const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Course = require("../models/courses");

const getCourseById = async (req, res, next) => {
    const courseId = req.params.courseId;
    let course;
    try {
        course = await Course.findById(courseId);
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find course.",
            500
        );
        return next(error);
    }

    if (!course) {
        return next(
            new HttpError("Could not find a course for the provided id.", 404)
        );
    }

    res.json({ course: course.toObject({ getters: true }) });
};

const getCourses = async (req, res, next) => {
    let courses;

    try {
        courses = await Course.find();
    } catch (err) {
        const error = new HttpError(
            "Something went wrong, could not find any courses.",
            500
        );
        return next(error);
    }

    res.json({
        courses: courses.map((course) => course.toObject({ getters: true })),
    });
};


exports.getCourseById = getCourseById;
exports.getCourses = getCourses;
