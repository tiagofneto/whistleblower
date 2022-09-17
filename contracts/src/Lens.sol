// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Pool.sol";

contract Lens {
  address constant HUB = 0x7582177F9E536aB0b6c721e11f383C326F2Ad1D5;

  Pool pool;

  constructor(address _pool) {
    pool = Pool(_pool);
    //TODO create lens profile for the contract
    //TODO set the lensInteractor address on the pool
  }


  function verifyAndPost(string memory word) external {
    //1. Verify hash
    pool.verifyAndRemoveWord(word);
    //2. Post on lens
    //3. Reward the relayer
  }
}
