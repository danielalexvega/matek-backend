const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    reciever: { type: String, required: true },
    quiz: { type: mongoose.Types.ObjectId, required: true, ref: "Quiz" },
    score: { type: Number },
    submissionTime: Date,
    startTime: Date,
});

module.exports = mongoose.model("Score", scoreSchema);
