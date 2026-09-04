/**
 * @file hitl-webhook.ts
 * @description Enterprise Slack & Webhook Human-in-the-Loop approval dispatcher.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
export interface SlackHitlConfig {
    webhookUrl: string;
    channelName?: string;
    timeoutSeconds?: number;
}
/**
 * Dispatches an interactive approval request to a corporate Slack / Discord channel
 * when an autonomous agent attempts a high-ticket tool execution (> $0.50).
 */
export declare function createSlackHitlApprover(config: SlackHitlConfig): (params: {
    toolName: string;
    priceUsd: number;
    recipient: string;
    agentId?: string;
}) => Promise<boolean>;
//# sourceMappingURL=hitl-webhook.d.ts.map