/**
 * @file mock-vault.ts
 * @description Local test wallet driver with pre-funded balance for zero-crypto offline testing.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { getLocalPreimage, generatePreimage, } from "@subcent402/core";
/**
 * Pre-funded in-memory credit vault for local development, integration tests, and sandbox runs.
 */
export class MockVaultDriver {
    rail = "MOCK_VAULT";
    balanceUsd;
    settledPreimages = new Map();
    constructor(initialBalanceUsd = 100.0) {
        this.balanceUsd = initialBalanceUsd;
    }
    /**
     * Registers a known preimage for a specific payment hash.
     */
    registerPreimage(paymentHash, preimage) {
        this.settledPreimages.set(paymentHash.toLowerCase(), preimage);
    }
    /**
     * Settles the challenge by revealing the preimage.
     */
    async settleChallenge(challenge) {
        if (this.balanceUsd < challenge.price_usd) {
            throw new Error(`[MockVaultDriver] Insufficient vault balance. (Available: $${this.balanceUsd.toFixed(4)}, Required: $${challenge.price_usd.toFixed(4)})`);
        }
        // Deduct mock balance
        this.balanceUsd -= challenge.price_usd;
        // Retrieve matching preimage:
        // 1. Check registered preimages on this vault
        let preimage = this.settledPreimages.get(challenge.payment_hash.toLowerCase());
        // 2. Check local in-process registry
        if (!preimage) {
            preimage = getLocalPreimage(challenge.payment_hash);
        }
        // 3. Fallback
        if (!preimage) {
            preimage = generatePreimage();
        }
        return {
            macaroon: challenge.macaroon,
            preimage,
        };
    }
    async getBalanceUsd() {
        return this.balanceUsd;
    }
    topUp(amountUsd) {
        this.balanceUsd += amountUsd;
    }
}
//# sourceMappingURL=mock-vault.js.map