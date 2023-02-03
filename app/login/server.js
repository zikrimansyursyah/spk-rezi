import { getAllCookies } from "@/services/server";

export default async function Server() {
  const cookies = getAllCookies();
  return {
    cookies,
  };
}
