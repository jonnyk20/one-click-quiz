require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const db = require("./models/index.js");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "build")));

app.get("/ping", async (req, res) => {
  const { ItemType } = db;
  const itemType = await ItemType.findOne({
    where: {
      name: "image-item"
    }
  });

  return res.json({ itemType });
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
