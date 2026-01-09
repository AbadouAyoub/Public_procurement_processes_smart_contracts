const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("ProcurementSystem - Functional Tests", function () {
  let procurementSystem;
  let owner, auditor, bidder1, bidder2, bidder3, unauthorized;
  let tenderId;

  // Helper function to create bid hash
  function createBidHash(amount, nonce) {
    return ethers.keccak256(
      ethers.solidityPacked(["uint256", "string"], [amount, nonce])
    );
  }

  beforeEach(async function () {
    // Get signers
    [owner, auditor, bidder1, bidder2, bidder3, unauthorized] =
      await ethers.getSigners();

    // Deploy contract
    const ProcurementSystem = await ethers.getContractFactory(
      "ProcurementSystem"
    );
    procurementSystem = await ProcurementSystem.deploy(auditor.address);
    await procurementSystem.waitForDeployment();

    console.log("Contract deployed to:", await procurementSystem.getAddress());
    console.log("Owner:", owner.address);
    console.log("Auditor:", auditor.address);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await procurementSystem.owner()).to.equal(owner.address);
    });

    it("Should set the correct auditor", async function () {
      expect(await procurementSystem.auditor()).to.equal(auditor.address);
    });

    it("Should initialize tender counter to 0", async function () {
      expect(await procurementSystem.tenderCounter()).to.equal(0);
    });

    it("Should not be paused initially", async function () {
      expect(await procurementSystem.paused()).to.equal(false);
    });
  });

  describe("Tender Creation", function () {
    it("Should allow owner to create a tender", async function () {
      const descriptionHash = ethers.keccak256(
        ethers.toUtf8Bytes("Tender for road construction")
      );
      const maxBudget = ethers.parseEther("12");
      const submissionDeadline = (await time.latest()) + 86400 * 2; // +2 days
      const revealDeadline = submissionDeadline + 86400; // +1 day
      const totalMilestones = 2;
      const milestoneAmounts = [ethers.parseEther("6"), ethers.parseEther("6")];

      await expect(
        procurementSystem.createTender(
          descriptionHash,
          maxBudget,
          submissionDeadline,
          revealDeadline,
          totalMilestones,
          milestoneAmounts
        )
      )
        .to.emit(procurementSystem, "TenderCreated")
        .withArgs(
          0,
          descriptionHash,
          maxBudget,
          submissionDeadline,
          revealDeadline,
          totalMilestones
        );

      expect(await procurementSystem.tenderCounter()).to.equal(1);
    });

    it("Should reject tender creation from non-owner", async function () {
      const descriptionHash = ethers.keccak256(
        ethers.toUtf8Bytes("Test tender")
      );
      const maxBudget = ethers.parseEther("10");
      const submissionDeadline = (await time.latest()) + 86400;
      const revealDeadline = submissionDeadline + 86400;
      const milestoneAmounts = [ethers.parseEther("5"), ethers.parseEther("5")];

      await expect(
        procurementSystem
          .connect(unauthorized)
          .createTender(
            descriptionHash,
            maxBudget,
            submissionDeadline,
            revealDeadline,
            2,
            milestoneAmounts
          )
      ).to.be.revertedWithCustomError(
        procurementSystem,
        "OwnableUnauthorizedAccount"
      );
    });

    it("Should reject invalid deadline ordering", async function () {
      const descriptionHash = ethers.keccak256(
        ethers.toUtf8Bytes("Test tender")
      );
      const maxBudget = ethers.parseEther("10");
      const currentTime = await time.latest();
      const submissionDeadline = currentTime + 86400;
      const revealDeadline = currentTime + 3600; // Before submission deadline - INVALID
      const milestoneAmounts = [ethers.parseEther("5"), ethers.parseEther("5")];

      await expect(
        procurementSystem.createTender(
          descriptionHash,
          maxBudget,
          submissionDeadline,
          revealDeadline,
          2,
          milestoneAmounts
        )
      ).to.be.revertedWith("Reveal deadline must be after submission deadline");
    });

    it("Should reject milestone amounts exceeding budget", async function () {
      const descriptionHash = ethers.keccak256(
        ethers.toUtf8Bytes("Test tender")
      );
      const maxBudget = ethers.parseEther("10");
      const submissionDeadline = (await time.latest()) + 86400;
      const revealDeadline = submissionDeadline + 86400;
      const milestoneAmounts = [ethers.parseEther("7"), ethers.parseEther("7")]; // Total: 14 > 10

      await expect(
        procurementSystem.createTender(
          descriptionHash,
          maxBudget,
          submissionDeadline,
          revealDeadline,
          2,
          milestoneAmounts
        )
      ).to.be.revertedWith("Total milestone amount exceeds max budget");
    });
  });

  describe("Bidder Registration", function () {
    it("Should allow owner to register bidders", async function () {
      await expect(procurementSystem.registerBidder(bidder1.address))
        .to.emit(procurementSystem, "BidderRegistered")
        .withArgs(bidder1.address, (await time.latest()) + 1);

      expect(
        await procurementSystem.registeredBidders(bidder1.address)
      ).to.equal(true);
    });

    it("Should reject duplicate registration", async function () {
      await procurementSystem.registerBidder(bidder1.address);

      await expect(
        procurementSystem.registerBidder(bidder1.address)
      ).to.be.revertedWith("Bidder already registered");
    });

    it("Should reject zero address", async function () {
      await expect(
        procurementSystem.registerBidder(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid bidder address");
    });

    it("Should reject registration from non-owner", async function () {
      await expect(
        procurementSystem.connect(unauthorized).registerBidder(bidder1.address)
      ).to.be.revertedWithCustomError(
        procurementSystem,
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Bid Submission (Commit Phase)", function () {
    beforeEach(async function () {
      // Create a tender
      const descriptionHash = ethers.keccak256(
        ethers.toUtf8Bytes("Test tender")
      );
      const maxBudget = ethers.parseEther("12");
      const submissionDeadline = (await time.latest()) + 86400 * 2;
      const revealDeadline = submissionDeadline + 86400;
      const milestoneAmounts = [ethers.parseEther("6"), ethers.parseEther("6")];

      await procurementSystem.createTender(
        descriptionHash,
        maxBudget,
        submissionDeadline,
        revealDeadline,
        2,
        milestoneAmounts
      );

      tenderId = 0;

      // Register bidders
      await procurementSystem.registerBidder(bidder1.address);
      await procurementSystem.registerBidder(bidder2.address);
      await procurementSystem.registerBidder(bidder3.address);
    });

    it("Should allow registered bidder to submit bid", async function () {
      const bidAmount = ethers.parseEther("10");
      const nonce = "secret-nonce-123";
      const bidHash = createBidHash(bidAmount, nonce);

      await expect(
        procurementSystem.connect(bidder1).submitBid(tenderId, bidHash)
      )
        .to.emit(procurementSystem, "BidSubmitted")
        .withArgs(
          tenderId,
          bidder1.address,
          bidHash,
          (await time.latest()) + 1
        );

      const bid = await procurementSystem.getBidDetails(
        tenderId,
        bidder1.address
      );
      expect(bid.commitHash).to.equal(bidHash);
    });

    it("Should reject bid from unregistered bidder", async function () {
      const bidHash = createBidHash(ethers.parseEther("10"), "nonce");

      await expect(
        procurementSystem.connect(unauthorized).submitBid(tenderId, bidHash)
      ).to.be.revertedWith("Not a registered bidder");
    });

    it("Should reject duplicate bid submission", async function () {
      const bidHash = createBidHash(ethers.parseEther("10"), "nonce");

      await procurementSystem.connect(bidder1).submitBid(tenderId, bidHash);

      await expect(
        procurementSystem.connect(bidder1).submitBid(tenderId, bidHash)
      ).to.be.revertedWith("Bid already submitted");
    });

    it("Should reject bid after submission deadline", async function () {
      const tender = await procurementSystem.getTenderDetails(tenderId);

      // Fast forward past submission deadline
      await time.increaseTo(tender.submissionDeadline + 1n);

      const bidHash = createBidHash(ethers.parseEther("10"), "nonce");

      await expect(
        procurementSystem.connect(bidder1).submitBid(tenderId, bidHash)
      ).to.be.revertedWith("Deadline has passed");
    });
  });

  describe("Bid Reveal", function () {
    beforeEach(async function () {
      // Create tender and register bidders
      const descriptionHash = ethers.keccak256(
        ethers.toUtf8Bytes("Test tender")
      );
      const maxBudget = ethers.parseEther("12");
      const submissionDeadline = (await time.latest()) + 86400;
      const revealDeadline = submissionDeadline + 86400;
      const milestoneAmounts = [ethers.parseEther("6"), ethers.parseEther("6")];

      await procurementSystem.createTender(
        descriptionHash,
        maxBudget,
        submissionDeadline,
        revealDeadline,
        2,
        milestoneAmounts
      );

      tenderId = 0;

      await procurementSystem.registerBidder(bidder1.address);
      await procurementSystem.registerBidder(bidder2.address);
      await procurementSystem.registerBidder(bidder3.address);
    });

    it("Should allow valid bid reveal", async function () {
      const bidAmount = ethers.parseEther("10");
      const nonce = "secret-nonce-123";
      const bidHash = createBidHash(bidAmount, nonce);

      // Submit bid
      await procurementSystem.connect(bidder1).submitBid(tenderId, bidHash);

      // Fast forward past submission deadline
      const tender = await procurementSystem.getTenderDetails(tenderId);
      await time.increaseTo(tender.submissionDeadline + 1n);

      // Reveal bid
      await expect(
        procurementSystem.connect(bidder1).revealBid(tenderId, bidAmount, nonce)
      )
        .to.emit(procurementSystem, "BidRevealed")
        .withArgs(
          tenderId,
          bidder1.address,
          bidAmount,
          true,
          (await time.latest()) + 1
        );

      const bid = await procurementSystem.getBidDetails(
        tenderId,
        bidder1.address
      );
      expect(bid.isRevealed).to.equal(true);
      expect(bid.revealedAmount).to.equal(bidAmount);
      expect(bid.isValid).to.equal(true);
    });

    it("Should reject reveal with wrong nonce", async function () {
      const bidAmount = ethers.parseEther("10");
      const correctNonce = "correct-nonce";
      const wrongNonce = "wrong-nonce";
      const bidHash = createBidHash(bidAmount, correctNonce);

      await procurementSystem.connect(bidder1).submitBid(tenderId, bidHash);

      const tender = await procurementSystem.getTenderDetails(tenderId);
      await time.increaseTo(tender.submissionDeadline + 1n);

      await expect(
        procurementSystem
          .connect(bidder1)
          .revealBid(tenderId, bidAmount, wrongNonce)
      ).to.be.revertedWith("Invalid reveal - hash mismatch");
    });

    it("Should mark bid over budget as invalid", async function () {
      const bidAmount = ethers.parseEther("15"); // Over 12 ETH budget
      const nonce = "nonce";
      const bidHash = createBidHash(bidAmount, nonce);

      await procurementSystem.connect(bidder1).submitBid(tenderId, bidHash);

      const tender = await procurementSystem.getTenderDetails(tenderId);
      await time.increaseTo(tender.submissionDeadline + 1n);

      await procurementSystem
        .connect(bidder1)
        .revealBid(tenderId, bidAmount, nonce);

      const bid = await procurementSystem.getBidDetails(
        tenderId,
        bidder1.address
      );
      expect(bid.isValid).to.equal(false);
    });

    it("Should prevent double reveal", async function () {
      const bidAmount = ethers.parseEther("10");
      const nonce = "nonce";
      const bidHash = createBidHash(bidAmount, nonce);

      await procurementSystem.connect(bidder1).submitBid(tenderId, bidHash);

      const tender = await procurementSystem.getTenderDetails(tenderId);
      await time.increaseTo(tender.submissionDeadline + 1n);

      await procurementSystem
        .connect(bidder1)
        .revealBid(tenderId, bidAmount, nonce);

      await expect(
        procurementSystem.connect(bidder1).revealBid(tenderId, bidAmount, nonce)
      ).to.be.revertedWith("Bid already revealed");
    });
  });

  describe("Winner Selection", function () {
    beforeEach(async function () {
      // Setup tender
      const descriptionHash = ethers.keccak256(
        ethers.toUtf8Bytes("Test tender")
      );
      const maxBudget = ethers.parseEther("12");
      const submissionDeadline = (await time.latest()) + 86400;
      const revealDeadline = submissionDeadline + 86400;
      const milestoneAmounts = [ethers.parseEther("6"), ethers.parseEther("6")];

      await procurementSystem.createTender(
        descriptionHash,
        maxBudget,
        submissionDeadline,
        revealDeadline,
        2,
        milestoneAmounts
      );

      tenderId = 0;

      // Register and submit bids
      await procurementSystem.registerBidder(bidder1.address);
      await procurementSystem.registerBidder(bidder2.address);
      await procurementSystem.registerBidder(bidder3.address);

      // Bidder1: 10 ETH
      const hash1 = createBidHash(ethers.parseEther("10"), "nonce1");
      await procurementSystem.connect(bidder1).submitBid(tenderId, hash1);

      // Bidder2: 8 ETH (lowest)
      const hash2 = createBidHash(ethers.parseEther("8"), "nonce2");
      await procurementSystem.connect(bidder2).submitBid(tenderId, hash2);

      // Bidder3: 11 ETH
      const hash3 = createBidHash(ethers.parseEther("11"), "nonce3");
      await procurementSystem.connect(bidder3).submitBid(tenderId, hash3);

      // Fast forward to reveal phase
      const tender = await procurementSystem.getTenderDetails(tenderId);
      await time.increaseTo(tender.submissionDeadline + 1n);

      // Reveal all bids
      await procurementSystem
        .connect(bidder1)
        .revealBid(tenderId, ethers.parseEther("10"), "nonce1");
      await procurementSystem
        .connect(bidder2)
        .revealBid(tenderId, ethers.parseEther("8"), "nonce2");
      await procurementSystem
        .connect(bidder3)
        .revealBid(tenderId, ethers.parseEther("11"), "nonce3");
    });

    it("Should select lowest valid bid as winner", async function () {
      const tender = await procurementSystem.getTenderDetails(tenderId);
      await time.increaseTo(tender.revealDeadline + 1n);

      await expect(procurementSystem.selectWinner(tenderId))
        .to.emit(procurementSystem, "WinnerSelected")
        .withArgs(
          tenderId,
          bidder2.address,
          ethers.parseEther("8"),
          (await time.latest()) + 1
        );

      const updatedTender = await procurementSystem.getTenderDetails(tenderId);
      expect(updatedTender.winner).to.equal(bidder2.address);
      expect(updatedTender.winningBid).to.equal(ethers.parseEther("8"));
    });

    it("Should reject winner selection before reveal deadline", async function () {
      await expect(procurementSystem.selectWinner(tenderId)).to.be.revertedWith(
        "Deadline not reached yet"
      );
    });
  });

  describe("Pausable Functionality", function () {
    it("Should allow owner to pause contract", async function () {
      await procurementSystem.pause();
      expect(await procurementSystem.paused()).to.equal(true);
    });

    it("Should block tender creation when paused", async function () {
      await procurementSystem.pause();

      const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes("Test"));
      const maxBudget = ethers.parseEther("10");
      const submissionDeadline = (await time.latest()) + 86400;
      const revealDeadline = submissionDeadline + 86400;
      const milestoneAmounts = [ethers.parseEther("5"), ethers.parseEther("5")];

      await expect(
        procurementSystem.createTender(
          descriptionHash,
          maxBudget,
          submissionDeadline,
          revealDeadline,
          2,
          milestoneAmounts
        )
      ).to.be.revertedWithCustomError(procurementSystem, "EnforcedPause");
    });

    it("Should allow unpause and resume functionality", async function () {
      await procurementSystem.pause();
      await procurementSystem.unpause();

      expect(await procurementSystem.paused()).to.equal(false);
    });
  });
});
