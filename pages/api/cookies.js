import cookie from "cookie";

export default function handler(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(400).json({
      status: 400,
      message: "Request Method Not Allowed",
    });
  }

  const { cookie_name, value, max_age } = req.body;
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(cookie_name, value, {
      httpOnly: true,
      maxAge: max_age !== undefined && max_age !== null ? max_age : 1000 * 1000,
      sameSite: "strict",
      path: "/",
    })
  );

  return res.status(200).json({ message: `set ${cookie_name} cookies success` });
}
