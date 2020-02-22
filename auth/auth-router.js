const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("./auth-model");

router.post("/register", (req, res) => {
  // implement registration
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;

        res.status(201).json({
          message: `Welcome ${user.username}!`
        });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "failed to sign in", error: err.message });
    });
});

module.exports = router;
