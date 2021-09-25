const express = require("express");

const router = express.Router();

const DUMMY_PROBLEMS = [
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



router.get("/user/:userId", (req, res, next) => {
    const userId = req.params.userId;

    const problems = DUMMY_PROBLEMS.filter(problem => {
        return problem.authorId === userId;
    });

    res.json({problems});
})


router.get('/:problemId', (req, res, next) => {
    const problemId = req.params.problemId;

    const problem = DUMMY_PROBLEMS.find(problem => {
        return problem.id === problemId;
    })

    res.json({problem});
});


module.exports = router;