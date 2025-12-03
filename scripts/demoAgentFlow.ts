import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

// Demo: Full escrow flow
// 1. Deploy contract (or use existing)
// 2. Payer locks funds
// 3. Fake off-chain work
// 4. Verifier submits result
// 5. Funds released or refunded

const X1_ESCROW_ADDRESS = process.env.X1_ESCROW_ADDRESS || "";

async function demo() {
  const [payer, payee, verifier] = await ethers.getSigners();

  let escrow;
  if (X1_ESCROW_ADDRESS) {
    escrow = await ethers.getContractAt("Wap3Escrow", X1_ESCROW_ADDRESS);
    console.log("Using existing Wap3Escrow at:", X1_ESCROW_ADDRESS);
  } else {
    const Escrow = await ethers.getContractFactory("Wap3Escrow");
    escrow = await Escrow.connect(payer).deploy();
    await escrow.waitForDeployment();
    console.log("Deployed Wap3Escrow to:", await escrow.getAddress());
  }

  // 1) Payer creates deal
  const amount = ethers.parseEther("0.01");
  console.log("\nCreating deal...");
  const txCreate = await escrow
    .connect(payer)
    .createDeal(await payee.getAddress(), await verifier.getAddress(), {
      value: amount,
    });
  const receiptCreate = await txCreate.wait();
  const event = receiptCreate!.logs.find(
    (l: any) => l.fragment && l.fragment.name === "DealCreated"
  ) as any;

  const dealId = event?.args?.dealId ?? 1n;
  console.log("Deal created with id:", dealId.toString());

  // 2) Off-chain work happens here (AI agent, DePIN device, etc.)
  console.log("Simulating off-chain task... (pretend AI did some work)");

  // 3) Verifier verifies success and posts proof URI
  const proofUri =
    "walrus://proofs/x1-demo/" + new Date().toISOString().replace(/[:.]/g, "-");

  console.log("\nVerifier submitting success proof:", proofUri);
  const txVerify = await escrow
    .connect(verifier)
    .verifyDeal(dealId, true, proofUri);
  await txVerify.wait();

  const deal = await escrow.getDeal(dealId);
  console.log("\nFinal deal state:");
  console.log({
    payer: deal.payer,
    payee: deal.payee,
    verifier: deal.verifier,
    amount: deal.amount.toString(),
    status: deal.status, // 2 = Succeeded
    proofUri: deal.proofUri,
  });
}

demo().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
