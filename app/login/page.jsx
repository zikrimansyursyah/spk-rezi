import Client from "./client";
import Server from "./server";

export default async function Page() {
  return (
    <Client>
      <Server />
    </Client>
  );
}
