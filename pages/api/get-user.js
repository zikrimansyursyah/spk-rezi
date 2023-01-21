const db = require("../../database/models/index.js");
const User = db.Users;

export default async function handler(req, res) {
  // res.status(200).json({ name: 'John Doe' })
  const getData = await User.findAll();

  res.status(200).json({ data: getData });
}
