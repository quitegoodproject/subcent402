/**
 * @file vercel-ai.ts
 * @description Vercel AI SDK Core Tool wrapper for Subcent402.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { Subcent402ClientConfig } from "../types.js";
/**
 * Generic interface matching Vercel AI SDK Core Tool
 */
export interface VercelAiTool<TParams = any, TResult = any> {
    description?: string;
    parameters: unknown;
    execute?: (params: TParams, options?: unknown) => Promise<TResult>;
}
/**
 * Wraps a Vercel AI SDK Core Tool with Subcent402 auto-settlement.
 */
export declare function wrapVercelAiTool<TParams extends Record<string, unknown>, TResult>(toolName: string, toolDef: VercelAiTool<TParams, TResult>, options?: Subcent402ClientConfig): VercelAiTool<TParams, TResult>;
//# sourceMappingURL=vercel-ai.d.ts.map