import { httpCall } from ".";
import * as API from "./constants.js";

export const getAllUser = async (first = 0, rows = 10) => {
  return await httpCall("post", API.USERS_GET_ALL, { first, rows });
};

export const login = async (data) => {
  return await httpCall("POST", API.AUTH_LOGIN, data);
};

export const logout = async () => {
  return await httpCall("POST", API.AUTH_LOGOUT);
};
