## Project : Blockchain & Smart Contracts

### Academic Year: 2025

**Design and Implementation of a Decentralized Public Procurement Tracking System**

---

## 🎯 PROJECT STATUS: ✅ COMPLETE

### Latest Update: January 9, 2026

**Phase 1:** ✅ Architecture & Design (Complete)  
**Phase 2:** ✅ Smart Contract Implementation (Complete - Vulnerable Version)  
**Phase 3:** ✅ Testing & Vulnerability Confirmation (Complete - All 3 Exploited)  
**Phase 4:** ✅ Security Fixes & Production Version (Complete)

### Files Delivered:

- `contracts/ProcurementSystem.sol` - Vulnerable version (educational)
- `contracts/SecureProcurementSystem.sol` - Production-ready fixed version ⭐
- `VULNERABILITY_FIXES.md` - Detailed security analysis
- `OPENZEPPELIN_BENEFITS.md` - OpenZeppelin usage guide
- `SECURITY_COMPARISON.md` - Complete vulnerability comparison
- `SECURITY_FIX_SUMMARY.md` - Quick reference
- Complete test suite (31+ tests, all passing)

---

## Project Objective

The objective of this project is to **design, implement, and justify** a blockchain-based solution
that addresses a **real-world transparency and trust problem** using **smart contracts**.

Students are expected to **apply theoretical concepts** learned in the course — blockchain
architecture, smart contracts, transaction lifecycle, gas costs, security issues, and decentralization
trade-offs — to a **non-trivial practical case**.

This project emphasizes **reasoning, design choices, and system behavior** , not only code
correctness.

## Real-World Context

Public procurement processes often suffer from:

- Lack of transparency
- Post-hoc manipulation
- Difficulty in auditing
- Centralized control

Blockchain technology can improve these processes by providing:

- Immutability
- Public verifiability
- Automated execution
- Auditability through events

Your task is to **design a decentralized system** that tracks the lifecycle of a public tender from
creation to final payment.

## Problem Description

You must design and implement a **Decentralized Public Procurement Tracking System** that
manages the following phases:

1. **Tender Creation**
2. **Bid Submission**
3. **Bid Reveal**
4. **Winner Selection**
5. **Payment Release**

The system must be implemented using **smart contracts deployed on an Ethereum-
compatible blockchain** (local or test network).

## Functional Requirements

### 1⃣ Tender Creation

- Only the **contract owner** can create tenders.
- Each tender must include:
  o Unique identifier
  o Description (stored as a hash)
  o Maximum budget
  o Bid submission deadline
  o Reveal deadline

### 2⃣ Bid Submission (Commit Phase)

- Registered bidders can submit bids **before the submission deadline**.
- Bids must be **hashed** before submission.
- Bid values must not be readable on-chain at this stage.

### 3⃣ Bid Reveal (Reveal Phase)

- Bidders reveal their bid values and nonce.
- Smart contract verifies the hash.
- Invalid or late reveals are rejected.

### 4⃣ Winner Selection

- After the reveal phase, the smart contract:
  o Compares valid bids
  o Selects the lowest bid under the maximum budget
  o Emits an event with the winning bidder

### 5⃣ Payment Simulation

- Funds are locked in the contract.
- Payments are released in **milestones**.
- An auditor approves milestone completion.

## ⚙ Technical Constraints (Mandatory)

To ensure learning integrity:

1. **No external smart contract libraries** (e.g., OpenZeppelin)
2. Smart contracts must be **written manually**
3. At least **one off-chain component** (CLI or script)
4. Use **events** for auditability
5. Perform **gas usage analysis**
6. Introduce **the intentional vulnerabilities** , explain them, then fix them
7. No web UI (CLI only)

## Security & Design Requirements

Students must analyze and justify:

- Storage vs events
- Privacy vs transparency
- Gas cost vs readability
- Data structures (mapping, array, etc.)
- Known blockchain attacks relevant to the design

## Deliverables

### 1⃣ Source Code (Git Repository)

- Smart contract(s)
- Off-chain interaction script
- Clear commit history

### 2⃣ Technical Report (Max 8 pages)

Must include:

- Architecture diagram
- State machine
- Security analysis
- Gas analysis
- Design trade-offs
- Vulnerability explanation and fix

### 3⃣ Demonstration

- Live execution on a blockchain network
- Explanation of at least one real transaction hash

### 4⃣ Oral Defense

Students must:

- Explain design choices
- Modify logic under new constraints
- Answer conceptual questions

## Evaluation Criteria

```
Criterion Weight
Smart contract correctness 25%
```

```
Design & justification 20%
Security analysis 15%
Gas & performance analysis 15%
Git history 10%
Oral defense 15%
```

## ⚠ Academic Integrity

Use of AI tools is **not forbidden** , but:

- Code understanding must be demonstrated
- All design choices must be justified
- Students must explain and modify their work during defense

Failure to demonstrate understanding will result in **zero credit** , regardless of code quality.

# 🔑 Individualized Parameters per Group (AI-

# Resistant)

Each group receives **unique parameters** that must be embedded in their implementation.

## Parameter Set Structure

Each group gets a **Project Configuration Sheet** :

Group ID: Gx

Max Budget: Bx
Bid Submission Deadline: Dx
Reveal Deadline: Rx
Number of Bidders: Nx
Milestones: Mx
Audit Rule: Ax
Security Constraint: Sx

## Example Parameter Sets

### 🔹 Group G

- Max Budget: **12 ETH**
- Submission Deadline: **block.timestamp + 2 days**
- Reveal Deadline: **+1 day**
- Bidders: **3**
- Milestones: **2**
- Audit Rule: Auditor approves both milestones
- Security Constraint: Prevent front-running

### 🔹 Group G

- Max Budget: **7 ETH**
- Submission Deadline: **block.timestamp + 1 day**
- Reveal Deadline: **+12 hours**
- Bidders: **5**
- Milestones: **3**
- Audit Rule: DAO vote (majority)
- Security Constraint: Handle late reveal attacks

### 🔹 Group G

- Max Budget: **20 ETH**
- Submission Deadline: **block.timestamp + 3 days**
- Reveal Deadline: **+2 days**
- Bidders: **4**
- Milestones: **1**
- Audit Rule: Single auditor
- Security Constraint: Reentrancy protection

### 🔹 Group G

- Max Budget: **5 ETH**
- Submission Deadline: **block.timestamp + 6 hours**
- Reveal Deadline: **+6 hours**
- Bidders: **2**
- Milestones: **2**

- Audit Rule: Time-based auto approval
- Security Constraint: Denial of Service

# Orthogonal tasks(Mandatory)

# 🔹 Task 1 — Blockchain Forensics &

# Transaction Analysis

_(No coding-heavy, reasoning-heavy — AI-resistant)_

## Objective

Ability to **analyze real blockchain data** , not generate code.

## Task Description (Student Version)

You are given **5 real Ethereum transaction hashes** (testnet or mainnet).
For each transaction, you must:

1. Identify:
   o Sender
   o Receiver
   o Function called
   o Gas used
   o Gas price
2. Explain:
   o Why the gas cost is high or low
   o Which operations are expensive
3. Reconstruct:
   o The contract state **before and after** the transaction
4. Identify:
   o One possible attack or misuse scenario

## 🔐 AI-Resistance

- Transactions are **unique per group**
- Requires **block explorer reasoning**
- Requires understanding of **EVM execution**
- Cannot be solved by prompt alone

## 📁 Deliverable

- PDF report (max 3 pages)
- Annotated transaction screenshots
- One paragraph per transaction

## 🧪 Evaluation Focus

✔ EVM understanding

✔ Gas reasoning

✔ Security thinking

# 🔹 Task 2 — AI-Assisted Smart Contract

# Vulnerability Detection

_(AI is explicitly allowed — but controlled)_

## Objective

How to **use AI critically** , not blindly.

## 📌 Task Description (Student Version)

1. Take **your own smart contract**
2. Use an AI tool (ChatGPT, Copilot, etc.) to:
   o Detect vulnerabilities
   o Suggest improvements
3. **Manually verify** :

```
o Which AI findings are correct
o Which are false positives
```

4. Modify the contract **without copying AI code**
5. Justify all changes

## 🔑 Mandatory Structure

```
Step Description
AI Prompt Exact prompt used
AI Output Raw AI response
Human Evaluation What is correct / incorrect
Fix Manual fix
Reflection What AI misunderstood
```

## 🔐 AI-Resistance

- Students must show:
  o AI mistakes
  o Their own reasoning
- Blind copying is penalized
- Requires **deep understanding**

## 📁 Deliverable

- Markdown report
- Code diff (git diff)
- Reflection section (critical)

---

# 🏗️ SYSTEM ARCHITECTURE AND DESIGN

## GROUP PARAMETERS

**Group ID:** G1  
**Maximum Budget:** 12 ETH  
**Submission Deadline:** block.timestamp + 2 days  
**Reveal Deadline:** +1 day (after submission deadline)  
**Number of Bidders:** 3  
**Number of Payment Milestones:** 2  
**Audit Rule:** Auditor approves both milestones  
**Security Constraint:** Prevent front-running

---

## 1. SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                         OFF-CHAIN LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Owner CLI  │    │  Bidder CLI  │    │ Auditor CLI  │          │
│  │              │    │              │    │              │          │
│  │ - Create     │    │ - Submit Bid │    │ - Approve    │          │
│  │   Tender     │    │ - Reveal Bid │    │   Milestones │          │
│  │ - Select     │    │ - Check      │    │ - View       │          │
│  │   Winner     │    │   Status     │    │   Status     │          │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘          │
│         │                   │                    │                  │
│         └───────────────────┼────────────────────┘                  │
│                             │                                       │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                              │ Web3.js/Ethers.js
                              │
┌─────────────────────────────┼───────────────────────────────────────┐
│                             ▼                                        │
│                    BLOCKCHAIN LAYER                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │          ProcurementSystem Smart Contract                      │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │                                                                 │ │
│  │  STATE VARIABLES:                                              │ │
│  │  ├─ owner (address)                                            │ │
│  │  ├─ tenders (mapping: tenderId => Tender)                      │ │
│  │  ├─ bids (mapping: tenderId => bidderAddr => Bid)             │ │
│  │  ├─ milestones (mapping: tenderId => Milestone[])             │ │
│  │  └─ auditor (address)                                          │ │
│  │                                                                 │ │
│  │  CORE FUNCTIONS:                                               │ │
│  │  ├─ createTender()          [Owner Only]                       │ │
│  │  ├─ submitBid()             [Bidders, Before Deadline]         │ │
│  │  ├─ revealBid()             [Bidders, Reveal Phase]            │ │
│  │  ├─ selectWinner()          [Automated/Owner]                  │ │
│  │  ├─ approveMilestone()      [Auditor]                          │ │
│  │  └─ releaseFunds()          [After Approval]                   │ │
│  │                                                                 │ │
│  │  MODIFIERS:                                                     │ │
│  │  ├─ onlyOwner                                                   │ │
│  │  ├─ onlyAuditor                                                 │ │
│  │  ├─ inState(TenderState)                                        │ │
│  │  └─ nonReentrant                                                │ │
│  │                                                                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                             │                                        │
│                             ▼                                        │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    EVENT LOG (Audit Trail)                     │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │  - TenderCreated(tenderId, budget, deadline)                   │ │
│  │  - BidSubmitted(tenderId, bidder, commitHash)                  │ │
│  │  - BidRevealed(tenderId, bidder, amount)                       │ │
│  │  - WinnerSelected(tenderId, winner, amount)                    │ │
│  │  - MilestoneApproved(tenderId, milestoneId)                    │ │
│  │  - FundsReleased(tenderId, recipient, amount)                  │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

DATA FLOW:
1. Owner creates tender → State: CREATED
2. Bidders submit hashed bids → State: BIDDING
3. Submission deadline passes → State: REVEALING
4. Bidders reveal bids with nonce → Verify hash
5. Reveal deadline passes → State: SELECTING
6. Lowest valid bid wins → State: AWARDED
7. Auditor approves milestones → State: IN_PROGRESS
8. Funds released per milestone → State: COMPLETED
```

---

## 2. STATE MACHINE DIAGRAM

```
                    ┌──────────────┐
                    │   CREATED    │ ◄─── Initial state (tender created)
                    └──────┬───────┘
                           │
                           │ block.timestamp < submissionDeadline
                           │ submitBid()
                           ▼
                    ┌──────────────┐
                    │   BIDDING    │ ◄─── Bidders submit hashed bids
                    └──────┬───────┘      Event: BidSubmitted
                           │
                           │ block.timestamp >= submissionDeadline
                           │ Automatic transition
                           ▼
                    ┌──────────────┐
                    │  REVEALING   │ ◄─── Bidders reveal their bids
                    └──────┬───────┘      Event: BidRevealed
                           │
                           │ block.timestamp >= revealDeadline
                           │ selectWinner()
                           ▼
                    ┌──────────────┐
                    │  SELECTING   │ ◄─── Contract calculates winner
                    └──────┬───────┘
                           │
                           │ Winner determined
                           │ (lowest valid bid <= maxBudget)
                           ▼
                    ┌──────────────┐
                    │   AWARDED    │ ◄─── Winner selected
                    └──────┬───────┘      Event: WinnerSelected
                           │
                           │ approveMilestone(0)
                           │ (Auditor action)
                           ▼
                    ┌──────────────┐
                    │ IN_PROGRESS  │ ◄─── Work ongoing, milestones tracked
                    └──────┬───────┘      Event: MilestoneApproved
                           │              Event: FundsReleased
                           │
                           │ All milestones approved
                           │ All funds released
                           ▼
                    ┌──────────────┐
                    │  COMPLETED   │ ◄─── Final state (terminal)
                    └──────────────┘

STATE TRANSITION CONDITIONS:

CREATED → BIDDING:
  - Condition: First bid submitted AND block.timestamp < submissionDeadline
  - Trigger: submitBid()
  - Event: BidSubmitted(tenderId, bidder, commitHash)

BIDDING → REVEALING:
  - Condition: block.timestamp >= submissionDeadline
  - Trigger: Automatic (time-based) or first revealBid() call
  - Event: None (state transition logged in subsequent events)

REVEALING → SELECTING:
  - Condition: block.timestamp >= revealDeadline
  - Trigger: selectWinner()
  - Event: None (transition part of selection)

SELECTING → AWARDED:
  - Condition: Valid winner found (bid <= maxBudget)
  - Trigger: selectWinner() execution
  - Event: WinnerSelected(tenderId, winner, amount)
  - Alternative: If no valid bids → CANCELLED state

AWARDED → IN_PROGRESS:
  - Condition: First milestone approved by auditor
  - Trigger: approveMilestone(0)
  - Event: MilestoneApproved(tenderId, 0)

IN_PROGRESS → COMPLETED:
  - Condition: All milestones approved AND all funds released
  - Trigger: Last releaseFunds() call
  - Event: FundsReleased(tenderId, winner, finalAmount)

SPECIAL TRANSITIONS:

ANY_STATE → CANCELLED:
  - Condition: Owner cancels tender (before AWARDED)
  - Trigger: cancelTender()
  - Event: TenderCancelled(tenderId, reason)
```

---

## 3. DATA STRUCTURE DESIGN

### 3.1 Tender Structure

```solidity
struct Tender {
    uint256 tenderId;              // STORAGE: Unique identifier
    bytes32 descriptionHash;       // STORAGE: IPFS/SHA256 hash of description
    uint256 maxBudget;             // STORAGE: Maximum allowed bid (in wei)
    uint256 submissionDeadline;    // STORAGE: Unix timestamp
    uint256 revealDeadline;        // STORAGE: Unix timestamp
    TenderState state;             // STORAGE: Current state (enum)
    address winner;                // STORAGE: Winning bidder address
    uint256 winningBid;            // STORAGE: Winning bid amount
    uint256 createdAt;             // STORAGE: Creation timestamp
}

enum TenderState {
    CREATED,      // 0
    BIDDING,      // 1
    REVEALING,    // 2
    SELECTING,    // 3
    AWARDED,      // 4
    IN_PROGRESS,  // 5
    COMPLETED,    // 6
    CANCELLED     // 7
}
```

**Design Rationale:**

- **Storage Choice:** All fields are in storage because they need to persist across transactions
- **Gas Cost:** ~140k gas to create (7 SSTORE operations)
- **Why struct:** Groups related data together, easier to manage than separate mappings
- **Why bytes32 for description:** Storing full description on-chain is expensive (~20k gas per 32 bytes). Store hash instead, retrieve full text from off-chain storage (IPFS)
- **Accessibility:** Single mapping `mapping(uint256 => Tender) public tenders` allows direct access by ID

### 3.2 Bid Structure

```solidity
struct Bid {
    bytes32 commitHash;       // STORAGE: keccak256(amount, nonce, bidder)
    uint256 amount;           // STORAGE: Revealed bid amount (0 until revealed)
    bool revealed;            // STORAGE: Whether bid has been revealed
    uint256 submittedAt;      // STORAGE: Submission timestamp
}
```

**Design Rationale:**

- **Storage Choice:** All fields in storage (persistent state needed)
- **Nested Mapping:** `mapping(uint256 => mapping(address => Bid)) private bids`
  - First key: tenderId
  - Second key: bidder address
  - **Why:** O(1) lookup, no iteration needed, gas-efficient
- **Gas Cost:** ~80k gas per bid submission (3 SSTORE operations)
- **Privacy:** `amount` is 0 until revealed, protecting bid privacy during commit phase
- **Security:** `commitHash` prevents front-running (see section 6)

### 3.3 Milestone Structure

```solidity
struct Milestone {
    uint256 milestoneId;       // STORAGE: Milestone number (0, 1)
    uint256 percentage;        // STORAGE: % of total payment (e.g., 50 for 50%)
    bool approved;             // STORAGE: Auditor approval status
    bool paid;                 // STORAGE: Payment release status
    uint256 approvedAt;        // STORAGE: Approval timestamp
}
```

**Design Rationale:**

- **Data Structure:** `mapping(uint256 => Milestone[]) private milestones`
  - Array within mapping: Each tender has ordered list of milestones
  - **Why Array:** Milestones are sequential (milestone 0, then 1)
  - **Why Not Separate Mapping:** Small fixed size (2 milestones), array iteration is acceptable
- **Gas Cost:** ~100k gas per milestone creation (4 SSTORE operations)
- **Alternative Considered:** `mapping(uint256 => mapping(uint256 => Milestone))`
  - Would use more gas for initialization
  - Array provides natural ordering
- **Memory Usage:** When reading milestones in functions, load to memory for gas efficiency

### 3.4 Storage vs Memory Strategy

```solidity
// STORAGE - Persistent state (expensive)
mapping(uint256 => Tender) public tenders;                    // 20k gas per slot
mapping(uint256 => mapping(address => Bid)) private bids;     // 20k gas per slot
mapping(uint256 => Milestone[]) private milestones;           // 20k + array costs

// MEMORY - Temporary computation (cheap)
function selectWinner(uint256 tenderId) public {
    Tender storage tender = tenders[tenderId];  // Reference to storage

    address[] memory bidders = new address[](3);  // MEMORY: Temporary array
    uint256[] memory amounts = new uint256[](3); // MEMORY: Temporary array

    // Process in memory, then save winner to storage once
    tender.winner = calculateWinner(bidders, amounts);  // One SSTORE
}
```

**Gas Optimization Rules:**

1. **Read once, use multiple times:** Copy storage to memory if accessed >1 time
2. **Batch writes:** Accumulate changes in memory, write to storage once
3. **Use storage references:** `Tender storage tender` avoids copying entire struct
4. **Prefer memory for loops:** Iterate over memory arrays, not storage

---

## 4. OPENZEPPELIN LIBRARIES USAGE

**⚠️ NOTE:** Your project specification states "No external smart contract libraries" (Section ⚙ Technical Constraints, item 1). However, you mentioned OpenZeppelin is allowed. I'll provide recommendations for both scenarios.

### Scenario A: OpenZeppelin Allowed (Recommended)

#### 4.1 Ownable.sol

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProcurementSystem is Ownable {
    // Provides onlyOwner modifier and ownership management
}
```

**Pros:**

- ✅ Battle-tested access control (audited by millions)
- ✅ Gas-optimized implementation
- ✅ Standard pattern recognized by auditors
- ✅ Automatic ownership transfer functionality
- ✅ ~500 gas cheaper than custom implementation

**Cons:**

- ❌ Dependency on external library
- ❌ Slightly larger bytecode (~200 bytes)
- ❌ May not meet assignment requirements

**Verdict:** **USE IT** if allowed - security benefits outweigh downsides

#### 4.2 ReentrancyGuard.sol

```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ProcurementSystem is Ownable, ReentrancyGuard {
    function releaseFunds(uint256 tenderId, uint256 milestoneId)
        external
        nonReentrant  // Prevents reentrancy attacks
    {
        // Send ETH to winner
    }
}
```

**Pros:**

- ✅ Critical security protection (prevents reentrancy)
- ✅ Only ~2.4k gas overhead per protected function
- ✅ Industry standard implementation
- ✅ Simple to use (just add `nonReentrant` modifier)

**Cons:**

- ❌ Adds one storage slot (`uint256 private _status`)
- ❌ Small gas overhead on every call

**Verdict:** **HIGHLY RECOMMENDED** - reentrancy is a major attack vector

#### 4.3 Pausable.sol

```solidity
import "@openzeppelin/contracts/security/Pausable.sol";

contract ProcurementSystem is Ownable, ReentrancyGuard, Pausable {
    function submitBid(uint256 tenderId, bytes32 commitHash)
        external
        whenNotPaused  // Can be emergency-stopped
    {
        // Bid submission logic
    }
}
```

**Pros:**

- ✅ Emergency stop mechanism
- ✅ Useful during security incidents
- ✅ Only ~200 gas overhead per call
- ✅ Can pause specific functions selectively

**Cons:**

- ❌ Centralization concern (owner can pause)
- ❌ May conflict with decentralization goals
- ❌ Not essential for this use case

**Verdict:** **OPTIONAL** - useful for production, not critical for academic project

#### 4.4 Libraries NOT Recommended

**ReentrancyGuard Alternative - Pull Payment Pattern:**

- OpenZeppelin has `PullPayment.sol` but it's overkill here
- Our milestone-based system already uses pull pattern

**AccessControl.sol:**

- Too complex for our needs (3 roles: owner, bidder, auditor)
- Ownable + simple role mappings are sufficient

**SafeMath.sol:**

- NOT NEEDED in Solidity ≥0.8.0 (built-in overflow protection)
- Would actually waste gas if used

### Scenario B: No OpenZeppelin (Manual Implementation)

If you must write everything manually, here's what to implement:

```solidity
// Custom Ownable
address private owner;

modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

constructor() {
    owner = msg.sender;
}

// Custom ReentrancyGuard
uint256 private constant NOT_ENTERED = 1;
uint256 private constant ENTERED = 2;
uint256 private _status;

modifier nonReentrant() {
    require(_status != ENTERED, "Reentrant call");
    _status = ENTERED;
    _;
    _status = NOT_ENTERED;
}

constructor() {
    _status = NOT_ENTERED;
}
```

**Gas Comparison:**

- Custom Ownable: ~23k gas deployment, ~400 gas per call
- OZ Ownable: ~25k gas deployment, ~350 gas per call (more optimized)
- **Winner:** OpenZeppelin (if allowed)

---

## 5. EVENTS DESIGN

### 5.1 Complete Event List

```solidity
// Tender Lifecycle Events
event TenderCreated(
    uint256 indexed tenderId,
    bytes32 descriptionHash,
    uint256 maxBudget,
    uint256 submissionDeadline,
    uint256 revealDeadline
);

event BidSubmitted(
    uint256 indexed tenderId,
    address indexed bidder,
    bytes32 commitHash,
    uint256 timestamp
);

event BidRevealed(
    uint256 indexed tenderId,
    address indexed bidder,
    uint256 amount,
    bool isValid
);

event WinnerSelected(
    uint256 indexed tenderId,
    address indexed winner,
    uint256 winningBid,
    uint256 timestamp
);

event MilestoneApproved(
    uint256 indexed tenderId,
    uint256 milestoneId,
    address indexed auditor,
    uint256 timestamp
);

event FundsReleased(
    uint256 indexed tenderId,
    uint256 milestoneId,
    address indexed recipient,
    uint256 amount,
    uint256 timestamp
);

event TenderCancelled(
    uint256 indexed tenderId,
    string reason,
    uint256 timestamp
);

// Security Events
event FrontRunningAttemptDetected(
    uint256 indexed tenderId,
    address indexed attacker,
    uint256 timestamp
);

// Administrative Events
event AuditorChanged(
    address indexed oldAuditor,
    address indexed newAuditor,
    uint256 timestamp
);
```

### 5.2 Event Design Rationale

**Indexed Parameters:**

- **Purpose:** Allows filtering events by specific values
- **Limit:** Maximum 3 indexed parameters per event
- **Cost:** Each indexed parameter adds ~375 gas
- **Choice:** Index high-cardinality fields (tenderId, addresses) that you'll query often

**Why These Events:**

1. **TenderCreated:** Auditability - when and with what parameters
2. **BidSubmitted:** Proof of participation, timestamp tracking
3. **BidRevealed:** Verification of reveal process, detect invalid reveals
4. **WinnerSelected:** Critical audit point, public record of outcome
5. **MilestoneApproved:** Auditor accountability, payment tracking
6. **FundsReleased:** Financial audit trail, compliance
7. **FrontRunningAttemptDetected:** Security monitoring, attack detection

**Event vs Storage Trade-off:**

```solidity
// OPTION A: Store bidder addresses in storage
address[] public bidders;  // ~20k gas per bidder stored

// OPTION B: Emit event only
emit BidSubmitted(tenderId, msg.sender, commitHash, block.timestamp);  // ~1.5k gas

// TRADE-OFF:
// - Option A: Can iterate bidders on-chain (needed for selectWinner)
// - Option B: Must query events off-chain, cheaper
// - SOLUTION: Use events for audit, storage for contract logic
```

### 5.3 Event Listening (Off-Chain)

```javascript
// Example: CLI script listens for events
const contract = new ethers.Contract(address, abi, provider);

contract.on("WinnerSelected", (tenderId, winner, amount, timestamp) => {
  console.log(
    `Tender ${tenderId}: Winner ${winner}, Bid ${ethers.utils.formatEther(
      amount
    )} ETH`
  );
});
```

---

## 6. DESIGN TRADE-OFFS ANALYSIS

### 6.1 Storage vs Events (Cost vs Auditability)

**The Problem:**

- Storage: Persistent, queryable on-chain, but EXPENSIVE (20k gas per 256-bit slot)
- Events: Cheap (375 gas per indexed param), auditable off-chain, but NOT queryable on-chain

**Our Design Decisions:**

| Data Type                 | Storage           | Events        | Rationale                                  |
| ------------------------- | ----------------- | ------------- | ------------------------------------------ |
| Tender details            | ✅ Yes            | ✅ Yes        | Need on-chain access for state transitions |
| Bid commits               | ✅ Yes            | ✅ Yes        | Need to verify reveals on-chain            |
| Bid amounts (pre-reveal)  | ❌ No             | ❌ No         | Secret during commit phase                 |
| Bid amounts (post-reveal) | ✅ Yes            | ✅ Yes        | Need for winner selection                  |
| Winner selection          | ✅ Yes            | ✅ Yes        | Critical state + audit trail               |
| Milestone status          | ✅ Yes            | ✅ Yes        | Contract logic needs it                    |
| Tender description        | ❌ No (hash only) | ✅ Yes (hash) | Too expensive, use IPFS                    |

**Cost Analysis:**

```
Creating a tender with full description (1KB) on-chain:
- Description storage: 32 slots × 20k gas = 640k gas (~$20 at 50 gwei, $2000 ETH)
- Description hash: 1 slot × 20k gas = 20k gas (~$0.60)
- SAVINGS: 97% reduction

Emitting event with description hash:
- Cost: ~1k gas (~$0.03)
- Off-chain retrieval: Free (IPFS/database)
```

**Recommendation:** Store hashes, emit events, use off-chain storage for large data

### 6.2 Privacy vs Transparency (Commit-Reveal Pattern)

**The Problem:**
All blockchain transactions are public. Without protection, bidders can:

1. See others' bids
2. Submit a slightly lower bid (front-running)
3. Unfairly win the tender

**Solution: Commit-Reveal Pattern**

**Phase 1: Commit (Private)**

```solidity
function submitBid(uint256 tenderId, bytes32 commitHash) external {
    // commitHash = keccak256(abi.encodePacked(amount, nonce, msg.sender))
    bids[tenderId][msg.sender].commitHash = commitHash;
    emit BidSubmitted(tenderId, msg.sender, commitHash, block.timestamp);
}
```

- Bidders submit `keccak256(amount, nonce, msg.sender)`
- No one can see the actual bid amount
- Nonce prevents rainbow table attacks
- `msg.sender` in hash prevents bid stealing

**Phase 2: Reveal (Transparent)**

```solidity
function revealBid(uint256 tenderId, uint256 amount, bytes32 nonce) external {
    bytes32 computedHash = keccak256(abi.encodePacked(amount, nonce, msg.sender));
    require(computedHash == bids[tenderId][msg.sender].commitHash, "Invalid reveal");

    bids[tenderId][msg.sender].amount = amount;
    bids[tenderId][msg.sender].revealed = true;
    emit BidRevealed(tenderId, msg.sender, amount, true);
}
```

**Security Against Front-Running (Your Constraint):**

1. **Mempool Monitoring:** Attacker watches mempool for `revealBid()` transactions
2. **Front-Run Attempt:** Tries to submit lower bid after seeing reveal
3. **Prevention:** Reveal phase is AFTER submission deadline
   - No new bids accepted after deadline
   - Attacker can't submit new bid
4. **Additional Protection:** Require commit hash during submission
   - Can't change bid after commit
   - Even if attacker sees your commit transaction, they can't know your amount

**Trade-off:**

- ✅ **Pro:** Strong privacy, prevents front-running
- ❌ **Con:** Two-phase process (more transactions, higher gas cost)
- ❌ **Con:** Bidders who don't reveal are disqualified
- ✅ **Pro:** Industry standard (Vickrey auction pattern)

**Gas Cost:**

- Commit: ~80k gas (~$2.40 at 50 gwei)
- Reveal: ~45k gas (~$1.35)
- **Total per bidder:** ~125k gas (~$3.75)
- **Without commit-reveal:** ~65k gas but NO privacy

**Recommendation:** Essential for fair procurement, accept the gas overhead

### 6.3 Mappings vs Arrays (Lookup vs Iteration)

**Design Question:** How to store bidders?

**Option A: Mapping Only**

```solidity
mapping(uint256 => mapping(address => Bid)) private bids;
```

- ✅ O(1) lookup: `bids[tenderId][bidderAddress]`
- ❌ Cannot iterate (no way to list all bidders)
- ❌ Cannot count bidders on-chain
- Gas: 20k per bid (SSTORE)

**Option B: Array Only**

```solidity
mapping(uint256 => Bid[]) private bids;
```

- ✅ Can iterate: `for (uint i = 0; i < bids[tenderId].length; i++)`
- ❌ O(n) lookup (must search entire array)
- ❌ Duplicate prevention requires iteration
- Gas: 20k + 5k (array push) = 25k per bid

**Option C: Hybrid (Our Choice)**

```solidity
mapping(uint256 => mapping(address => Bid)) private bids;
mapping(uint256 => address[]) private bidderAddresses;
```

- ✅ O(1) lookup via mapping
- ✅ Can iterate via array
- ✅ Best of both worlds
- Gas: 20k + 5k = 25k per bid (acceptable for 3 bidders)

**Winner Selection Implementation:**

```solidity
function selectWinner(uint256 tenderId) public {
    address[] memory bidders = bidderAddresses[tenderId];  // Load to memory
    uint256 lowestBid = type(uint256).max;
    address winner;

    for (uint i = 0; i < bidders.length; i++) {  // Iterate in memory
        Bid storage bid = bids[tenderId][bidders[i]];  // O(1) lookup
        if (bid.revealed && bid.amount < lowestBid && bid.amount <= maxBudget) {
            lowestBid = bid.amount;
            winner = bidders[i];
        }
    }

    tenders[tenderId].winner = winner;  // One SSTORE
}
```

**Gas Analysis (3 bidders):**

- Mapping only: Cannot select winner on-chain ❌
- Array only: 3 iterations × 2.1k gas = 6.3k gas
- Hybrid: 3 iterations × 800 gas (memory) = 2.4k gas ✅

**For Milestones: Array is Sufficient**

```solidity
Milestone[] private milestones[tenderId];
```

- Only 2 milestones (fixed, small size)
- Sequential access pattern (milestone 0, then 1)
- No need for mapping
- Gas: Slightly cheaper than hybrid approach

**Recommendation:**

- **Use Mapping:** When you need fast lookup by key (tenders, bids)
- **Use Array:** When you need iteration and size is small (<10 items)
- **Use Hybrid:** When you need both (bidders)

### 6.4 Gas Optimization vs Code Readability

**Scenario 1: Packing Storage Variables**

**Unoptimized (Readable):**

```solidity
struct Tender {
    uint256 tenderId;           // Slot 0 (32 bytes)
    uint256 maxBudget;          // Slot 1 (32 bytes)
    address winner;             // Slot 2 (20 bytes, 12 wasted)
    TenderState state;          // Slot 3 (1 byte, 31 wasted)
    uint256 submissionDeadline; // Slot 4
}
// Total: 5 slots × 20k gas = 100k gas
```

**Optimized (Less Readable):**

```solidity
struct Tender {
    uint256 tenderId;           // Slot 0
    uint256 maxBudget;          // Slot 1
    uint256 submissionDeadline; // Slot 2
    address winner;             // Slot 3 (20 bytes)
    TenderState state;          // Slot 3 (1 byte) ← PACKED!
    // 11 bytes still wasted but better than before
}
// Total: 4 slots × 20k gas = 80k gas
// SAVINGS: 20k gas (~$0.60 per tender)
```

**Trade-off:**

- ✅ **Pro:** 20% gas savings
- ❌ **Con:** Less intuitive ordering
- ❌ **Con:** Harder to understand structure
- **Verdict:** Worth it for frequently created structs

**Scenario 2: Loop Optimization**

**Unoptimized (Readable):**

```solidity
function selectWinner(uint256 tenderId) public {
    for (uint i = 0; i < bidderAddresses[tenderId].length; i++) {  // SLOAD each iteration
        if (bids[tenderId][bidderAddresses[tenderId][i]].revealed) {  // Multiple SLOADs
            // Process bid
        }
    }
}
// Gas: 3 bidders × 4 SLOADs = 12 × 2.1k = 25k gas
```

**Optimized:**

```solidity
function selectWinner(uint256 tenderId) public {
    address[] memory bidders = bidderAddresses[tenderId];  // One SLOAD, cache in memory
    uint256 length = bidders.length;  // Cache length

    for (uint i = 0; i < length; i++) {  // Use cached length
        Bid storage bid = bids[tenderId][bidders[i]];  // Storage reference
        if (bid.revealed) {
            // Process bid
        }
    }
}
// Gas: 1 SLOAD + 3 memory accesses = 2.1k + 3 × 3 = 2.1k + 9 gas
// SAVINGS: ~23k gas (~92% reduction)
```

**Trade-off:**

- ✅ **Pro:** Massive gas savings (92%)
- ✅ **Pro:** Still readable with comments
- ❌ **Con:** More code lines
- **Verdict:** Always optimize loops

**Scenario 3: Short-Circuit Evaluation**

**Unoptimized:**

```solidity
function isValidBid(uint256 tenderId, address bidder) public view returns (bool) {
    Bid storage bid = bids[tenderId][bidder];

    if (bid.commitHash != bytes32(0) &&
        bid.revealed &&
        bid.amount > 0 &&
        bid.amount <= tenders[tenderId].maxBudget) {
        return true;
    }
    return false;
}
// Gas: All 4 conditions checked even if first fails
```

**Optimized:**

```solidity
function isValidBid(uint256 tenderId, address bidder) public view returns (bool) {
    Bid storage bid = bids[tenderId][bidder];

    // Cheapest checks first (short-circuit)
    if (bid.commitHash == bytes32(0)) return false;  // No SLOAD if false
    if (!bid.revealed) return false;
    if (bid.amount == 0) return false;
    if (bid.amount > tenders[tenderId].maxBudget) return false;

    return true;
}
// Gas: Fails fast, average 1-2 checks instead of 4
```

**Our Design Philosophy:**

1. **Optimize Hot Paths:** Functions called frequently (submitBid, selectWinner)
2. **Keep Setup Readable:** One-time functions (constructor) prioritize clarity
3. **Comment Optimizations:** Explain WHY code looks "weird"
4. **Measure Impact:** Only optimize if savings > 5k gas

### 6.5 OpenZeppelin vs Custom Implementation

**Security Comparison:**

| Aspect             | OpenZeppelin             | Custom                 | Winner |
| ------------------ | ------------------------ | ---------------------- | ------ |
| **Audit Status**   | ✅ Audited by 100+ firms | ❌ Unaudited           | OZ     |
| **Battle-Tested**  | ✅ Billions in TVL       | ❌ Untested            | OZ     |
| **Gas Efficiency** | ✅ Highly optimized      | ⚠️ Varies              | OZ     |
| **Learning Value** | ❌ Black box             | ✅ Deep understanding  | Custom |
| **Customization**  | ⚠️ Limited               | ✅ Full control        | Custom |
| **Maintenance**    | ✅ Community updates     | ❌ Your responsibility | OZ     |

**Gas Cost Comparison:**

```solidity
// CUSTOM OWNABLE
address private owner;
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}
// Deployment: ~23k gas
// Call overhead: ~400 gas

// OPENZEPPELIN OWNABLE
import "@openzeppelin/contracts/access/Ownable.sol";
contract ProcurementSystem is Ownable { }
// Deployment: ~25k gas (+2k)
// Call overhead: ~350 gas (-50 gas, more optimized)
```

**Recommendation for Academic Project:**

**Phase 1: Custom Implementation**

- Write your own Ownable, ReentrancyGuard
- **Reason:** Demonstrates understanding
- **Reason:** Fulfills "no external libraries" requirement
- **Reason:** Learning experience

**Phase 2: Security Analysis Task (Task 2)**

- Introduce intentional vulnerability in custom code
- Use AI tool to detect it
- Compare with OpenZeppelin implementation
- Document differences

**Phase 3: Production Recommendation**

- In report, state: "For production, OpenZeppelin recommended"
- Justify: Security > gas savings > development time
- Show you understand the trade-off

**Report Section Example:**

```markdown
## Security Analysis: Custom vs OpenZeppelin

### Our Implementation:

[Show your custom Ownable code]

### Vulnerability Introduced:

Missing zero-address check in ownership transfer

### OpenZeppelin Comparison:

[Show OZ code with _checkOwner()]

### Recommendation:

For production systems, we recommend OpenZeppelin because:

1. Audited by security firms (Trail of Bits, ConsenSys)
2. Used in $50B+ TVL projects
3. Marginal gas increase (2k) is negligible vs security risk
4. Active maintenance and updates

For this academic project, custom implementation demonstrates
understanding of access control patterns and security trade-offs.
```

---

## 7. SUMMARY OF ARCHITECTURAL DECISIONS

### 7.1 Key Design Choices

| Aspect                  | Decision                      | Rationale                                  |
| ----------------------- | ----------------------------- | ------------------------------------------ |
| **State Management**    | Enum-based state machine      | Clear transitions, prevents invalid states |
| **Bid Privacy**         | Commit-reveal pattern         | Prevents front-running (requirement)       |
| **Data Storage**        | Hybrid mapping + array        | O(1) lookup + iteration capability         |
| **Milestone Tracking**  | Array of structs              | Sequential access, small size (2 items)    |
| **Events**              | Comprehensive logging         | Audit trail, off-chain indexing            |
| **Access Control**      | Custom Ownable + role checks  | Meets "no external libraries" constraint   |
| **Reentrancy**          | Custom guard                  | Critical security, manual implementation   |
| **Description Storage** | Hash on-chain, data off-chain | 97% gas savings                            |

### 7.2 Gas Budget Estimate

```
Deployment:
- Contract deployment: ~2,500,000 gas (~$75)

Tender Creation:
- Create tender: ~140,000 gas (~$4.20)
- Create 2 milestones: ~200,000 gas (~$6)
- TOTAL: ~340,000 gas per tender

Bidding (per bidder × 3):
- Submit bid: ~80,000 gas
- Reveal bid: ~45,000 gas
- TOTAL: ~125,000 gas per bidder
- FOR 3 BIDDERS: ~375,000 gas

Winner Selection:
- Select winner: ~50,000 gas

Milestone Execution (× 2):
- Approve milestone: ~45,000 gas
- Release funds: ~35,000 gas
- TOTAL: ~80,000 gas per milestone
- FOR 2 MILESTONES: ~160,000 gas

TOTAL END-TO-END: ~925,000 gas (~$27.75 at 50 gwei, $2000 ETH)
```

### 7.3 Security Measures

1. **Front-Running Prevention:**

   - Commit-reveal pattern
   - Deadline enforcement
   - Hash verification

2. **Reentrancy Protection:**

   - Custom nonReentrant modifier
   - Checks-Effects-Interactions pattern
   - State updates before external calls

3. **Access Control:**

   - onlyOwner for tender creation
   - onlyAuditor for milestone approval
   - Bidder validation

4. **Input Validation:**

   - Deadline checks
   - Budget limits
   - Address zero checks
   - State transition validation

5. **Integer Overflow:**
   - Solidity 0.8+ automatic checks
   - No SafeMath needed

### 7.4 Next Steps

**Before Implementation:**

- [ ] Review and approve this architecture
- [ ] Decide on OpenZeppelin usage (check with professor)
- [ ] Set up development environment (Hardhat/Foundry)
- [ ] Create Git repository

**Implementation Order:**

1. Core data structures (Tender, Bid, Milestone)
2. State machine logic
3. Access control (Ownable, modifiers)
4. Tender creation function
5. Bid submission (commit)
6. Bid reveal and verification
7. Winner selection algorithm
8. Milestone approval system
9. Fund release mechanism
10. Events and error handling
11. Security features (reentrancy guard)
12. Off-chain CLI tool

**Testing Strategy:**

1. Unit tests for each function
2. Integration tests for full lifecycle
3. Gas optimization tests
4. Security vulnerability testing (intentional bugs)
5. Event emission verification

---

## 8. QUESTIONS FOR CLARIFICATION

---

## ✅ IMPLEMENTATION COMPLETED

### 📁 Deliverable Files

1. **[ProcurementSystem.sol](ProcurementSystem.sol)** - Main smart contract with intentional vulnerabilities
2. **[CONTRACT_DOCUMENTATION.md](CONTRACT_DOCUMENTATION.md)** - Comprehensive documentation & vulnerability analysis
3. **[QUICK_START.md](QUICK_START.md)** - Deployment, testing, and interaction guide

### 🎯 Implementation Details

**Solidity Version:** `^0.8.19`  
**OpenZeppelin Libraries Used:**

- ✅ `Ownable.sol` - Access control and ownership management
- ✅ `ReentrancyGuard.sol` - Protection against reentrancy attacks

**Group G1 Parameters Implemented:**

- Max Budget: **12 ETH** ✅
- Submission Deadline: **block.timestamp + 2 days** ✅
- Reveal Deadline: **+1 day** ✅
- Number of Bidders: **3** ✅
- Payment Milestones: **2** (50% + 50%) ✅
- Audit Rule: **Auditor approves both milestones** ✅
- Security Constraint: **Prevent front-running** ⚠️ (intentionally vulnerable for educational purposes)

### 🐛 Intentional Vulnerabilities Included

**Vulnerability 1: Bid Visibility Leak** 🔴

- Location: `submitBid()` function
- Issue: Bidder addresses publicly exposed via events and public array
- Impact: Medium - Enables coordination attacks

**Vulnerability 2: Early Bid Reveal Allowed** 🔴🔴🔴 **CRITICAL**

- Location: `revealBid()` function
- Issue: Missing deadline checks - reveals allowed before submission deadline
- Impact: CRITICAL - Destroys auction fairness, enables front-running
- Demonstrates what happens when commit-reveal pattern is improperly implemented

**Vulnerability 3: Public Bid Information Exposure** 🔴

- Location: `getBidDetails()` function
- Issue: Anyone can query any bidder's revealed bid amount
- Impact: Medium-High - Real-time information leakage

### 🔒 Security Features Correctly Implemented

✅ **Reentrancy Protection** - OpenZeppelin's `nonReentrant` on fund transfers  
✅ **Access Control** - OpenZeppelin's `Ownable` + custom modifiers (`onlyAuditor`, `onlyRegisteredBidder`)  
✅ **Input Validation** - Budget limits, deadline checks, address validation  
✅ **Integer Overflow Protection** - Solidity 0.8+ automatic checks  
✅ **State Machine** - Proper state transitions with validation  
✅ **Events** - Comprehensive audit trail with 8 event types

### 📊 Gas Costs Estimated

```
Deployment:                    ~2,800,000 gas (~$84)
Create Tender:                   ~340,000 gas (~$10.20)
Submit Bid (per bidder):          ~85,000 gas (~$2.55)
Reveal Bid (per bidder):          ~48,000 gas (~$1.44)
Select Winner:                    ~55,000 gas (~$1.65)
Approve Milestone:                ~47,000 gas (~$1.41)
Release Payment:                  ~38,000 gas (~$1.14)
──────────────────────────────────────────────────────
TOTAL LIFECYCLE (3 bidders):     ~950,000 gas (~$28.50)
```

### 🧪 Next Steps

1. **Deploy & Test** - Use `QUICK_START.md` to deploy to local Hardhat network
2. **Simulate Attacks** - Test the intentional vulnerabilities with exploit scripts
3. **Task 2: AI Security Analysis** - Use AI tools to detect vulnerabilities and compare findings
4. **Fix Vulnerabilities** - Implement proper deadline checks and access controls
5. **Gas Optimization** - Benchmark and optimize storage/computation
6. **Write Technical Report** - Document architecture, vulnerabilities, fixes, and gas analysis

### 📚 Documentation Structure

**Main Files:**

```
ProjectGLD2026.md              ← Project spec + Architecture design (this file)
ProcurementSystem.sol          ← Smart contract with vulnerabilities
CONTRACT_DOCUMENTATION.md      ← Technical documentation & analysis
QUICK_START.md                 ← Setup, deployment, testing guide
```

**To Be Created (Next Phase):**

```
scripts/deploy.js              ← Hardhat deployment script
scripts/interact.js            ← CLI interaction script
test/ProcurementSystem.test.js ← Unit tests + vulnerability tests
hardhat.config.js              ← Hardhat configuration
```

---

**✅ PHASE 1 COMPLETE: ARCHITECTURE & DESIGN**  
**✅ PHASE 2 COMPLETE: SMART CONTRACT IMPLEMENTATION**

## 📁 Project Files Created

- **`/contracts/ProcurementSystem.sol`** - Main smart contract (850+ lines)

  - ✅ OpenZeppelin imports (Ownable, ReentrancyGuard, Pausable)
  - ✅ Complete commit-reveal bidding system
  - ✅ Milestone-based payment system
  - ✅ 3 intentional vulnerabilities (documented)
  - ✅ Comprehensive NatSpec comments

- **`/contracts/README.md`** - Contract documentation
  - ✅ OpenZeppelin usage explanation
  - ✅ Vulnerability analysis with exploitation scenarios
  - ✅ Gas cost analysis
  - ✅ Function reference guide

**Ready for Phase 3: Deployment, Testing & CLI Development** 🚀

---

# 🏗️ ARCHITECTURE & DESIGN (OpenZeppelin-Based)

## 1. SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    ETHEREUM BLOCKCHAIN LAYER                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │         ProcurementSystem Smart Contract                  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  OpenZeppelin Base Contracts:                       │  │  │
│  │  │  • Ownable (owner-only functions)                   │  │  │
│  │  │  • ReentrancyGuard (payment protection)            │  │  │
│  │  │  • Pausable (emergency stop)                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                             │  │
│  │  Core State:                                                │  │
│  │  • tenders mapping                                          │  │
│  │  • bids mapping                                             │  │
│  │  • milestones mapping                                       │  │
│  │  • bidderRegistrations                                      │  │
│  │                                                             │  │
│  │  Functions:                                                 │  │
│  │  ├─ createTender() [onlyOwner, whenNotPaused]             │  │
│  │  ├─ registerBidder() [whenNotPaused]                      │  │
│  │  ├─ submitBid() [commit-reveal phase 1]                   │  │
│  │  ├─ revealBid() [commit-reveal phase 2]                   │  │
│  │  ├─ selectWinner() [automatic after reveal]               │  │
│  │  └─ releaseMilestonePayment() [nonReentrant]              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              ▲                                   │
│                              │ Web3 JSON-RPC                     │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                    OFF-CHAIN LAYER                               │
│                              │                                   │
│  ┌───────────────────────────▼────────────────────────────┐     │
│  │           CLI Application (Node.js/Hardhat)            │     │
│  │  ┌──────────────────────────────────────────────────┐  │     │
│  │  │  Components:                                     │  │     │
│  │  │  • Web3 Provider (ethers.js)                     │  │     │
│  │  │  • CLI Interface (inquirer/commander)            │  │     │
│  │  │  • Crypto Utils (hash generation, nonce)         │  │     │
│  │  │  • Event Listener (real-time notifications)      │  │     │
│  │  └──────────────────────────────────────────────────┘  │     │
│  │                                                         │     │
│  │  Functions:                                             │     │
│  │  ├─ deployContract()                                    │     │
│  │  ├─ createTenderCLI()                                   │     │
│  │  ├─ submitBidWithHash()                                 │     │
│  │  ├─ revealBidCLI()                                      │     │
│  │  ├─ queryTenderStatus()                                 │     │
│  │  └─ listenToEvents()                                    │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Local Storage/Cache                           │    │
│  │  • Nonces (for bid reveal)                              │    │
│  │  • Bid amounts (encrypted locally)                      │    │
│  │  • Transaction receipts                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                     │
├──────────────────────────────────────────────────────────────────┤
│  1. Owner creates tender → Event: TenderCreated                  │
│  2. Bidders submit hash(bid, nonce) → Event: BidSubmitted        │
│  3. After deadline, bidders reveal → Event: BidRevealed          │
│  4. Contract selects winner → Event: WinnerSelected              │
│  5. Auditor approves milestone → Event: MilestoneApproved        │
│  6. Payment released → Event: PaymentReleased                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. STATE MACHINE DIAGRAM

```
                    ┌──────────────────┐
                    │   DEPLOYMENT     │
                    │   (Contract      │
                    │    Created)      │
                    └────────┬─────────┘
                             │
                             │ createTender()
                             │ [onlyOwner]
                             ▼
                    ┌──────────────────┐
                    │   BID_SUBMISSION │──────┐
                    │                  │      │ block.timestamp
                    │  • Accept hashed │      │ < submissionDeadline
                    │    bids          │      │
                    │  • Emit:         │◄─────┘
                    │    BidSubmitted  │
                    └────────┬─────────┘
                             │
                             │ block.timestamp
                             │ >= submissionDeadline
                             ▼
                    ┌──────────────────┐
                    │   BID_REVEAL     │──────┐
                    │                  │      │ block.timestamp
                    │  • Verify hash   │      │ < revealDeadline
                    │  • Store bid amt │      │
                    │  • Emit:         │◄─────┘
                    │    BidRevealed   │
                    └────────┬─────────┘
                             │
                             │ block.timestamp
                             │ >= revealDeadline
                             ▼
                    ┌──────────────────┐
                    │ WINNER_SELECTION │
                    │                  │
                    │  • Find lowest   │
                    │    valid bid     │
                    │  • Check budget  │
                    │  • Emit:         │
                    │    WinnerSelected│
                    └────────┬─────────┘
                             │
                             │ selectWinner()
                             │ [automatic/anyone]
                             ▼
                    ┌──────────────────┐
                    │ PAYMENT_PENDING  │──────┐
                    │                  │      │
                    │  • Await auditor │      │ Multiple
                    │    approval      │      │ milestones
                    │  • Track progress│◄─────┘
                    └────────┬─────────┘
                             │
                             │ approveMilestone()
                             │ [auditor only]
                             ▼
                    ┌──────────────────┐
                    │ MILESTONE_PAYMENT│──────┐
                    │                  │      │
                    │  • Release funds │      │ More
                    │  • Emit:         │      │ milestones?
                    │    PaymentReleased◄─────┘
                    └────────┬─────────┘
                             │
                             │ All milestones
                             │ completed
                             ▼
                    ┌──────────────────┐
                    │    COMPLETED     │
                    │                  │
                    │  • Tender closed │
                    │  • Final state   │
                    └──────────────────┘

EMERGENCY TRANSITIONS (Pausable):
┌──────────────────────────────────────────────────────┐
│ ANY STATE → PAUSED (owner calls pause())             │
│ PAUSED → Previous STATE (owner calls unpause())      │
└──────────────────────────────────────────────────────┘

STATE TRANSITION CONDITIONS:
• BID_SUBMISSION → BID_REVEAL: Time-based (deadline reached)
• BID_REVEAL → WINNER_SELECTION: Time-based (reveal period ends)
• WINNER_SELECTION → PAYMENT_PENDING: Function call (manual/automatic)
• PAYMENT_PENDING → MILESTONE_PAYMENT: Auditor approval
• MILESTONE_PAYMENT → COMPLETED: All milestones paid

EVENTS EMITTED:
├─ TenderCreated (tenderId, maxBudget, deadlines)
├─ BidSubmitted (tenderId, bidder, bidHash)
├─ BidRevealed (tenderId, bidder, amount)
├─ WinnerSelected (tenderId, winner, amount)
├─ MilestoneApproved (tenderId, milestoneId, auditor)
├─ PaymentReleased (tenderId, milestoneId, amount)
└─ Paused / Unpaused (emergency events)
```

---

## 3. DATA STRUCTURE DESIGN

### **3.1 Tender Structure**

```solidity
struct Tender {
    uint256 id;                      // STORAGE: Unique identifier
    bytes32 descriptionHash;         // STORAGE: IPFS/SHA256 hash of description
    uint256 maxBudget;               // STORAGE: Maximum allowed bid
    uint256 submissionDeadline;      // STORAGE: Block timestamp for bid submission
    uint256 revealDeadline;          // STORAGE: Block timestamp for reveal
    TenderState state;               // STORAGE: Current state enum
    address winner;                  // STORAGE: Winning bidder address
    uint256 winningBid;              // STORAGE: Winning bid amount
    uint256 numMilestones;           // STORAGE: Total payment milestones
    uint256 completedMilestones;     // STORAGE: Paid milestones counter
}

// Storage: mapping(uint256 => Tender) public tenders;
```

**Design Rationale:**

- **Struct vs Separate Mappings**: Struct groups related data, improving code readability. Gas cost is similar for access but better for batch reads.
- **Storage Variables**: All tender data must persist between transactions → STORAGE required.
- **descriptionHash**: Storing only hash (32 bytes) vs full text saves ~20k gas per character.
- **state enum**: More gas-efficient than strings, enables compiler-level validation.

**Gas Analysis:**

- Tender creation: ~200k gas (6 storage slots written)
- Reading tender: ~2.1k gas (SLOAD operations)
- Alternative (separate mappings): Similar gas but worse readability

---

### **3.2 Bid Structure**

```solidity
struct Bid {
    bytes32 commitHash;              // STORAGE: keccak256(amount, nonce)
    uint256 revealedAmount;          // STORAGE: Actual bid (after reveal)
    bool isRevealed;                 // STORAGE: Reveal status
    bool isValid;                    // STORAGE: Validation flag
}

// Storage: mapping(uint256 => mapping(address => Bid)) public bids;
// Nested mapping: tenderId → bidder address → Bid
```

**Design Rationale:**

- **Nested Mapping**: Direct access to specific tender's specific bidder in O(1).
- **Alternative (Array)**: Would require iteration (expensive for gas).
- **commitHash (bytes32)**: 32 bytes = 1 storage slot = optimal.
- **Booleans**: Packed into same slot with compiler optimization (saves gas).

**Commit-Reveal Privacy:**

1. **Commit Phase**: Only hash stored → bid amount invisible on-chain
2. **Reveal Phase**: Hash verification prevents tampering
3. **Formula**: `require(keccak256(abi.encodePacked(amount, nonce)) == commitHash)`

**Gas Analysis:**

- Submit bid (commit): ~45k gas (1 storage slot)
- Reveal bid: ~25k gas (2 slots updated)
- Alternative (array of bids): +10k gas per iteration

---

### **3.3 Milestone Structure**

```solidity
struct Milestone {
    uint256 id;                      // STORAGE: Milestone number
    uint256 amount;                  // STORAGE: Payment for this milestone
    bool isApproved;                 // STORAGE: Auditor approval
    bool isPaid;                     // STORAGE: Payment status
    address auditor;                 // STORAGE: Who approved
    uint256 approvalTimestamp;       // STORAGE: When approved
}

// Storage: mapping(uint256 => mapping(uint256 => Milestone)) public milestones;
// Nested: tenderId → milestoneId → Milestone
```

**Design Rationale:**

- **Nested Mapping**: Isolates milestones per tender, prevents cross-contamination.
- **Alternative (Array)**: Would require loop to find specific milestone.
- **Separation of isApproved/isPaid**: Allows two-step process (approve then pay).
- **auditor address**: Auditability requirement for tracking who approved.

**Why Not Events Only?**

- Events cannot be queried from smart contracts (off-chain only).
- Payment release logic needs on-chain verification of approval status.
- Hybrid approach: State for logic, events for auditability.

---

### **3.4 Bidder Registration**

```solidity
mapping(address => bool) public registeredBidders;
// Simple mapping: Efficient O(1) lookup
```

**Design Rationale:**

- **Mapping vs Array**: No need to iterate, only check existence.
- **Bool vs Struct**: No additional data needed, bool is sufficient.
- **Gas**: ~22k gas for registration (1 SSTORE from 0 to 1)

---

### **3.5 Memory vs Storage Strategy**

| **Variable Type**         | **Location** | **Reason**                                     |
| ------------------------- | ------------ | ---------------------------------------------- |
| Function parameters       | memory       | Temporary, not persisted                       |
| Loop counters             | memory       | Discarded after execution                      |
| Tender/Bid/Milestone data | storage      | Must survive between transactions              |
| Temporary calculations    | memory       | Gas savings (MSTORE: 3 gas vs SSTORE: 20k gas) |
| Return values             | memory       | Copied to caller, not stored                   |

**Example: Winner Selection Logic**

```solidity
function selectWinner(uint256 tenderId) public {
    Tender storage tender = tenders[tenderId];  // STORAGE: We modify it

    uint256 lowestBid = type(uint256).max;      // MEMORY: Temporary variable
    address winner;                             // MEMORY: Temporary

    // ... logic ...

    tender.winner = winner;                     // Write to STORAGE
    tender.winningBid = lowestBid;             // Write to STORAGE
}
```

**Gas Comparison:**

- Using `storage`: Modifications persist (~20k gas per SSTORE)
- Using `memory`: Would require final copy to storage (same cost + overhead)
- **Decision**: Use storage reference when modifying, memory for temps.

---

## 4. OPENZEPPELIN LIBRARIES USAGE

### **4.1 Ownable.sol** ✅ **RECOMMENDED**

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProcurementSystem is Ownable {
    function createTender(...) public onlyOwner {
        // Only contract owner can create tenders
    }
}
```

**Pros:**

- **Battle-tested**: Used in 1000s of production contracts
- **Gas-efficient**: Single storage slot for owner address
- **Standardized**: Well-known modifier pattern
- **Transfer ownership**: Supports `transferOwnership()` for upgrades

**Cons:**

- **Centralization**: Single point of control (mitigated by transparency)
- **No multi-sig**: For multi-sig, need separate contract

**Gas Cost:**

- Deployment: +~30k gas overhead
- Per call: +~300 gas for modifier check
- **Trade-off**: Minimal gas cost for major security benefit

**Why Use It?**

- Your requirement: "Only owner can create tenders"
- Custom implementation error-prone (seen in 30% of audits)
- OpenZeppelin version is audited and standardized

---

### **4.2 ReentrancyGuard.sol** ✅ **CRITICAL**

```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ProcurementSystem is ReentrancyGuard {
    function releaseMilestonePayment(uint256 tenderId, uint256 milestoneId)
        public
        nonReentrant  // Prevents reentrancy attack
    {
        // Transfer funds to winner
        (bool success, ) = winner.call{value: amount}("");
        require(success, "Payment failed");
    }
}
```

**Pros:**

- **Prevents reentrancy**: Uses mutex lock pattern
- **Minimal overhead**: 1 storage variable + 2 SSTOREs per call
- **Automatic**: No manual state tracking needed
- **Proven**: Stops DAO-hack style attacks

**Cons:**

- **Gas cost**: +~2.5k gas per protected function
- **Cross-function**: Protects whole contract, not just one function

**Gas Cost:**

- First call: +~22k gas (SSTORE 0→1)
- Subsequent: +~5k gas (SSTORE 1→2→1)

**Why Use It?**

- Payment release involves external calls (`.call{value}`)
- External calls can re-enter contract before state updates
- Your constraint: "Security constraint" (reentrancy is common)
- **Alternative**: Manual checks-effects-interactions (error-prone)

**Attack Scenario Without It:**

```solidity
// VULNERABLE CODE
function pay() public {
    uint256 amount = balances[msg.sender];
    (bool success, ) = msg.sender.call{value: amount}("");  // Attacker re-enters here
    balances[msg.sender] = 0;  // State updated AFTER call
}

// Attacker's contract:
receive() external payable {
    if (address(victim).balance > 0) {
        victim.pay();  // Re-enter before balance is zeroed
    }
}
```

**With ReentrancyGuard:** Second call reverts immediately.

---

### **4.3 Pausable.sol** ✅ **RECOMMENDED**

```solidity
import "@openzeppelin/contracts/security/Pausable.sol";

contract ProcurementSystem is Pausable {
    function submitBid(...) public whenNotPaused {
        // Disabled during emergency pause
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
```

**Pros:**

- **Emergency stop**: Halt contract during exploit
- **Upgradeable**: Fix bugs off-chain while paused
- **Granular control**: Choose which functions to protect
- **Events**: Emits `Paused` and `Unpaused` for transparency

**Cons:**

- **Centralization**: Owner can pause anytime (trade-off for security)
- **Gas overhead**: +~300 gas per call (modifier check)

**Gas Cost:**

- Deployment: +~20k gas
- Per call: +~300 gas
- Pause/Unpause: ~5k gas each

**Why Use It?**

- Critical for financial contracts (payment system)
- If exploit discovered mid-tender, can pause to prevent losses
- Academic project: Shows understanding of security trade-offs
- **Alternative**: No emergency stop → single exploit drains all funds

**Use Cases:**

- Bug discovered during reveal phase
- Auditor compromised (pause until replacement)
- Blockchain congestion (pause to prevent deadline issues)

---

### **4.4 Other OpenZeppelin Contracts (Optional)**

| **Contract**         | **Use Case**          | **Recommendation**                          |
| -------------------- | --------------------- | ------------------------------------------- |
| `Address.sol`        | Safe ETH transfers    | ✅ Optional (useful for `sendValue()`)      |
| `SafeMath.sol`       | Overflow protection   | ❌ Not needed (Solidity 0.8+ has built-in)  |
| `EnumerableSet`      | Track bidders list    | ⚠️ Expensive (use only if iteration needed) |
| `AccessControl`      | Multi-role management | ❌ Overkill (Ownable sufficient)            |
| `TimelockController` | Delayed admin actions | ⚠️ Advanced (good for production)           |

---

### **4.5 Combined Contract Inheritance**

```solidity
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract ProcurementSystem is Ownable, ReentrancyGuard, Pausable {
    // Inherits:
    // - onlyOwner modifier (Ownable)
    // - nonReentrant modifier (ReentrancyGuard)
    // - whenNotPaused modifier (Pausable)
    // - pause() / unpause() functions

    constructor() Ownable(msg.sender) {
        // Constructor initializes all base contracts
    }
}
```

**Gas Cost Summary:**

- Deployment: +~80k gas total (all 3 contracts)
- Per transaction: +~600-3k gas (depending on modifiers used)
- **Trade-off**: ~$2-5 extra per transaction at 50 gwei → Worth it for security

---

## 5. EVENTS DESIGN

### **5.1 Events List with Parameters**

```solidity
// Tender Lifecycle Events
event TenderCreated(
    uint256 indexed tenderId,
    bytes32 descriptionHash,
    uint256 maxBudget,
    uint256 submissionDeadline,
    uint256 revealDeadline,
    uint256 numMilestones
);

event BidSubmitted(
    uint256 indexed tenderId,
    address indexed bidder,
    bytes32 commitHash,
    uint256 timestamp
);

event BidRevealed(
    uint256 indexed tenderId,
    address indexed bidder,
    uint256 amount,
    bool isValid
);

event WinnerSelected(
    uint256 indexed tenderId,
    address indexed winner,
    uint256 winningBid,
    uint256 timestamp
);

// Payment Events
event MilestoneApproved(
    uint256 indexed tenderId,
    uint256 indexed milestoneId,
    address auditor,
    uint256 timestamp
);

event PaymentReleased(
    uint256 indexed tenderId,
    uint256 indexed milestoneId,
    address recipient,
    uint256 amount,
    uint256 timestamp
);

// Admin Events
event BidderRegistered(
    address indexed bidder,
    uint256 timestamp
);

event ContractPaused(
    address indexed by,
    uint256 timestamp
);

event ContractUnpaused(
    address indexed by,
    uint256 timestamp
);
```

### **5.2 Indexed Parameters Rationale**

**Indexed vs Non-Indexed:**

- **Indexed** (up to 3 per event): Filterable, stored in topics (faster queries)
- **Non-indexed**: Stored in data field (cheaper gas, not filterable)

**Gas Cost:**

- Indexed parameter: ~375 gas each
- Non-indexed: ~8 gas per byte
- **Rule**: Index IDs and addresses (for filtering), not large data

**Example Query (Off-Chain):**

```javascript
// Get all bids for tender #5
const events = await contract.queryFilter(
  contract.filters.BidSubmitted(5) // Filter by indexed tenderId
);
```

---

### **5.3 Events vs Storage Trade-off**

| **Aspect**          | **Events**                | **Storage**          |
| ------------------- | ------------------------- | -------------------- |
| **Gas Cost**        | ~375-2k gas per event     | ~20k gas per SSTORE  |
| **Queryability**    | Off-chain only (web3)     | On-chain accessible  |
| **Auditability**    | Permanent log (immutable) | Can be overwritten   |
| **Data Size Limit** | ~2kb practical limit      | No limit (expensive) |
| **Access Speed**    | Slow (RPC calls)          | Fast (SLOAD)         |

**Best Practice:**

```solidity
function releaseMilestonePayment(uint256 tenderId, uint256 milestoneId)
    public
    nonReentrant
{
    // 1. Update storage (needed for contract logic)
    milestones[tenderId][milestoneId].isPaid = true;

    // 2. Emit event (needed for auditability)
    emit PaymentReleased(tenderId, milestoneId, winner, amount, block.timestamp);

    // 3. Transfer funds
    (bool success, ) = winner.call{value: amount}("");
    require(success);
}
```

**Why Both?**

- **Storage**: Contract needs `isPaid` to prevent double-spending
- **Event**: Auditors need off-chain log of all payments
- **Cost**: ~22k gas total vs ~20k for storage alone → +10% for full auditability

---

## 6. DESIGN TRADE-OFFS ANALYSIS

### **6.1 Storage vs Events**

**Scenario: Tracking Bid History**

**Option A: Store All Bids in Array**

```solidity
Bid[] public bidHistory;  // Storage array

function submitBid(...) public {
    bidHistory.push(Bid(...));  // ~40k gas per bid
}

function getBidHistory() public view returns (Bid[] memory) {
    return bidHistory;  // Gas grows with array size
}
```

**Option B: Use Events Only**

```solidity
event BidSubmitted(uint256 tenderId, address bidder, bytes32 hash);

function submitBid(...) public {
    emit BidSubmitted(tenderId, msg.sender, commitHash);  // ~1.5k gas
}

// Off-chain: Query events via web3
const bids = await contract.queryFilter(contract.filters.BidSubmitted(tenderId));
```

**Comparison:**

| **Metric**             | **Storage Array** | **Events Only** | **Hybrid (Recommended)** |
| ---------------------- | ----------------- | --------------- | ------------------------ |
| **Gas per bid**        | ~40k              | ~1.5k           | ~23k (storage + event)   |
| **On-chain access**    | ✅ Yes            | ❌ No           | ✅ Yes (current only)    |
| **Off-chain audit**    | ⚠️ Manual export  | ✅ Easy         | ✅ Easy                  |
| **Historical queries** | ✅ On-chain       | ✅ Off-chain    | ✅ Both                  |
| **Cost for 100 bids**  | ~4M gas           | ~150k gas       | ~2.3M gas                |

**Recommendation:** **Hybrid**

- Store current bid in mapping (needed for winner selection)
- Emit event for audit trail (cheap, permanent)
- Total cost: ~23k gas per bid vs 40k (42% savings)

---

### **6.2 Privacy vs Transparency (Commit-Reveal)**

**Why Commit-Reveal is Necessary:**

**Without Commit-Reveal (Naive Approach):**

```solidity
// VULNERABLE: All bids visible immediately
function submitBid(uint256 amount) public {
    bids[msg.sender] = amount;  // Stored in plaintext
}
```

**Attack:**

1. Alice submits bid: 10 ETH (tx in mempool)
2. Bob sees Alice's tx, front-runs with 9.9 ETH
3. Bob wins despite Alice bidding first

**With Commit-Reveal:**

```solidity
// PHASE 1: Commit (hash only)
function submitBid(bytes32 commitHash) public {
    bids[msg.sender].commitHash = commitHash;  // Hash is opaque
}

// PHASE 2: Reveal (after deadline)
function revealBid(uint256 amount, bytes32 nonce) public {
    require(keccak256(abi.encodePacked(amount, nonce)) == bids[msg.sender].commitHash);
    bids[msg.sender].revealedAmount = amount;
}
```

**Security:**

- Commit phase: Impossible to determine bid amount from hash
- Reveal phase: Hash verification prevents changing bid after seeing others
- Deadline enforcement: Can't reveal early to gain advantage

**Gas Cost:**

- Commit: ~45k gas
- Reveal: ~25k gas
- **Total**: ~70k vs ~23k for naive approach
- **Trade-off**: 3x gas cost for preventing front-running (worth it)

**Academic Perspective:**

- Demonstrates understanding of blockchain-specific attacks
- Shows knowledge of cryptographic commitments
- Trade-off: Privacy during bidding vs gas efficiency

---

### **6.3 Mappings vs Arrays**

**Use Case: Storing Bids**

**Option A: Mapping (Recommended)**

```solidity
mapping(uint256 => mapping(address => Bid)) public bids;

// Access: O(1)
Bid storage bid = bids[tenderId][bidder];  // ~2.1k gas

// Cannot iterate
```

**Option B: Array**

```solidity
struct BidWithAddress {
    address bidder;
    Bid bid;
}

BidWithAddress[] public allBids;

// Access: O(n) - must loop
for (uint i = 0; i < allBids.length; i++) {
    if (allBids[i].bidder == targetBidder) {
        // Found it - costs ~2k gas per iteration
    }
}
```

**Decision Matrix:**

| **Need**                 | **Use Mapping** | **Use Array** |
| ------------------------ | --------------- | ------------- |
| Direct access by key     | ✅              | ❌            |
| Iteration over all items | ❌              | ✅            |
| Gas-efficient lookup     | ✅              | ❌            |
| Know exact count         | ❌              | ✅            |
| Order preservation       | ❌              | ✅            |

**For Procurement System:**

- **Bids**: Mapping (need to access specific bidder's bid)
- **Tenderers list**: Array (need to iterate to find winner)
- **Milestones**: Mapping (direct access by ID)

**Gas Analysis (100 bidders):**

- Mapping lookup: ~2.1k gas (constant)
- Array search: ~210k gas (100 iterations × 2.1k)
- **Difference**: 100x slower for arrays

**Hybrid Solution (If Iteration Needed):**

```solidity
mapping(address => Bid) public bids;         // Fast lookup
address[] public bidderAddresses;            // Enables iteration

function submitBid(...) public {
    bids[msg.sender] = Bid(...);
    bidderAddresses.push(msg.sender);        // +~22k gas
}

// Now can iterate when needed (e.g., winner selection)
for (uint i = 0; i < bidderAddresses.length; i++) {
    Bid storage bid = bids[bidderAddresses[i]];
    // ...
}
```

**Cost:** +~22k gas per bid for array push, but enables iteration.

---

### **6.4 Gas Optimization vs Code Readability**

**Example: Winner Selection Logic**

**Option A: Optimized for Gas**

```solidity
function selectWinner(uint256 t) external {
    uint256 l = type(uint256).max;
    address w;
    for (uint i; i < ba.length;) {
        uint256 a = b[t][ba[i]].ra;
        if (a < l && a <= tn[t].mb && b[t][ba[i]].iv) {
            l = a;
            w = ba[i];
        }
        unchecked { ++i; }  // Save ~40 gas per iteration
    }
    tn[t].w = w;
    tn[t].wb = l;
}
```

**Gas**: ~180k for 10 bidders

**Option B: Readable (Recommended for Academic)**

```solidity
function selectWinner(uint256 tenderId) external {
    Tender storage tender = tenders[tenderId];
    require(block.timestamp >= tender.revealDeadline, "Reveal not ended");

    uint256 lowestBid = type(uint256).max;
    address winner;

    for (uint256 i = 0; i < bidderAddresses.length; i++) {
        address bidder = bidderAddresses[i];
        Bid storage bid = bids[tenderId][bidder];

        if (bid.isRevealed &&
            bid.isValid &&
            bid.revealedAmount <= tender.maxBudget &&
            bid.revealedAmount < lowestBid)
        {
            lowestBid = bid.revealedAmount;
            winner = bidder;
        }
    }

    require(winner != address(0), "No valid bids");

    tender.winner = winner;
    tender.winningBid = lowestBid;
    tender.state = TenderState.PAYMENT_PENDING;

    emit WinnerSelected(tenderId, winner, lowestBid, block.timestamp);
}
```

**Gas**: ~195k for 10 bidders (+8% vs optimized)

**Trade-off Analysis:**

| **Aspect**           | **Optimized** | **Readable** |
| -------------------- | ------------- | ------------ |
| **Gas cost**         | ~180k         | ~195k        |
| **Code review time** | 30 min        | 5 min        |
| **Bug likelihood**   | High          | Low          |
| **Audit cost**       | $500+         | $200         |
| **Maintainability**  | Poor          | Good         |

**Recommendation for Academic Project:**

- **Prioritize readability** (you must explain during defense)
- **Document optimizations**: Show you know them, but chose readability
- **Gas savings**: 8% (~$2 at 50 gwei) vs audit cost ($300 difference)

**Production System:** Optimize after thorough testing and audit.

---

### **6.5 Using OpenZeppelin vs Custom Implementation**

**Example: Access Control**

**Option A: OpenZeppelin Ownable**

```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProcurementSystem is Ownable {
    function createTender(...) public onlyOwner {
        // ...
    }
}
```

**Option B: Custom Implementation**

```solidity
contract ProcurementSystem {
    address private owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createTender(...) public onlyOwner {
        // ...
    }
}
```

**Comparison:**

| **Aspect**             | **OpenZeppelin**                         | **Custom**    |
| ---------------------- | ---------------------------------------- | ------------- |
| **Deployment gas**     | ~30k extra                               | Baseline      |
| **Security**           | Audited (100k+ projects)                 | Untested      |
| **Features**           | transferOwnership(), renounceOwnership() | Basic only    |
| **Standardization**    | Industry standard                        | Non-standard  |
| **Learning curve**     | Known pattern                            | Must document |
| **Audit cost savings** | ~$500-1000                               | $0            |
| **Trust**              | High                                     | Low           |

**Real-World Bug Example (Custom Implementation):**

```solidity
// BUG: Ownership can be stolen!
address public owner;  // PUBLIC instead of private

constructor() {
    owner = msg.sender;
}

// Missing access control
function transferOwnership(address newOwner) public {
    owner = newOwner;  // Anyone can call this!
}
```

**OpenZeppelin Prevents:**

- Ownership theft (protected transferOwnership)
- Locked contracts (renounceOwnership for decentralization)
- Zero-address bugs (requires newOwner != address(0))

**Recommendation:**

- **Use OpenZeppelin** for access control, reentrancy, pausable
- **Custom implementation** only for domain-specific logic (tender, bids)
- **Gas overhead**: ~$3-5 per transaction → negligible vs security risk
- **Academic value**: Shows knowledge of industry best practices

---

### **6.6 Security Constraint: Front-Running Prevention**

**Your Specific Constraint: Prevent Front-Running**

**Vulnerability:**

```solidity
// VULNERABLE: Bid amounts visible in mempool
function submitBid(uint256 amount) public payable {
    require(msg.value == amount);
    bids[msg.sender] = amount;
}
```

**Attack:**

1. Alice submits tx: submitBid(10 ETH) with gas price 20 gwei
2. Bob's bot sees tx in mempool (before mining)
3. Bob submits tx: submitBid(9.9 ETH) with gas price 100 gwei (higher)
4. Miner prioritizes Bob's tx (higher fee)
5. Bob's tx executes first, Alice's second
6. Bob wins despite Alice bidding first

**Solution 1: Commit-Reveal (Recommended)**

```solidity
// Phase 1: Commit (before deadline)
function submitBid(bytes32 commitHash) public {
    // commitHash = keccak256(abi.encodePacked(amount, nonce))
    bids[msg.sender].commitHash = commitHash;
}

// Phase 2: Reveal (after deadline)
function revealBid(uint256 amount, bytes32 nonce) public {
    require(block.timestamp >= revealDeadline);
    bytes32 hash = keccak256(abi.encodePacked(amount, nonce));
    require(hash == bids[msg.sender].commitHash, "Invalid reveal");
    bids[msg.sender].revealedAmount = amount;
}
```

**Why It Works:**

- During commit: Only hash visible (amount is secret)
- Front-runner can't determine optimal bid from hash
- After deadline: All commits locked in, revealing order doesn't matter

**Solution 2: Minimum Delay (Alternative)**

```solidity
uint256 public constant MIN_BLOCK_DELAY = 5;
mapping(address => uint256) public lastBidBlock;

function submitBid(uint256 amount) public {
    require(block.number >= lastBidBlock[msg.sender] + MIN_BLOCK_DELAY);
    lastBidBlock[msg.sender] = block.number;
    bids[msg.sender] = amount;
}
```

**Comparison:**

| **Method**          | **Security** | **Gas Cost** | **UX**           |
| ------------------- | ------------ | ------------ | ---------------- |
| **Commit-Reveal**   | ✅✅✅       | ~70k total   | ⚠️ 2 tx required |
| **Minimum Delay**   | ⚠️ Partial   | ~25k         | ✅ 1 tx          |
| **Submarine Sends** | ✅✅         | ~100k        | ❌ Complex       |

**Recommendation:** Commit-reveal (matches project requirements + best security)

---

## 7. FINAL ARCHITECTURE SUMMARY

### **Contract Structure**

```solidity
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract ProcurementSystem is Ownable, ReentrancyGuard, Pausable {

    // ENUMS
    enum TenderState { BID_SUBMISSION, BID_REVEAL, WINNER_SELECTION, PAYMENT_PENDING, COMPLETED }

    // STRUCTS
    struct Tender { ... }
    struct Bid { ... }
    struct Milestone { ... }

    // STATE VARIABLES
    mapping(uint256 => Tender) public tenders;
    mapping(uint256 => mapping(address => Bid)) public bids;
    mapping(uint256 => mapping(uint256 => Milestone)) public milestones;
    mapping(address => bool) public registeredBidders;
    address[] public bidderAddresses;  // For iteration
    uint256 public tenderCounter;

    // EVENTS
    event TenderCreated(...);
    event BidSubmitted(...);
    event BidRevealed(...);
    event WinnerSelected(...);
    event MilestoneApproved(...);
    event PaymentReleased(...);

    // MODIFIERS (inherited from OpenZeppelin)
    // - onlyOwner
    // - nonReentrant
    // - whenNotPaused

    // FUNCTIONS
    function createTender(...) external onlyOwner whenNotPaused { ... }
    function registerBidder() external whenNotPaused { ... }
    function submitBid(bytes32 commitHash) external whenNotPaused { ... }
    function revealBid(uint256 amount, bytes32 nonce) external whenNotPaused { ... }
    function selectWinner(uint256 tenderId) external whenNotPaused { ... }
    function approveMilestone(...) external onlyOwner { ... }
    function releaseMilestonePayment(...) external nonReentrant { ... }
    function pause() external onlyOwner { ... }
    function unpause() external onlyOwner { ... }
}
```

### **Gas Cost Estimates (Group Parameters)**

| **Operation**           | **Gas Cost** | **Cost at 50 gwei**           |
| ----------------------- | ------------ | ----------------------------- |
| **Deploy contract**     | ~2,500,000   | ~$0.25 (0.125 ETH at $2k/ETH) |
| **Create tender**       | ~200,000     | ~$0.02                        |
| **Register bidder**     | ~45,000      | ~$0.004                       |
| **Submit bid (commit)** | ~45,000      | ~$0.004                       |
| **Reveal bid**          | ~25,000      | ~$0.0025                      |
| **Select winner**       | ~195,000     | ~$0.02 (for 3 bidders)        |
| **Approve milestone**   | ~30,000      | ~$0.003                       |
| **Release payment**     | ~55,000      | ~$0.005                       |

**Total for 1 tender with 3 bidders, 2 milestones:**

- ~900,000 gas (~$0.09 at 50 gwei)

---

### **Security Features**

1. ✅ **Access Control**: OpenZeppelin Ownable
2. ✅ **Reentrancy Protection**: ReentrancyGuard on payments
3. ✅ **Emergency Stop**: Pausable for crisis management
4. ✅ **Front-Running Prevention**: Commit-reveal pattern
5. ✅ **Input Validation**: require() statements throughout
6. ✅ **Event Logging**: All state changes emit events
7. ✅ **Deadline Enforcement**: Block timestamp checks

---

### **Next Steps (Implementation Phase)**

1. **Write Solidity contract** following this architecture
2. **Deploy to Hardhat local network**
3. **Create CLI script** for interaction
4. **Write unit tests** for each function
5. **Perform gas analysis** (actual vs estimated)
6. **Security audit** (introduce vulnerability, then fix)
7. **Document design choices** in technical report

---

**✅ ARCHITECTURE DESIGN COMPLETE - READY FOR IMPLEMENTATION**
