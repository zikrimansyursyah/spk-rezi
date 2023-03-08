import dynamic from "next/dynamic";
import Loading from "./loading";

const DynamicAbsensiTemplate = dynamic(() => import("./client"), { ssr: false, loading: () => <Loading /> });

export default async function Page() {
  return <DynamicAbsensiTemplate />;
}

export const metadata = {
  title: "Absensi Siswa",
};
