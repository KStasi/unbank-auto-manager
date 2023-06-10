const express = require("express");
const bodyParser = require("body-parser");
const { createAccount, issueCard, topUpCard } = require("./src/handlers");
const setupProvider = require("./src/setup");
const app = express();
const cors = require("cors");
let ever;

app.use(cors());

app.use(async (req, res, next) => {
  if (!ever) {
    ever = await setupProvider();
  }
  req.ever = ever;
  next();
});
app.use(bodyParser.json());

app.post("/create-account", createAccount);
app.post("/issue-card", issueCard);
app.post("/top-up", topUpCard);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
