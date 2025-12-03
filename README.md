# WAP3-X1 Agentic Settlement (PoC)

Escrow and verification layer for AI agents on X1 EcoChain.

> **X1-focused summary**
>
> This repository is a focused proof-of-concept of the WAP3 agentic escrow and verification layer on **X1 EcoChain**. It demonstrates how AI agents and DePIN-style devices can lock value, verify off-chain work, and settle payments on an energy-efficient, PoA EVM chain with sub-cent fees. The code and docs are intentionally minimal so that X1 engineers and reviewers can quickly understand, run, and extend the core settlement pattern.

This shows how AI agents and DePIN devices can:

1. Lock funds in an on-chain escrow
2. Do off-chain work
3. Submit verifiable results with proof URIs
4. Get paid or refunded based on verification

> **Security Notice**
> PoC only - not audited. Don't use in production.

## Key Components

- **[contracts/Wap3Escrow.sol](contracts/Wap3Escrow.sol)**
  Simple escrow that separates verification from settlement.

- **[scripts/deploy.ts](scripts/deploy.ts)**
  Deploy to X1 testnet or local network.

- **[scripts/demoAgentFlow.ts](scripts/demoAgentFlow.ts)**
  Full demo: deploy, create deal, simulate work, verify, settle.

- **[test/Wap3Escrow.test.ts](test/Wap3Escrow.test.ts)**
  Tests for success, refund, and cancellation.

- **[docs/architecture.md](docs/architecture.md)**
  System design and components.

- **[docs/workflows.md](docs/workflows.md)**
  How deals flow through the system.

- **[docs/api-schema.md](docs/api-schema.md)**
  JSON schemas for off-chain agents.

- **[docs/x1-notes.md](docs/x1-notes.md)**
  Why X1 for this project.

- **[docs/roadmap.md](docs/roadmap.md)**
  Development roadmap and future milestones.

## X1 Setup

Works with X1 testnet:

- RPC: `https://x1-testnet.xen.network/`
- Chain ID: `204005`

Or run locally with Hardhat for faster iteration.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file:

```bash
cp .env.example .env
```

Edit `.env`:
- Set `X1_RPC_URL` to the X1 testnet RPC endpoint
- Set `PRIVATE_KEY` to the deployer account's private key (with testnet funds)

### 3. Compile contracts

```bash
npm run build
```

### 4. Run tests (local Hardhat network)

```bash
npm test
```

You should see output confirming all three test cases pass:
- ✓ creates, verifies and settles a successful deal
- ✓ refunds payer when verification fails
- ✓ allows payer to cancel a pending deal

### 5. Deploy to X1 testnet

```bash
npm run deploy:x1
```

The script will print the deployed `Wap3Escrow` address. Optionally, set:

```bash
X1_ESCROW_ADDRESS=0xYourDeployedAddress
```

in `.env` to reuse it in the demo script.

### 6. Run the demo agent flow on X1

```bash
npm run demo:x1
```

You should see logs showing:
- Deal creation
- Fake off-chain task
- Verifier submitting a proof URI
- Final deal state with status `Succeeded`

## Project Structure

```
wap3-x1-agentic-settlement/
├── contracts/
│   └── Wap3Escrow.sol
├── scripts/
│   ├── deploy.ts
│   └── demoAgentFlow.ts
├── test/
│   └── Wap3Escrow.test.ts
├── docs/
│   ├── architecture.md
│   ├── workflows.md
│   ├── api-schema.md
│   └── x1-notes.md
├── .env.example
├── .gitignore
├── hardhat.config.ts
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

## Extending the PoC

This repository is intentionally small and focused so that reviewers and other developers can quickly understand the agentic settlement pattern on X1.

Natural extensions include:
- Multi-verifier quorum / staking
- Structured risk profiles and slippage bounds
- Integration with Walrus / S3 / IPFS for proof storage
- Analytics dashboard subscribed to `DealCreated` / `DealSettled` events
- Rate limiting and reputation systems for verifiers
- Cross-chain settlement bridging

## Why X1?

See **[docs/x1-notes.md](docs/x1-notes.md)** for a detailed explanation of why X1 EcoChain is the ideal settlement layer for agentic workflows:
- Sub-cent transaction fees
- Fast finality with PoA consensus
- DePIN-native 3W node architecture
- Full EVM compatibility

## License

MIT – see [LICENSE](LICENSE)
