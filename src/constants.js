require("dotenv").config();

module.exports = {
  MANAGER_SEED_PHRASE: process.env.MANAGER_SEED_PHRASE,
  MANAGER_ACCOUNT_ID: process.env.MANAGER_ACCOUNT_ID,
  MANAGER_ADDRESS: process.env.MANAGER_ADDRESS,
  ACCOUNT_FACTORY_ADDRESS: process.env.ACCOUNT_FACTORY_ADDRESS,
  MANAGER_COLLECTION_ADDRESS: process.env.MANAGER_COLLECTION_ADDRESS,
  PATH: "m/44'/396'/0'/0/INDEX",
};
