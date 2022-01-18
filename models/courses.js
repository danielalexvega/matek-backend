const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseTitle: { type: String, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model("Course", courseSchema);
