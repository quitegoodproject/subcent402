/**
 * @file session-cache.ts
 * @description In-memory cache for active multi-call Macaroon Session Passes (eliminates latency).
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { deserializeMacaroon } from "@subcent402/core";
/**
 * High-speed in-memory cache for active Session Passes.
 */
export class SessionPassCache {
    cache = new Map();
    /**
     * Retrieves an active, unexpired session pass for a specific tool.
     *
     * @param toolName Target tool name
     * @returns PaymentProof if a valid session exists with remaining calls, or null
     */
    getActivePass(toolName) {
        const session = this.cache.get(toolName);
        if (!session)
            return null;
        const now = Date.now();
        // Check expiration
        if (session.expiresAt <= now || session.remainingCalls <= 0) {
            this.cache.delete(toolName);
            return null;
        }
        // Decrement call count and return cached proof
        session.remainingCalls -= 1;
        return session.proof;
    }
    /**
     * Stores a newly acquired multi-call session pass.
     *
     * @param toolName Target tool name
     * @param proof Payment proof containing macaroon and preimage
     * @param defaultCalls Fallback number of calls if not in caveats
     */
    storePass(toolName, proof, defaultCalls = 1) {
        const parsed = deserializeMacaroon(proof.macaroon);
        if (!parsed)
            return;
        const maxCalls = parsed.caveats.max_calls ?? defaultCalls;
        if (maxCalls <= 1) {
            // Single-use token, no need to cache for multi-call sessions
            return;
        }
        this.cache.set(toolName, {
            toolName,
            proof,
            expiresAt: parsed.caveats.expires_at,
            remainingCalls: maxCalls - 1, // First call is being executed now
        });
    }
    /**
     * Clears cached session for a specific tool or all tools
     */
    clear(toolName) {
        if (toolName) {
            this.cache.delete(toolName);
        }
        else {
            this.cache.clear();
        }
    }
}
//# sourceMappingURL=session-cache.js.map