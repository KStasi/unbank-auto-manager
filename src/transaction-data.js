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

async function prepareCreateAccountData(ever, userAddress) {
  const accountFactoryAddress = new Address(ACCOUNT_FACTORY_ADDRESS);

  const accountFactory = new ever.Contract(
    accountFactoryAbi,
    accountFactoryAddress
  );

  const accountFactoryCallData = await accountFactory.methods
    .deployRetailAccount({ pubkey: null, owner: userAddress })
    .encodeInternal();

  return accountFactoryCallData;
}

async function getRetailAccountAddress(ever, userAddress) {
  const accountFactoryAddress = new Address(ACCOUNT_FACTORY_ADDRESS);

  const accountFactory = new ever.Contract(
    accountFactoryAbi,
    accountFactoryAddress
  );

  const retailAccountAddress = await accountFactory.methods
    .retailAccountAddress({ pubkey: null, owner: userAddress, answerId: 2 })
    .call();

  return retailAccountAddress.retailAccount;
}

async function prepareCreateCardData(
  ever,
  retailAccountAddress,
  cardTypeId,
  currencyAddress,
  otherCardDetails
) {
  const retailAccountInstance = new ever.Contract(
    retailAccountAbi,
    retailAccountAddress
  );

  const addCardCallData = await retailAccountInstance.methods
    .addCard({
      cardTypeId,
      currency: currencyAddress,
      cardType: cardTypeId,
      otherCardDetails,
    })
    .encodeInternal();

  return addCardCallData;
}

module.exports = {
  prepareCreateCardData,
  prepareCreateAccountData,
  getRetailAccountAddress,
};
