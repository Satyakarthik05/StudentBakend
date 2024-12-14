const express = require("express");
const {
  StudentLogin,
  StudentSign,
  StudentMarks,
  Stuattendence,
  FilterStu,
  getMonthlyAttendance,
  getStudents,
} = require("../controllers/StudentController");
const verifyToken = require("../middlewares/VerifyStudentToken");

const router = express.Router();

router.post("/studentsign", StudentSign);
router.post("/studentlogin", StudentLogin);
router.patch("/update-marks", StudentMarks);
router.patch("/attendence", Stuattendence);
router.get("/allstu", FilterStu);
router.get("/monthly", getMonthlyAttendance);
router.get("/getstudent", verifyToken, getStudents);

module.exports = router;
