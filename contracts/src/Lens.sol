// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./interfaces/ILensHub.sol";
import "./interfaces/IMockProfileCreationProxy.sol";
import "./Pool.sol";

contract Lens {
  address constant HUB = 0x7582177F9E536aB0b6c721e11f383C326F2Ad1D5;
  address constant COLLECT_MODULE = 0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c;
  address constant PROFILE_CREATOR = 0x4fe8deB1cf6068060dE50aA584C3adf00fbDB87f;

  Pool pool;

  uint256 tokenId;

  constructor(address _pool) {
    //1. Set pool
    pool = Pool(_pool);

    //2. Create lens profile
    IMockProfileCreationProxy profileCreator = IMockProfileCreationProxy(PROFILE_CREATOR);

    IMockProfileCreationProxy.CreateProfileData memory vars = IMockProfileCreationProxy.CreateProfileData({
      to: address(this),
      handle: "testloremipsumtest",
      imageURI: "",
      followModule: address(0),
      followModuleInitData: "",
      followNFTURI: ""
    });

    profileCreator.proxyCreateProfile(vars);

    //3. Set lens interactor on pool
    pool.setLensInteractor(address(this));

    //4. Get lens token tokenId
    tokenId = ILensHub(HUB).tokenOfOwnerByIndex(address(this), 0);
  }


  function verifyAndPost(string memory word) external {
    //1. Verify hash
    pool.verifyAndRemoveWord(word);

    //2. Post on lens
    ILensHub.PostData memory data = ILensHub.PostData({
      profileId: tokenId,
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
