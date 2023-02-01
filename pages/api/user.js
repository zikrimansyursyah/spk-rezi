const db = require("../../database/models/index.js");
const Users = db.users;

export default async function handler(req, res) {
  const userData = await Users.findAll();
  res.status(200).json({ data: userData })
}
