const express = require("express");
const { check } = require("express-validator");

const { getUsers, signup, login } = require("../controllers/users-controller");

const router = express.Router();

router.get("/", getUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  signup
);
router.post("/login", login);

module.exports = router;
