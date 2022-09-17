// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import "../src/Pool.sol";
import "../src/Lens.sol";

contract DeployScript is Script {
    function run() public {
      vm.startBroadcast();

      Pool pool = new Pool(10**16);
    
      Lens lens = new Lens(address(pool));
      lens;

      vm.stopBroadcast();
    }
}
