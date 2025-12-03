# WAP3-X1 Agentic Settlement – Architecture (PoC)

This repository provides a proof-of-concept implementation of the WAP3 agentic
payment and verification layer on **X1 EcoChain**.

At a high level, the system separates **intent, verification and settlement**:

```text
+------------------+        +-------------------------+
|  AI / DePIN      |        |  Off-chain Verifier    |
|  Agent / dApp    |        |  (rule- / AI-based)    |
+--------+---------+        +-----------+-------------+
         |                              |
         | 1. Create intent / task      |
         |                              |
         v                              v
+----------------------------------------------------+
|             Wap3-X1 Coordination Layer            |
|  (client SDK, API gateway, verification service)  |
+-------------------------+--------------------------+
                          |
                          | 2. Submit escrow & later
                          |    verification result
                          v
+----------------------------------------------------+
|             Wap3Escrow Contract on X1             |
|  - Holds funds                                    |
|  - Exposes createDeal / verifyDeal / cancelDeal   |
|  - Emits events for off-chain analytics           |
+-------------------------+--------------------------+
                          |
                          | 3. On-chain settlement
                          v
+----------------------------------------------------+
|                 X1 EcoChain (PoA, EVM)            |
|  - 3W nodes / sub-cent fees                       |
|  - Maculatus testnet / mainnet                    |
+----------------------------------------------------+
```

## Components

### Wap3Escrow.sol

Minimal X1-native escrow contract that:
- Accepts value from a payer
- Locks funds until a designated verifier posts a result
- Releases funds to payee on success
- Refunds payer on failure or cancellation

### Off-chain verifier / agent (PoC script)

The `scripts/demoAgentFlow.ts` script emulates an AI agent or DePIN device:
- Creates a deal
- Runs a fake "off-chain task"
- Submits a proof URI and success flag
- Reads back the final deal state

### X1 EcoChain

The PoC is configured to run against X1 testnet using:
- RPC endpoint: `https://x1-testnet.xen.network/`
- Chain ID: `204005`

This PoC focuses on making the X1-specific escrow & verification path simple
to understand and easy to extend for more complex agentic workflows.
