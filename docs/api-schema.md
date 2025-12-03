# WAP3-X1 Agentic Settlement – API Schema (PoC)

This document defines minimal JSON schemas used by off-chain components
in the PoC. They are intentionally simple and can be extended.

## 1. Escrow Intent

```jsonc
{
  "type": "object",
  "title": "EscrowIntent",
  "properties": {
    "payer": { "type": "string", "description": "EOA address on X1" },
    "payee": { "type": "string", "description": "EOA or contract address" },
    "verifier": { "type": "string", "description": "Designated verifier address" },
    "amount": {
      "type": "string",
      "description": "Escrowed amount in wei (as string)"
    },
    "task_description": { "type": "string" },
    "deadline": {
      "type": "string",
      "description": "Optional ISO 8601 timestamp"
    },
    "metadata": {
      "type": "object",
      "additionalProperties": true
    }
  },
  "required": ["payer", "payee", "verifier", "amount", "task_description"]
}
```

## 2. Verification Result

```jsonc
{
  "type": "object",
  "title": "VerificationResult",
  "properties": {
    "deal_id": { "type": "string" },
    "verifier": { "type": "string" },
    "success": { "type": "boolean" },
    "proof_uri": {
      "type": "string",
      "description": "URI pointing to external proof (Walrus / S3 / IPFS)"
    },
    "reason": {
      "type": "string",
      "description": "Human-readable explanation"
    },
    "score": {
      "type": "number",
      "description": "Optional confidence score from 0.0 to 1.0"
    }
  },
  "required": ["deal_id", "verifier", "success", "proof_uri"]
}
```

In this PoC, the TypeScript demo script internally constructs objects that match
these schemas and then translates them into on-chain calls against
`Wap3Escrow.createDeal` and `Wap3Escrow.verifyDeal`.
