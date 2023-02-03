"use server";
import axios from "axios";
import { headers, cookies } from "next/headers";

export function getCookies(name) {
  return cookies().get(name)?.value;
}

export function getAllCookies() {
  let result = {};
  cookies()
    .getAll()
    .map((item) => {
      result[item.name] = item.value;
    });

  return result;
}

export function getHeader(name) {
  return headers().get(name);
}

export async function httpCall(method, url, data = null, headers = null) {
  const host = getHeader("host");
  let result = null;

  let config = {
    method: method,
    url: "http://" + host + url,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data !== null) {
    config.data = data;
  }

  if (headers !== null) {
    config.headers = { ...config.headers, ...headers };
  }

  await axios(config)
    .then((response) => {
      result = response.data;
    })
    .catch((error) => {
      result = error.response;
    });

  return result;
}
