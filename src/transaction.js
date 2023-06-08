const BigNumber = require("bignumber.js");
const { toNano } = require("./utils");
const { Address } = require("everscale-inpage-provider");
const accountFactoryAbi = require("./abi/RetailAccountFactory.abi.json");
const managerCollectionAbi = require("./abi/ManagerCollection.abi.json");
const managerNftBaseAbi = require("./abi/ManagerNftBase.abi.json");
const {
  ACCOUNT_FACTORY_ADDRESS,
  MANAGER_COLLECTION_ADDRESS,
  MANAGER_ADDRESS,
} = require("./constants");

async function prepareTransaction(ever, userAddress) {
  const accountFactoryAddress = new Address(ACCOUNT_FACTORY_ADDRESS);
  const managerCollectionAddress = new Address(MANAGER_COLLECTION_ADDRESS);

  const accountFactory = new ever.Contract(
    accountFactoryAbi,
    accountFactoryAddress
  );
  const managerCollection = new ever.Contract(
    managerCollectionAbi,
    managerCollectionAddress
  );
  const retailAccountAddress = await accountFactory.methods
    .retailAccountAddress({ pubkey: null, owner: userAddress, answerId: 2 })
    .call();
  const accountFactoryCallData = await accountFactory.methods
    .deployRetailAccount({ pubkey: null, owner: userAddress })
    .encodeInternal();
  const managerCollectionCallData = await managerCollection.methods
    .callAsAnyManager({
      owner: managerCollectionAddress,
      dest: accountFactoryAddress,
      value: toNano(1),
      bounce: false,
      flags: 0,
      payload: accountFactoryCallData,
    })
    .encodeInternal();
  const managerAddressDetails = MANAGER_ADDRESS.toString().split(":");

  const { nft: nftAddress } = await managerCollection.methods
    .nftAddress({
      id: new BigNumber(managerAddressDetails[1], 16).toString(),
      answerId: 0,
    })
    .call();

  const managerNFTInstance = new ever.Contract(managerNftBaseAbi, nftAddress);

  const preparedTransaction = await managerNFTInstance.methods.sendTransaction({
    dest: managerCollectionAddress,
    value: toNano(2),
    bounce: false,
    flags: 0,
    payload: managerCollectionCallData,
  });

  return { retailAccountAddress, preparedTransaction };
}

module.exports = prepareTransaction;
