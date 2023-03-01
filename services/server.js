"use server";
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
  let config = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data !== null) {
    config.body = JSON.stringify(data);
  }

  if (headers !== null) {
    config.headers = { ...config.headers, ...headers };
  }

  let api = {
    status: 500,
    message: null,
  };

  await fetch("http://" + host + url, config)
    .then((response) => {
      api.status = response.status;
      return response.json();
    })
    .then((result) => {
      api = { ...api, ...result };
    })
    .catch((error) => {
      api.message = error?.message;
    });

  return api;
}
