const express = require("express");
const configureMiddleware = require("./server-middleware");

const authenticate = require("../auth/authenticate-middleware.js");
const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router.js");

const server = express();
configureMiddleware(server);

server.use("/api/auth", authRouter);
server.use("/api/jokes", authenticate, jokesRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "running" });
});

module.exports = server;
