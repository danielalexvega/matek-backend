const express = require("express");

const {getProblemById, getProblemsByUserId, createProblem, getProblems} = require("../controllers/problems-controller");

const router = express.Router();

router.get("/user/:userId", getProblemsByUserId);

router.get("/:problemId", getProblemById);

router.get("/", getProblems);

router.post("/", createProblem);

module.exports = router;
