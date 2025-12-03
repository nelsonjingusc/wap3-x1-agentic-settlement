# WAP3-X1 Agentic Settlement – Roadmap

This document outlines the planned evolution of the WAP3-X1 agentic escrow and verification layer over the next 90–120 days. It is intentionally aligned with the milestone structure described in the X1 Ecosystem Grants application.

---

## 0. Current Status – PoC Baseline (this repository)

This repository represents a minimal but end-to-end proof-of-concept:

- A single `Wap3Escrow` Solidity contract that:
  - Locks funds from a payer
  - Delegates outcome evaluation to a designated verifier
  - Releases to the payee on success, refunds to the payer on failure or cancellation
- Hardhat project configuration with:
  - Local network and X1 testnet network definitions
  - TypeScript-based deploy and demo scripts
- Tests covering:
  - Successful settlement
  - Refund on failure
  - Payer-initiated cancellation
- Documentation:
  - `docs/architecture.md` – separation of intent, verification, and settlement
  - `docs/workflows.md` – happy path, failure path, cancellation
  - `docs/api-schema.md` – JSON schemas for `EscrowIntent` and `VerificationResult`
  - `docs/x1-notes.md` – X1-specific design choices and assumptions

This baseline is intended to be easy for X1 engineers and ecosystem reviewers to clone, run, and reason about.

---

## 1. Phase 1 – X1 Testnet Deep Integration (0–30 days)

**Goals**

- Move from a generic PoC to a robust X1 testnet deployment with better tooling and observability.

**Planned work**

- Harden the `Wap3Escrow` contract:
  - Additional validation and event coverage
  - Gas cost review and minor optimizations for high-frequency usage
- Improve test coverage:
  - Edge cases (re-entrancy attempts, invalid callers, zero-value deposits)
  - Time-based behaviors and cancellation constraints
- X1 testnet integration:
  - Use canonical X1 testnet RPC endpoints in configuration
  - Document X1-specific deployment steps and known limitations
- Developer experience:
  - Add more detailed CLI output in demo scripts
  - Provide a simple `examples/` folder with ready-made payloads

**Success indicators**

- Contract deployed and verified on X1 testnet
- All tests passing against both local Hardhat and X1 testnet
- Clear runbook for X1 engineers to reproduce the PoC

---

## 2. Phase 2 – SDK and Integration Templates (30–60 days)

**Goals**

- Make it easy for other X1 ecosystem projects to adopt the WAP3 escrow and verification pattern.

**Planned work**

- TypeScript SDK:
  - A small client package that wraps `createDeal`, `verifyDeal`, and `cancelDeal`
  - Helpers for building `EscrowIntent` and `VerificationResult` objects that match the JSON schemas
- Integration templates:
  - Example code for integrating with AI agent frameworks or rule engines
  - Example code for backend services that monitor contract events and update application state
- Additional documentation:
  - "How to plug this into your existing dApp" guide
  - Security considerations and extension points

**Success indicators**

- A first version of the SDK published (even if only within this repo)
- At least two documented integration templates (agentic and DePIN-inspired)
- Positive feedback from at least one external developer or ecosystem team

---

## 3. Phase 3 – Mainnet-Ready Deployment and Metrics (60–90 days)

**Goals**

- Prepare the escrow and verification layer for real user traffic on X1 mainnet.
- Provide the ecosystem with basic metrics around usage and reliability.

**Planned work**

- Mainnet-focused review:
  - Additional security review and static analysis
  - Parameter tuning for mainnet gas assumptions and usage patterns
- Analytics and monitoring:
  - A simple metrics pipeline that:
    - Subscribes to `DealCreated` and `DealSettled` events
    - Aggregates counts, volumes, and status breakdowns
    - Exposes a minimal dashboard or JSON endpoint
- Operational documentation:
  - Runbooks for deploying to X1 mainnet
  - Incident handling guide (e.g. stuck transactions, verifier misconfiguration)

**Success indicators**

- X1-compatible "mainnet-ready" configuration documented
- Event-driven metrics running against testnet and optionally mainnet
- Basic dashboard capturing:
  - Number of deals
  - Success vs refund vs cancelled ratios
  - Aggregate value settled

---

## 4. Phase 4 – Extended Agentic & DePIN Patterns (90–120 days)

**Goals**

- Extend beyond the minimal escrow pattern to support richer agentic workflows and DePIN-style use cases on X1.

**Planned work**

- Multi-verifier and staking patterns:
  - Optional multi-signer verification flows
  - Simple staking/slashing mechanics for verifiers
- DePIN integration examples:
  - Example of a sensor/edge-node reporting data + proof URI
  - Example of usage-based settlement (e.g. pay-per-call or pay-per-reading)
- Advanced agent coordination:
  - More expressive intent schemas (risk profiles, deadlines, and priorities)
  - Example integration with a production-grade agent framework

**Success indicators**

- At least one DePIN-style example documented and runnable
- At least one extended agentic flow implemented and tested
- Clear extension paths for X1 ecosystem partners that want to build on top of WAP3's patterns

---

## 5. Long-Term Vision

Longer term, the WAP3-X1 integration is intended to be one of several chain targets supported by the WAP3 platform. X1's low-energy, PoA infrastructure and sub-cent fees make it particularly compelling for:

- High-frequency, low-value agentic transactions
- Home-node / edge-node participation
- Web4-native applications with strong requirements around verifiability and cost efficiency

This roadmap is expected to evolve together with the X1 engineering and ecosystem teams as more real-world feedback, usage data, and integration partners come online.
