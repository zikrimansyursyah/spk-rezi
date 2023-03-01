import { RES_METHOD_NOT_ALLOWED, RES_INTERNAL_SERVER_ERROR } from "@/services/constants";
import { deleteCookie } from "cookies-next";

export default async function handler(req, res) {
  if (req.method.toUpperCase() !== "POST") {
    return res.status(RES_METHOD_NOT_ALLOWED.status).json(RES_METHOD_NOT_ALLOWED);
  }

  try {
    deleteCookie("access_token", { req, res });
    deleteCookie("menu", { req, res });

    return res.status(200).json({ status: 200, message: "Logout Berhasil" });
  } catch (error) {
    return res.status(RES_INTERNAL_SERVER_ERROR.status).json(RES_INTERNAL_SERVER_ERROR);
  }
}
