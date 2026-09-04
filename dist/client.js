/**
 * @file client.ts
 * @description Master Subcent402Client orchestrator for autonomous agents.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { BudgetGuard } from "./budget/budget-guard.js";
import { SessionPassCache } from "./budget/session-cache.js";
import { wrapMcpClient } from "./transports/mcp-proxy.js";
import { MockVaultDriver } from "./wallets/mock-vault.js";
/**
 * Master client for managing autonomous agent spending policies and wallet integrations.
 */
export class Subcent402Client {
    budgetGuard;
    wallet;
    sessionCache;
    constructor(config = {}) {
        this.budgetGuard = new BudgetGuard(config.budget);
        this.wallet = config.wallet ?? new MockVaultDriver();
        this.sessionCache = config.enableSessionPassCache !== false ? new SessionPassCache() : null;
    }
    /**
     * Wraps an MCP Client with automated 402 challenge resolution.
     */
    wrapMcp(client) {
        return wrapMcpClient(client, {
            budget: this.budgetGuard["config"],
            wallet: this.wallet,
            enableSessionPassCache: this.sessionCache !== null,
        });
    }
    /**
     * Returns current daily spend in USD
     */
    getDailySpend() {
        return this.budgetGuard.getCurrentDailySpend();
    }
    /**
     * Returns remaining daily budget allowance in USD
     */
    getRemainingDailyAllowance() {
        return this.budgetGuard.getRemainingDailyAllowance();
    }
    /**
     * Returns available wallet balance in USD
     */
    async getWalletBalance() {
        return await this.wallet.getBalanceUsd();
    }
}
//# sourceMappingURL=client.js.map