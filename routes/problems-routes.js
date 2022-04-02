const express = require("express");
const { check } = require("express-validator");

const {
    getProblemById,
    getProblemsByUserId,
    createProblem,
    getProblems,
    updateProblem,
    deleteProblem,
    getLastSixProblemsByUserId,
    getProblemsByCourse,
    getProblemsBySubjectContent,
    getProblemsBySubdomain,
    getVariableProblemSet,
} = require("../controllers/problems-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// get all problems
router.get("/", getProblems);

// get all problems with a userId
router.get("/user/:userId", getProblemsByUserId);

// get last 6 problems from a user
router.get("/user/lastSix/:userId", getLastSixProblemsByUserId);

// get a single problem
router.get("/:problemId", getProblemById);

// get all problems from a course
router.get("/problemsByCourse/:course", getProblemsByCourse);

// get all problems from a subject content
router.get(
    "/problemsBySubjectContent/:subjectContent",
    getProblemsBySubjectContent
);

// get all problems from a subject content
router.get("/problemsBySubdomain/:subdomain", getProblemsBySubdomain);

// get an amount of problems from a given course, subject domain, and subdomain
router.get(
    "/problems/:amount/:course/:subjectContent/:subdomain",
    getVariableProblemSet
);

// clone a problem
router.get("/:problemId/clone", getProblemById);

router.use(checkAuth);

// create a problem
router.post(
    "/",
    fileUpload.single("image"),
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
