const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Problem = require("./problem").schema;

const quizSchema = new Schema({
    authorId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    author: { type: String, required: true },
    course: { type: String, required: true },
    problems: [Problem]
});

module.exports = mongoose.model("Quiz", quizSchema);