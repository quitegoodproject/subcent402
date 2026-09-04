/**
 * @file base-usdc.ts
 * @description Base L2 USDC wallet driver with Nonce Mutex for concurrent agent calls.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { SettlementRail, Subcent402Challenge, PaymentProof } from "@subcent402/core";
import { WalletDriver } from "../types.js";
/**
 * Base L2 USDC wallet driver with built-in concurrency lock.
 */
export declare class BaseUsdcDriver implements WalletDriver {
    readonly rail: SettlementRail;
    private privateKey;
    private rpcUrl;
    private balanceUsd;
    private nonceLock;
    getRpcUrl(): string;
    getPrivateKeyMasked(): string;
    constructor(options: {
        privateKey: string;
        rpcUrl?: string;
        initialBalanceUsd?: number;
    });
    /**
     * Settles challenge using off-chain EIP-712 signature or micro-escrow with sequential nonce mutex.
     */
    settleChallenge(challenge: Subcent402Challenge): Promise<PaymentProof>;
    getBalanceUsd(): Promise<number>;
}
//# sourceMappingURL=base-usdc.d.ts.map