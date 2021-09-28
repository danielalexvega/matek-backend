const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator")

const HttpError = require("../models/http-error");

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

const getProblemById = (req, res, next) => {
  const problemId = req.params.problemId;

  const problem = DUMMY_PROBLEMS.find((problem) => {
    return problem.id === problemId;
  });

  if (!problem) {
    return next(
      new HttpError("Could not find a problem for the provided id.", 404)
    );
  }

  res.json({ problem });
};

const getProblemsByUserId = (req, res, next) => {
  const userId = req.params.userId;

  const problems = DUMMY_PROBLEMS.filter((problem) => {
    return problem.authorId === userId;
  });

  if (!problems || problems.length === 0) {
    throw new HttpError(
      "Could not find a problem for the provided user id.",
      404
    );
  }

  res.json({ problems });
};

const createProblem = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
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

  const createdProblem = {
    id: uuidv4(),
    subjectContent,
    katex,
    solution,
    isMultipleChoice,
    choices,
    description,
    author,
    authorId,
    courses,
  };

  DUMMY_PROBLEMS.push(createdProblem);
  res.status(201).json({ problem: createdProblem });
};

const getProblems = (req, res, next) => {
  res.json({ problems: DUMMY_PROBLEMS });
};

const updateProblem = (req, res, next) => {
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

  const updatedProblem = {
    ...DUMMY_PROBLEMS.find((problem) => problem.id === problemId),
  };
  const problemIndex = DUMMY_PROBLEMS.findIndex(
    (problem) => problem.id === problemId
  );
  updatedProblem.subjectContent = content;
  updatedProblem.katex = katex;
  updatedProblem.solution = solution;
  updatedProblem.isMultipleChoice = isMultipleChoice;
  updatedProblem.choices = choices;
  updatedProblem.description = description;
  updatedProblem.courses = courses;

  DUMMY_PROBLEMS[problemIndex] = updatedProblem;

  res.status(200).json({ problem: updatedProblem });
};

const deleteProblem = (req, res, next) => {
  const problemId = req.params.problemId;
  DUMMY_PROBLEMS = DUMMY_PROBLEMS.filter((problem) => problem.id !== problemId);

  res.status(200).json({ message: "Deleted a problem." });
};

exports.getProblemById = getProblemById;
exports.getProblemsByUserId = getProblemsByUserId;
exports.createProblem = createProblem;
exports.getProblems = getProblems;
exports.updateProblem = updateProblem;
exports.deleteProblem = deleteProblem;
