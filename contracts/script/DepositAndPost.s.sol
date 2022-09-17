// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import "../src/Pool.sol";
import "../src/Lens.sol";

contract DepositAndPostScript is Script {
    function run() public {
      vm.startBroadcast();
  
      // Script is deploying new contracts everytime for the sake of testing
      Pool pool = new Pool(10**16);
      Lens lens = new Lens(address(pool), "testhandle");

      pool.deposit{value: 10**16}(keccak256(abi.encodePacked("https://arweave.net/yjJB06jDjnuZFFMk2Rc77kSZEQE1Sa-1Ei78a08KQEs")));

      lens.verifyAndPost("https://arweave.net/yjJB06jDjnuZFFMk2Rc77kSZEQE1Sa-1Ei78a08KQEs");

      vm.stopBroadcast();
    }
}
