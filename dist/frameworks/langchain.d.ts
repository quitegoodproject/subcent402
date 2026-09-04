/**
 * @file langchain.ts
 * @description LangChain and LangGraph tool wrapper for Subcent402 autonomous auto-settlement.
 * @author Quite Good Project <engineering@quitegoodproject.com>
 */
import { Subcent402ClientConfig } from "../types.js";
/**
 * Generic interface for LangChain StructuredTool
 */
export interface LangChainStructuredTool {
    name: string;
    description: string;
    schema: unknown;
    call: (arg: Record<string, unknown>, ...rest: unknown[]) => Promise<unknown>;
}
/**
 * Wraps a LangChain StructuredTool with Subcent402 autonomous payment interceptor.
 *
 * @example
 * ```typescript
 * import { wrapLangChainTool } from "@subcent402/client/frameworks/langchain";
 *
 * const tool = wrapLangChainTool(new MyPaidScraperTool(), {
 *   budget: { maxDailySpendUsd: 5.00 }
 * });
 * ```
 */
export declare function wrapLangChainTool<TTool extends LangChainStructuredTool>(tool: TTool, options?: Subcent402ClientConfig): TTool;
//# sourceMappingURL=langchain.d.ts.map