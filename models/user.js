const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 }, //check for password
  image: { type: String },
  problems: [{ type: mongoose.Types.ObjectId, required: true, ref: "Problem"}],
  school: { type: String, required: true},
  schoolDistrict: { type: String, required: true},
  city: {type: String, required: false},
  state: {type: String, required: false},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
