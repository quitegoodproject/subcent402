/**
 * @file budget-guard.ts
 * @description Enterprise spending guardrail and Human-in-the-Loop policy engine.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { BudgetConfig } from "../types.js";
/**
 * Enterprise client-side budget guard preventing runaway agent spend and unauthorized tool drain.
 */
export declare class BudgetGuard {
    private config;
    private currentDailySpendUsd;
    private lastResetTimestamp;
    constructor(config?: Partial<BudgetConfig>);
    /**
     * Authorizes a proposed tool spend against local policy and invokes HITL hooks if needed.
     *
     * @param params Spend details
     * @returns Promise<boolean> true if authorized
     * @throws Error if budget is exceeded or action rejected
     */
    authorizeSpend(params: {
        toolName: string;
        priceUsd: number;
        recipient: string;
    }): Promise<boolean>;
    /**
     * Returns the current daily spend in USD
     */
    getCurrentDailySpend(): number;
    /**
     * Returns the remaining daily allowance in USD
     */
    getRemainingDailyAllowance(): number;
    /**
     * Resets daily counter if 24 hours have elapsed
     */
    private checkDailyReset;
}
//# sourceMappingURL=budget-guard.d.ts.map