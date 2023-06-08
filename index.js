// Import the necessary modules
require("dotenv").config();
const BigNumber = require("bignumber.js");

const express = require("express");
const bodyParser = require("body-parser");
const { ProviderRpcClient, Address } = require("everscale-inpage-provider");
const {
  EverscaleStandaloneClient,
  EverWalletAccount,
} = require("everscale-standalone-client/nodejs");
const accountFactoryAbi = require("./abi/RetailAccountFactory.abi.json");
const managerCollectionAbi = require("./abi/ManagerCollection.abi.json");
const managerNftBaseAbi = require("./abi/ManagerNftBase.abi.json");
const {
  SimpleKeystore,
  SimpleAccountsStorage,
  Clock,
} = require("everscale-standalone-client/nodejs");
const {
  deriveBip39Phrase,
  //   KeyPair,
  makeBip39Path,
} = require("everscale-crypto");

const managerAddressDetails = process.env.MANAGER_ADDRESS.toString().split(":");
const managerSeedPhrase = process.env.MANAGER_SEED_PHRASE;
const managerAccountId = process.env.MANAGER_ACCOUNT_ID;
const managerAddress = new Address(process.env.MANAGER_ADDRESS);

BigNumber.config({ EXPONENTIAL_AT: 120 });

const toNano = (amount) => new BigNumber(amount).shiftedBy(9).toFixed(0);
const fromNano = (amount) => new BigNumber(amount).shiftedBy(-9).toString();
const PATH = "m/44'/396'/0'/0/INDEX";

async function generateKeys(amount) {
  return [...Array(amount).keys()].map((i) => {
    const path = PATH.replace("INDEX", `${i}`);
    return deriveBip39Phrase(managerSeedPhrase, path);
  });
}

const app = express();

app.use(bodyParser.json());

app.post("/create-account", async (req, res) => {
  const keys = await generateKeys(10);

  const keystore = new SimpleKeystore(
    [...keys].reduce(
      (acc, keyPair, idx) => ({
        ...acc,
        [idx]: keyPair,
      }),
      {}
    )
  );
  const accountsStorage = new SimpleAccountsStorage();
  const address = accountsStorage.addAccount(
    new EverWalletAccount(managerAddress)
  );
  console.log(address);

  const clock = new Clock();

  const ever = new ProviderRpcClient({
    forceUseFallback: true,
    fallback: async () =>
      EverscaleStandaloneClient.create({
        connection: "local",
        keystore,
        accountsStorage,
        clock,
      }),
  });
  await ever.ensureInitialized();

  const accountFactoryAddress = new Address(
    process.env.ACCOUNT_FACTORY_ADDRESS
  );
  const managerCollectionAddress = new Address(
    process.env.MANAGER_COLLECTION_ADDRESS
  );

  const accountFactory = new ever.Contract(
    accountFactoryAbi,
    accountFactoryAddress
  );
  const managerCollection = new ever.Contract(
    managerCollectionAbi,
    managerCollectionAddress
  );

  const userAddress = new Address(req.body.userAddress);

  try {
    const retailAccountAddress = await accountFactory.methods
      .retailAccountAddress({ pubkey: null, owner: userAddress, answerId: 2 })
      .call();
    console.log(retailAccountAddress);
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
    console.log(managerCollectionCallData);

    const { nft: nftAddress } = await managerCollection.methods
      .nftAddress({
        id: new BigNumber(managerAddressDetails[1], 16).toString(),
        answerId: 0,
      })
      .call();

    console.log(nftAddress);

    const managerNFTInstance = new ever.Contract(managerNftBaseAbi, nftAddress);

    const { transaction } = await managerNFTInstance.methods
      .sendTransaction({
        dest: managerCollectionAddress,
        value: toNano(2),
        bounce: false,
        flags: 0,
        payload: managerCollectionCallData,
      })
      .send({
        from: managerAddress.toString(),
        amount: toNano(3),
      });

    res.status(200).json({ message: "Account created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occured" });
  }
});

app.post("/issue-card", (req, res) => {
  res.status(200).json({ message: "Card issuance endpoint" });
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
