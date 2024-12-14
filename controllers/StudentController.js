const student = require("../models/StudentModel");
const jwt = require("jsonwebtoken");

secret = "Satya12@";

const StudentSign = async (req, res) => {
  const { name, regno, branch, joiningYear, studentphno, parentphno } =
    req.body;
  try {
    const sign = await student.findOne({ regno: regno });
    if (sign) {
      res.status(400).json({ message: "regno is already exists" });
    }

    const studentreg = await student.create({
      name,
      regno,
      branch,
      joiningYear,
      studentphno,
      parentphno,
    });
    if (studentreg) {
      res.status(200).json({ message: "Student rgistration successful" });
    } else {
      res.status(400).json({ message: "Error while registering" });
    }
  } catch (error) {
    console.log(error);
  }
};

const StudentLogin = async (req, res) => {
  const { regno } = req.body;
  // const password = "123456";

  try {
    const stlog = await student.findOne({ regno: regno });

    if (stlog) {
      const token = await jwt.sign({ stuId: stlog._id }, secret, {
        expiresIn: "1h",
      });
      res.status(200).json({ message: "Student login successful", token });
    } else {
      res.status(400).json({ message: "Invalid regno or password" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getStudents = async (req, res) => {
  try {
    const getStudent = await student.findById(req.stuId);
    if (!getStudent) {
      return res.status(400).json({ message: "Student not found" });
    }
    res.status(200).json(getStudent);
  } catch (error) {
    console.log(error);
  }
};

// Route for updating student marks
const StudentMarks = async (req, res) => {
  const marksData = req.body; // Array of student marks

  try {
    // Loop through each student in the marksData array
    for (let i = 0; i < marksData.length; i++) {
      const { regno, subject, marks } = marksData[i];

      // Ensure marks is stored as a number
      const marksValue = Number(marks);

      // Find the student record
      const studentRecord = await student.findOne({ regno });

      if (!studentRecord) {
        // If student not found, return error for the specific student
        return res.status(400).json({
          message: `Student with regno ${regno} not found`,
        });
      }

      // Ensure the 'subjects' Map is initialized
      if (!studentRecord.subjects) {
        studentRecord.subjects = new Map();
      }

      // Update the subject marks for the student
      studentRecord.subjects.set(subject, marksValue);

      // Save changes to the database for each student
      await studentRecord.save();
    }

    return res
      .status(200)
      .json({ message: "Marks for all students updated successfully" });
  } catch (error) {
    console.error("Error while updating student marks:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const Stuattendence = async (req, res) => {
  const attendanceRecords = req.body; // Expect an array of attendance records

  try {
    for (const record of attendanceRecords) {
      const { regno, date, status } = record;

      if (!regno || !date || !status) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const studentDoc = await student.findOne({ regno });

      if (!studentDoc) {
        return res.status(404).json({ message: `Student ${regno} not found` });
      }

      if (!studentDoc.attendence) {
        studentDoc.attendence = [];
      }

      const existingRecord = studentDoc.attendence.find(
        (att) => att.date.toISOString().split("T")[0] === date
      );

      if (existingRecord) {
        return res.status(400).json({
          message: `Attendance for ${regno} on ${date} already exists`,
        });
      }

      studentDoc.attendence.push({ date: new Date(date), status });
      await studentDoc.save();
    }

    res.status(200).json({ message: "Attendance added successfully" });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// router.patch("/attendence", Stuattendence);

const getMonthlyAttendance = async (req, res) => {
  const { regno } = req.query; // Extract the regno from the query parameters

  try {
    // Fetch the student data from the database using regno
    const student = await Student.findOne({ regno });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Prepare attendance data: this will give us the dates and attendance status
    const allAttendance = student.attendence.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(), // Convert date to a readable format
      status: entry.status,
    }));

    // Prepare subjects and marks data
    const subjects = student.subjects ? student.subjects : [];

    // Calculate the total attendance days
    const totalDays = allAttendance.length;
    const presentDays = allAttendance.filter(
      (record) => record.status === "Present"
    ).length;
    const attendancePercentage = totalDays
      ? (presentDays / totalDays) * 100
      : 0;

    // Send the student data in the response
    res.status(200).json({
      studentInfo: {
        name: student.name,
        regno: student.regno,
        branch: student.branch,
        joiningYear: student.joiningYear,
        studentphno: student.studentphno,
        parentphno: student.parentphno,
      },
      attendance: allAttendance,
      subjects: subjects,
      attendancePercentage: attendancePercentage.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const FilterStu = async (req, res) => {
  const { branch, year } = req.query;
  try {
    if (!branch || !year) {
      return res.status(400).json({
        message: "Branch and year are required parameters.",
      });
    }

    const students = await student.find({ branch: branch, joiningYear: year });

    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found for the given branch and year.",
      });
    }

    return res.status(200).json({
      message: "Students retrieved successfully.",
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  StudentSign,
  StudentLogin,
  StudentMarks,
  Stuattendence,
  FilterStu,
  getMonthlyAttendance,
  getStudents,
};
