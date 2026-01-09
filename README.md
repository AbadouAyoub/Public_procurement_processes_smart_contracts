# Public Procurement Smart Contracts

**Decentralized Public Procurement Tracking System** built with Ethereum Smart Contracts for transparency and fairness.

## 🎯 Project Overview

This project implements a blockchain-based solution for managing public procurement tenders using smart contracts. It addresses transparency and trust issues in traditional procurement processes through:

- **Immutability**: Permanent, tamper-proof records
- **Transparency**: Public verifiability of all tender activities
- **Fairness**: Commit-reveal pattern prevents bid manipulation
- **Automation**: Smart contract enforced rules and milestones

## 📋 Features

- ✅ **Tender Creation**: Government creates public tenders with budgets and deadlines
- ✅ **Secure Bidding**: Two-phase commit-reveal pattern prevents front-running
- ✅ **Winner Selection**: Automatic selection of lowest valid bid
- ✅ **Milestone Payments**: Auditor-approved phased payment releases
- ✅ **OpenZeppelin Security**: Battle-tested security libraries
- ✅ **Emergency Controls**: Pausable contract for incident response

## 🏗️ Architecture

### Smart Contracts

- **SecureProcurementSystem.sol**: Production-ready contract with OpenZeppelin security
- **ProcurementSystem.sol**: Educational version with intentional vulnerabilities

### Security Features

- **OpenZeppelin Ownable**: Access control and ownership management
- **ReentrancyGuard**: Protection against reentrancy attacks
- **Pausable**: Emergency stop mechanism
- **Commit-Reveal Pattern**: Prevents front-running attacks

## 🚀 Quick Start

### Prerequisites

```bash
node >= 16.0.0
npm >= 8.0.0
```

### Installation

```bash
# Clone repository
git clone https://github.com/abadouayoub/Public_procurement_processes_smart_contracts.git
cd Public_procurement_processes_smart_contracts

# Install dependencies
npm install
```

### Deployment

```bash
# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy-secure.js --network localhost

# Run tests
npx hardhat test

# Run comprehensive gas analysis
npx hardhat test test/ComprehensiveGasAnalysis.test.js

# Run vulnerability tests
npx hardhat test test/VulnerabilityTests.test.js
```

### Interactive CLI

```bash
node scripts/interact.js
```

## 📊 Gas Costs

Average costs at 50 Gwei, $2000 ETH:

| Operation | Gas Used | Cost (USD) |
|-----------|----------|------------|
| Create Tender | ~340,000 | ~$10.20 |
| Submit Bid | ~85,000 | ~$2.55 |
| Reveal Bid | ~48,000 | ~$1.44 |
| Select Winner | ~55,000 | ~$1.65 |
| Approve Milestone | ~47,000 | ~$1.41 |
| Release Payment | ~38,000 | ~$1.14 |
| **Full Lifecycle** | **~950,000** | **~$28.50** |

## 🔒 Security Analysis

**Security Score: 9.0/10**

### Strengths
- ✅ Battle-tested OpenZeppelin contracts ($500B+ TVL protected)
- ✅ Comprehensive reentrancy protection
- ✅ Custom front-running prevention (commit-reveal)
- ✅ Multi-layer access control
- ✅ DoS attack prevention (bounded loops)

### Addressed Vulnerabilities
- ✅ Reentrancy attacks
- ✅ Front-running
- ✅ Unauthorized access
- ✅ Integer overflow (Solidity 0.8+)
- ✅ Denial of Service

See [SECURITY_ANALYSIS_COMPLETE.md](SECURITY_ANALYSIS_COMPLETE.md) for comprehensive security documentation.

## 📁 Project Structure

```
├── contracts/
│   ├── ProcurementSystem.sol           # Educational (with vulnerabilities)
│   ├── SecureProcurementSystem.sol     # Production-ready
│   └── README.md                       # Contract documentation
├── scripts/
│   ├── deploy.js                       # Deploy vulnerable version
│   ├── deploy-secure.js                # Deploy secure version
│   └── interact.js                     # Interactive CLI
├── test/
│   ├── ProcurementSystem.test.js       # Unit tests
│   ├── VulnerabilityTests.test.js      # Vulnerability tests
│   ├── ComprehensiveGasAnalysis.test.js # Gas analysis
│   └── SimpleGasAnalysis.test.js       # Simple gas tests
├── hardhat.config.js                   # Hardhat configuration
├── package.json                        # Dependencies
├── ProjectGLD2026.md                   # Full project specification
├── CLI_README.md                       # CLI documentation
├── SECURITY_ANALYSIS_COMPLETE.md       # Security analysis (100+ pages)
├── setup.ps1                          # Windows setup script
└── README.md                           # This file
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Test with gas reporting
REPORT_GAS=true npx hardhat test

# Test specific file
npx hardhat test test/ProcurementSystem.test.js

# Coverage
npx hardhat coverage
```

## 📖 Documentation

- **[ProjectGLD2026.md](ProjectGLD2026.md)**: Complete project specification and architecture
- **[CLI_README.md](CLI_README.md)**: Interactive CLI user guide
- **[SECURITY_ANALYSIS_COMPLETE.md](SECURITY_ANALYSIS_COMPLETE.md)**: Comprehensive security analysis
- **[contracts/README.md](contracts/README.md)**: Smart contract technical documentation

## 🎓 Academic Context

This project was developed for:
- **Course**: Blockchain & Smart Contracts
- **Academic Year**: 2025-2026
- **Group**: G1
- **Security Constraint**: Prevent front-running attacks

### Project Parameters
- Max Budget: 12 ETH
- Submission Deadline: 2 days
- Reveal Deadline: +1 day
- Number of Bidders: 3
- Milestones: 2 (50% + 50%)
- Audit Rule: Auditor approves both milestones

## 🛡️ Security Recommendations

Before mainnet deployment:
1. ✅ Professional security audit ($15k-$30k)
2. ✅ Multi-sig wallet for owner role (Gnosis Safe)
3. ✅ Insurance coverage (Nexus Mutual)
4. ✅ Bug bounty program (Immunefi)
5. ✅ Monitoring & alerting (Tenderly, OpenZeppelin Defender)

## 📜 License

MIT License - see LICENSE file for details

## 👥 Contributors

- Ayoub Abadou ([@abadouayoub](https://github.com/abadouayoub))

## 🔗 Links

- GitHub: https://github.com/abadouayoub/Public_procurement_processes_smart_contracts
- Academic Project Specification: [ProjectGLD2026.md](ProjectGLD2026.md)

---

**⚠️ Disclaimer**: This project includes an educational version with intentional vulnerabilities for learning purposes. Always use the secure version (`SecureProcurementSystem.sol`) for production deployments.
