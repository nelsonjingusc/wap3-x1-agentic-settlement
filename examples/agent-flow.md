# Agent Flow Example – WAP3-X1 Escrow

This example illustrates how an off-chain agent, rule engine, or backend service interacts with the `Wap3Escrow` contract deployed on the X1 testnet.

The goal is to demonstrate a realistic flow using the `EscrowIntent` and `VerificationResult` payloads in this directory.

---

## 1. Step 1 – Build the Escrow Intent

An off-chain agent prepares an `EscrowIntent` similar to:

```
examples/escrow-intent.json
```

Important fields:

- `payer`: the address funding the escrow
- `payee`: the worker or service provider
- `verifier`: the party authorized to finalize the settlement
- `amount`: escrowed value in wei
- `task_description`: a short description of the requested work
- `deadline`, `metadata`: optional contextual fields for off-chain coordination

---

## 2. Step 2 – Submit the Escrow On-Chain

The agent translates the JSON into an on-chain call:

```solidity
createDeal(payee, verifier)
```

with the escrowed amount sent as `msg.value`.

Once the transaction is confirmed, the agent retrieves the `dealId` from the `DealCreated` event.

---

## 3. Step 3 – Perform the Off-Chain Task

The agent (or a delegated worker, model, or device) performs the requested task:
- AI inference
- content generation
- data extraction
- a DePIN device submitting sensor data
- etc.

All work remains off-chain.

---

## 4. Step 4 – Build a Verification Result

After evaluating the work, the verifier produces a payload in one of the two formats:

**Success case**

```
examples/verification-result-success.json
```

**Failure case**

```
examples/verification-result-failure.json
```

Fields:
- `deal_id`: must match the deal created earlier
- `success`: true or false depending on evaluation outcome
- `proof_uri`: a URI pointing to logs, artifacts, or additional proofs
- `reason`: human-readable justification for acceptance or rejection
- `score`: optional confidence score

---

## 5. Step 5 – Finalize Settlement On-Chain

The verifier finalizes the deal by calling:

```solidity
verifyDeal(dealId, true, proofUri);
```

or for rejection:

```solidity
verifyDeal(dealId, false, proofUri);
```

The contract then:
- transfers the escrowed amount to the payee on success
- refunds the payer on failure
- emits `DealVerified` and `DealSettled` events

---

## Summary

This examples set provides:
- runnable JSON payloads for the PoC
- clear separation of intent → work → verification → settlement
- a minimal but complete blueprint for integrating agentic workflows or DePIN devices with X1's PoA, low-cost infrastructure.
