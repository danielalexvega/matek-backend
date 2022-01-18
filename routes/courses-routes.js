const express = require("express");
const { check } = require("express-validator");

const {
    getCourses,
    getCourseById,
} = require("../controllers/courses-controller");

const router = express.Router();

// get all courses
router.get("/", getCourses);

// get a single course
router.get("/:courseId", getCourseById);

module.exports = router;
