const faculty = require("../models/FacultyModel");
const jwt = require("jsonwebtoken");

secret = "Student@12";

const FacultySign = async (req, res) => {
  const { teacherId, password, subject, Designation, yearofpassing } = req.body;

  try {
    const sign = await faculty.findOne({ teacherId: teacherId });

    if (sign) {
      res.status(400).json({ message: "Faculty alredy registered" });
    }

    const facreg = await faculty.create({
      teacherId,
      password,
      subject,
      Designation,
      yearofpassing,
    });
    if (facreg) {
      console.log("faculty registration successful");
      res.status(200).json({ message: "Faculty Registered succesfully" });
    } else {
      res.status(400).json({ message: "error while registering" });
    }
  } catch (error) {
    console.log(error);
  }
};

const facultyLogin = async (req, res) => {
  const { teacherId, password } = req.body;

  const faclog = await faculty.findOne({
    teacherId: teacherId,
    password: password,
  });
  if (faclog) {
    const token = await jwt.sign({ stuId: faclog._id }, secret, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Faculty login successful", token });
  } else {
    res.status(400).json({ message: "Faculty not found" });
  }
};

const getFaculty = async (req, res) => {
  try {
    const getFaculty = await faculty.findById(req.facultyId);
    if (!getFaculty) {
      return res.status(400).json({ message: "Student not found" });
    }
    res.status(200).json(getFaculty);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { FacultySign, facultyLogin, getFaculty };
