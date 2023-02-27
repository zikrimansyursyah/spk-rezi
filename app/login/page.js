import { TITLE_PAGE } from "@/services/constants";
import Client from "./client";

export default function Page() {
  return <Client />;
}

export const metadata = {
  title: "Login" + TITLE_PAGE,
};
