const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "a1",
    name: "Daniel Vega",
    email: "danielalexvega@gmail.com",
    password: "testtest",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed; please check your data.", 422);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await user.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed. Please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "Could not create user; email already exits.",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
    problems,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identified user, please check credentials.",
      401
    );
  }

  res.json({ message: "You are now logged in." });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
