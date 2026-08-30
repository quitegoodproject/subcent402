# ⚡ Subcent402 (`subcent402.com`)

> **The Universal M2M Micro-Payment Protocol & Model Context Protocol (MCP) Paywall Standard**  
> Enables autonomous AI agents to pay for tools, APIs, and data feeds in sub-cent fractions ($0.0001 – $0.05) via HTTP 402, L402 Macaroons, and Base USDC.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-1.0_Compliant-emerald.svg)](https://modelcontextprotocol.io)
[![Part of Quite Good Project](https://img.shields.io/badge/Maintained_by-Quite_Good_Project-09090b.svg)](https://quitegoodproject.com)

---

## 🧭 The Problem
Traditional payment processors impose a fixed **$0.30 + 2.9% fee**, making $0.002 sub-cent API calls mathematically impossible. Furthermore, autonomous AI agents cannot fill in credit card forms or solve CAPTCHAs.

**Subcent402** enables 3-line tool paywalls and cryptographic machine settlement in <0.2ms.

---

## 🚀 Quickstart: Monetize an MCP Tool in 3 Lines

```typescript
import { withSubcent402 } from "@quitegoodproject/subcent402";

export const extractTool = withSubcent402(
  {
    priceUsd: 0.001,
    toolName: "tokenmarkdown_extract",
    recipientWallet: "0xYourWalletAddress"
  },
  async (params: { url: string }) => {
    return await fetchCleanMarkdown(params.url);
  }
);
```

---

## 🏛️ developer suite & Governance
Maintained by **[The Quite Good Project](https://quitegoodproject.com)**.
