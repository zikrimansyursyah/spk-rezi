"use client";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context";
import Image from "next/image";
import Link from "next/link";
import { getTotalSiswa } from "@/services/user";
import { getPenerima } from "@/services/penerimaBantuan";
import { Skeleton } from "primereact/skeleton";

export default function Dashboard() {
  const { access_token } = useContext(AppContext);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [lastUpdateSiswa, setLastUpdateSiswa] = useState("");
  const [dataPenerima, setDataPenerima] = useState([]);
  const [lastUpdatePenerima, setLastUpdatePenerima] = useState("");

  const getTotal = () => {
    getTotalSiswa().then((res) => {
      setLastUpdateSiswa(new Date(res.data.last_updated).toLocaleDateString());
      setTotalSiswa(res.data.count);
    });
  };

  const getDataPenerimaBantuan = () => {
    getPenerima({ tingkat_kelas: "6", semester: "ganjil", tahun_ajaran: `${new Date().getFullYear() - 1}/${new Date().getFullYear()}`, first: 0, rows: 5 }).then((res) => {
      if (res.status === 200) {
        let dataTemp = [];
        for (let i = 0; i < res.data.ranking.length; i++) {
          dataTemp.push({
            no: i + 1,
            ...res.data.ranking[i],
          });
        }

        setLastUpdatePenerima(new Date(res.data.last_updated).toLocaleDateString());
        setDataPenerima(dataTemp);
      }
    });
  };

  useEffect(() => {
    getTotal();
    getDataPenerimaBantuan();
  }, []);

  return (
    <div className="min-h-[94vh] bg-gradient-to-br from-white to-gray-100">
      <div className="px-12 py-9 grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-12 gap-6 pt-10">
            <div className="col-span-12 lg:col-span-5 relative h-44 lg:h-auto order-last lg:order-first">
              <Image src="/dashboard-1.png" alt="karakter 1 dashboard" fill className="object-contain" />
            </div>
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
              <h1 className="text-6xl font-medium text-gray-800 text-center lg:text-start">Sistem Penunjang Keputusan</h1>
              <h2 className="text-2xl font-medium text-center lg:text-start">Siswa Penerima Dana Bantuan Kesejahteraan</h2>
              <h3 className="text-center lg:text-start">Sekolah Dasar Negeri Pakulonan Barat 02</h3>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 lg:gap-10 mt-10 lg:mt-16">
            <p className="col-span-12 lg:col-span-6 p-4 border border-blue-500 rounded-lg bg-white hover:shadow-xl hover:shadow-blue-200 hover:border-blue-400">
              Sistem Pendukung Keputusan (SPK) memiliki peran yang sangat penting dalam meningkatkan kualitas pengambilan keputusan di sekolah. Dengan menggunakan teknologi dan data yang ada, SPK
              dapat membantu mempercepat proses pengambilan keputusan yang akurat dan tepat waktu, sehingga dapat meningkatkan efisiensi dan efektivitas kegiatan di sekolah.
            </p>
            <div className="hidden lg:block col-span-6 relative">
              <Image src="/dashboard-2.png" alt="karakter 1 dashboard" fill className="object-contain" />
            </div>
          </div>
          <div className="hidden lg:flex justify-center mt-32 text-sm text-gray-500">Copyright &copy; Ahmad Fahrezi - 2023</div>
        </div>
        <div className="col-span-12 lg:col-span-4 mt-10 lg:mt-0 flex flex-col gap-10">
          <div className="w-full bg-white border rounded-lg hover:shadow-lg hover:shadow-gray-200 hover:border-blue-400 p-5 flex flex-col gap-4 justify-between">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Penerima Dana Terbaru {`${new Date().getFullYear() - 1}/${new Date().getFullYear()}`}</h3>
              <Link href="/penerima-bantuan" className="w-7 h-7 flex justify-center items-center rounded-md hover:bg-gray-100 hover:shadow-sm">
                <i className="pi pi-external-link"></i>
              </Link>
            </div>
            {dataPenerima.length === 0 && (
              <div className="flex flex-col gap-3">
                <Skeleton width="17rem" height="3rem" />
                <Skeleton width="17rem" height="3rem" />
                <Skeleton width="17rem" height="3rem" />
              </div>
            )}
            {(dataPenerima || []).map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="grid grid-cols-3 p-2 border rounded hover:bg-blue-400 group hover:shadow-sm">
                  <span className="col-span-2 border-r pr-4 font-medium group-hover:text-white">{item.nama}</span>
                  <span className="col-span-1 pl-4 text-gray-600 font-light group-hover:text-white">{item.no_induk_sekolah}</span>
                </div>
              </div>
            ))}
            <div className="text-xs flex items-center gap-2">Terakhir diupdate : {lastUpdatePenerima || <Skeleton width="8rem" height="1rem" />}</div>
          </div>
          <div className="w-full h-48 bg-white border rounded-lg hover:shadow-lg hover:shadow-gray-200 hover:border-blue-400 p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Total Siswa Dikelola</h3>
              {access_token.user_type === "admin" && (
                <Link href="/manajemen-siswa" className="w-7 h-7 flex justify-center items-center rounded-md hover:bg-gray-100 hover:shadow-sm">
                  <i className="pi pi-external-link"></i>
                </Link>
              )}
            </div>
            {totalSiswa ? (
              <div className="text-6xl font-medium">
                {totalSiswa} <span className="text-4xl">Siswa</span>
              </div>
            ) : (
              <Skeleton width="15rem" height="5rem" />
            )}
            <div className="text-xs flex items-center gap-2">Terakhir diupdate : {lastUpdateSiswa ? lastUpdateSiswa : <Skeleton width="8rem" height="1rem" />}</div>
          </div>
          <div className="flex lg:hidden justify-center mt-20 text-sm text-gray-500">Copyright &copy; Ahmad Fahrezi - 2023</div>
        </div>
      </div>
    </div>
  );
}
