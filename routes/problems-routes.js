const express = require("express");
const { check } = require("express-validator");

const {
  getProblemById,
  getProblemsByUserId,
  createProblem,
  getProblems,
  updateProblem,
  deleteProblem,
} = require("../controllers/problems-controller");

const router = express.Router();

// get all problems
router.get("/", getProblems);

// get all problems with a userId
router.get("/user/:userId", getProblemsByUserId);

// get a single problem
router.get("/:problemId", getProblemById);

// create a problem
router.post(
  "/",
  [
    check("subjectContent").not().isEmpty(),
    check("solution").not().isEmpty(),
    check("katex").not().isEmpty(),
  ],
  createProblem
);

// update a problem
router.patch(
  "/:problemId",
  [
    check("subjectContent").not().isEmpty(),
    check("solution").not().isEmpty(),
    check("katex").not().isEmpty(),
  ],
  updateProblem
);

//delete a problem
router.delete("/:problemId", deleteProblem);

//get all problems that are multiple choice

//get all problems that are the same content

//get a certain amount of problems

module.exports = router;
