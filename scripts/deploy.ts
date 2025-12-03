import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying Wap3Escrow with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const Escrow = await ethers.getContractFactory("Wap3Escrow");
  const escrow = await Escrow.deploy();

  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log("Wap3Escrow deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
