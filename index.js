const express = require("express");
const bodyParser = require("body-parser");
const { createAccount, issueCard } = require("./src/handlers");

const app = express();
app.use(bodyParser.json());

app.post("/create-account", createAccount);
app.post("/issue-card", issueCard);

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
