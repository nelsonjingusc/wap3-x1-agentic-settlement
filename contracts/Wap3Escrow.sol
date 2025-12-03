// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title WAP3 Escrow for X1 EcoChain (PoC)
/// @notice Simple escrow with off-chain verification. Verifier marks task
///         success/failure and funds get released or refunded accordingly.
/// @dev    PoC only - not audited. Don't use in production.
contract Wap3Escrow {
    enum Status {
        None,
        Pending,
        Succeeded,
        Refunded,
        Cancelled
    }

    struct Deal {
        address payer;
        address payee;
        address verifier;
        uint256 amount;
        Status status;
        string proofUri; // e.g. Walrus / S3 / IPFS URI
        uint64 createdAt;
        uint64 verifiedAt;
    }

    uint256 public nextDealId;
    mapping(uint256 => Deal) public deals;

    event DealCreated(
        uint256 indexed dealId,
        address indexed payer,
        address indexed payee,
        address verifier,
        uint256 amount
    );

    event DealVerified(
        uint256 indexed dealId,
        bool success,
        string proofUri
    );

    event DealSettled(
        uint256 indexed dealId,
        Status finalStatus
    );

    error InvalidAmount();
    error InvalidAddress();
    error DealNotPending();
    error NotPayer();
    error NotVerifier();
    error AlreadyExists();
    error NothingToCancel();

    /// @notice Lock funds for a task. Verifier will later decide outcome.
    /// @param payee Gets paid if task succeeds.
    /// @param verifier Can verify and trigger settlement.
    function createDeal(
        address payee,
        address verifier
    ) external payable returns (uint256 dealId) {
        if (msg.value == 0) revert InvalidAmount();
        if (payee == address(0) || verifier == address(0)) {
            revert InvalidAddress();
        }

        dealId = ++nextDealId;

        if (deals[dealId].status != Status.None) {
            revert AlreadyExists();
        }

        deals[dealId] = Deal({
            payer: msg.sender,
            payee: payee,
            verifier: verifier,
            amount: msg.value,
            status: Status.Pending,
            proofUri: "",
            createdAt: uint64(block.timestamp),
            verifiedAt: 0
        });

        emit DealCreated(dealId, msg.sender, payee, verifier, msg.value);
    }

    /// @notice Verifier posts the result and triggers payout or refund.
    /// @param dealId Deal to settle.
    /// @param success True = pay payee, false = refund payer.
    /// @param proofUri Link to proof (Walrus/S3/IPFS).
    function verifyDeal(
        uint256 dealId,
        bool success,
        string calldata proofUri
    ) external {
        Deal storage d = deals[dealId];

        if (d.status != Status.Pending) revert DealNotPending();
        if (msg.sender != d.verifier) revert NotVerifier();

        d.proofUri = proofUri;
        d.verifiedAt = uint64(block.timestamp);

        if (success) {
            d.status = Status.Succeeded;
            (bool sent, ) = d.payee.call{value: d.amount}("");
            require(sent, "Transfer to payee failed");
        } else {
            d.status = Status.Refunded;
            (bool sent, ) = d.payer.call{value: d.amount}("");
            require(sent, "Refund to payer failed");
        }

        emit DealVerified(dealId, success, proofUri);
        emit DealSettled(dealId, d.status);
    }

    /// @notice Payer cancels deal before verification and gets refund.
    function cancelDeal(uint256 dealId) external {
        Deal storage d = deals[dealId];

        if (d.status != Status.Pending) revert NothingToCancel();
        if (msg.sender != d.payer) revert NotPayer();

        d.status = Status.Cancelled;
        (bool sent, ) = d.payer.call{value: d.amount}("");
        require(sent, "Refund on cancel failed");

        emit DealSettled(dealId, Status.Cancelled);
    }

    /// @notice Read-only helper for off-chain agents.
    function getDeal(uint256 dealId) external view returns (Deal memory) {
        return deals[dealId];
    }
}
