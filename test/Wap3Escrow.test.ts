import { expect } from "chai";
import { ethers } from "hardhat";

describe("Wap3Escrow (PoC)", function () {
  it("creates, verifies and settles a successful deal", async () => {
    const [payer, payee, verifier] = await ethers.getSigners();

    const Escrow = await ethers.getContractFactory("Wap3Escrow");
    const escrow = await Escrow.deploy();
    await escrow.waitForDeployment();

    const amount = ethers.parseEther("1.0");

    const txCreate = await escrow
      .connect(payer)
      .createDeal(await payee.getAddress(), await verifier.getAddress(), {
        value: amount,
      });

    const receiptCreate = await txCreate.wait();
    const event = receiptCreate!.logs.find(
      (l: any) => l.fragment && l.fragment.name === "DealCreated"
    ) as any;

    const dealId = event.args.dealId;

    const beforePayee = await ethers.provider.getBalance(payee.address);

    const proofUri = "walrus://unit-test/proof-1";
    await escrow.connect(verifier).verifyDeal(dealId, true, proofUri);

    const deal = await escrow.getDeal(dealId);

    expect(deal.status).to.equal(2); // Succeeded
    expect(deal.proofUri).to.equal(proofUri);

    const afterPayee = await ethers.provider.getBalance(payee.address);
    expect(afterPayee).to.be.greaterThan(beforePayee);
  });

  it("refunds payer when verification fails", async () => {
    const [payer, payee, verifier] = await ethers.getSigners();

    const Escrow = await ethers.getContractFactory("Wap3Escrow");
    const escrow = await Escrow.deploy();
    await escrow.waitForDeployment();

    const amount = ethers.parseEther("0.5");
    const txCreate = await escrow
      .connect(payer)
      .createDeal(await payee.getAddress(), await verifier.getAddress(), {
        value: amount,
      });

    const receiptCreate = await txCreate.wait();
    const event = receiptCreate!.logs.find(
      (l: any) => l.fragment && l.fragment.name === "DealCreated"
    ) as any;

    const dealId = event.args.dealId;

    const beforePayer = await ethers.provider.getBalance(payer.address);

    const proofUri = "walrus://unit-test/proof-2";
    const txVerify = await escrow
      .connect(verifier)
      .verifyDeal(dealId, false, proofUri);
    await txVerify.wait();

    const deal = await escrow.getDeal(dealId);

    expect(deal.status).to.equal(3); // Refunded
    expect(deal.proofUri).to.equal(proofUri);

    const afterPayer = await ethers.provider.getBalance(payer.address);
    expect(afterPayer).to.be.greaterThan(beforePayer);
  });

  it("allows payer to cancel a pending deal", async () => {
    const [payer, payee, verifier] = await ethers.getSigners();

    const Escrow = await ethers.getContractFactory("Wap3Escrow");
    const escrow = await Escrow.deploy();
    await escrow.waitForDeployment();

    const amount = ethers.parseEther("0.25");
    const txCreate = await escrow
      .connect(payer)
      .createDeal(await payee.getAddress(), await verifier.getAddress(), {
        value: amount,
      });

    const receiptCreate = await txCreate.wait();
    const event = receiptCreate!.logs.find(
      (l: any) => l.fragment && l.fragment.name === "DealCreated"
    ) as any;

    const dealId = event.args.dealId;

    await escrow.connect(payer).cancelDeal(dealId);
    const deal = await escrow.getDeal(dealId);

    expect(deal.status).to.equal(4); // Cancelled
  });
});
