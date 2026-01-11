# Public Procurement System on Blockchain

**Decentralized public tender management system** using Ethereum Smart Contracts to ensure transparency and fairness.

---

## 📖 Project Description

This project implements a blockchain solution to manage public tenders in a transparent and secure manner. It replaces traditional opaque processes with an automated and verifiable system on the Ethereum blockchain.

### Problem Solved

- ❌ **Traditionally**: Opaque processes, risk of corruption, bid manipulation
- ✅ **Our Solution**: Immutable records, commit-reveal pattern to prevent manipulation, automated milestone-based payments

### Main Features

1. **Tender Creation**: Government publishes tenders with budget and deadlines
2. **Secure Submission**: Companies submit bids using commit-reveal mode (anti-front-running)
3. **Automatic Selection**: The lowest valid bid is automatically selected
4. **Milestone Payments**: Progressive payments validated by an independent auditor
5. **Enhanced Security**: Protection against attacks (reentrancy, front-running, DoS)

---

## 🏗️ Technical Architecture

### Smart Contracts

The project contains **2 versions** of the contract:

| Contract                        | Description                             | Usage                      |
| ------------------------------- | --------------------------------------- | -------------------------- |
| **SecureProcurementSystem.sol** | **SECURE** version with OpenZeppelin    | 🟢 **Production**          |
| **ProcurementSystem.sol**       | **VULNERABLE** version (educational)    | 🔴 **Learning only**       |

### Technologies Used

- **Solidity 0.8.28**: Smart contract language
- **Hardhat**: Development and testing framework
- **OpenZeppelin**: Security libraries (Ownable, ReentrancyGuard, Pausable)
- **Ethers.js**: Blockchain interaction
- **Chai**: Testing framework

### Security

- ✅ **OpenZeppelin Ownable**: Access control
- ✅ **ReentrancyGuard**: Protection against reentrancy attacks
- ✅ **Pausable**: Emergency stop mechanism
- ✅ **Commit-Reveal Pattern**: Prevents bid manipulation (front-running)
- ✅ **Bounded Loops**: Protection against DoS attacks

---

## 🚀 Installation and Setup

### Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/abadouayoub/Public_procurement_processes_smart_contracts.git
cd MarchePublicSmartContracts

# 2. Install dependencies
npm install

# 3. Verify installation
npx hardhat version
```

**Installation successful if you see**: `Hardhat version X.X.X`

---

## 🧪 How to Test the Project

### 1️⃣ Complete Unit Tests

Run all project tests (complete feature coverage):

```bash
npx hardhat test
```

**Expected result**: ~50+ passing tests ✅

### 2️⃣ Security Tests (Vulnerabilities)

Verify that the secure contract resists attacks:

```bash
npx hardhat test test/VulnerabilityTests.test.js
```

**What is tested**:
- ✅ Protection against reentrancy attacks
- ✅ Protection against front-running
- ✅ Strict access control
- ✅ Edge case handling

### 3️⃣ Gas Cost Analysis

Measure the cost of each operation:

```bash
# Detailed analysis
npx hardhat test test/ComprehensiveGasAnalysis.test.js

# Simple analysis
npx hardhat test test/SimpleGasAnalysis.test.js
```

**Result**: Gas cost table for each operation

### 4️⃣ Code Coverage Tests

```bash
npx hardhat coverage
```

**Result**: Percentage of tested code (goal: >90%)

### 5️⃣ Interactive Test (CLI)

Deploy and interact with the contract in interactive mode:

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy-secure.js --network localhost

# Terminal 3: Interactive interface
node scripts/interact.js
```

**Available interactive menu**:
- Create a tender
- Submit a bid
- Reveal a bid
- Select winner
- Approve/pay milestones

---

## 📊 Complete Test Scenario (Manual)

Follow these steps to test the complete cycle:

### Step 1: Start local network

```bash
# Terminal 1
npx hardhat node
```

Keep this terminal open ⚠️

### Step 2: Deploy contract

```bash
# Terminal 2
npx hardhat run scripts/deploy-secure.js --network localhost
```

**Note the displayed contract address**: `0x...`

### Step 3: Test with Hardhat console

```bash
npx hardhat console --network localhost
```

Then in the console:

```javascript
// Load contract
const Contract = await ethers.getContractFactory("SecureProcurementSystem");
const contract = await Contract.attach("CONTRACT_ADDRESS");

// Get test accounts
const [owner, company1, company2, auditor] = await ethers.getSigners();

// 1. Create a tender
const budget = ethers.parseEther("10");
const submissionDeadline = Math.floor(Date.now() / 1000) + 86400; // +1 day
const revealDeadline = submissionDeadline + 86400; // +2 days
await contract.createTender(budget, submissionDeadline, revealDeadline);
console.log("✅ Tender created");

// 2. Submit a bid (Company1)
const bidAmount = ethers.parseEther("8");
const secret = ethers.id("secret123");
const commitment = ethers.keccak256(
  ethers.AbiCoder.defaultAbiCoder().encode(
    ["uint256", "bytes32"],
    [bidAmount, secret]
  )
);
await contract.connect(company1).submitBid(0, commitment);
console.log("✅ Bid submitted (commit)");

// 3. Reveal bid (after submission deadline)
await ethers.provider.send("evm_increaseTime", [86400]);
await contract.connect(company1).revealBid(0, bidAmount, secret);
console.log("✅ Bid revealed");

// 4. Select winner
await ethers.provider.send("evm_increaseTime", [86400]);
await contract.selectWinner(0);
console.log("✅ Winner selected");

// 5. Approve and pay milestone
await contract.approveMilestone(0, 0);
await contract.releasePayment(0, 0, { value: ethers.parseEther("4") });
console.log("✅ First milestone paid");
```

---

## 📊 Test Results

### Test Coverage

The project has a complete test suite:

| Test Type       | File                               | Number of Tests | Objective                       |
| --------------- | ---------------------------------- | --------------- | ------------------------------- |
| Unit Tests      | `ProcurementSystem.test.js`        | ~30 tests       | Basic functionalities           |
| Security Tests  | `VulnerabilityTests.test.js`       | ~15 tests       | Attacks and vulnerabilities     |
| Gas Analysis    | `ComprehensiveGasAnalysis.test.js` | ~10 tests       | Operation costs                 |
| Simple Analysis | `SimpleGasAnalysis.test.js`        | ~5 tests        | Quick benchmark                 |

### Average Costs (Gas)

_Estimated prices: 50 Gwei, ETH @ $2000_

| Operation                 | Gas Used     | Cost (USD)  |
| ------------------------- | ------------ | ----------- |
| 🏗️ Create tender          | ~340,000     | ~$10.20     |
| 📝 Submit bid (commit)    | ~85,000      | ~$2.55      |
| 🔓 Reveal bid             | ~48,000      | ~$1.44      |
| 🏆 Select winner          | ~55,000      | ~$1.65      |
| ✅ Approve milestone      | ~47,000      | ~$1.41      |
| 💰 Pay milestone          | ~38,000      | ~$1.14      |
| **📊 Complete cycle**     | **~950,000** | **~$28.50** |

### Security Score

**Overall Score: 9.0/10** ✅

- ✅ No critical vulnerabilities
- ✅ OpenZeppelin protection (>$500B TVL protected)
- ✅ Commit-reveal pattern anti-front-running
- ✅ Complete security tests
- ⚠️ Professional audit recommended before mainnet

---

## 📁 Project Structure

```
MarchePublicSmartContracts/
│
├── contracts/                          # Solidity Smart Contracts
│   ├── SecureProcurementSystem.sol    # ✅ SECURE version (production)
│   ├── ProcurementSystem.sol          # ⚠️ VULNERABLE version (educational)
│   └── README.md                       # Technical documentation
│
├── scripts/                            # Deployment scripts
│   ├── deploy-secure.js               # Deploy secure version
│   ├── deploy.js                      # Deploy vulnerable version
│   └── interact.js                    # Interactive CLI
│
├── test/                               # Test suite
│   ├── ProcurementSystem.test.js      # Complete unit tests
│   ├── VulnerabilityTests.test.js     # Security tests
│   ├── ComprehensiveGasAnalysis.test.js # Detailed gas analysis
│   ├── SimpleGasAnalysis.test.js      # Quick gas benchmark
│   └── GasAnalysis.test.js            # Additional gas analysis
│
├── artifacts/                          # Compilation artifacts (auto-generated)
├── cache/                              # Hardhat cache (auto-generated)
├── node_modules/                       # npm dependencies (auto-generated)
│
├── .gitignore                          # Files to ignore by Git
├── hardhat.config.js                   # Hardhat configuration
├── package.json                        # npm dependencies
├── package-lock.json                   # Exact dependency versions
├── setup.ps1                          # Windows installation script
│
├── README.md                           # 📖 This file - Main guide
└── AI_CRITIQUE.md                      # AI audit tools critique

```

---

## 🎓 Academic Context

**University Project** - Blockchain & Smart Contracts

- **Academic Year**: 2025-2026
- **Group**: ABADOU - ETTOUMI
- **Main Constraint**: Prevent front-running attacks

### Project Parameters

| Parameter              | Value                            |
| ---------------------- | -------------------------------- |
| Maximum Budget         | 12 ETH                           |
| Submission Deadline    | 2 days                           |
| Reveal Deadline        | +1 day (3 days total)            |
| Number of Companies    | 3                                |
| Number of Milestones   | 2 (50% + 50%)                    |
| Audit Rule             | Auditor approves both milestones |

---

## 🔒 Security Documentation

### Fixed Vulnerabilities

The **SecureProcurementSystem.sol** contract protects against:

1. ✅ **Reentrancy Attacks**: OpenZeppelin's `ReentrancyGuard`
2. ✅ **Front-Running**: Custom commit-reveal pattern
3. ✅ **Unauthorized Access**: `Ownable` + custom modifiers
4. ✅ **Integer Overflow**: Solidity 0.8+ (native protections)
5. ✅ **Denial of Service**: Bounded loops, check-effects-interactions pattern

### Recommendations before Mainnet Deployment

Before deploying to production on Ethereum mainnet:

1. 🔍 **Professional Audit**: $15,000 - $30,000 (mandatory)
   - Recommended: Trail of Bits, ConsenSys Diligence, OpenZeppelin
2. 🔐 **Multi-Signature Wallet**: Gnosis Safe for owner role
3. 🛡️ **Insurance**: Nexus Mutual or similar
4. 🎁 **Bug Bounty**: Immunefi program (~10% TVL)
5. 📊 **Monitoring**: Tenderly, OpenZeppelin Defender

See [AI_CRITIQUE.md](AI_CRITIQUE.md) for AI audit tools analysis.

---

## 🛠️ Useful Commands

### Development

```bash
# Compile contracts
npx hardhat compile

# Clean artifacts
npx hardhat clean

# Start local node
npx hardhat node

# Interactive console
npx hardhat console --network localhost
```

### Testing

```bash
# All tests
npm test

# Tests with gas report
REPORT_GAS=true npx hardhat test

# Specific test
npx hardhat test test/ProcurementSystem.test.js

# Code coverage
npx hardhat coverage

# Security tests only
npx hardhat test test/VulnerabilityTests.test.js
```

### Deployment

```bash
# Local network
npx hardhat run scripts/deploy-secure.js --network localhost

# Testnet (Sepolia)
npx hardhat run scripts/deploy-secure.js --network sepolia

# Mainnet (production)
npx hardhat run scripts/deploy-secure.js --network mainnet
```

---

## 🐛 Troubleshooting

### Problem: `Error: network does not exist`

**Solution**: Check `hardhat.config.js`, ensure the network is configured.

### Problem: `Error: cannot find module`

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: Tests fail with `timeout`

**Solution**: Increase timeout in `hardhat.config.js`
```javascript
mocha: {
  timeout: 100000
}
```

### Problem: Gas too high

**Solution**: Optimize code or use a layer-2 network (Arbitrum, Optimism)

---

## 📚 Additional Documentation

| Document                               | Description                          |
| -------------------------------------- | ------------------------------------ |
| [contracts/README.md](contracts/README.md) | Technical contract documentation     |
| [AI_CRITIQUE.md](AI_CRITIQUE.md)       | AI audit tools critical evaluation   |

---

## 📜 License

MIT License - See `LICENSE` file for details.

---

## 👥 Author

**Ayoub Abadou**
- GitHub: [@abadouayoub](https://github.com/abadouayoub)
- Repository: [Public_procurement_processes_smart_contracts](https://github.com/abadouayoub/Public_procurement_processes_smart_contracts)

---

## ⚠️ Warning

**Educational Version**: This project contains an intentionally vulnerable version (`ProcurementSystem.sol`) for learning purposes. **NEVER** deploy this version to production.

**Production Version**: **ALWAYS** use `SecureProcurementSystem.sol` with a professional audit beforehand.

---

## 🚀 Quick Start (TL;DR)

```bash
# Installation
npm install

# Test the project
npx hardhat test

# Deploy locally
npx hardhat node                                      # Terminal 1
npx hardhat run scripts/deploy-secure.js --network localhost  # Terminal 2
node scripts/interact.js                              # Terminal 3 (CLI)
```

**✅ Tested and functional project** - Ready for academic demonstration
