const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password");
    } catch (err) {
        const error = new HttpError(
            "Fecthing users failed. Please try agai",
            500
        );
        return next(error);
    }
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed; please check your data.", 422)
        );
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            "Signing up failed. Please try again later",
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            "Could not create user; email already exits.",
            422
        );
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            "Could not create user, please try again",
            500
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        problems: [],
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            "Signing up failed, please try again.",
            500
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
    } catch (err) {
        const error = new HttpError(
            "Signing up failed, please try again.",
            500
        );
        return next(error);
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, userName: name, token: token });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            "Logging in has failed. Please try again later.",
            500
        );
        return next(error);
    }

    console.log("You got this far.");

    if (!existingUser) {
        const error = new HttpError(
            "Invalid credentials, could not log you in.",
            401
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            "Could not log you in. Please try your credentials and try again.",
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            "Invalid credentials, could not log you in.",
            403
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: email },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
    } catch (err) {
        const error = new HttpError(
            "Logging in failed, please try again.",
            500
        );
        return next(error);
    }

    res.json({
        message: "You are now logged in.",
        name: existingUser.name,
        userId: existingUser.id, 
        email: existingUser.email, 
        token: token 
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
