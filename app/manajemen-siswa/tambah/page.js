import dynamic from "next/dynamic";
import Loading from "./loading";

const DynamicUserTemplate = dynamic(() => import("./client"), { ssr: false, loading: () => <Loading /> });

export default async function Page() {
  return <DynamicUserTemplate />;
}

export const metadata = {
  title: "Tambah Siswa",
};
