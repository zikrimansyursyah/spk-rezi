import { httpCall } from ".";
import * as API from "./constants.js";

export const addAbsen = async (data) => {
  return await httpCall("POST", API.ABSENSI_TAMBAH, data);
};

export const getAllAbsen = async (data) => {
  return await httpCall("POST", API.ABSENSI_GET_ALL, data);
};

export const editAbsen = async (data) => {
  return await httpCall("PUT", API.ABSENSI_EDIT, data);
};

export const deleteAbsen = async (id) => {
  return await httpCall("DELETE", API.ABSENSI_DELETE, { id });
};
