// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./MerkleTreeWithHistory.sol";
import "./Verifier.sol";

contract Pool is MerkleTreeWithHistory {
  Verifier public immutable verifier;
  uint256 immutable depositAmount;

  mapping(bytes32 => bool) public commitments;
  mapping(bytes32 => bool) public nullifierHashes;

  address lensInteractor;

  constructor(uint256 _depostiAmount, Verifier _verifier) MerkleTreeWithHistory(20, IHasher(0x83584f83f26aF4eDDA9CBe8C730bc87C364b28fe)) {
    depositAmount = _depostiAmount;
    verifier = _verifier;
  }

  function deposit(bytes32 commitment) external payable {
    require(msg.value == depositAmount, "Wrong deposit amount");
    require(!commitments[commitment], "Hash already included");

    commitments[commitment] = true;
  }

  function verify(
    bytes calldata proof, 
    bytes32 root,
    bytes32 nullifierHash
  ) external {  
    require(msg.sender == lensInteractor, "No permission");
    require(!nullifierHashes[nullifierHash], "Already spent");
    require(isKnownRoot(root), "Invalid merkle root");

    verifier.verifyProof(proof, [uint256(root), uint256(nullifierHash)]);

    nullifierHashes[nullifierHash] = true;
  }

  function rewardRelayer(address relayer) external {
    require(msg.sender == lensInteractor, "No permission");

    (bool sent, bytes memory data) = relayer.call{value: depositAmount}("");
    require(sent, "Failed to send Ether");
    data;
  }

  function setLensInteractor(address _lensInteractor) external {
    require(lensInteractor == address(0));
    lensInteractor = _lensInteractor;
  }
}

