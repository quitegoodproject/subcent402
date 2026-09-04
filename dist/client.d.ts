/**
 * @file client.ts
 * @description Master Subcent402Client orchestrator for autonomous agents.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { BudgetGuard } from "./budget/budget-guard.js";
import { SessionPassCache } from "./budget/session-cache.js";
import { GenericMcpClient } from "./transports/mcp-proxy.js";
import { Subcent402ClientConfig, WalletDriver } from "./types.js";
/**
 * Master client for managing autonomous agent spending policies and wallet integrations.
 */
export declare class Subcent402Client {
    readonly budgetGuard: BudgetGuard;
    readonly wallet: WalletDriver;
    readonly sessionCache: SessionPassCache | null;
    constructor(config?: Subcent402ClientConfig);
    /**
     * Wraps an MCP Client with automated 402 challenge resolution.
     */
    wrapMcp<TClient extends GenericMcpClient>(client: TClient): TClient;
    /**
     * Returns current daily spend in USD
     */
    getDailySpend(): number;
    /**
     * Returns remaining daily budget allowance in USD
     */
    getRemainingDailyAllowance(): number;
    /**
     * Returns available wallet balance in USD
     */
    getWalletBalance(): Promise<number>;
}
//# sourceMappingURL=client.d.ts.map