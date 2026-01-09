/**
 * @title Interactive CLI for Secure Procurement System
 * @notice Command-line interface for interacting with the deployed smart contract
 * @dev Uses ethers.js v6 and Hardhat for OpenZeppelin contract interaction
 *
 * Features:
 * - Tender creation and management (tests Ownable.onlyOwner)
 * - Bidder registration
 * - Commit-reveal bidding (with local nonce storage)
 * - Winner selection
 * - Milestone payments (tests ReentrancyGuard.nonReentrant)
 * - Emergency pause controls (tests Pausable)
 * - Event listening and display
 *
 * OpenZeppelin Integration:
 * - Ownable: Ownership management and access control
 * - ReentrancyGuard: Payment protection
 * - Pausable: Emergency stop mechanism
 */

const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// =============================================================================
//                           CONFIGURATION
// =============================================================================

const CONFIG = {
  CONTRACT_ADDRESS_FILE: "deployed-address.json",
  BIDS_STORAGE_FILE: "bids.json",
  CONTRACT_NAME: "SecureProcurementSystem",
};

// =============================================================================
//                           GLOBAL STATE
// =============================================================================

let contract;
let signer;
let signers;
let provider;
let contractAddress;

// =============================================================================
//                           UTILITY FUNCTIONS
// =============================================================================

/**
 * Create readline interface for user input
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Promisified question function
 */
function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

/**
 * Display formatted separator
 */
function separator(char = "=", length = 80) {
  console.log(char.repeat(length));
}

/**
 * Display section header
 */
function header(title) {
  console.log("\n");
  separator("=");
  console.log(`  ${title.toUpperCase()}`);
  separator("=");
}

/**
 * Display success message
 */
function success(message) {
  console.log(`\n✅ ${message}`);
}

/**
 * Display error message
 */
function error(message) {
  console.log(`\n❌ ERROR: ${message}`);
}

/**
 * Display info message
 */
function info(message) {
  console.log(`\nℹ️  ${message}`);
}

/**
 * Display warning message
 */
function warning(message) {
  console.log(`\n⚠️  ${message}`);
}

/**
 * Format ETH amount for display
 */
function formatEth(wei) {
  return ethers.formatEther(wei) + " ETH";
}

/**
 * Format timestamp to readable date
 */
function formatTimestamp(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
}

/**
 * Format address for display (short version)
 */
function formatAddress(address) {
  return `${address.substring(0, 6)}...${address.substring(38)}`;
}

/**
 * Display transaction details
 */
async function displayTxDetails(tx, receipt) {
  console.log("\n📝 Transaction Details:");
  console.log(`   Hash: ${tx.hash}`);
  console.log(`   From: ${receipt.from}`);
  console.log(`   To: ${receipt.to}`);
  console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);
  console.log(
    `   Gas Price: ${ethers.formatUnits(
      receipt.gasPrice || tx.gasPrice,
      "gwei"
    )} gwei`
  );

  const gasCost = receipt.gasUsed * (receipt.gasPrice || tx.gasPrice);
  console.log(`   Total Cost: ${formatEth(gasCost)}`);
  console.log(`   Block: ${receipt.blockNumber}`);
  console.log(
    `   Status: ${receipt.status === 1 ? "✅ Success" : "❌ Failed"}`
  );
}

/**
 * Wait for user to press Enter
 */
async function pressEnterToContinue() {
  await question("\nPress Enter to continue...");
}

// =============================================================================
//                        STORAGE MANAGEMENT
// =============================================================================

/**
 * Load deployed contract address
 */
function loadContractAddress() {
  try {
    const data = fs.readFileSync(CONFIG.CONTRACT_ADDRESS_FILE, "utf8");
    const json = JSON.parse(data);
    return json.address;
  } catch (err) {
    error(`Contract address file not found. Please deploy the contract first.`);
    info(`Run: npx hardhat run scripts/deploy.js --network localhost`);
    process.exit(1);
  }
}

/**
 * Save contract address
 */
function saveContractAddress(address) {
  const data = {
    address: address,
    network: "localhost",
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(CONFIG.CONTRACT_ADDRESS_FILE, JSON.stringify(data, null, 2));
}

/**
 * Load bid storage (nonces)
 */
function loadBids() {
  try {
    const data = fs.readFileSync(CONFIG.BIDS_STORAGE_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

/**
 * Save bid with nonce
 */
function saveBid(tenderId, bidderAddress, amount, nonce) {
  const bids = loadBids();
  const key = `${tenderId}_${bidderAddress}`;
  bids[key] = {
    tenderId: tenderId,
    bidder: bidderAddress,
    amount: amount,
    nonce: nonce,
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(CONFIG.BIDS_STORAGE_FILE, JSON.stringify(bids, null, 2));
}

/**
 * Load bid by tender ID and bidder address
 */
function loadBid(tenderId, bidderAddress) {
  const bids = loadBids();
  const key = `${tenderId}_${bidderAddress}`;
  return bids[key] || null;
}

// =============================================================================
//                        CONTRACT INITIALIZATION
// =============================================================================

/**
 * Initialize contract connection
 */
async function initializeContract() {
  try {
    header("Initializing Contract Connection");

    // Get signers
    signers = await ethers.getSigners();
    signer = signers[0];
    provider = signer.provider;

    info(`Connected to network: ${(await provider.getNetwork()).name}`);
    info(`Current account: ${signer.address}`);
    info(`Balance: ${formatEth(await provider.getBalance(signer.address))}`);

    // Load contract address
    contractAddress = loadContractAddress();
    info(`Contract address: ${contractAddress}`);

    // Get contract instance
    contract = await ethers.getContractAt(
      CONFIG.CONTRACT_NAME,
      contractAddress,
      signer
    );

    // Verify contract is deployed
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      throw new Error("No contract deployed at this address");
    }

    // Test OpenZeppelin Ownable - get owner
    try {
      const owner = await contract.owner();
      info(`Contract owner (Ownable): ${owner}`);

      if (owner.toLowerCase() === signer.address.toLowerCase()) {
        success("You are the contract owner!");
      } else {
        warning("You are NOT the contract owner");
      }
    } catch (err) {
      error("Failed to get owner - Ownable might not be implemented");
    }

    // Check if contract is paused
    try {
      const isPaused = await contract.paused();
      info(
        `Contract status (Pausable): ${isPaused ? "⏸️  PAUSED" : "▶️  ACTIVE"}`
      );
    } catch (err) {
      warning("Pausable status check failed");
    }

    success("Contract initialized successfully!");
  } catch (err) {
    error(`Failed to initialize contract: ${err.message}`);
    process.exit(1);
  }
}

// =============================================================================
//                        TENDER OPERATIONS
// =============================================================================

/**
 * Create a new tender (Owner only - tests Ownable.onlyOwner)
 */
async function createTender() {
  header("Create New Tender");

  try {
    // Check if user is owner
    const owner = await contract.owner();
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      error("Only the contract owner can create tenders!");
      info(`Owner: ${owner}`);
      info(`You: ${signer.address}`);
      return;
    }

    // Get tender details from user
    console.log("\nEnter tender details:");

    const title = await question("Title: ");
    const description = await question("Description: ");
    const maxBudget = await question("Maximum Budget (ETH): ");
    const submissionDuration = await question(
      "Submission Duration (seconds, e.g., 3600 for 1 hour): "
    );
    const revealDuration = await question(
      "Reveal Duration (seconds, e.g., 1800 for 30 min): "
    );

    // Milestone details
    const numMilestones = parseInt(await question("Number of Milestones: "));

    const milestoneDescriptions = [];
    const milestoneAmounts = [];

    console.log("\nEnter milestone details:");
    for (let i = 0; i < numMilestones; i++) {
      console.log(`\nMilestone ${i + 1}:`);
      const desc = await question(`  Description: `);
      const amount = await question(`  Amount (ETH): `);

      milestoneDescriptions.push(desc);
      milestoneAmounts.push(ethers.parseEther(amount));
    }

    // Validate total milestone amounts
    const totalMilestones = milestoneAmounts.reduce(
      (sum, amount) => sum + amount,
      0n
    );
    const maxBudgetWei = ethers.parseEther(maxBudget);

    if (totalMilestones !== maxBudgetWei) {
      error(
        `Total milestones (${formatEth(
          totalMilestones
        )}) must equal max budget (${formatEth(maxBudgetWei)})`
      );
      return;
    }

    info("\nCreating tender...");

    // Call createTender (tests Ownable.onlyOwner modifier)
    const tx = await contract.createTender(
      title,
      description,
      maxBudgetWei,
      parseInt(submissionDuration),
      parseInt(revealDuration),
      milestoneDescriptions,
      milestoneAmounts
    );

    info(`Transaction sent: ${tx.hash}`);
    info("Waiting for confirmation...");

    const receipt = await tx.wait();

    // Parse TenderCreated event
    const event = receipt.logs.find((log) => {
      try {
        const parsed = contract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });
        return parsed.name === "TenderCreated";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = contract.interface.parseLog({
        topics: [...event.topics],
        data: event.data,
      });

      const tenderId = parsed.args[0];

      success(`Tender created successfully!`);
      console.log(`\n📋 Tender Details:`);
      console.log(`   ID: ${tenderId}`);
      console.log(`   Title: ${title}`);
      console.log(`   Max Budget: ${formatEth(maxBudgetWei)}`);
      console.log(`   Submission Deadline: ${formatTimestamp(parsed.args[3])}`);
      console.log(`   Reveal Deadline: ${formatTimestamp(parsed.args[4])}`);
    }

    await displayTxDetails(tx, receipt);
  } catch (err) {
    if (err.message.includes("Ownable")) {
      error(
        "Access denied! This function requires owner privileges (Ownable.onlyOwner)"
      );
    } else {
      error(`Failed to create tender: ${err.message}`);
    }
  }
}

/**
 * View tender details
 */
async function viewTender() {
  header("View Tender Details");

  try {
    const tenderId = await question("Enter Tender ID: ");

    const details = await contract.getTenderDetails(tenderId);

    console.log(`\n📋 Tender #${tenderId}:`);
    console.log(`   Title: ${details[0]}`);
    console.log(`   Description: ${details[1]}`);
    console.log(`   Max Budget: ${formatEth(details[2])}`);
    console.log(`   Submission Deadline: ${formatTimestamp(details[3])}`);
    console.log(`   Reveal Deadline: ${formatTimestamp(details[4])}`);
    console.log(
      `   Phase: ${
        [
          "BID_SUBMISSION",
          "BID_REVEAL",
          "WINNER_SELECTION",
          "PAYMENT_PENDING",
          "COMPLETED",
        ][details[5]]
      }`
    );
    console.log(
      `   Winner: ${
        details[6] === ethers.ZeroAddress ? "Not selected" : details[6]
      }`
    );
    console.log(`   Funded Amount: ${formatEth(details[7])}`);
    console.log(`   Milestones Completed: ${details[8].toString()}`);

    // Get milestone count
    const milestoneCount = await contract.getMilestoneCount(tenderId);
    console.log(`\n📊 Milestones (${milestoneCount} total):`);

    for (let i = 0; i < Number(milestoneCount); i++) {
      const milestone = await contract.getMilestone(tenderId, i);
      console.log(`\n   Milestone ${i + 1}:`);
      console.log(`      Description: ${milestone[0]}`);
      console.log(`      Amount: ${formatEth(milestone[1])}`);
      console.log(`      Status: ${milestone[2] ? "✅ Paid" : "⏳ Pending"}`);
      if (milestone[2]) {
        console.log(`      Paid At: ${formatTimestamp(milestone[3])}`);
      }
    }
  } catch (err) {
    error(`Failed to view tender: ${err.message}`);
  }
}

// =============================================================================
//                        BIDDER OPERATIONS
// =============================================================================

/**
 * Register as a bidder
 */
async function registerBidder() {
  header("Register as Bidder");

  try {
    // Check if already registered
    const isRegistered = await contract.isBidderRegistered(signer.address);

    if (isRegistered) {
      warning("You are already registered as a bidder!");
      return;
    }

    info("Registering as bidder...");

    const tx = await contract.registerBidder();
    info(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();

    success("Successfully registered as bidder!");
    await displayTxDetails(tx, receipt);
  } catch (err) {
    error(`Failed to register: ${err.message}`);
  }
}

/**
 * Submit a bid (Commit phase)
 */
async function submitBid() {
  header("Submit Bid (Commit Phase)");

  try {
    // Check if registered
    const isRegistered = await contract.isBidderRegistered(signer.address);
    if (!isRegistered) {
      error("You must register as a bidder first!");
      return;
    }

    const tenderId = await question("Enter Tender ID: ");

    // Get tender details to check phase
    const details = await contract.getTenderDetails(tenderId);
    const phase = Number(details[5]);

    if (phase !== 0) {
      // BID_SUBMISSION = 0
      error("Tender is not in BID_SUBMISSION phase!");
      return;
    }

    const bidAmount = await question("Enter your bid amount (ETH): ");

    // Generate random nonce using ethers
    const nonce = ethers.hexlify(ethers.randomBytes(32));

    info(`Generated nonce: ${nonce}`);

    // Calculate bid hash using solidityPackedKeccak256
    const bidHash = ethers.solidityPackedKeccak256(
      ["uint256", "string"],
      [ethers.parseEther(bidAmount), nonce]
    );

    info(`Calculated bid hash: ${bidHash}`);

    // Save bid locally
    saveBid(tenderId, signer.address, bidAmount, nonce);
    success("Bid details saved locally");

    info("Submitting hashed bid to blockchain...");

    const tx = await contract.submitBid(tenderId, bidHash);
    info(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();

    success("Bid submitted successfully!");
    console.log(`\n📝 Bid Summary:`);
    console.log(`   Tender ID: ${tenderId}`);
    console.log(`   Bid Amount: ${bidAmount} ETH (hidden on-chain)`);
    console.log(`   Bid Hash: ${bidHash}`);
    console.log(`   Nonce: ${nonce.substring(0, 10)}... (stored locally)`);

    warning("Keep your nonce safe! You'll need it to reveal your bid.");

    await displayTxDetails(tx, receipt);
  } catch (err) {
    if (err.message.includes("Maximum number of bidders reached")) {
      error("DoS Protection: Maximum bidder limit reached for this tender!");
      info("This is Fix #2 - prevents unbounded loop DoS attacks");
    } else {
      error(`Failed to submit bid: ${err.message}`);
    }
  }
}

/**
 * Reveal a bid (Reveal phase)
 */
async function revealBid() {
  header("Reveal Bid (Reveal Phase)");

  try {
    const tenderId = await question("Enter Tender ID: ");

    // Load stored bid
    const storedBid = loadBid(tenderId, signer.address);

    if (!storedBid) {
      error("No stored bid found for this tender!");
      info("You must submit a bid first before revealing.");
      return;
    }

    console.log(`\n📝 Stored Bid Details:`);
    console.log(`   Amount: ${storedBid.amount} ETH`);
    console.log(`   Nonce: ${storedBid.nonce.substring(0, 10)}...`);
    console.log(`   Submitted: ${storedBid.timestamp}`);

    const confirm = await question("\nReveal this bid? (yes/no): ");
    if (confirm.toLowerCase() !== "yes") {
      info("Reveal cancelled");
      return;
    }

    info("Revealing bid...");

    // Call revealBid - Tests Fix #1 (deadline enforcement)
    const tx = await contract.revealBid(
      tenderId,
      ethers.parseEther(storedBid.amount),
      storedBid.nonce
    );

    info(`Transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();

    // Parse BidRevealed event
    const event = receipt.logs.find((log) => {
      try {
        const parsed = contract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });
        return parsed.name === "BidRevealed";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = contract.interface.parseLog({
        topics: [...event.topics],
        data: event.data,
      });

      success("Bid revealed successfully!");
      console.log(`\n📊 Revealed Bid:`);
      console.log(`   Tender ID: ${parsed.args[0]}`);
      console.log(`   Bidder: ${parsed.args[1]}`);
      console.log(`   Amount: ${formatEth(parsed.args[2])}`);
      console.log(`   Valid: ${parsed.args[3] ? "✅ Yes" : "❌ No"}`);
      console.log(`   Revealed At: ${formatTimestamp(parsed.args[4])}`);
    }

    await displayTxDetails(tx, receipt);
  } catch (err) {
    if (err.message.includes("Reveal deadline has passed")) {
      error("Reveal deadline has passed!");
      info("This is Fix #1 - prevents late reveal attacks");
      info("All bidders must reveal within the same time window for fairness");
    } else if (err.message.includes("Invalid reveal")) {
      error("Invalid reveal - hash mismatch!");
      info("The amount/nonce combination doesn't match your committed hash");
    } else {
      error(`Failed to reveal bid: ${err.message}`);
    }
  }
}

/**
 * View all bids for a tender
 */
async function viewBids() {
  header("View Tender Bids");

  try {
    const tenderId = await question("Enter Tender ID: ");

    // Get all bidders
    const bidders = await contract.getTenderBidders(tenderId);

    if (bidders.length === 0) {
      info("No bids submitted for this tender");
      return;
    }

    console.log(
      `\n📊 Bids for Tender #${tenderId} (${bidders.length} bidders):`
    );
    console.log(`   Maximum bidders allowed: 100 (Fix #2 - DoS protection)\n`);

    for (let i = 0; i < bidders.length; i++) {
      const bidder = bidders[i];
      const bid = await contract.getBid(tenderId, bidder);

      console.log(`   Bidder ${i + 1}: ${formatAddress(bidder)}`);
      console.log(`      Commit Hash: ${bid[0]}`);

      if (bid[2]) {
        // isRevealed
        console.log(`      Revealed Amount: ${formatEth(bid[1])}`);
        console.log(`      Valid: ${bid[3] ? "✅" : "❌"}`);
        console.log(`      Revealed At: ${formatTimestamp(bid[4])}`);
      } else {
        console.log(`      Status: ⏳ Not yet revealed`);
      }
      console.log();
    }
  } catch (err) {
    error(`Failed to view bids: ${err.message}`);
  }
}

// =============================================================================
//                        WINNER SELECTION
// =============================================================================

/**
 * Select winner (Owner only)
 */
async function selectWinner() {
  header("Select Winner");

  try {
    // Check if user is owner
    const owner = await contract.owner();
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      error("Only the contract owner can select winners!");
      return;
    }

    const tenderId = await question("Enter Tender ID: ");

    info("Selecting winner (iterating through all revealed bids)...");
    info("Protected by Fix #2: Maximum 100 bidders = ~210k gas max");

    const tx = await contract.selectWinner(tenderId);
    info(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();

    // Parse WinnerSelected event
    const event = receipt.logs.find((log) => {
      try {
        const parsed = contract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });
        return parsed.name === "WinnerSelected";
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = contract.interface.parseLog({
        topics: [...event.topics],
        data: event.data,
      });

      success("Winner selected successfully!");
      console.log(`\n🏆 Winner Details:`);
      console.log(`   Tender ID: ${parsed.args[0]}`);
      console.log(`   Winner: ${parsed.args[1]}`);
      console.log(`   Winning Bid: ${formatEth(parsed.args[2])}`);
      console.log(`   Selected At: ${formatTimestamp(parsed.args[3])}`);
    }

    await displayTxDetails(tx, receipt);
  } catch (err) {
    if (err.message.includes("No valid bids found")) {
      error(
        "No valid bids found! Ensure at least one bid is revealed and valid."
      );
    } else {
      error(`Failed to select winner: ${err.message}`);
    }
  }
}

// =============================================================================
//                        PAYMENT OPERATIONS
// =============================================================================

/**
 * Fund a tender (Owner only)
 */
async function fundTender() {
  header("Fund Tender");

  try {
    const owner = await contract.owner();
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      error("Only the contract owner can fund tenders!");
      return;
    }

    const tenderId = await question("Enter Tender ID: ");

    // Get tender details
    const details = await contract.getTenderDetails(tenderId);
    const winner = details[6];

    if (winner === ethers.ZeroAddress) {
      error("Winner not selected yet!");
      return;
    }

    // Get winner's bid amount
    const winnerBid = await contract.getBid(tenderId, winner);
    const amount = winnerBid[1];

    console.log(`\n💰 Funding Details:`);
    console.log(`   Winner: ${winner}`);
    console.log(`   Winning Bid: ${formatEth(amount)}`);

    const confirm = await question(`\nFund ${formatEth(amount)}? (yes/no): `);
    if (confirm.toLowerCase() !== "yes") {
      info("Funding cancelled");
      return;
    }

    info("Funding tender...");

    const tx = await contract.fundTender(tenderId, { value: amount });
    info(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();

    success("Tender funded successfully!");
    await displayTxDetails(tx, receipt);
  } catch (err) {
    error(`Failed to fund tender: ${err.message}`);
  }
}

/**
 * Release milestone payment (Owner only - Tests nonReentrant)
 */
async function releaseMilestonePayment() {
  header("Release Milestone Payment");

  try {
    const owner = await contract.owner();
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      error("Only the contract owner can release milestone payments!");
      return;
    }

    const tenderId = await question("Enter Tender ID: ");
    const milestoneIndex = await question("Enter Milestone Index (0-based): ");

    // Get milestone details
    const milestone = await contract.getMilestone(tenderId, milestoneIndex);

    console.log(`\n💸 Milestone Details:`);
    console.log(`   Description: ${milestone[0]}`);
    console.log(`   Amount: ${formatEth(milestone[1])}`);
    console.log(`   Status: ${milestone[2] ? "Already paid" : "Pending"}`);

    if (milestone[2]) {
      warning("This milestone is already paid!");
      return;
    }

    const confirm = await question(
      `\nRelease payment of ${formatEth(milestone[1])}? (yes/no): `
    );
    if (confirm.toLowerCase() !== "yes") {
      info("Release cancelled");
      return;
    }

    info("Releasing milestone payment...");
    info(
      "Protected by OpenZeppelin ReentrancyGuard.nonReentrant modifier (Fix #3)"
    );

    // This tests ReentrancyGuard - will block reentrancy attempts
    const tx = await contract.releaseMilestonePayment(tenderId, milestoneIndex);
    info(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();

    success("Milestone payment released successfully!");
    info(
      "Note: Payment protected by ReentrancyGuard (defense-in-depth with CEI pattern)"
    );

    await displayTxDetails(tx, receipt);
  } catch (err) {
    if (err.message.includes("ReentrancyGuard")) {
      error("Reentrancy attempt blocked by ReentrancyGuard!");
      info("This is Fix #3 - prevents reentrancy attacks");
    } else {
      error(`Failed to release payment: ${err.message}`);
    }
  }
}

/**
 * Emergency withdraw (Owner only - Tests nonReentrant)
 */
async function emergencyWithdraw() {
  header("Emergency Withdraw");

  try {
    const owner = await contract.owner();
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      error("Only the contract owner can perform emergency withdraw!");
      return;
    }

    const tenderId = await question("Enter Tender ID: ");

    // Get tender details
    const details = await contract.getTenderDetails(tenderId);
    const fundedAmount = details[7];

    if (fundedAmount === 0n) {
      warning("No funds to withdraw for this tender");
      return;
    }

    console.log(`\n⚠️  Emergency Withdraw:`);
    console.log(`   Funded Amount: ${formatEth(fundedAmount)}`);

    const confirm = await question(
      `\nWithdraw ${formatEth(fundedAmount)}? (yes/no): `
    );
    if (confirm.toLowerCase() !== "yes") {
      info("Withdrawal cancelled");
      return;
    }

    warning("This is an emergency function - use with caution!");
    info(
      "Protected by OpenZeppelin ReentrancyGuard.nonReentrant modifier (Fix #3)"
    );

    const tx = await contract.emergencyWithdraw(tenderId);
    info(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();

    success("Emergency withdrawal completed!");
    info(
      "Note: Protected by both CEI pattern AND ReentrancyGuard (defense-in-depth)"
    );

    await displayTxDetails(tx, receipt);
  } catch (err) {
    if (err.message.includes("ReentrancyGuard")) {
      error("Reentrancy attempt blocked by ReentrancyGuard!");
    } else {
      error(`Failed to withdraw: ${err.message}`);
    }
  }
}

// =============================================================================
//                        EMERGENCY CONTROLS (Pausable)
// =============================================================================

/**
 * Pause contract (Owner only - Tests Pausable)
 */
async function pauseContract() {
  header("Pause Contract");

  try {
    const owner = await contract.owner();
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      error("Only the contract owner can pause the contract!");
      return;
    }

    const isPaused = await contract.paused();
    if (isPaused) {
      warning("Contract is already paused!");
      return;
    }

    warning("This will stop all contract operations!");
    const confirm = await question("Pause contract? (yes/no): ");
    if (confirm.toLowerCase() !== "yes") {
      info("Pause cancelled");
      return;
    }

    info("Pausing contract (OpenZeppelin Pausable)...");

    const tx = await contract.pause();
    info(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();

    success("Contract paused successfully!");
    info("All public functions are now blocked by whenNotPaused modifier");

    await displayTxDetails(tx, receipt);
  } catch (err) {
    error(`Failed to pause: ${err.message}`);
  }
}

/**
 * Unpause contract (Owner only - Tests Pausable)
 */
async function unpauseContract() {
  header("Unpause Contract");

  try {
    const owner = await contract.owner();
    if (owner.toLowerCase() !== signer.address.toLowerCase()) {
      error("Only the contract owner can unpause the contract!");
      return;
    }

    const isPaused = await contract.paused();
    if (!isPaused) {
      warning("Contract is not paused!");
      return;
    }

    const confirm = await question("Unpause contract? (yes/no): ");
    if (confirm.toLowerCase() !== "yes") {
      info("Unpause cancelled");
      return;
    }

    info("Unpausing contract (OpenZeppelin Pausable)...");

    const tx = await contract.unpause();
    info(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();

    success("Contract unpaused successfully!");
    info("All public functions are now operational");

    await displayTxDetails(tx, receipt);
  } catch (err) {
    error(`Failed to unpause: ${err.message}`);
  }
}

// =============================================================================
//                        OWNERSHIP MANAGEMENT (Ownable)
// =============================================================================

/**
 * Transfer ownership (Tests Ownable.transferOwnership)
 */
async function transferOwnership() {
  header("Transfer Ownership");

  try {
    const currentOwner = await contract.owner();
    if (currentOwner.toLowerCase() !== signer.address.toLowerCase()) {
      error("Only the current owner can transfer ownership!");
      return;
    }

    console.log(`\nCurrent Owner: ${currentOwner}`);

    const newOwner = await question("Enter new owner address: ");

    if (!ethers.isAddress(newOwner)) {
      error("Invalid address!");
      return;
    }

    if (newOwner === ethers.ZeroAddress) {
      error("Cannot transfer to zero address! Use renounceOwnership instead.");
      return;
    }

    warning("This will permanently transfer contract ownership!");
    const confirm = await question(
      `Transfer ownership to ${newOwner}? (yes/no): `
    );
    if (confirm.toLowerCase() !== "yes") {
      info("Transfer cancelled");
      return;
    }

    info("Transferring ownership (OpenZeppelin Ownable)...");

    const tx = await contract.transferOwnership(newOwner);
    info(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();

    success("Ownership transferred successfully!");
    console.log(`\n👤 New Owner: ${newOwner}`);

    await displayTxDetails(tx, receipt);
  } catch (err) {
    error(`Failed to transfer ownership: ${err.message}`);
  }
}

// =============================================================================
//                        EVENT LISTENING
// =============================================================================

/**
 * Listen to contract events
 */
async function listenToEvents() {
  header("Listen to Contract Events");

  try {
    info("Starting event listener...");
    info("Press Ctrl+C to stop");

    separator("-");

    // Listen to all events
    contract.on(
      "TenderCreated",
      (tenderId, title, maxBudget, submissionDeadline, revealDeadline) => {
        console.log(`\n🆕 TenderCreated:`);
        console.log(`   Tender ID: ${tenderId}`);
        console.log(`   Title: ${title}`);
        console.log(`   Max Budget: ${formatEth(maxBudget)}`);
        console.log(
          `   Submission Deadline: ${formatTimestamp(submissionDeadline)}`
        );
        console.log(`   Reveal Deadline: ${formatTimestamp(revealDeadline)}`);
      }
    );

    contract.on("BidderRegistered", (bidder, timestamp) => {
      console.log(`\n👤 BidderRegistered:`);
      console.log(`   Bidder: ${bidder}`);
      console.log(`   Time: ${formatTimestamp(timestamp)}`);
    });

    contract.on("BidSubmitted", (tenderId, bidder, commitHash, timestamp) => {
      console.log(`\n📩 BidSubmitted:`);
      console.log(`   Tender ID: ${tenderId}`);
      console.log(`   Bidder: ${formatAddress(bidder)}`);
      console.log(`   Hash: ${commitHash}`);
      console.log(`   Time: ${formatTimestamp(timestamp)}`);
    });

    contract.on(
      "BidRevealed",
      (tenderId, bidder, amount, isValid, timestamp) => {
        console.log(`\n🔓 BidRevealed:`);
        console.log(`   Tender ID: ${tenderId}`);
        console.log(`   Bidder: ${formatAddress(bidder)}`);
        console.log(`   Amount: ${formatEth(amount)}`);
        console.log(`   Valid: ${isValid ? "✅" : "❌"}`);
        console.log(`   Time: ${formatTimestamp(timestamp)}`);
      }
    );

    contract.on("WinnerSelected", (tenderId, winner, winningBid, timestamp) => {
      console.log(`\n🏆 WinnerSelected:`);
      console.log(`   Tender ID: ${tenderId}`);
      console.log(`   Winner: ${winner}`);
      console.log(`   Winning Bid: ${formatEth(winningBid)}`);
      console.log(`   Time: ${formatTimestamp(timestamp)}`);
    });

    contract.on("TenderFunded", (tenderId, amount, timestamp) => {
      console.log(`\n💰 TenderFunded:`);
      console.log(`   Tender ID: ${tenderId}`);
      console.log(`   Amount: ${formatEth(amount)}`);
      console.log(`   Time: ${formatTimestamp(timestamp)}`);
    });

    contract.on(
      "MilestonePaymentReleased",
      (tenderId, milestoneIndex, recipient, amount, timestamp) => {
        console.log(`\n💸 MilestonePaymentReleased:`);
        console.log(`   Tender ID: ${tenderId}`);
        console.log(`   Milestone: ${milestoneIndex}`);
        console.log(`   Recipient: ${formatAddress(recipient)}`);
        console.log(`   Amount: ${formatEth(amount)}`);
        console.log(`   Time: ${formatTimestamp(timestamp)}`);
      }
    );

    // OpenZeppelin Ownable events
    contract.on("OwnershipTransferred", (previousOwner, newOwner) => {
      console.log(`\n👤 OwnershipTransferred (Ownable):`);
      console.log(`   From: ${previousOwner}`);
      console.log(`   To: ${newOwner}`);
    });

    // OpenZeppelin Pausable events
    contract.on("Paused", (account) => {
      console.log(`\n⏸️  Paused (Pausable):`);
      console.log(`   By: ${account}`);
    });

    contract.on("Unpaused", (account) => {
      console.log(`\n▶️  Unpaused (Pausable):`);
      console.log(`   By: ${account}`);
    });

    success("Event listener active!");

    // Keep the process running
    await new Promise(() => {});
  } catch (err) {
    error(`Event listener error: ${err.message}`);
  }
}

// =============================================================================
//                        UTILITY FUNCTIONS
// =============================================================================

/**
 * Check account balance
 */
async function checkBalance() {
  header("Check Account Balance");

  try {
    const address = await question(
      "Enter address (or press Enter for current account): "
    );
    const checkAddress = address || signer.address;

    const balance = await provider.getBalance(checkAddress);

    console.log(`\n💰 Balance Information:`);
    console.log(`   Address: ${checkAddress}`);
    console.log(`   Balance: ${formatEth(balance)}`);
    console.log(
      `   Is You: ${
        checkAddress.toLowerCase() === signer.address.toLowerCase()
          ? "Yes"
          : "No"
      }`
    );
  } catch (err) {
    error(`Failed to check balance: ${err.message}`);
  }
}

/**
 * Switch account (use different signer)
 */
async function switchAccount() {
  header("Switch Account");

  try {
    console.log("\nAvailable accounts:");
    for (let i = 0; i < Math.min(signers.length, 10); i++) {
      const addr = signers[i].address;
      const bal = await provider.getBalance(addr);
      const isCurrent = addr.toLowerCase() === signer.address.toLowerCase();
      console.log(
        `   ${i}: ${addr} - ${formatEth(bal)} ${isCurrent ? "(current)" : ""}`
      );
    }

    const index = await question("\nSelect account index: ");
    const idx = parseInt(index);

    if (idx < 0 || idx >= signers.length) {
      error("Invalid account index");
      return;
    }

    signer = signers[idx];
    contract = contract.connect(signer);

    success(`Switched to account: ${signer.address}`);

    // Check if new account is owner
    const owner = await contract.owner();
    if (owner.toLowerCase() === signer.address.toLowerCase()) {
      info("This account is the contract owner!");
    }

    // Check if registered bidder
    const isRegistered = await contract.isBidderRegistered(signer.address);
    if (isRegistered) {
      info("This account is a registered bidder");
    }
  } catch (err) {
    error(`Failed to switch account: ${err.message}`);
  }
}

/**
 * View contract information
 */
async function viewContractInfo() {
  header("Contract Information");

  try {
    console.log(`\n📋 Contract Details:`);
    console.log(`   Name: ${CONFIG.CONTRACT_NAME}`);
    console.log(`   Address: ${contractAddress}`);
    console.log(`   Network: ${(await provider.getNetwork()).name}`);

    const owner = await contract.owner();
    console.log(`   Owner (Ownable): ${owner}`);

    const isPaused = await contract.paused();
    console.log(
      `   Status (Pausable): ${isPaused ? "⏸️  PAUSED" : "▶️  ACTIVE"}`
    );

    const balance = await provider.getBalance(contractAddress);
    console.log(`   Balance: ${formatEth(balance)}`);

    console.log(`\n🛡️  OpenZeppelin Libraries:`);
    console.log(`   ✅ Ownable - Access control`);
    console.log(`   ✅ ReentrancyGuard - Reentrancy protection`);
    console.log(`   ✅ Pausable - Emergency stop`);

    console.log(`\n🔒 Security Fixes Applied:`);
    console.log(`   ✅ Fix #1: Late reveal deadline enforcement`);
    console.log(
      `   ✅ Fix #2: Maximum 100 bidders per tender (DoS protection)`
    );
    console.log(`   ✅ Fix #3: ReentrancyGuard on all payment functions`);
  } catch (err) {
    error(`Failed to get contract info: ${err.message}`);
  }
}

// =============================================================================
//                           MAIN MENU
// =============================================================================

/**
 * Display main menu
 */
function displayMenu() {
  separator("=");
  console.log("  SECURE PROCUREMENT SYSTEM - CLI");
  console.log("  OpenZeppelin Integration Demo");
  separator("=");
  console.log("\n📋 TENDER MANAGEMENT:");
  console.log("  1. Create Tender (Owner only - tests Ownable)");
  console.log("  2. View Tender Details");
  console.log("\n👤 BIDDER OPERATIONS:");
  console.log("  3. Register as Bidder");
  console.log("  4. Submit Bid (Commit Phase)");
  console.log("  5. Reveal Bid (Reveal Phase - tests Fix #1)");
  console.log("  6. View All Bids");
  console.log("\n🏆 WINNER & PAYMENTS:");
  console.log("  7. Select Winner (Owner only - tests Fix #2)");
  console.log("  8. Fund Tender (Owner only)");
  console.log("  9. Release Milestone Payment (tests ReentrancyGuard)");
  console.log(" 10. Emergency Withdraw (tests ReentrancyGuard)");
  console.log("\n🛡️  EMERGENCY CONTROLS:");
  console.log(" 11. Pause Contract (tests Pausable)");
  console.log(" 12. Unpause Contract (tests Pausable)");
  console.log("\n👥 OWNERSHIP & UTILITIES:");
  console.log(" 13. Transfer Ownership (tests Ownable)");
  console.log(" 14. Listen to Events");
  console.log(" 15. Check Balance");
  console.log(" 16. Switch Account");
  console.log(" 17. View Contract Info");
  console.log("\n 0. Exit");
  separator("=");
}

/**
 * Main menu loop
 */
async function mainMenu() {
  while (true) {
    displayMenu();
    const choice = await question("\nEnter your choice: ");

    try {
      switch (choice) {
        case "1":
          await createTender();
          break;
        case "2":
          await viewTender();
          break;
        case "3":
          await registerBidder();
          break;
        case "4":
          await submitBid();
          break;
        case "5":
          await revealBid();
          break;
        case "6":
          await viewBids();
          break;
        case "7":
          await selectWinner();
          break;
        case "8":
          await fundTender();
          break;
        case "9":
          await releaseMilestonePayment();
          break;
        case "10":
          await emergencyWithdraw();
          break;
        case "11":
          await pauseContract();
          break;
        case "12":
          await unpauseContract();
          break;
        case "13":
          await transferOwnership();
          break;
        case "14":
          await listenToEvents();
          break;
        case "15":
          await checkBalance();
          break;
        case "16":
          await switchAccount();
          break;
        case "17":
          await viewContractInfo();
          break;
        case "0":
          info("Exiting...");
          rl.close();
          process.exit(0);
        default:
          warning("Invalid choice. Please try again.");
      }

      await pressEnterToContinue();
    } catch (err) {
      error(`Unexpected error: ${err.message}`);
      await pressEnterToContinue();
    }
  }
}

// =============================================================================
//                           ENTRY POINT
// =============================================================================

async function main() {
  console.clear();

  header("Secure Procurement System - Interactive CLI");
  console.log("\n🔐 Security Features:");
  console.log("   ✅ OpenZeppelin Ownable - Ownership management");
  console.log("   ✅ OpenZeppelin ReentrancyGuard - Payment protection");
  console.log("   ✅ OpenZeppelin Pausable - Emergency controls");
  console.log("\n🛡️  Security Fixes:");
  console.log("   ✅ Fix #1: Deadline enforcement (prevents late reveals)");
  console.log("   ✅ Fix #2: Max 100 bidders per tender (prevents DoS)");
  console.log("   ✅ Fix #3: ReentrancyGuard on payments (defense-in-depth)");
  console.log();

  await initializeContract();
  await pressEnterToContinue();

  await mainMenu();
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n👋 Goodbye!");
  rl.close();
  process.exit(0);
});

// Run main function
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
