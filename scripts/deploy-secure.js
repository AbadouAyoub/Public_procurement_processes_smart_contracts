/**
 * @title Deployment Script for Secure Procurement System
 * @notice Deploys the SecureProcurementSystem contract with OpenZeppelin libraries
 * @dev Saves contract address for CLI interaction
 */

const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying SecureProcurementSystem Contract...\n");
  console.log("=" + "=".repeat(70));
  console.log("  SECURE VERSION - ALL VULNERABILITIES FIXED");
  console.log("=" + "=".repeat(70));
  console.log("\n🛡️  Security Features:");
  console.log("   ✅ OpenZeppelin Ownable - Access control");
  console.log("   ✅ OpenZeppelin ReentrancyGuard - Payment protection");
  console.log("   ✅ OpenZeppelin Pausable - Emergency controls");
  console.log("\n🔒 Security Fixes:");
  console.log("   ✅ Fix #1: Deadline enforcement (prevents late reveals)");
  console.log("   ✅ Fix #2: Max 100 bidders per tender (prevents DoS)");
  console.log("   ✅ Fix #3: ReentrancyGuard on payments (defense-in-depth)");
  console.log();

  // Get deployer
  const [deployer] = await ethers.getSigners();

  console.log("📋 Deployment Details:");
  console.log("   Deployer address:", deployer.address);
  console.log(
    "   Deployer balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );
  console.log();

  // Deploy contract
  console.log("⏳ Deploying SecureProcurementSystem...");
  console.log("   Compiling contracts if needed...");

  const SecureProcurementSystem = await ethers.getContractFactory(
    "SecureProcurementSystem"
  );

  console.log("   Deploying to network...");
  const contract = await SecureProcurementSystem.deploy();

  console.log("   Waiting for deployment confirmation...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("\n✅ Contract deployed successfully!\n");
  console.log("═".repeat(70));
  console.log("  CONTRACT INFORMATION");
  console.log("═".repeat(70));
  console.log("Contract Address:", contractAddress);
  console.log("Owner (Ownable):", await contract.owner());
  console.log("Paused (Pausable):", await contract.paused());
  console.log(
    "Max Bidders per Tender:",
    await contract.MAX_BIDDERS_PER_TENDER()
  );
  console.log("═".repeat(70));

  // Get deployment transaction details
  const deployTx = contract.deploymentTransaction();
  if (deployTx) {
    const receipt = await deployTx.wait();
    console.log("\n💰 GAS ANALYSIS:");
    console.log("   Gas Used:", receipt.gasUsed.toString());
    console.log(
      "   Gas Price:",
      ethers.formatUnits(deployTx.gasPrice || 0n, "gwei"),
      "gwei"
    );
    const gasCost = receipt.gasUsed * (deployTx.gasPrice || 0n);
    console.log("   Deployment Cost:", ethers.formatEther(gasCost), "ETH");
    console.log("   Block Number:", receipt.blockNumber);
  }

  // Save contract address for CLI
  const deploymentInfo = {
    address: contractAddress,
    network: (await ethers.provider.getNetwork()).name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: deployTx ? (await deployTx.wait()).blockNumber : null,
    contractName: "SecureProcurementSystem",
    openZeppelinLibraries: {
      Ownable: "^5.0.0",
      ReentrancyGuard: "^5.0.0",
      Pausable: "^5.0.0",
    },
    securityFixes: {
      fix1: "Deadline enforcement (prevents late reveals)",
      fix2: "Max 100 bidders per tender (prevents DoS)",
      fix3: "ReentrancyGuard on payments (defense-in-depth)",
    },
  };

  fs.writeFileSync(
    "deployed-address.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📝 Contract address saved to: deployed-address.json");
  console.log("\n🎯 NEXT STEPS:");
  console.log("   1. Interact with CLI:");
  console.log("      node scripts/interact.js");
  console.log("\n   2. Run tests:");
  console.log("      npx hardhat test");
  console.log("\n   3. Verify contract (if on testnet):");
  console.log(
    `      npx hardhat verify --network <network> ${contractAddress}`
  );
  console.log();

  return contractAddress;
}

// Execute deployment
main()
  .then((address) => {
    console.log("✅ Deployment completed successfully!");
    console.log(`📍 Contract Address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
