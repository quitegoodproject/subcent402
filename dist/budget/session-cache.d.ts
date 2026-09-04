/**
 * @file session-cache.ts
 * @description In-memory cache for active multi-call Macaroon Session Passes (eliminates latency).
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { PaymentProof } from "@subcent402/core";
/**
 * High-speed in-memory cache for active Session Passes.
 */
export declare class SessionPassCache {
    private cache;
    /**
     * Retrieves an active, unexpired session pass for a specific tool.
     *
     * @param toolName Target tool name
     * @returns PaymentProof if a valid session exists with remaining calls, or null
     */
    getActivePass(toolName: string): PaymentProof | null;
    /**
     * Stores a newly acquired multi-call session pass.
     *
     * @param toolName Target tool name
     * @param proof Payment proof containing macaroon and preimage
     * @param defaultCalls Fallback number of calls if not in caveats
     */
    storePass(toolName: string, proof: PaymentProof, defaultCalls?: number): void;
    /**
     * Clears cached session for a specific tool or all tools
     */
    clear(toolName?: string): void;
}
//# sourceMappingURL=session-cache.d.ts.map