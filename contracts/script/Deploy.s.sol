// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import "../src/Pool.sol";
import "../src/Lens.sol";
import "../src/Verifier.sol";

contract DeployScript is Script {
    function run() public {
      vm.startBroadcast();

      Verifier verifier = new Verifier();

      Pool pool = new Pool(10**16, verifier);
    
      Lens lens = new Lens(address(pool), "testhandle");
      lens;

      vm.stopBroadcast();
    }
}
