const { Address } = require("everscale-inpage-provider");
const prepareTransaction = require("./transaction");
const { toNano } = require("./utils");
const {
  MANAGER_ADDRESS,
  ACCOUNT_FACTORY_ADDRESS,
  FOUNDER_ADDRESS,
  DEFAULT_TOP_UP_AMOUNT,
} = require("./constants");
const {
  prepareCreateAccountData,
  getRetailAccountAddress,
  prepareCreateCardData,
} = require("./transaction-data");
const prepareMint = require("./mint");

module.exports = {
  createAccount: async (req, res) => {
    const ever = req.ever;

    const userAddress = new Address(req.body.userAddress);
    const accountFactoryAddress = new Address(ACCOUNT_FACTORY_ADDRESS);
    try {
      const data = await prepareCreateAccountData(ever, userAddress);
      const { preparedTransaction } = await prepareTransaction(
        ever,
        data,
        accountFactoryAddress
      );

      await preparedTransaction.send({
        from: MANAGER_ADDRESS,
        amount: toNano(1.4),
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
      const { preparedTransaction } = await prepareTransaction(
        ever,
        data,
        retailAccountAddress
      );

      await preparedTransaction.send({
        from: MANAGER_ADDRESS,
        amount: toNano(1.4),
      });

      res.status(200).json({ message: "Done" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },

  topUpCard: async (req, res) => {
    const ever = req.ever;

    const cardAddress = new Address(req.body.cardAddress);
    const currencyAddress = new Address(req.body.currency);

    try {
      const { preparedTransaction } = await prepareMint(
        ever,
        currencyAddress,
        cardAddress
      );

      await preparedTransaction.send({
        from: FOUNDER_ADDRESS,
        amount: toNano(0.5),
      });

      res.status(200).json({ message: "Done" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "An error occurred" });
    }
  },
};
