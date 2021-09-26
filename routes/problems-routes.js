const express = require("express");

const {
  getProblemById,
  getProblemsByUserId,
  createProblem,
  getProblems,
  updateProblem,
  deleteProblem,
} = require("../controllers/problems-controller");

const router = express.Router();

router.get("/user/:userId", getProblemsByUserId);

router.get("/:problemId", getProblemById);
router.patch("/:problemId", updateProblem);
router.delete("/:problemId", deleteProblem);

//get all problems that are multiple choice

//get all problems that are the same content

//get a certain amount of problems


router.get("/", getProblems);
router.post("/", createProblem);

module.exports = router;
