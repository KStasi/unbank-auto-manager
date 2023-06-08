const { Address } = require("everscale-inpage-provider");
const prepareTransaction = require("./transaction");
const { toNano } = require("./utils");
const { MANAGER_ADDRESS } = require("./constants");
const {
  prepareCreateAccountData,
  getRetailAccountAddress,
  prepareCreateCardData,
} = require("./transaction-data");

module.exports = {
  createAccount: async (req, res) => {
    const ever = req.ever;

    const userAddress = new Address(req.body.userAddress);

    try {
      const data = await prepareCreateAccountData(ever, userAddress);
      const { preparedTransaction } = await prepareTransaction(ever, data);

      await preparedTransaction.send({
        from: MANAGER_ADDRESS,
        amount: toNano(3),
      });
      const retailAccountAddress = await getRetailAccountAddress(
        ever,
        userAddress
      );

      res.status(200).json({ message: retailAccountAddress.toString() });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },

  issueCard: async (req, res) => {
    const ever = req.ever;

    const retailAccountAddress = new Address(req.body.retailAccountAddress);
    const cardTypeId = req.body.cardTypeId;
    const currencyAddress = new Address(req.body.currency);
    const otherCardDetails = req.body.otherCardDetails;

    try {
      const data = await prepareCreateCardData(
        ever,
        retailAccountAddress,
        cardTypeId,
        currencyAddress,
        otherCardDetails
      );
      const { preparedTransaction } = await prepareTransaction(ever, data);

      await preparedTransaction.send({
        from: MANAGER_ADDRESS,
        amount: toNano(3),
      });
      res.status(200).json({ message: "Done" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
};
