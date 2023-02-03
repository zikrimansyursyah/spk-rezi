import { httpCall } from "./index.js";
import * as API from "./constants.js";

export const getAllUser = async (first = 0, rows = 10) => {
  return await httpCall("post", API.USERS_GET_ALL, { first, rows });
};
