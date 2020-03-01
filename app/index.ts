import express from "express";
import bodyParser from "body-parser";
import path from "path";
import http from "http";

const buildPath = "/../build/";

const app = express();

const routes = require("./routes");
const socket = require("./socket");

const server = http.createServer(app);
socket(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, buildPath)));

routes(app);

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/../build/", "index.html"));
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
console.log("HELLO WORLD!!");
