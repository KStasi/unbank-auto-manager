const { ProviderRpcClient } = require("everscale-inpage-provider");
const {
  SimpleKeystore,
  SimpleAccountsStorage,
  Clock,
  EverscaleStandaloneClient,
  EverWalletAccount,
} = require("everscale-standalone-client/nodejs");

const { generateKeys } = require("./utils");
const { MANAGER_ADDRESS, MANAGER_SEED_PHRASE } = require("./constants");

async function setupProvider() {
  const keys = await generateKeys(MANAGER_SEED_PHRASE, 10);

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
  accountsStorage.addAccount(new EverWalletAccount(MANAGER_ADDRESS));

  const clock = new Clock();

  const ever = new ProviderRpcClient({
    forceUseFallback: true,
    fallback: async () =>
      EverscaleStandaloneClient.create({
        connection: {
          id: 1010,
          group: "venom_testnet",
          type: "jrpc",
          data: {
            endpoint: "https://jrpc-devnet.venom.foundation/rpc",
          },
        },
        keystore,
        accountsStorage,
        clock,
      }),
  });
  await ever.ensureInitialized();

  return ever;
}

module.exports = setupProvider;
