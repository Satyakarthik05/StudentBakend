const Faculty = require("../models/StudentModel");
const jwt = require("jsonwebtoken");

secret = "Student@12";

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ error: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, secret);
    const facultys = await Faculty.findById(decoded.facultyId);
    if (!facultys) {
      return res.status(404).json({ error: "college not found" });
    }
    req.facultyId = facultys._id;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Invalid Token" });
  }
};
module.exports = verifyToken;
