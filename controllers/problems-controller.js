const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const Problem = require("../models/problem");

let DUMMY_PROBLEMS = [
  {
    id: "p1",
    image: "",
    katex: {
      isValid: true,
      value: `\\begin{cases} -x -5y -5z = 2  \\\\ 4x – 5y + 4z = 19 \\\\ 
            x + 5y - z= -20 \\end{cases}`,
    },
    author: "Daniel Vega",
    authorId: "a1",
    solution: { isValid: true, value: "(-2, -3, 3)" },
    isMultipleChoice: { value: true, isValid: true },
    choices: {
      isValid: true,
      value: [
        {
          id: "choiceA",
          label: "A",
          value: "(2, 3, -3)",
          isValid: true,
        },
        {
          id: "choiceB",
          label: "B",
          value: "(-2, -3, 3)",
          isValid: true,
        },
        {
          id: "choiceC",
          label: "C",
          value: "(3, -2, 3)",
          isValid: true,
        },
      ],
    },
    content: "Solving the Square",
    description: {
      isValid: true,
      value:
        "This is the first problem. A system of equations problem with three variables. This problem is easiest solved with elimination.",
    },
    courses: ["Algebra 2"],
  },
  {
    id: "p2",
    image: "",
    katex: {
      isValid: true,
      value: `\\begin{cases} -x -5y -5z = 2  \\\\ 4x – 5y + 4z = 19 \\\\ 
            x + 5y - z= -20 \\end{cases}`,
    },
    author: "Daniel Vega",
    authorId: "a2",
    solution: { isValid: true, value: "(-2, -3, 3)" },
    isMultipleChoice: { value: true, isValid: true },
    choices: {
      isValid: true,
      value: [
        {
          id: "choiceA",
          label: "A",
          value: "(2, 3, -3)",
          isValid: true,
        },
        {
          id: "choiceB",
          label: "B",
          value: "(-2, -3, 3)",
          isValid: true,
        },
        {
          id: "choiceC",
          label: "C",
          value: "(3, -2, 3)",
          isValid: true,
        },
      ],
    },
    content: "Solving the Square",
    description: {
      isValid: true,
      value:
        "A system of equations problem with three variables. This problem is easiest solved with elimination.",
    },
    courses: ["Algebra 2"],
  },
  {
    id: "p3",
    image: "",
    katex: {
      isValid: true,
      value: `\\begin{cases} -x -5y + z = 17  \\\\ -5x – 5y + 5z = 5 \\\\ 
              2x + 5y - 3z= -10 \\end{cases}`,
    },
    author: "Daniel Vega",
    authorId: "a2",
    solution: { isValid: true, value: "(-1, -4, -4)" },
    isMultipleChoice: { value: null, isValid: true },
    choices: {
      isValid: true,
      value: [],
    },
    content: "Solving the Square",
    description: {
      isValid: true,
      value:
        "This is the third Problem. A system of equations problem with three variables. This problem is easiest solved with elimination.",
    },
    courses: ["Algebra 2"],
  },
];

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

const getProblems = (req, res, next) => {
  res.json({ problems: DUMMY_PROBLEMS });
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

const deleteProblem = (req, res, next) => {
  const problemId = req.params.problemId;
  if (!DUMMY_PROBLEMS.find((problem) => problem.id === problemId)) {
    throw new HttpError("Could not find a problem for that id.", 404);
  }

  DUMMY_PROBLEMS = DUMMY_PROBLEMS.filter((problem) => problem.id !== problemId);

  res.status(200).json({ message: "Deleted a problem." });
};

exports.getProblemById = getProblemById;
exports.getProblemsByUserId = getProblemsByUserId;
exports.createProblem = createProblem;
exports.getProblems = getProblems;
exports.updateProblem = updateProblem;
exports.deleteProblem = deleteProblem;
