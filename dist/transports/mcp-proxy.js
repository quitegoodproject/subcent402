/**
 * @file mcp-proxy.ts
 * @description Transparent MCP Client transport interceptor with automated 402 challenge resolution.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { McpError } from "@modelcontextprotocol/sdk/types.js";
import { BudgetGuard } from "../budget/budget-guard.js";
import { SessionPassCache } from "../budget/session-cache.js";
import { MockVaultDriver } from "../wallets/mock-vault.js";
/**
 * Wraps an MCP Client to transparently handle -32042 Payment Required challenges,
 * enforcing BudgetGuard rules, auto-settling via the configured wallet, and retrying.
 *
 * @param client Standard MCP Client instance
 * @param options Client configuration (budget, wallet, session cache)
 * @returns Wrapped MCP Client with auto-payment super-powers
 */
export function wrapMcpClient(client, options = {}) {
    const budgetGuard = new BudgetGuard(options.budget);
    const wallet = options.wallet ?? new MockVaultDriver();
    const sessionCache = options.enableSessionPassCache !== false ? new SessionPassCache() : null;
    // Retrieve raw un-intercepted callTool if already wrapped
    const originalCallTool = client._rawCallTool || client.callTool.bind(client);
    const wrappedCallTool = async (params, resultSchema) => {
        const toolName = params.name;
        let toolArgs = params.arguments ? { ...params.arguments } : {};
        // Step 1: Check for active cached Session Pass (0ms latency path)
        if (sessionCache) {
            const activePass = sessionCache.getActivePass(toolName);
            if (activePass) {
                toolArgs._auth_l402 = `${activePass.macaroon}:${activePass.preimage}`;
            }
        }
        try {
            // Step 2: Attempt primary invocation
            return await originalCallTool({ name: toolName, arguments: toolArgs }, resultSchema);
        }
        catch (err) {
            // Step 3: Check if error is an MCP -32042 Payment Required challenge
            const isMcpPaymentError = (err instanceof McpError && (err.code === -32042 || String(err.code) === "-32042")) ||
                (typeof err === "object" && err !== null && err.code === -32042);
            if (!isMcpPaymentError) {
                // Normal error, rethrow
                throw err;
            }
            // Step 4: Extract challenge data
            const mcpErr = err;
            const challenge = mcpErr.data || extractChallengeFromError(mcpErr);
            if (!challenge || !challenge.price_usd || !challenge.macaroon) {
                throw new Error(`[Subcent402] Failed to parse 402 challenge metadata: ${mcpErr.message}`);
            }
            // Step 5: Check BudgetGuard limits (Hard caps & HITL prompts)
            await budgetGuard.authorizeSpend({
                toolName,
                priceUsd: challenge.price_usd,
                recipient: challenge.recipient,
            });
            // Step 6: Settle invoice via configured wallet driver
            const proof = await wallet.settleChallenge(challenge);
            // Step 7: Cache Session Pass if applicable
            if (sessionCache && challenge.session?.is_session_pass) {
                sessionCache.storePass(toolName, proof, challenge.session.max_calls);
            }
            // Step 8: Attach cryptographic proof and re-invoke tool
            const retryArgs = {
                ...toolArgs,
                _auth_l402: `${proof.macaroon}:${proof.preimage}`,
            };
            return await originalCallTool({ name: toolName, arguments: retryArgs }, resultSchema);
        }
    };
    // Return a cloned proxy client retaining prototype and raw tool reference
    const proxy = Object.create(Object.getPrototypeOf(client));
    Object.assign(proxy, client, {
        _rawCallTool: originalCallTool,
        callTool: wrappedCallTool,
    });
    return proxy;
}
/**
 * Fallback parser for challenge data in case of varied MCP error wrapping
 */
function extractChallengeFromError(err) {
    if (err.data && typeof err.data === "object") {
        const data = err.data;
        if (data.challenge && typeof data.challenge === "object") {
            return data.challenge;
        }
        if (data.price_usd && data.macaroon) {
            return data;
        }
    }
    return null;
}
//# sourceMappingURL=mcp-proxy.js.map