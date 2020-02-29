require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");

const routes = require("./routes");
const socket = require("./socket");

const app = express();
const server = http.createServer(app);
socket(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "build")));

routes(app);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
