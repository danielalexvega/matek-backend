const fs = require("fs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Problem = require("../models/problem");

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
};

const getProblemById = async (req, res, next) => {
    const problemId = req.params.problemId;
    let problem;
    try {
        problem = await Problem.findById(problemId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find a problem.",
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

    if (!problems) {
        const error = new HttpError(
            "Could not find a problem for the provided user id.",
            404
        );

        return next(error);
    }

    res.json({
        problems: problems.map((problem) =>
            problem.toObject({ getters: true })
        ),
    });
};

const getProblemsByCourse = async (req, res, next) => {
    const course = req.params.course.replace(/-/g, " ");
    let problems;

    try {
        problems = await Problem.find({ course: course });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find problems.",
            500
        );
    }

    if (!problems) {
        const error = new HttpError(
            "Could not find a problem for the provided course.",
            404
        );

        return next(error);
    }

    problems = problems.reverse();
    res.json({
        problems: problems.map((problem) =>
            problem.toObject({ getters: true })
        ),
    });
};

const getProblemsBySubjectContent = async (req, res, next) => {
    const subjectContent = req.params.subjectContent.replace(/-/g, " ");
    let problems;

    try {
        problems = await Problem.find({ subjectContent: subjectContent });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find problems.",
            500
        );
    }

    if (!problems) {
        const error = new HttpError(
            "Could not find a problem for the provided subject content.",
            404
        );

        return next(error);
    }

    problems = problems.reverse();
    res.json({
        problems: problems.map((problem) =>
            problem.toObject({ getters: true })
        ),
    });
};

const getProblemsBySubdomain = async (req, res, next) => {
    const subdomain = req.params.subdomain.replace(/-/g, " ");
    let problems;

    try {
        problems = await Problem.find({ subdomain: subdomain });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find problems.",
            500
        );
    }

    if (!problems) {
        const error = new HttpError(
            "Could not find a problem for the provided subdomain.",
            404
        );

        return next(error);
    }

    problems = problems.reverse();
    res.json({
        problems: problems.map((problem) =>
            problem.toObject({ getters: true })
        ),
    });
};

const getVariableProblemSet = async (req, res, next) => {
    const course = req.params.course.replace(/-/g, " ");
    const subjectContent = req.params.subjectContent.replace(/-/g, " ");
    const subdomain = req.params.subdomain.replace(/-/g, " ");
    const amount = req.params.amount;

    let problems;

    try {
        problems = await Problem.find({
            course: course,
            subjectContent: subjectContent,
            subdomain: subdomain,
        });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find problems.",
            500
        );
    }

    if (!problems) {
        const error = new HttpError(
            "Could not find a problem for the provided subdomain.",
            404
        );

        return next(error);
    }

    problems = shuffleArray(problems.reverse());
    problems.splice(0, amount);
    res.json({
        problems: problems.map((problem) =>
            problem.toObject({ getters: true })
        ),
    });
};

const getLastSixProblemsByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    let problems;

    try {
        problems = await Problem.find({ authorId: userId });
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find a problem.",
            500
        );

        return next(error);
    }

    if (!problems) {
        const error = new HttpError(
            "Could not find a problem for the provided user id.",
            404
        );

        return next(error);
    }

    problems = problems.reverse();
    problems = problems.slice(0, 6);
    res.json({
        problems: problems.map((problem) =>
            problem.toObject({ getters: true })
        ),
    });
};

const getProblems = async (req, res, next) => {
    let problems;

    try {
        problems = await Problem.find();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find any problems.",
            500
        );
        return next(error);
    }

    res.json({
        problems: problems.map((problem) =>
            problem.toObject({ getters: true })
        ),
    });
};

const createProblem = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError(
            "Invalid inputs passed; please check your data.",
            422
        );
    }

    const {
        subjectContent,
        course,
        subdomain,
        katex,
        katexEquation,
        solution,
        isMultipleChoice,
        choices,
        description,
        author,
        hasImage,
    } = req.body;

    let choicesArray = [choices];

    let createdProblem;

    if (hasImage) {
        createdProblem = new Problem({
            katex,
            katexEquation,
            solution,
            image: req.file.path,
            isMultipleChoice,
            choicesArray,
            author,
            authorId: req.userData.userId,
            subjectContent,
            subdomain,
            description,
            course,
            hasImage,
        });
    } else {
        createdProblem = new Problem({
            katex,
            katexEquation,
            solution,
            isMultipleChoice,
            choicesArray,
            author,
            authorId: req.userData.userId,
            subjectContent,
            subdomain,
            description,
            course,
            hasImage,
        });
    }

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            "Creating problem failed, please try again.",
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError(
            "We could not find user for provided id",
            404
        );
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdProblem.save({ session: sess });
        user.problems.push(createdProblem);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        console.log(err.message);
        const error = new HttpError(
            "Creating Problem failed, please try again. And it was here bubba.",
            500
        );
        return next(error);
    }

    res.status(201).json({ problem: createdProblem });
};

const updateProblem = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new HttpError(
            "Invalid inputs passed; please check your data.",
            422
        );
    }

    const {
        katex,
        katexEquation,
        solution,
        isMultipleChoice,
        choices,
        subjectContent,
        subdomain,
        description,
        course,
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

    if (problem.authorId.toString() !== req.userData.userId) {
        const error = new HttpError(
            "You are not allowed to edit this problem.",
            401
        );
        return next(error);
    }

    problem.course = course;
    problem.subdomain = subdomain;
    problem.subjectContent = subjectContent;
    problem.katex = katex;
    problem.katexEquation = katexEquation;
    problem.solution = solution;
    problem.isMultipleChoice = isMultipleChoice;
    problem.choices = choices;
    problem.description = description;

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
        problem = await Problem.findById(problemId).populate("authorId");
    } catch (err) {
        const error = new HttpError(
            "Something went wrong. Could not delete problem",
            500
        );
        return next(error);
    }

    if (!problem) {
        const error = new HttpError(
            "Could not find the problem for the given id.",
            404
        );
        return next(error);
    }

    if (problem.authorId.id !== req.userData.userId) {
        const error = new HttpError(
            "You are not allowed to delete this problem.",
            401
        );
        return next(error);
    }

    let imagePath;
    if (problem.image) {
        imagePath = problem.image;
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await problem.remove({ session: sess });
        problem.authorId.problems.pull(problem);
        await problem.authorId.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong. Could not delete problem",
            500
        );
        return next(error);
    }

    if (problem.image) {
        fs.unlink(imagePath, (err) => {
            console.log(err);
        });
    }

    res.status(200).json({ message: "Deleted a problem." });
};



exports.getProblemById = getProblemById;
exports.getProblemsByUserId = getProblemsByUserId;
exports.getProblems = getProblems;
exports.createProblem = createProblem;
exports.updateProblem = updateProblem;
exports.deleteProblem = deleteProblem;
exports.getLastSixProblemsByUserId = getLastSixProblemsByUserId;
exports.getProblemsByCourse = getProblemsByCourse;
exports.getProblemsBySubjectContent = getProblemsBySubjectContent;
exports.getProblemsBySubdomain = getProblemsBySubdomain;
exports.getVariableProblemSet = getVariableProblemSet;
