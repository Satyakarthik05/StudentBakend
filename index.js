const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const FacultyRoutes = require("./routes/FacultyRoutes");
const StudentRoutes = require("./routes/StudentRoutes");
const Student = require("./models/StudentModel");
const verifyToken = require("./middlewares/VerifyStudentToken");
const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174","https://student-frontnd.vercel.app/","https://student-frontnd.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "token"],
  credentials: true,
};

mongoose
  .connect("mongodb+srv://satyakarthik:Satya12@@cluster0.d31vs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Mongodb Connected successfully"))
  .catch((error) => console.log(error));

app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/faculty", FacultyRoutes);
app.use("/student/", StudentRoutes);

app.get("/getattendance", verifyToken, async (req, res) => {
  const { regno } = req.query; // Assuming regno is passed as a query parameter

  try {
    const student = await Student.findOne({ regno });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendance = student.attendance.map((entry) => ({
      date: entry.date,
      status: entry.status,
    }));

    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance", error });
  }
});

app.listen(3000, () => {
  console.log("Server running successfully");
});
