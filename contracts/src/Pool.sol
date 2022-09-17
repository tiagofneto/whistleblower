// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Pool {
  uint256 immutable depositAmount;

  mapping(bytes32 => bool) private hashes;

  constructor(uint256 _depostiAmount) {
    depositAmount = _depostiAmount;
  }

  function deposit(bytes32 hash) external payable {
    require(msg.value == depositAmount, "Wrong deposit amount");
    require(!hashes[hash], "Hash already included");

    hashes[hash] = true;
  }

  function verifyAndRemoveWord(string memory word) external {  
    bytes32 hash = keccak256(abi.encodePacked(word));
    require(hashes[hash], "Word hash not found");

    hashes[hash] = false;
  }
}

