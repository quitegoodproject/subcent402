/**
 * @file base-usdc.ts
 * @description Base L2 USDC wallet driver with Nonce Mutex for concurrent agent calls.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
/**
 * Base L2 USDC wallet driver with built-in concurrency lock.
 */
export class BaseUsdcDriver {
    rail = "BASE_USDC";
    privateKey;
    rpcUrl;
    balanceUsd;
    nonceLock = Promise.resolve();
    getRpcUrl() { return this.rpcUrl; }
    getPrivateKeyMasked() { return this.privateKey.substring(0, 6) + '...'; }
    constructor(options) {
        this.privateKey = options.privateKey;
        this.rpcUrl = options.rpcUrl ?? "https://mainnet.base.org";
        this.balanceUsd = options.initialBalanceUsd ?? 50.0;
    }
    /**
     * Settles challenge using off-chain EIP-712 signature or micro-escrow with sequential nonce mutex.
     */
    async settleChallenge(challenge) {
        // Acquire mutex lock to prevent concurrent subagent nonce collision
        let unlock;
        const nextLock = new Promise((resolve) => {
            unlock = resolve;
        });
        const currentLock = this.nonceLock;
        this.nonceLock = nextLock;
        await currentLock;
        try {
            if (this.balanceUsd < challenge.price_usd) {
                throw new Error(`[BaseUsdcDriver] Insufficient USDC balance on Base. (Available: $${this.balanceUsd.toFixed(4)})`);
            }
            // Simulate <60ms cryptographic EIP-712 signing & gateway settlement
            this.balanceUsd -= challenge.price_usd;
            // In production gateway flow, the signed EIP-712 permit is submitted to gateway to release preimage
            return {
                macaroon: challenge.macaroon,
                preimage: challenge.payment_hash, // Gateway unlocks matching preimage
            };
        }
        finally {
            unlock();
        }
    }
    async getBalanceUsd() {
        return this.balanceUsd;
    }
}
//# sourceMappingURL=base-usdc.js.map