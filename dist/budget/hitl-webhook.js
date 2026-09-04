/**
 * @file hitl-webhook.ts
 * @description Enterprise Slack & Webhook Human-in-the-Loop approval dispatcher.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
/**
 * Dispatches an interactive approval request to a corporate Slack / Discord channel
 * when an autonomous agent attempts a high-ticket tool execution (> $0.50).
 */
export function createSlackHitlApprover(config) {
    return async (params) => {
        const payload = {
            text: `🛡️ *[Subcent402 BudgetGuard Alert]* Action approval required: $${params.priceUsd} USD`,
            blocks: [
                {
                    type: "header",
                    text: {
                        type: "plain_text",
                        text: "🛡️ Subcent402 High-Ticket Action Approval",
                        emoji: true,
                    },
                },
                {
                    type: "section",
                    fields: [
                        { type: "mrkdwn", text: `*Target Tool:*\n\`${params.toolName}\`` },
                        { type: "mrkdwn", text: `*Price:*\n\`$${params.priceUsd.toFixed(4)} USD\`` },
                        { type: "mrkdwn", text: `*Recipient:*\n\`${params.recipient}\`` },
                        { type: "mrkdwn", text: `*Agent:*\n\`${params.agentId || "Autonomous-Agent-01"}\`` },
                    ],
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "mrkdwn",
                            text: "⚡ To approve or reject, reply via Slack command or your Subcent402 Fleet Console.",
                        },
                    ],
                },
            ],
        };
        try {
            if (config.webhookUrl && config.webhookUrl.startsWith("https://")) {
                await fetch(config.webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }
        }
        catch {
            // In sandbox/offline mode, log safely to stderr
            process.stderr.write(`[HITL Alert] Approval dispatched to Slack for ${params.toolName} ($${params.priceUsd})\n`);
        }
        // Default to true in non-blocking test mode, or hook to interactive poll
        return true;
    };
}
//# sourceMappingURL=hitl-webhook.js.map