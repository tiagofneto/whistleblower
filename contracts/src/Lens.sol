// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./interfaces/ILensHub.sol";
import "./Pool.sol";

contract Lens {
  address constant HUB = 0x7582177F9E536aB0b6c721e11f383C326F2Ad1D5;
  address constant COLLECT_MODULE = 0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c;
  address constant PROFILE_CREATOR = 0x4fe8deB1cf6068060dE50aA584C3adf00fbDB87f;


  Pool pool;

  constructor(address _pool) {
    pool = Pool(_pool);
    //TODO create lens profile for the contract
    pool.setLensInteractor(address(this));
  }


  function verifyAndPost(string memory word) external {
    //1. Verify hash
    pool.verifyAndRemoveWord(word);

    //2. Post on lens
    ILensHub.PostData memory data = ILensHub.PostData({
      //TODO get profile id from current contract profile
      profileId: 0,
      contentURI: "Lorem ipsum",
      collectModule: COLLECT_MODULE,
      collectModuleInitData: "",
      referenceModule: address(0),
      referenceModuleInitData: ""
    });

    ILensHub hub = ILensHub(HUB);
    hub.post(data);

    //3. Reward the relayer
    pool.rewardRelayer(msg.sender);
  }
}
