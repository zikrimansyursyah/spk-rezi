import jwt from "jsonwebtoken";

require("dotenv").config();

export default async function handler(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(400).json({
      status: 403,
      message: "Request Method Not Allowed",
    });
  }

  const { access_token } = req.body;

  try {
    const verif = jwt.verify(access_token, process.env.JWT_SECRET_KEY);
    return res.status(200).json({ status: 200, message: "Token Valid", data: verif });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Internal Server Error :" + error.message });
  }
}
