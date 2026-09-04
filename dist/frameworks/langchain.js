/**
 * @file langchain.ts
 * @description LangChain and LangGraph tool wrapper for Subcent402 autonomous auto-settlement.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { Subcent402Client } from "../client.js";
/**
 * Wraps a LangChain StructuredTool with Subcent402 autonomous payment interceptor.
 *
 * @example
 * ```typescript
 * import { wrapLangChainTool } from "@subcent402/client/frameworks/langchain";
 *
 * const tool = wrapLangChainTool(new MyPaidScraperTool(), {
 *   budget: { maxDailySpendUsd: 5.00 }
 * });
 * ```
 */
export function wrapLangChainTool(tool, options = {}) {
    const client = new Subcent402Client(options);
    const originalCall = tool.call.bind(tool);
    tool.call = async (arg, ...rest) => {
        let callArgs = { ...arg };
        // Check active session pass
        if (client.sessionCache) {
            const pass = client.sessionCache.getActivePass(tool.name);
            if (pass) {
                callArgs._auth_l402 = `${pass.macaroon}:${pass.preimage}`;
            }
        }
        try {
            return await originalCall(callArgs, ...rest);
        }
        catch (err) {
            // Check if error contains 402 challenge
            const is402 = err?.code === -32042 ||
                err?.message?.includes("Payment Required");
            if (!is402)
                throw err;
            const challenge = err?.data || err?.challenge;
            if (!challenge)
                throw err;
            const challengeObj = challenge;
            // Authorize spend
            await client.budgetGuard.authorizeSpend({
                toolName: tool.name,
                priceUsd: challengeObj.price_usd,
                recipient: challengeObj.recipient,
            });
            // Settle
            const proof = await client.wallet.settleChallenge(challengeObj);
            // Retry
            callArgs._auth_l402 = `${proof.macaroon}:${proof.preimage}`;
            return await originalCall(callArgs, ...rest);
        }
    };
    return tool;
}
//# sourceMappingURL=langchain.js.map