/**
 * @file mcp-proxy.ts
 * @description Transparent MCP Client transport interceptor with automated 402 challenge resolution.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { Subcent402ClientConfig } from "../types.js";
/**
 * Generic interface matching Model Context Protocol Client's callTool method
 */
export interface GenericMcpClient {
    callTool(params: {
        name: string;
        arguments?: Record<string, unknown>;
    }, resultSchema?: unknown): Promise<unknown>;
}
/**
 * Wraps an MCP Client to transparently handle -32042 Payment Required challenges,
 * enforcing BudgetGuard rules, auto-settling via the configured wallet, and retrying.
 *
 * @param client Standard MCP Client instance
 * @param options Client configuration (budget, wallet, session cache)
 * @returns Wrapped MCP Client with auto-payment super-powers
 */
export declare function wrapMcpClient<TClient extends GenericMcpClient>(client: TClient, options?: Subcent402ClientConfig): TClient;
//# sourceMappingURL=mcp-proxy.d.ts.map