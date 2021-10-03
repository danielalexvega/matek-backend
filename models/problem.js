const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const choiceSchema = new Schema({
  label: { type: String, required: true },
  id: { type: String, required: true },
  value: { type: String, required: true },
});

const courseSchema = new Schema({
  value: { type: String },
});

const problemSchema = new Schema({
  katex: { type: String, required: true },
  solution: { type: String, required: true },
  image: { type: String },
  isMultipleChoice: { type: Boolean, required: true },
  choices: { type: [choiceSchema] },
  author: { type: String, required: true },
  authorId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  subjectContent: { type: String, required: true },
  description: { type: String, required: true },
  courses: { type: [courseSchema] },
});

module.exports = mongoose.model("Problem", problemSchema);
