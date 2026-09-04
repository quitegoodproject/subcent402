/**
 * @file budget-guard.ts
 * @description Enterprise spending guardrail and Human-in-the-Loop policy engine.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
/**
 * Enterprise client-side budget guard preventing runaway agent spend and unauthorized tool drain.
 */
export class BudgetGuard {
    config;
    currentDailySpendUsd = 0;
    lastResetTimestamp = Date.now();
    constructor(config = {}) {
        this.config = {
            maxDailySpendUsd: config.maxDailySpendUsd ?? 5.00,
            maxPerCallUsd: config.maxPerCallUsd ?? 0.05,
            hitlThresholdUsd: config.hitlThresholdUsd ?? 0.50,
            hitlCallback: config.hitlCallback,
            allowedTools: config.allowedTools,
        };
    }
    /**
     * Authorizes a proposed tool spend against local policy and invokes HITL hooks if needed.
     *
     * @param params Spend details
     * @returns Promise<boolean> true if authorized
     * @throws Error if budget is exceeded or action rejected
     */
    async authorizeSpend(params) {
        this.checkDailyReset();
        // 1. Tool Allowlist check (if configured)
        if (this.config.allowedTools && this.config.allowedTools.length > 0) {
            const isAllowed = this.config.allowedTools.includes(params.toolName) || this.config.allowedTools.includes("*");
            if (!isAllowed) {
                throw new Error(`[BudgetGuard] Tool '${params.toolName}' is not in the authorized tool allowlist.`);
            }
        }
        // 2. Per-call hard limit check
        if (params.priceUsd > this.config.maxPerCallUsd) {
            // Check if Human-in-the-Loop can approve it
            if (this.config.hitlCallback) {
                const approved = await this.config.hitlCallback(params);
                if (!approved) {
                    throw new Error(`[BudgetGuard] Call cost ($${params.priceUsd}) exceeds max per-call limit ($${this.config.maxPerCallUsd}) and was rejected by Human Approver.`);
                }
            }
            else {
                throw new Error(`[BudgetGuard] Call cost ($${params.priceUsd}) exceeds max per-call limit ($${this.config.maxPerCallUsd}).`);
            }
        }
        // 3. Human-in-the-loop threshold check for high-ticket actions
        if (this.config.hitlThresholdUsd && params.priceUsd >= this.config.hitlThresholdUsd && this.config.hitlCallback) {
            const approved = await this.config.hitlCallback(params);
            if (!approved) {
                throw new Error(`[BudgetGuard] High-ticket action ($${params.priceUsd}) was rejected by Human Approver.`);
            }
        }
        // 4. Daily budget ceiling check
        if (this.currentDailySpendUsd + params.priceUsd > this.config.maxDailySpendUsd) {
            throw new Error(`[BudgetGuard] Daily budget limit ($${this.config.maxDailySpendUsd}) reached. (Spent: $${this.currentDailySpendUsd.toFixed(4)}, Attempted: $${params.priceUsd.toFixed(4)})`);
        }
        // Deduct and record spend
        this.currentDailySpendUsd += params.priceUsd;
        return true;
    }
    /**
     * Returns the current daily spend in USD
     */
    getCurrentDailySpend() {
        this.checkDailyReset();
        return this.currentDailySpendUsd;
    }
    /**
     * Returns the remaining daily allowance in USD
     */
    getRemainingDailyAllowance() {
        this.checkDailyReset();
        return Math.max(0, this.config.maxDailySpendUsd - this.currentDailySpendUsd);
    }
    /**
     * Resets daily counter if 24 hours have elapsed
     */
    checkDailyReset() {
        const now = Date.now();
        const twentyFourHoursMs = 24 * 60 * 60 * 1000;
        if (now - this.lastResetTimestamp >= twentyFourHoursMs) {
            this.currentDailySpendUsd = 0;
            this.lastResetTimestamp = now;
        }
    }
}
//# sourceMappingURL=budget-guard.js.map