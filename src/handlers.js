const { Address } = require("everscale-inpage-provider");
const setupProvider = require("./setup");
const prepareTransaction = require("./transaction");
const { toNano } = require("./utils");
const { MANAGER_ADDRESS } = require("./constants");

module.exports = {
  createAccount: async (req, res) => {
    const ever = await setupProvider();

    const userAddress = new Address(req.body.userAddress);

    try {
      const { retailAccountAddress, preparedTransaction } =
        await prepareTransaction(ever, userAddress);

      console.log(retailAccountAddress);
      await preparedTransaction.send({
        from: MANAGER_ADDRESS,
        amount: toNano(3),
      });

      res.status(200).json({ message: "Account created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },

  issueCard: (req, res) => {
    // ... your code for the issueCard endpoint
  },
};
