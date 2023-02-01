import httpCall from "."
import * as API from './constants.js';
import { getCookies } from ".";

export const getAllKaryawan = async (first = 0, rows = 10) => {
  return await httpCall('POST', API.GET_ALL_USER, { first, rows }, {
    'Authorize': 'Bearer ' + getCookies('access_token')
  })
}