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

router.get("/user/:userId", getProblemsByUserId);

router.get("/:problemId", getProblemById);
router.patch(
  "/:problemId",
  [
    check("subjectContent").not().isEmpty(),
    check("solution").not().isEmpty(),
    check("katex").not().isEmpty(),
  ],
  updateProblem
);

router.delete("/:problemId", deleteProblem);

//get all problems that are multiple choice

//get all problems that are the same content

//get a certain amount of problems

router.get("/", getProblems);
router.post(
  "/",
  [
    check("subjectContent").not().isEmpty(),
    check("solution").not().isEmpty(),
    check("katex").not().isEmpty(),
  ],
  createProblem
);

module.exports = router;
