const router = require("express").Router();
const bcrypt = require("bcryptjs");
const db = require("./auth-model");
const restricted = require("./authenticate-middleware");

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

router.get("/logout", (req, res) => {
  if (req.session)
    req.session.destroy(err => {
      if (err) {
        res.json({ message: "could not logout", error: err.message });
      } else res.status(200).json({ message: `Logout success` });
    });
  else {
    res.status(400).json({ message: "Cannot logout. not currently logged in" });
  }
});

router.delete("/users/:id", restricted, (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deletedUser => {
      res.status(200).json(deletedUser);
    })
    .catch(err => {
      res.status(501).json({ message: "could not delete user", error: err });
    });
});

router.put("/users/:id", restricted, verifyChanges, async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    let updatedUser;
    if (password) {
      const newPass = bcrypt.hashSync(password, 14);
      updatedUser = await db.update(id, {
        username: username,
        password: newPass
      });
    } else updatedUser = await db.update(id, { username: username });
    res.status(200).json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "could not update user info", error: err.message });
  }
});

function verifyChanges(req, res, next) {
  const changes = req.body;
  if (changes.username) next();
  else
    res.status(400).json({
      message:
        "username field required to make changes (even if it is not changed)"
    });
}

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
