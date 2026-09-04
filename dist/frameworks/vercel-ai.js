/**
 * @file vercel-ai.ts
 * @description Vercel AI SDK Core Tool wrapper for Subcent402.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { Subcent402Client } from "../client.js";
/**
 * Wraps a Vercel AI SDK Core Tool with Subcent402 auto-settlement.
 */
export function wrapVercelAiTool(toolName, toolDef, options = {}) {
    const client = new Subcent402Client(options);
    const originalExecute = toolDef.execute;
    if (!originalExecute)
        return toolDef;
    return {
        ...toolDef,
        execute: async (params, opts) => {
            let callParams = { ...params };
            if (client.sessionCache) {
                const pass = client.sessionCache.getActivePass(toolName);
                if (pass) {
                    callParams._auth_l402 = `${pass.macaroon}:${pass.preimage}`;
                }
            }
            try {
                return await originalExecute(callParams, opts);
            }
            catch (err) {
                const is402 = err?.code === -32042 ||
                    err?.message?.includes("Payment Required");
                if (!is402)
                    throw err;
                const challenge = err?.data || err?.challenge;
                if (!challenge)
                    throw err;
                await client.budgetGuard.authorizeSpend({
                    toolName,
                    priceUsd: challenge.price_usd,
                    recipient: challenge.recipient,
                });
                const proof = await client.wallet.settleChallenge(challenge);
                callParams._auth_l402 = `${proof.macaroon}:${proof.preimage}`;
                return await originalExecute(callParams, opts);
            }
        },
    };
}
//# sourceMappingURL=vercel-ai.js.map