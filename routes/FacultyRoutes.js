const express = require("express");
const {
  FacultySign,
  facultyLogin,
  getFaculty,
} = require("../controllers/FacultyController");

const router = express.Router();

router.post("/facultysign", FacultySign);
router.post("/facultylogin", facultyLogin);
router.post("/getfaculty", getFaculty);

module.exports = router;
