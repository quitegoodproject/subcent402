/**
 * @file types.ts
 * @description Client SDK types, budget policies, and wallet driver interfaces.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { SettlementRail, Subcent402Challenge, PaymentProof } from "@subcent402/core";
/**
 * Budget guardrail configuration
 */
export interface BudgetConfig {
    /** Maximum total spend permitted in a 24-hour rolling window in USD (default: $5.00) */
    maxDailySpendUsd: number;
    /** Maximum single-call price allowed without manual approval in USD (default: $0.05) */
    maxPerCallUsd: number;
    /** Threshold above which the Human-in-the-Loop (HITL) prompt is triggered (default: $0.50) */
    hitlThresholdUsd?: number;
    /** Optional interactive callback invoked when price exceeds hitlThresholdUsd */
    hitlCallback?: (params: {
        toolName: string;
        priceUsd: number;
        recipient: string;
    }) => Promise<boolean>;
    /** Optional domain/tool whitelist (if set, only listed tools are permitted) */
    allowedTools?: string[];
}
/**
 * Wallet driver interface for handling autonomous settlements
 */
export interface WalletDriver {
    /** The rail this wallet operates on */
    readonly rail: SettlementRail;
    /**
     * Settles a Subcent402 challenge and returns the cryptographic preimage proof
     *
     * @param challenge The challenge received from the tool
     * @returns Preimage hex string (or full PaymentProof)
     */
    settleChallenge(challenge: Subcent402Challenge): Promise<PaymentProof>;
    /** Returns the current available balance in USD */
    getBalanceUsd(): Promise<number>;
}
/**
 * Configuration options for Subcent402Client
 */
export interface Subcent402ClientConfig {
    /** Budget guardrails */
    budget?: Partial<BudgetConfig>;
    /** The active wallet driver to use for settlements (defaults to MockVaultDriver) */
    wallet?: WalletDriver;
    /** Gateway endpoint URL */
    gatewayUrl?: string;
    /** Enable multi-call session pass caching (default: true) */
    enableSessionPassCache?: boolean;
}
//# sourceMappingURL=types.d.ts.map