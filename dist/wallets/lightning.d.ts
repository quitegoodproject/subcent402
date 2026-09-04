/**
 * @file lightning.ts
 * @description Bitcoin Lightning Network wallet driver for sub-cent satoshi settlements.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { SettlementRail, Subcent402Challenge, PaymentProof } from "@subcent402/core";
import { WalletDriver } from "../types.js";
/**
 * Bitcoin Lightning Network wallet driver for instant sub-satoshi micro-settlements.
 */
export declare class LightningDriver implements WalletDriver {
    readonly rail: SettlementRail;
    private lnNodeUrl;
    private macaroonAuth?;
    private balanceUsd;
    getNodeUrl(): string;
    getMacaroonMasked(): string;
    constructor(options: {
        lnNodeUrl?: string;
        macaroonAuth?: string;
        initialBalanceUsd?: number;
    });
    /**
     * Settles BOLT11 Lightning invoice and extracts cryptographic preimage receipt.
     */
    settleChallenge(challenge: Subcent402Challenge): Promise<PaymentProof>;
    getBalanceUsd(): Promise<number>;
}
//# sourceMappingURL=lightning.d.ts.map