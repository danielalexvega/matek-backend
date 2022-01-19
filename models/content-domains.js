const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    value: { type: String },
  });

const contentDomainSchema = new Schema({
    domainTitle: {type: String, required: true},
    courses: { type: [courseSchema]},
});

module.exports = mongoose.model("ContentDomain", contentDomainSchema);