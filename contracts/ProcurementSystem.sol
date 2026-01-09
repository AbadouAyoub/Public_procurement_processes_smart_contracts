// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ProcurementSystem
 * @dev Decentralized Public Procurement Tracking System
 * @notice This contract manages tender creation, bidding, winner selection, and milestone payments
 * 
 * ACADEMIC PROJECT - Contains INTENTIONAL VULNERABILITIES for educational purposes
 * These vulnerabilities will be identified, explained, and fixed in subsequent phases
 * 
 * OpenZeppelin Libraries Used:
 * - Ownable: Provides access control for tender creation and administrative functions
 * - ReentrancyGuard: Protects against reentrancy attacks on payment functions
 * - Pausable: Enables emergency stop mechanism for critical situations
 * 
 * Security Constraint: Prevent Front-Running Attacks
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract ProcurementSystem is Ownable, ReentrancyGuard, Pausable {
    
    // ============================================
    // ENUMS
    // ============================================
    
    /**
     * @dev Represents the current phase of a tender
     * State transitions are time-based and irreversible
     */
    enum TenderPhase {
        BID_SUBMISSION,     // Bidders submit hashed bids
        BID_REVEAL,         // Bidders reveal their actual bid amounts
        WINNER_SELECTION,   // Contract determines the lowest valid bid
        PAYMENT_PENDING,    // Awaiting milestone completion and payments
        COMPLETED           // All milestones paid, tender closed
    }
    
    // ============================================
    // STRUCTS
    // ============================================
    
    /**
     * @dev Represents a public procurement tender
     * @notice All deadlines are Unix timestamps (block.timestamp)
     */
    struct Tender {
        uint256 id;                      // Unique tender identifier
        bytes32 descriptionHash;         // IPFS/SHA256 hash of tender description
        uint256 maxBudget;               // Maximum acceptable bid amount (in wei)
        uint256 submissionDeadline;      // Deadline for bid submission (commit phase)
        uint256 revealDeadline;          // Deadline for bid reveal
        TenderPhase phase;               // Current phase of the tender
        address winner;                  // Address of winning bidder
        uint256 winningBid;              // Winning bid amount
        uint256 totalMilestones;         // Total number of payment milestones
        uint256 completedMilestones;     // Number of milestones completed and paid
        uint256 fundedAmount;            // Amount of ETH locked in contract for this tender
        bool isActive;                   // Whether tender is active
    }
    
    /**
     * @dev Represents a bid submission (commit-reveal pattern)
     * @notice Uses cryptographic commitment to prevent front-running
     */
    struct Bid {
        bytes32 commitHash;              // Hash of (bidAmount + nonce) during commit phase
        uint256 revealedAmount;          // Actual bid amount (revealed in reveal phase)
        bool isRevealed;                 // Whether bid has been revealed
        bool isValid;                    // Whether revealed bid is valid
        uint256 revealTimestamp;         // When the bid was revealed
    }
    
    /**
     * @dev Represents a payment milestone
     * @notice Payments are released only after auditor approval
     */
    struct Milestone {
        uint256 id;                      // Milestone identifier (0-indexed)
        uint256 amount;                  // Payment amount for this milestone (in wei)
        bool isApproved;                 // Whether auditor has approved this milestone
        bool isPaid;                     // Whether payment has been released
        address approvedBy;              // Address of auditor who approved
        uint256 approvalTimestamp;       // When milestone was approved
        uint256 paymentTimestamp;        // When payment was released
    }
    
    // ============================================
    // STATE VARIABLES
    // ============================================
    
    // Tender storage
    mapping(uint256 => Tender) public tenders;
    uint256 public tenderCounter;
    
    // Bid storage: tenderId => bidder => Bid
    mapping(uint256 => mapping(address => Bid)) public bids;
    
    // Milestone storage: tenderId => milestoneId => Milestone
    mapping(uint256 => mapping(uint256 => Milestone)) public milestones;
    
    // Registered bidders
    mapping(address => bool) public registeredBidders;
    
    // Track bidders per tender for iteration (needed for winner selection)
    mapping(uint256 => address[]) public tenderBidders;
    
    // Auditor address (can approve milestones)
    address public auditor;
    
    // ============================================
    // EVENTS
    // ============================================
    
    /**
     * @dev Emitted when a new tender is created
     */
    event TenderCreated(
        uint256 indexed tenderId,
        bytes32 descriptionHash,
        uint256 maxBudget,
        uint256 submissionDeadline,
        uint256 revealDeadline,
        uint256 totalMilestones
    );
    
    /**
     * @dev Emitted when a bidder is registered
     */
    event BidderRegistered(
        address indexed bidder,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when a bid is submitted (commit phase)
     */
    event BidSubmitted(
        uint256 indexed tenderId,
        address indexed bidder,
        bytes32 commitHash,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when a bid is revealed
     */
    event BidRevealed(
        uint256 indexed tenderId,
        address indexed bidder,
        uint256 amount,
        bool isValid,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when a winner is selected
     */
    event WinnerSelected(
        uint256 indexed tenderId,
        address indexed winner,
        uint256 winningBid,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when a tender is funded
     */
    event TenderFunded(
        uint256 indexed tenderId,
        uint256 amount,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when a milestone is approved
     */
    event MilestoneApproved(
        uint256 indexed tenderId,
        uint256 indexed milestoneId,
        address approvedBy,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when a milestone payment is released
     */
    event PaymentReleased(
        uint256 indexed tenderId,
        uint256 indexed milestoneId,
        address recipient,
        uint256 amount,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when auditor is changed
     */
    event AuditorChanged(
        address indexed oldAuditor,
        address indexed newAuditor,
        uint256 timestamp
    );
    
    // ============================================
    // MODIFIERS
    // ============================================
    
    /**
     * @dev Restricts function access to registered bidders only
     */
    modifier onlyRegisteredBidder() {
        require(registeredBidders[msg.sender], "Not a registered bidder");
        _;
    }
    
    /**
     * @dev Restricts function access to the auditor only
     */
    modifier onlyAuditor() {
        require(msg.sender == auditor, "Only auditor can call this");
        _;
    }
    
    /**
     * @dev Ensures the current block timestamp is before the specified deadline
     * @param deadline Unix timestamp deadline
     */
    modifier onlyBeforeDeadline(uint256 deadline) {
        require(block.timestamp < deadline, "Deadline has passed");
        _;
    }
    
    /**
     * @dev Ensures the current block timestamp is after the specified deadline
     * @param deadline Unix timestamp deadline
     */
    modifier onlyAfterDeadline(uint256 deadline) {
        require(block.timestamp >= deadline, "Deadline not reached yet");
        _;
    }
    
    /**
     * @dev Ensures tender is in the specified phase
     * @param tenderId The tender ID to check
     * @param expectedPhase The required phase
     */
    modifier inPhase(uint256 tenderId, TenderPhase expectedPhase) {
        require(tenders[tenderId].phase == expectedPhase, "Invalid phase for this operation");
        _;
    }
    
    /**
     * @dev Ensures tender exists and is active
     * @param tenderId The tender ID to check
     */
    modifier tenderExists(uint256 tenderId) {
        require(tenders[tenderId].isActive, "Tender does not exist or is inactive");
        _;
    }
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    /**
     * @dev Initializes the contract with the deployer as owner
     * @param _auditor Address of the initial auditor
     * @notice Uses Ownable(msg.sender) to set the initial owner
     */
    constructor(address _auditor) Ownable(msg.sender) {
        require(_auditor != address(0), "Invalid auditor address");
        auditor = _auditor;
        tenderCounter = 0;
    }
    
    // ============================================
    // TENDER MANAGEMENT FUNCTIONS
    // ============================================
    
    /**
     * @dev Creates a new tender
     * @param descriptionHash Hash of the tender description (IPFS/SHA256)
     * @param maxBudget Maximum acceptable bid amount in wei
     * @param submissionDeadline Unix timestamp for bid submission deadline
     * @param revealDeadline Unix timestamp for bid reveal deadline
     * @param totalMilestones Number of payment milestones
     * @param milestoneAmounts Array of payment amounts for each milestone
     * @return tenderId The ID of the created tender
     * 
     * @notice Only contract owner can create tenders (uses OpenZeppelin's onlyOwner)
     * @notice Contract must not be paused (uses OpenZeppelin's whenNotPaused)
     */
    function createTender(
        bytes32 descriptionHash,
        uint256 maxBudget,
        uint256 submissionDeadline,
        uint256 revealDeadline,
        uint256 totalMilestones,
        uint256[] memory milestoneAmounts
    ) external onlyOwner whenNotPaused returns (uint256 tenderId) {
        // Input validation
        require(descriptionHash != bytes32(0), "Invalid description hash");
        require(maxBudget > 0, "Budget must be greater than zero");
        require(submissionDeadline > block.timestamp, "Submission deadline must be in future");
        require(revealDeadline > submissionDeadline, "Reveal deadline must be after submission deadline");
        require(totalMilestones > 0, "Must have at least one milestone");
        require(milestoneAmounts.length == totalMilestones, "Milestone amounts mismatch");
        
        // Verify sum of milestones doesn't exceed max budget
        uint256 totalMilestoneAmount = 0;
        for (uint256 i = 0; i < totalMilestones; i++) {
            require(milestoneAmounts[i] > 0, "Milestone amount must be greater than zero");
            totalMilestoneAmount += milestoneAmounts[i];
        }
        require(totalMilestoneAmount <= maxBudget, "Total milestone amount exceeds max budget");
        
        // Create tender
        tenderId = tenderCounter++;
        
        Tender storage tender = tenders[tenderId];
        tender.id = tenderId;
        tender.descriptionHash = descriptionHash;
        tender.maxBudget = maxBudget;
        tender.submissionDeadline = submissionDeadline;
        tender.revealDeadline = revealDeadline;
        tender.phase = TenderPhase.BID_SUBMISSION;
        tender.totalMilestones = totalMilestones;
        tender.completedMilestones = 0;
        tender.fundedAmount = 0;
        tender.isActive = true;
        
        // Create milestones
        for (uint256 i = 0; i < totalMilestones; i++) {
            Milestone storage milestone = milestones[tenderId][i];
            milestone.id = i;
            milestone.amount = milestoneAmounts[i];
            milestone.isApproved = false;
            milestone.isPaid = false;
        }
        
        // Emit event
        emit TenderCreated(
            tenderId,
            descriptionHash,
            maxBudget,
            submissionDeadline,
            revealDeadline,
            totalMilestones
        );
        
        return tenderId;
    }
    
    /**
     * @dev Retrieves complete details of a tender
     * @param tenderId The tender ID to query
     * @return Tender struct containing all tender information
     */
    function getTenderDetails(uint256 tenderId) external view tenderExists(tenderId) returns (Tender memory) {
        return tenders[tenderId];
    }
    
    /**
     * @dev Funds a tender with ETH to cover milestone payments
     * @param tenderId The tender ID to fund
     * @notice Anyone can fund a tender, but typically done by contract owner
     */
    function fundTender(uint256 tenderId) external payable tenderExists(tenderId) whenNotPaused {
        require(msg.value > 0, "Must send ETH to fund tender");
        
        tenders[tenderId].fundedAmount += msg.value;
        
        emit TenderFunded(tenderId, msg.value, block.timestamp);
    }
    
    // ============================================
    // BIDDER MANAGEMENT FUNCTIONS
    // ============================================
    
    /**
     * @dev Registers a new bidder
     * @param bidder Address of the bidder to register
     * @notice Only owner can register bidders (centralized for academic purposes)
     */
    function registerBidder(address bidder) external onlyOwner whenNotPaused {
        require(bidder != address(0), "Invalid bidder address");
        require(!registeredBidders[bidder], "Bidder already registered");
        
        registeredBidders[bidder] = true;
        
        emit BidderRegistered(bidder, block.timestamp);
    }
    
    /**
     * @dev Checks if an address is a registered bidder
     * @param bidder Address to check
     * @return bool True if registered, false otherwise
     */
    function isRegisteredBidder(address bidder) external view returns (bool) {
        return registeredBidders[bidder];
    }
    
    // ============================================
    // BIDDING PROCESS FUNCTIONS (COMMIT-REVEAL)
    // ============================================
    
    /**
     * @dev Submits a bid commitment (hash only) - Phase 1 of commit-reveal
     * @param tenderId The tender to bid on
     * @param bidHash Hash of keccak256(abi.encodePacked(bidAmount, nonce))
     * 
     * @notice Uses commit-reveal pattern to prevent front-running
     * @notice Bidder must be registered and deadline must not be passed
     * 
     * WHY COMMIT-REVEAL?
     * Without this pattern, bid amounts would be visible in the mempool,
     * allowing attackers to front-run by submitting a slightly lower bid
     * with higher gas price before the original transaction is mined.
     */
    function submitBid(uint256 tenderId, bytes32 bidHash)
        external
        onlyRegisteredBidder
        tenderExists(tenderId)
        inPhase(tenderId, TenderPhase.BID_SUBMISSION)
        onlyBeforeDeadline(tenders[tenderId].submissionDeadline)
        whenNotPaused
    {
        require(bidHash != bytes32(0), "Invalid bid hash");
        require(bids[tenderId][msg.sender].commitHash == bytes32(0), "Bid already submitted");
        
        // Store the commitment
        bids[tenderId][msg.sender].commitHash = bidHash;
        
        // Track this bidder for iteration during winner selection
        tenderBidders[tenderId].push(msg.sender);
        
        emit BidSubmitted(tenderId, msg.sender, bidHash, block.timestamp);
    }
    
    /**
     * @dev Reveals a previously committed bid - Phase 2 of commit-reveal
     * @param tenderId The tender ID
     * @param bidAmount The actual bid amount (must match commitment)
     * @param nonce Random string used during commitment (for hash verification)
     * 
     * @notice Automatically transitions tender to REVEAL phase if deadline passed
     * @notice Validates that hash(bidAmount, nonce) matches original commitment
     * 
     * VULNERABILITY #1: LATE REVEAL ALLOWED WITHOUT PENALTY
     * Currently, bidders can reveal after the reveal deadline without any penalty.
     * This allows strategic late reveals where bidders wait to see others' bids
     * before deciding whether to reveal their own.
     * 
     * PROPER IMPLEMENTATION SHOULD:
     * - Reject reveals after deadline, OR
     * - Mark late reveals as invalid, OR
     * - Apply financial penalty for late reveals
     */
    function revealBid(uint256 tenderId, uint256 bidAmount, string memory nonce)
        external
        onlyRegisteredBidder
        tenderExists(tenderId)
        whenNotPaused
    {
        // Auto-transition to reveal phase if submission deadline passed
        if (block.timestamp >= tenders[tenderId].submissionDeadline && 
            tenders[tenderId].phase == TenderPhase.BID_SUBMISSION) {
            tenders[tenderId].phase = TenderPhase.BID_REVEAL;
        }
        
        require(tenders[tenderId].phase == TenderPhase.BID_REVEAL, "Not in reveal phase");
        
        Bid storage bid = bids[tenderId][msg.sender];
        require(bid.commitHash != bytes32(0), "No bid commitment found");
        require(!bid.isRevealed, "Bid already revealed");
        
        // VULNERABILITY #1: Missing deadline check - allows late reveals
        // SHOULD HAVE: require(block.timestamp < tenders[tenderId].revealDeadline, "Reveal deadline passed");
        
        // Verify the commitment
        bytes32 computedHash = keccak256(abi.encodePacked(bidAmount, nonce));
        require(computedHash == bid.commitHash, "Invalid reveal - hash mismatch");
        
        // Store revealed amount
        bid.revealedAmount = bidAmount;
        bid.isRevealed = true;
        bid.revealTimestamp = block.timestamp;
        
        // Validate bid (must be within budget)
        if (bidAmount <= tenders[tenderId].maxBudget && bidAmount > 0) {
            bid.isValid = true;
        } else {
            bid.isValid = false;
        }
        
        emit BidRevealed(tenderId, msg.sender, bidAmount, bid.isValid, block.timestamp);
    }
    
    /**
     * @dev Selects the winner based on lowest valid bid
     * @param tenderId The tender ID
     * 
     * @notice Can be called by anyone after reveal deadline
     * @notice Automatically transitions to WINNER_SELECTION then PAYMENT_PENDING phase
     * 
     * VULNERABILITY #2: UNBOUNDED LOOP - DENIAL OF SERVICE
     * The loop iterates through ALL bidders without gas limit checks.
     * An attacker could register many fake bidders and submit bids,
     * causing this function to run out of gas and fail permanently.
     * 
     * PROPER IMPLEMENTATION SHOULD:
     * - Limit maximum number of bidders per tender, OR
     * - Use pull-over-push pattern where bidders query if they won, OR
     * - Batch processing across multiple transactions, OR
     * - Use off-chain computation with on-chain verification
     */
    function selectWinner(uint256 tenderId)
        external
        tenderExists(tenderId)
        onlyAfterDeadline(tenders[tenderId].revealDeadline)
        whenNotPaused
    {
        Tender storage tender = tenders[tenderId];
        
        // Auto-transition phase if needed
        if (tender.phase == TenderPhase.BID_SUBMISSION || tender.phase == TenderPhase.BID_REVEAL) {
            tender.phase = TenderPhase.WINNER_SELECTION;
        }
        
        require(tender.phase == TenderPhase.WINNER_SELECTION, "Winner already selected");
        require(tender.winner == address(0), "Winner already determined");
        
        uint256 lowestBid = type(uint256).max;
        address winner = address(0);
        
        // VULNERABILITY #2: Unbounded loop - DoS risk
        // Iterate through all bidders to find lowest valid bid
        address[] memory bidders = tenderBidders[tenderId];
        for (uint256 i = 0; i < bidders.length; i++) {
            address bidder = bidders[i];
            Bid storage bid = bids[tenderId][bidder];
            
            // Only consider revealed and valid bids
            if (bid.isRevealed && bid.isValid && bid.revealedAmount < lowestBid) {
                lowestBid = bid.revealedAmount;
                winner = bidder;
            }
        }
        
        require(winner != address(0), "No valid bids found");
        
        // Update tender with winner
        tender.winner = winner;
        tender.winningBid = lowestBid;
        tender.phase = TenderPhase.PAYMENT_PENDING;
        
        emit WinnerSelected(tenderId, winner, lowestBid, block.timestamp);
    }
    
    // ============================================
    // PAYMENT PROCESS FUNCTIONS
    // ============================================
    
    /**
     * @dev Approves a milestone for payment
     * @param tenderId The tender ID
     * @param milestoneId The milestone index to approve
     * 
     * @notice Only auditor can approve milestones (uses custom onlyAuditor modifier)
     * @notice Demonstrates role-based access control beyond basic ownership
     */
    function approveMilestone(uint256 tenderId, uint256 milestoneId)
        external
        onlyAuditor
        tenderExists(tenderId)
        inPhase(tenderId, TenderPhase.PAYMENT_PENDING)
        whenNotPaused
    {
        require(milestoneId < tenders[tenderId].totalMilestones, "Invalid milestone ID");
        
        Milestone storage milestone = milestones[tenderId][milestoneId];
        require(!milestone.isApproved, "Milestone already approved");
        require(!milestone.isPaid, "Milestone already paid");
        
        milestone.isApproved = true;
        milestone.approvedBy = msg.sender;
        milestone.approvalTimestamp = block.timestamp;
        
        emit MilestoneApproved(tenderId, milestoneId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Releases payment for an approved milestone
     * @param tenderId The tender ID
     * @param milestoneId The milestone index to pay
     * 
     * @notice Uses OpenZeppelin's ReentrancyGuard to prevent reentrancy attacks
     * @notice Follows checks-effects-interactions pattern
     * 
     * WHY REENTRANCY GUARD?
     * External calls (transfer ETH) can trigger fallback functions in recipient contracts.
     * Malicious recipients could re-enter this function before state is updated,
     * draining funds by claiming the same payment multiple times.
     * 
     * OpenZeppelin's nonReentrant modifier uses a mutex lock that prevents
     * the function from being called again until the first call completes.
     */
    function releaseMilestonePayment(uint256 tenderId, uint256 milestoneId)
        external
        onlyOwner
        tenderExists(tenderId)
        inPhase(tenderId, TenderPhase.PAYMENT_PENDING)
        nonReentrant  // ✅ PROPER USE: OpenZeppelin ReentrancyGuard protects payment
        whenNotPaused
    {
        require(milestoneId < tenders[tenderId].totalMilestones, "Invalid milestone ID");
        
        Tender storage tender = tenders[tenderId];
        Milestone storage milestone = milestones[tenderId][milestoneId];
        
        require(milestone.isApproved, "Milestone not approved yet");
        require(!milestone.isPaid, "Milestone already paid");
        require(tender.fundedAmount >= milestone.amount, "Insufficient funds in tender");
        
        // CHECKS-EFFECTS-INTERACTIONS PATTERN
        
        // EFFECTS: Update state BEFORE external call
        milestone.isPaid = true;
        milestone.paymentTimestamp = block.timestamp;
        tender.completedMilestones++;
        tender.fundedAmount -= milestone.amount;
        
        // Check if all milestones completed
        if (tender.completedMilestones == tender.totalMilestones) {
            tender.phase = TenderPhase.COMPLETED;
        }
        
        // INTERACTIONS: External call AFTER state updates
        // Transfer payment to winner
        (bool success, ) = tender.winner.call{value: milestone.amount}("");
        require(success, "Payment transfer failed");
        
        emit PaymentReleased(
            tenderId,
            milestoneId,
            tender.winner,
            milestone.amount,
            block.timestamp
        );
    }
    
    /**
     * @dev Emergency withdrawal function for stuck funds
     * @param tenderId The tender ID
     * 
     * VULNERABILITY #3: MISSING REENTRANCY GUARD - REENTRANCY ATTACK POSSIBLE
     * This function transfers ETH but does NOT use nonReentrant modifier.
     * Although it follows checks-effects-interactions pattern, it's still vulnerable
     * if the state updates are not sufficient or if there are complex interactions.
     * 
     * PROPER IMPLEMENTATION SHOULD:
     * - Add nonReentrant modifier (use OpenZeppelin's protection), OR
     * - Use pull-over-push pattern where winner withdraws instead of contract sending
     * 
     * This demonstrates what happens when you DON'T use OpenZeppelin protections
     * even though they're available in your inherited contracts.
     */
    function emergencyWithdraw(uint256 tenderId) 
        external 
        onlyOwner 
        tenderExists(tenderId)
        // VULNERABILITY #3: Missing nonReentrant modifier here!
        // SHOULD HAVE: nonReentrant
    {
        Tender storage tender = tenders[tenderId];
        require(tender.fundedAmount > 0, "No funds to withdraw");
        require(tender.phase == TenderPhase.COMPLETED || block.timestamp > tender.revealDeadline + 30 days, 
                "Cannot withdraw - tender still active");
        
        uint256 amount = tender.fundedAmount;
        
        // EFFECTS: Update state
        tender.fundedAmount = 0;
        
        // INTERACTIONS: External call - VULNERABLE to reentrancy
        (bool success, ) = owner().call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    // ============================================
    // ADMIN FUNCTIONS
    // ============================================
    
    /**
     * @dev Changes the auditor address
     * @param newAuditor Address of the new auditor
     * @notice Only owner can change auditor (demonstrates multi-role system)
     */
    function setAuditor(address newAuditor) external onlyOwner {
        require(newAuditor != address(0), "Invalid auditor address");
        require(newAuditor != auditor, "Same auditor address");
        
        address oldAuditor = auditor;
        auditor = newAuditor;
        
        emit AuditorChanged(oldAuditor, newAuditor, block.timestamp);
    }
    
    /**
     * @dev Pauses the contract - emergency stop
     * @notice Uses OpenZeppelin's Pausable functionality
     * @notice Only owner can pause (inherited from Pausable + Ownable)
     * 
     * WHY PAUSABLE?
     * If a critical vulnerability is discovered or there's an ongoing attack,
     * the owner can pause all state-changing functions to prevent further damage
     * while a fix is deployed or the situation is assessed.
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpauses the contract
     * @notice Only owner can unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ============================================
    // VIEW FUNCTIONS (QUERY HELPERS)
    // ============================================
    
    /**
     * @dev Gets the current phase of a tender
     * @param tenderId The tender ID
     * @return TenderPhase enum value
     */
    function getTenderPhase(uint256 tenderId) external view tenderExists(tenderId) returns (TenderPhase) {
        return tenders[tenderId].phase;
    }
    
    /**
     * @dev Gets bid details for a specific bidder on a tender
     * @param tenderId The tender ID
     * @param bidder The bidder address
     * @return Bid struct
     */
    function getBidDetails(uint256 tenderId, address bidder) 
        external 
        view 
        tenderExists(tenderId) 
        returns (Bid memory) 
    {
        return bids[tenderId][bidder];
    }
    
    /**
     * @dev Gets milestone details
     * @param tenderId The tender ID
     * @param milestoneId The milestone index
     * @return Milestone struct
     */
    function getMilestoneDetails(uint256 tenderId, uint256 milestoneId)
        external
        view
        tenderExists(tenderId)
        returns (Milestone memory)
    {
        require(milestoneId < tenders[tenderId].totalMilestones, "Invalid milestone ID");
        return milestones[tenderId][milestoneId];
    }
    
    /**
     * @dev Gets all bidders for a tender
     * @param tenderId The tender ID
     * @return Array of bidder addresses
     */
    function getTenderBidders(uint256 tenderId) 
        external 
        view 
        tenderExists(tenderId) 
        returns (address[] memory) 
    {
        return tenderBidders[tenderId];
    }
    
    /**
     * @dev Gets the number of bidders for a tender
     * @param tenderId The tender ID
     * @return Number of bidders
     */
    function getBidderCount(uint256 tenderId) external view tenderExists(tenderId) returns (uint256) {
        return tenderBidders[tenderId].length;
    }
    
    /**
     * @dev Gets contract balance
     * @return Balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // ============================================
    // RECEIVE & FALLBACK
    // ============================================
    
    /**
     * @dev Allows contract to receive ETH directly
     * @notice ETH sent directly will not be assigned to any tender
     */
    receive() external payable {}
    
    /**
     * @dev Fallback function
     */
    fallback() external payable {}
}


/**
 * ============================================
 * SUMMARY OF OPENZEPPELIN USAGE
 * ============================================
 * 
 * 1. OWNABLE (from @openzeppelin/contracts/access/Ownable.sol)
 *    - Provides onlyOwner modifier for access control
 *    - Used for: createTender, registerBidder, setAuditor, pause/unpause
 *    - Gas overhead: ~30k deployment, ~300 gas per call
 *    - Why: Battle-tested, prevents ownership bugs, industry standard
 * 
 * 2. REENTRANCY GUARD (from @openzeppelin/contracts/security/ReentrancyGuard.sol)
 *    - Provides nonReentrant modifier using mutex lock pattern
 *    - Used for: releaseMilestonePayment (PROPER USAGE)
 *    - NOT used for: emergencyWithdraw (INTENTIONAL VULNERABILITY)
 *    - Gas overhead: ~2.5k gas per protected function
 *    - Why: Prevents DAO-hack style attacks on payment functions
 * 
 * 3. PAUSABLE (from @openzeppelin/contracts/security/Pausable.sol)
 *    - Provides whenNotPaused modifier and pause/unpause functions
 *    - Used for: All critical state-changing functions
 *    - Gas overhead: ~300 gas per call
 *    - Why: Emergency stop mechanism for security incidents
 * 
 * ============================================
 * INTENTIONAL VULNERABILITIES SUMMARY
 * ============================================
 * 
 * VULNERABILITY #1: Late Reveal Without Penalty (Line ~340)
 *    Location: revealBid() function
 *    Issue: Missing deadline check allows reveals after reveal deadline
 *    Impact: Bidders can strategically wait to see others' bids before revealing
 *    Fix: Add require(block.timestamp < revealDeadline) check
 * 
 * VULNERABILITY #2: Unbounded Loop DoS (Line ~385)
 *    Location: selectWinner() function
 *    Issue: Loops through all bidders without gas limit protection
 *    Impact: Too many bidders causes out-of-gas, preventing winner selection
 *    Fix: Limit max bidders, use pull pattern, or batch processing
 * 
 * VULNERABILITY #3: Missing Reentrancy Guard (Line ~510)
 *    Location: emergencyWithdraw() function
 *    Issue: External ETH transfer without nonReentrant modifier
 *    Impact: Potential reentrancy attack if owner is a malicious contract
 *    Fix: Add nonReentrant modifier (already inherited from ReentrancyGuard)
 * 
 * These vulnerabilities demonstrate:
 * - What happens when you DON'T use available OpenZeppelin protections
 * - Common smart contract security pitfalls
 * - Importance of deadline enforcement, loop limits, and reentrancy guards
 * 
 * Next phase: Identify, explain, and fix these vulnerabilities
 * ============================================
 */
