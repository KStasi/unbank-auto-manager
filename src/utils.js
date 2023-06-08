const BigNumber = require("bignumber.js");
const { deriveBip39Phrase } = require("everscale-crypto");
const { PATH, MANAGER_SEED_PHRASE } = require("./constants");

BigNumber.config({ EXPONENTIAL_AT: 120 });

module.exports = {
  toNano: (amount) => new BigNumber(amount).shiftedBy(9).toFixed(0),
  fromNano: (amount) => new BigNumber(amount).shiftedBy(-9).toString(),
  generateKeys: async (seedPhrase, amount) => {
    return [...Array(amount).keys()].map((i) => {
      const path = PATH.replace("INDEX", `${i}`);
      return deriveBip39Phrase(seedPhrase, path);
    });
  },
};
