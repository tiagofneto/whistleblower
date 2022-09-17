// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import "../src/Pool.sol";
import "../src/Lens.sol";

contract DepositAndPostScript is Script {
    function run() public {
      vm.startBroadcast();

      Pool pool = Pool(0xB708a2cbDEC4a140Ae815d0577434a80A21f0652);
      Lens lens = Lens(0x3BC9901355935eC273953a1f30Bc08Ecd06e1941);

      pool.deposit{value: 10**16}(keccak256(abi.encodePacked("hello")));

      lens.verifyAndPost("hello");

      vm.stopBroadcast();
    }
}
