const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ProcurementSystem Contract...\n");

  // Get signers
  const [deployer, auditor] = await ethers.getSigners();

  console.log("📋 Deployment Details:");
  console.log("   Deployer address:", deployer.address);
  console.log(
    "   Deployer balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );
  console.log("   Auditor address:", auditor.address);
  console.log();

  // Deploy contract
  console.log("⏳ Deploying contract...");
  const ProcurementSystem = await ethers.getContractFactory(
    "ProcurementSystem"
  );
  const procurementSystem = await ProcurementSystem.deploy(auditor.address);

  await procurementSystem.waitForDeployment();

  const contractAddress = await procurementSystem.getAddress();

  console.log("✅ Contract deployed successfully!\n");
  console.log("═".repeat(70));
  console.log("CONTRACT INFORMATION");
  console.log("═".repeat(70));
  console.log("Contract Address:", contractAddress);
  console.log("Owner:", await procurementSystem.owner());
  console.log("Auditor:", await procurementSystem.auditor());
  console.log("Tender Counter:", await procurementSystem.tenderCounter());
  console.log("Paused:", await procurementSystem.paused());
  console.log("═".repeat(70));

  // Get deployment transaction details
  const deployTx = procurementSystem.deploymentTransaction();
  if (deployTx) {
    const receipt = await deployTx.wait();
    console.log("\n💰 GAS ANALYSIS:");
    console.log("   Gas Used:", receipt.gasUsed.toString());
    console.log(
      "   Gas Price:",
      ethers.formatUnits(deployTx.gasPrice || 0n, "gwei"),
      "gwei"
    );
    console.log(
      "   Total Cost:",
      ethers.formatEther(receipt.gasUsed * (deployTx.gasPrice || 0n)),
      "ETH"
    );
  }

  // Save deployment info
  const deploymentInfo = {
    network: "localhost",
    contractAddress: contractAddress,
    owner: deployer.address,
    auditor: auditor.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber(),
  };

  console.log("\n📝 Deployment Info (save this):");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\n✨ Next Steps:");
  console.log("   1. Copy the contract address above");
  console.log("   2. Use it in scripts/interact.js");
  console.log(
    "   3. Run: npx hardhat run scripts/interact.js --network localhost"
  );
  console.log();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
