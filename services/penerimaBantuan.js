import { httpCall } from ".";
import * as API from "./constants.js";

export const getPenerima = async (data) => {
  return await httpCall("POST", API.PENERIMA_GET, data);
};
