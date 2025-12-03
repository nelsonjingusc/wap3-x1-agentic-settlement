# Quick Start Guide

This guide walks you through running the WAP3-X1 Agentic Settlement PoC from scratch.

## Prerequisites

- Node.js 18+ installed
- Basic understanding of Ethereum/EVM development
- (For X1 testnet deployment) X1 testnet funds in your wallet

## Local Development (5 minutes)

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd wap3-x1-agentic-settlement
npm install
```

### Step 2: Compile Contracts

```bash
npm run build
```

Expected output:
```
Compiled 1 Solidity file successfully
```

### Step 3: Run Tests

```bash
npm test
```

Expected output:
```
  Wap3Escrow (PoC)
    ✓ creates, verifies and settles a successful deal
    ✓ refunds payer when verification fails
    ✓ allows payer to cancel a pending deal

  3 passing
```

### Step 4: Run Local Demo

```bash
npm run demo:local
```

This deploys the contract to a local Hardhat network, creates a deal, simulates off-chain work, and settles it.

Expected output:
```
Deployed Wap3Escrow to: 0x...
Creating deal...
Deal created with id: 1
Simulating off-chain task...
Verifier submitting success proof: walrus://proofs/x1-demo/...
Final deal state: { status: 2n, ... }
```

Status `2n` means **Succeeded** ✓

## X1 Testnet Deployment (10 minutes)

### Step 1: Get X1 Testnet Funds

1. Generate a new wallet or use an existing one
2. Visit X1 testnet faucet (check X1 documentation for current faucet URL)
3. Request testnet XEN tokens

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```bash
X1_RPC_URL=https://x1-testnet.xen.network/
PRIVATE_KEY=0xYourPrivateKeyHere
```

**Security warning**: Never commit `.env` to git. Never use production private keys.

### Step 3: Deploy to X1 Testnet

```bash
npm run deploy:x1
```

Expected output:
```
Deploying Wap3Escrow with account: 0x...
Account balance: ...
Wap3Escrow deployed to: 0xABCDEF...
```

Copy the deployed contract address.

### Step 4: Update .env with Deployed Address

Add to `.env`:
```bash
X1_ESCROW_ADDRESS=0xYourDeployedAddressHere
```

### Step 5: Run Demo on X1

```bash
npm run demo:x1
```

This will:
1. Connect to your deployed contract on X1
2. Create a real on-chain escrow deal
3. Submit a verification result
4. Settle the payment

Expected output shows deal creation and settlement with a real transaction hash.

## Understanding the Flow

### 1. Create Deal
```typescript
await escrow.createDeal(payeeAddress, verifierAddress, { value: amount })
```
- Payer locks funds in escrow
- Contract emits `DealCreated` event
- Returns unique `dealId`

### 2. Off-chain Work
The AI agent / DePIN device performs the actual task off-chain.

### 3. Verify & Settle
```typescript
await escrow.verifyDeal(dealId, success, proofUri)
```
- Verifier submits result (`true` = success, `false` = failure)
- Contract automatically transfers funds to payee (success) or refunds payer (failure)
- Emits `DealVerified` and `DealSettled` events

### 4. Cancel (Optional)
```typescript
await escrow.cancelDeal(dealId)
```
- Payer can cancel before verification
- Funds are immediately refunded

## Troubleshooting

### Tests fail with "insufficient funds"
This shouldn't happen on local Hardhat network. If it does, restart:
```bash
rm -rf cache artifacts
npm run build
npm test
```

### X1 deployment fails with "insufficient funds"
Check your testnet balance:
```bash
# In hardhat console
npx hardhat console --network x1testnet
> (await ethers.provider.getBalance("YOUR_ADDRESS")).toString()
```

### X1 deployment fails with "nonce too low"
Wait a few seconds and retry. X1 testnet might be processing previous transactions.

### Demo runs but status is not 2 (Succeeded)
- Status 0 = None
- Status 1 = Pending
- Status 2 = Succeeded
- Status 3 = Refunded
- Status 4 = Cancelled

Check which status you got and review the transaction logs.

## Next Steps

- Read [docs/architecture.md](docs/architecture.md) for system design
- Read [docs/workflows.md](docs/workflows.md) for detailed flows
- Read [docs/x1-notes.md](docs/x1-notes.md) for why X1 was chosen
- Modify `scripts/demoAgentFlow.ts` to test different scenarios
- Extend `contracts/Wap3Escrow.sol` with new features

## Common Modifications

### Test a refund scenario
In `scripts/demoAgentFlow.ts`, change:
```typescript
await escrow.connect(verifier).verifyDeal(dealId, true, proofUri);
```
to:
```typescript
await escrow.connect(verifier).verifyDeal(dealId, false, proofUri);
```

### Test cancellation
After creating a deal, call:
```typescript
await escrow.connect(payer).cancelDeal(dealId);
```

### Change escrow amount
Modify:
```typescript
const amount = ethers.parseEther("0.01");
```
to any value you want.

## Support

- Report issues: Create a GitHub issue in this repository
- Questions: Check existing issues or create a new discussion
- X1-specific questions: Refer to X1 EcoChain documentation

## License

MIT - see [LICENSE](LICENSE) file.
