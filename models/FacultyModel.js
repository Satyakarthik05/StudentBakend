const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  Designation: {
    type: String,
    required: true,
  },
  yearofpassing: {
    type: String,
    required: true,
  },
});

const faculty = new mongoose.model("FacultyDetails", FacultySchema);
module.exports = faculty;
