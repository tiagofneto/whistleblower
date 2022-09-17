// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/access/Ownable.sol";

contract Pool is Ownable {
  uint256 immutable depositAmount;

  mapping(bytes32 => bool) private hashes;

  address lensInteractor;

  constructor(uint256 _depostiAmount) {
    depositAmount = _depostiAmount;
  }

  function deposit(bytes32 hash) external payable {
    require(msg.value == depositAmount, "Wrong deposit amount");
    require(!hashes[hash], "Hash already included");

    hashes[hash] = true;
  }

  function verifyAndRemoveWord(string memory word) external {  
    require(msg.sender == lensInteractor, "No permission");

    bytes32 hash = keccak256(abi.encodePacked(word));
    require(hashes[hash], "Word hash not found");

    hashes[hash] = false;
  }

  function rewardRelayer(address relayer) external {
    require(msg.sender == lensInteractor, "No permission");

    (bool sent, bytes memory data) = relayer.call{value: depositAmount}("");
    require(sent, "Failed to send Ether");
    data;
  }

  function setLensInteractor(address _lensInteractor) external onlyOwner {
    lensInteractor = _lensInteractor;
  }
}

