const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const logger = require("./logger");

const sessionConfig = {
  name: "elephant",
  secret: "hello, this is a secret",
  cookie: {
    maxAge: 1000 * 60 * 30, //30 minutes
    secure: false, //true in production
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false //GDPR laws against setting cookies auto
};

module.exports = server => {
  server.use(helmet());
  server.use(express.json());
  server.use(cors());
  server.use(session(sessionConfig));
  // server.use(logger);
};
