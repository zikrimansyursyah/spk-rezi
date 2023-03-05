import { httpCall } from ".";
import * as API from "./constants.js";

export const getAllSiswa = async (first = 0, rows = 10, search) => {
  return await httpCall("POST", API.USERS_GET_ALL, { first, rows, search });
};

export const login = async (data) => {
  return await httpCall("POST", API.AUTH_LOGIN, data);
};

export const logout = async () => {
  return await httpCall("POST", API.AUTH_LOGOUT);
};
