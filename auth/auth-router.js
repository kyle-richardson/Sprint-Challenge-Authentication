const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("./auth-model");

router.post("/register", verifyNewUser, async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await db.add({
      username: username,
      password: bcrypt.hashSync(password, 14)
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(501).json({ message: "could not add user", error: err.message });
  }
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

function verifyNewUser(req, res, next) {
  const { username, password } = req.body;
  if (username && password) {
    db.findBy({ username }).then(user => {
      if (user) res.status(400).json({ message: "username already in use" });
      else next();
    });
  } else
    res.status(400).json({ message: "username and password fields required" });
}

module.exports = router;
