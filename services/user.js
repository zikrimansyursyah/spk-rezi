import { httpCall } from ".";
import * as API from "./constants.js";

export const getAllSiswa = async (first = 0, rows = 10, search) => {
  return await httpCall("POST", API.USERS_GET_ALL, { first, rows, search });
};

export const getNamaSiswa = async (id) => {
  return await httpCall("POST", API.USERS_GET_NAMA_SISWA, { id });
};

export const editSiswa = async (data) => {
  return await httpCall("PUT", API.USERS_PUT_EDIT_USER, data);
};

export const addSiswa = async (data) => {
  return await httpCall("POST", API.USERS_ADD_USER, data);
};

export const deleteSiswa = async (id) => {
  return await httpCall("DELETE", API.USERS_DELETE_USER, { id });
};

export const login = async (data) => {
  return await httpCall("POST", API.AUTH_LOGIN, data);
};

export const logout = async () => {
  return await httpCall("POST", API.AUTH_LOGOUT);
};

export const getDropdownSiswa = async (tingkat_kelas) => {
  return await httpCall("POST", API.USERS_DROPDOWN_SISWA, { tingkat_kelas });
};

export const getTotalSiswa = async () => {
  return await httpCall("GET", API.USERS_TOTAL_SISWA);
};
