const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const problemSchema = new Schema({
  katex: { type: String, required: true },
  solution: { type: String, required: true },
  image: { type: String, required: true },
  isMultipleChoce: { type: Boolean, required: true },
  choices: { any: [{}] },
  author: { type: String, required: true },
  authorId: { type: String, required: true },
  subjectContent: { type: String, required: true },
  description: { type: String, required: true },
  courses: { any: [String] },
});

module.exports = mongoose.model('Problem', problemSchema);
