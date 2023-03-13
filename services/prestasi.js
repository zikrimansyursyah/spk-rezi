import { httpCall } from ".";
import * as API from "./constants.js";

export const getPrestasi = async (data) => {
  return await httpCall("POST", API.PRESTASI_GET_ALL, data);
};

export const addPrestasi = async (data) => {
  return await httpCall("POST", API.PRESTASI_TAMBAH, data);
};

export const editPrestasi = async (data) => {
  return await httpCall("PUT", API.PRESTASI_EDIT, data);
};

export const deletePrestasi = async (id) => {
  return await httpCall("DELETE", API.PRESTASI_DELETE, { id });
};
