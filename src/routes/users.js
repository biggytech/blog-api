const express = require("express");
const bcryptjs = require("bcryptjs");
const sanitize = require("mongo-sanitize");

const User = require("../models/user");
const auth = require("../middleware/auth");
const logger = require("../utils/logger");
const PERMISSIONS = require("../constants/permissions");
const verifyTokenAndUser = require("../utils/verifyTokenAndUser");
const getTokenPayload = require("../utils/getTokenPayload");
const getUserByIdAndToken = require("../utils/getUserByIdAndToken");
const getClearToken = require("../utils/getClearToken");
const generateToken = require("../utils/generateToken");

const usersRouter = express.Router();

// sign up
usersRouter.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (password.length < 8) {
      throw new Error("Password should be at least 8 characters long.");
    }

    // hash a passwrod
    let hashedPassword = await bcryptjs.hash(password, 8);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      permissions: PERMISSIONS.getAll(),
    });
    await user.save();
    res.send(user);
  } catch (err) {
    logger.error(err.message);
    res.status(400).send({ error: { message: err.message } });
  }
});

// sign in
usersRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: sanitize(username) });
    if (!user) {
      return res
        .status(401)
        .send({ error: { message: "Invalid credentials" } });
    }

    let isPasswordMatches = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatches) {
      return res
        .status(401)
        .send({ error: { message: "Invalid credentials" } });
    }

    const token = generateToken({ _id: user._id.toString() });
    user.tokens.push(token);

    await user.save();
    res.status(201).send({ user, token });
  } catch (err) {
    logger.error(err.message);
    res.status(400).send();
  }
});

// refresh token
usersRouter.post("/refreshToken", async (req, res) => {
  let token = req.headers?.authorization || "";
  const clearedToken = getClearToken(token);

  try {
    await verifyTokenAndUser(clearedToken);
  } catch (err) {
    if (err.name !== "TokenExpiredError") {
      return res.status(401).send({ error: { message: "Unauthorized" } });
    }
  }

  let { _id: userId } = getTokenPayload(clearedToken);
  const user = await getUserByIdAndToken(userId, clearedToken);
  if (!user) {
    return res.status(401).send({ error: { message: "Unauthorized" } });
  }
  // remove user token
  user.tokens = user.tokens.filter((token) => token !== clearedToken);

  const newToken = generateToken({ _id: user._id.toString() });

  user.tokens.push(newToken);

  await user.save();
  res.status(201).send({ user, token: newToken });
});

// logout
usersRouter.post("/logout", auth, async (req, res) => {
  req.user.tokens = req.user.tokens.filter((token) => token !== req.token);
  try {
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    res.status(500).send();
  }
});

module.exports = usersRouter;
