import * as API from "@/services/constants";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { httpCall } from "@/services";
import Loading from "./loading";

const DynamicUserTemplate = dynamic(() => import("./client"), { ssr: false, loading: () => <Loading /> });

export default async function Page({ params }) {
  let data = null;
  const { id } = params;
  await httpCall("POST", "http://" + (headers().get("host").includes("localhost") ? "127.0.0.1:3000" : headers().get("host")) + API.USERS_GET_DETAIL_SISWA, { id }, { cookie: headers().get("cookie") })
    .then((res) => {
      if (res.status === 200) {
        data = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  if (data) {
    return <DynamicUserTemplate data={data} />;
  }
  return redirect("/manajemen-siswa");
}

export async function generateMetadata({ params }) {
  let title = "Siswa";
  const { id } = params;
  await httpCall("POST", "http://" + (headers().get("host").includes("localhost") ? "127.0.0.1:3000" : headers().get("host")) + API.USERS_GET_NAMA_SISWA, { id }, { cookie: headers().get("cookie") })
    .then((res) => {
      if (res.status === 200) {
        title = res.data.nama;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  return { title };
}
