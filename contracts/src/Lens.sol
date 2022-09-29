// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./interfaces/ILensHub.sol";
import "./interfaces/IMockProfileCreationProxy.sol";
import "./Pool.sol";

contract Lens {
  address constant HUB = 0x60Ae865ee4C725cd04353b5AAb364553f56ceF82;
  address constant COLLECT_MODULE = 0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c;
  address constant PROFILE_CREATOR = 0x420f0257D43145bb002E69B14FF2Eb9630Fc4736;

  Pool pool;

  uint256 tokenId;

  constructor(address _pool, string memory handle) {
    //1. Set pool
    pool = Pool(_pool);

    //2. Create lens profile
    IMockProfileCreationProxy profileCreator = IMockProfileCreationProxy(PROFILE_CREATOR);

    IMockProfileCreationProxy.CreateProfileData memory vars = IMockProfileCreationProxy.CreateProfileData({
      to: address(this),
      handle: handle,
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


  function verifyAndPost(bytes calldata proof, string memory word, bytes32 root, bytes32 nullifierHash) external {
    //1. Verify hash
    pool.verify(proof, word, root, nullifierHash);

    //2. Post on lens
    ILensHub.PostData memory data = ILensHub.PostData({
      profileId: tokenId,
      contentURI: word,
      collectModule: COLLECT_MODULE,
      collectModuleInitData: abi.encode(false),
      referenceModule: address(0),
      referenceModuleInitData: ""
    });

    ILensHub hub = ILensHub(HUB);
    hub.post(data);

    //3. Reward the relayer
    pool.rewardRelayer(msg.sender);
  }
}
