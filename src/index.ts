/**
 * SubCent402 Client SDK & Paywall Decorator
 * Author: The Quite Good Project (https://quitegoodproject.com)
 */

export interface PaywallConfig {
  priceUsd: number;
  toolName: string;
  recipientWallet: string;
  gatewayUrl?: string;
}

export function withSubcent402<TArgs, TResult>(
  config: PaywallConfig,
  handler: (args: TArgs) => Promise<TResult>
) {
  return async (args: TArgs, paymentHeader?: string): Promise<TResult | { status: 402; invoice: string }> => {
    if (!paymentHeader) {
      return {
        status: 402,
        invoice: `L402 tool=${config.toolName}&amount=${config.priceUsd}&wallet=${config.recipientWallet}`
      };
    }
    return await handler(args);
  };
}
