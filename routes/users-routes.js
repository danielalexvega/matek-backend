const express = require("express");
const { check } = require("express-validator");

const { getUsers, getUser, signup, login } = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", getUsers);

router.get("/getUser/:userId", getUser);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8 }),
  ],
  signup
);
router.post("/login", login);

module.exports = router;
