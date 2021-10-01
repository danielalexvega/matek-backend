const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Problem = require("../models/problem");

const getProblemById = async (req, res, next) => {
  const problemId = req.params.problemId;
  let problem;
  try {
    problem = await Problem.findById(problemId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a problem",
      500
    );

    return next(error);
  }

  if (!problem) {
    return next(
      new HttpError("Could not find a problem for the provided id.", 404)
    );
  }

  res.json({ problem: problem.toObject({ getters: true }) });
};

const getProblemsByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let problems;

  try {
    problems = await Problem.find({ authorId: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a problem",
      500
    );

    return next(error);
  }

  if (!problems || problems.length === 0) {
    const error = new HttpError(
      "Could not find a problem for the provided user id.",
      404
    );

    return next(error);
  }

  res.json({
    problems: problems.map((problem) => problem.toObject({ getters: true })),
  });
};

const getProblems = (req, res, next) => {
  let problems;

  try {
    problems = await Problem.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a problem",
      500
    );

    return next(error);
  }

  res.json({
    problems: problems.map((problem) => problem.toObject({ getters: true })),
  });
};

const createProblem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed; please check your data.", 422);
  }

  const {
    subjectContent,
    katex,
    solution,
    isMultipleChoice,
    choices,
    description,
    author,
    authorId,
    courses,
  } = req.body;

  const createdProblem = new Problem({
    katex,
    solution,
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
    isMultipleChoice,
    choices,
    author,
    authorId,
    subjectContent,
    description,
    courses,
  });

  try {
    await createdProblem.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating Problem failed, please try again dumb dumb",
      500
    );
    return next(error);
  }
  
  res.status(201).json({ problem: createdProblem });
};

const updateProblem = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed; please check your data.", 422);
  }

  const {
    content,
    katex,
    solution,
    isMultipleChoice,
    choices,
    description,
    courses,
  } = req.body;

  const problemId = req.params.problemId;

  let problem;
  try {
    problem = await Problem.findById(problemId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update problem.",
      500
    );
    return next(error);
  }

  problem.subjectContent = content;
  problem.katex = katex;
  problem.solution = solution;
  problem.isMultipleChoice = isMultipleChoice;
  problem.choices = choices;
  problem.description = description;
  problem.courses = courses;

  try {
    await problem.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update problem.",
      500
    );
    return next(error);
  }

  res.status(200).json({ problem: problem.toObject({ getters: true }) });
};

const deleteProblem = async (req, res, next) => {
  const problemId = req.params.problemId;
  let problem;
  try {
    problem = await Problem.findById(problemId);
  } catch (err) {
    const error = new HttpError("Something went wrong. Could not delete problem", 500);
    return next(error);
  }

  try {
    await problem.remove();
  } catch (err) {
    const error = new HttpError("Something went wrong. Could not delete problem", 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted a problem." });
};

exports.getProblemById = getProblemById;
exports.getProblemsByUserId = getProblemsByUserId;
exports.getProblems = getProblems;
exports.createProblem = createProblem;
exports.updateProblem = updateProblem;
exports.deleteProblem = deleteProblem;
