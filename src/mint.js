const BigNumber = require("bignumber.js");
const { toNano } = require("./utils");
const tokenRootAbi = require("./abi/TokenRoot.abi.json");
const { DEFAULT_TOP_UP_AMOUNT, FOUNDER_ADDRESS } = require("./constants");

async function prepareMint(ever, cbdc, cardAddress) {
  const currency = new ever.Contract(tokenRootAbi, cbdc);

  const preparedTransaction = await currency.methods.mint({
    amount: toNano(DEFAULT_TOP_UP_AMOUNT),
    recipient: cardAddress.toString(),
    deployWalletValue: 0,
    remainingGasTo: FOUNDER_ADDRESS,
    notify: false,
    payload: "",
  });

  return { preparedTransaction };
}

module.exports = prepareMint;
