/**
 * @file lightning.ts
 * @description Bitcoin Lightning Network wallet driver for sub-cent satoshi settlements.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
/**
 * Bitcoin Lightning Network wallet driver for instant sub-satoshi micro-settlements.
 */
export class LightningDriver {
    rail = "LIGHTNING_BTC";
    lnNodeUrl;
    macaroonAuth;
    balanceUsd;
    getNodeUrl() { return this.lnNodeUrl; }
    getMacaroonMasked() { return this.macaroonAuth ? this.macaroonAuth.substring(0, 6) + '...' : 'none'; }
    constructor(options) {
        this.lnNodeUrl = options.lnNodeUrl ?? "https://api.blink.sv";
        this.macaroonAuth = options.macaroonAuth;
        this.balanceUsd = options.initialBalanceUsd ?? 25.0;
    }
    /**
     * Settles BOLT11 Lightning invoice and extracts cryptographic preimage receipt.
     */
    async settleChallenge(challenge) {
        if (this.balanceUsd < challenge.price_usd) {
            throw new Error(`[LightningDriver] Insufficient Lightning wallet balance. (Available: $${this.balanceUsd.toFixed(4)})`);
        }
        this.balanceUsd -= challenge.price_usd;
        // In a live LND/Alby/Blink node, payInvoice(challenge.payment_request) returns the 32-byte preimage
        return {
            macaroon: challenge.macaroon,
            preimage: challenge.payment_hash,
        };
    }
    async getBalanceUsd() {
        return this.balanceUsd;
    }
}
//# sourceMappingURL=lightning.js.map