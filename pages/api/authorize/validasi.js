import { API_UNAUTHORIZED } from "@/services/constants";
import { verifyJWT } from "@/utils/jwt";

export default async function handler(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(400).json({
      status: 400,
      message: "Request Method Not Allowed",
    });
  }

  const { access_token } = req.headers;

  const verif = verifyJWT(access_token);
  if (verif) {
    return res.status(200).json({ status: 200, message: "Token Valid", data: verif });
  } else {
    return res.status(API_UNAUTHORIZED.status).json(API_UNAUTHORIZED);
  }
}
