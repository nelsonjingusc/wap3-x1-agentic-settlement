# WAP3-X1 Agentic Settlement – Workflows (PoC)

This document describes the core flows implemented in this PoC.

## 1. Happy Path: Successful Task & Settlement

1. **Payer** decides to outsource a task to an AI agent or DePIN device.
2. The client (dApp / agent) creates an escrow deal on X1:
   - Calls `createDeal(payee, verifier)` on `Wap3Escrow`
   - Sends the agreed `msg.value` as escrowed funds
   - Contract emits `DealCreated(dealId, payer, payee, verifier, amount)`

3. The **AI / DePIN agent** performs the off-chain task.
4. The **Verifier** (could be a rules engine, AI system, or human-in-the-loop):
   - Evaluates the outcome
   - Stores any artifacts to Walrus / S3 / IPFS
   - Calls `verifyDeal(dealId, true, proofUri)`

5. `Wap3Escrow`:
   - Records `proofUri` and timestamps
   - Transfers funds to `payee`
   - Updates status to `Succeeded`
   - Emits `DealVerified` and `DealSettled`

6. Off-chain analytics service subscribes to events and updates dashboards.

## 2. Failure Path: Task Rejected & Refund

Same as above until step 4, but the verifier calls:

```solidity
verifyDeal(dealId, false, proofUri);
```

The contract:
- Refunds the payer
- Marks status as `Refunded`

## 3. Payer Cancel Before Verification

If the verifier has not acted and the deal is still `Pending`:
- Payer calls `cancelDeal(dealId)`
- Contract refunds payer and sets status to `Cancelled`

## 4. How This Fits X1 EcoChain

- **Low fees** → makes high-frequency agentic micro-payments viable
- **3W PoA nodes** → compatible with DePIN / home-node participation
- **EVM** → this PoC uses standard Solidity & Hardhat and can be dropped into
  existing X1 tooling with minimal friction

Future extensions:
- Multi-signature or multi-verifier aggregation
- Slashing / staking for verifiers
- Off-chain intent schema & router
- Integration with X1-native node devices for DePIN-style proofs
