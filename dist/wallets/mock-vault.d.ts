/**
 * @file mock-vault.ts
 * @description Local test wallet driver with pre-funded balance for zero-crypto offline testing.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { SettlementRail, Subcent402Challenge, PaymentProof } from "@subcent402/core";
import { WalletDriver } from "../types.js";
/**
 * Pre-funded in-memory credit vault for local development, integration tests, and sandbox runs.
 */
export declare class MockVaultDriver implements WalletDriver {
    readonly rail: SettlementRail;
    private balanceUsd;
    private settledPreimages;
    constructor(initialBalanceUsd?: number);
    /**
     * Registers a known preimage for a specific payment hash.
     */
    registerPreimage(paymentHash: string, preimage: string): void;
    /**
     * Settles the challenge by revealing the preimage.
     */
    settleChallenge(challenge: Subcent402Challenge): Promise<PaymentProof>;
    getBalanceUsd(): Promise<number>;
    topUp(amountUsd: number): void;
}
//# sourceMappingURL=mock-vault.d.ts.map