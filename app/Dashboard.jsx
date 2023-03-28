"use client";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context";
import Image from "next/image";
import Link from "next/link";
import { getTotalSiswa } from "@/services/user";
import { getPenerima } from "@/services/penerimaBantuan";

export default function Dashboard() {
  const { access_token } = useContext(AppContext);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [dataPenerima, setDataPenerima] = useState([]);

  const getTotal = () => {
    getTotalSiswa().then((res) => {
      setTotalSiswa(res.data);
    });
  };

  const getDataPenerimaBantuan = () => {
    getPenerima({ tingkat_kelas: "6", semester: "ganjil", tahun_ajaran: "2022/2023", first: 0, rows: 5 }).then((res) => {
      if (res.status === 200) {
        let dataTemp = [];
        for (let i = 0; i < res.data.ranking.length; i++) {
          dataTemp.push({
            no: i + 1,
            ...res.data.ranking[i],
          });
        }
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
        <div className="col-span-8">
          <div className="grid grid-cols-12 gap-16 pt-10">
            <div className="col-span-5 relative">
              <Image src="/dashboard-1.png" alt="karakter 1 dashboard" fill className="object-contain" />
            </div>
            <div className="col-span-7 flex flex-col gap-4">
              <h1 className="text-6xl font-medium text-gray-800">Sistem Penunjang Keputusan</h1>
              <h2 className="text-2xl font-medium">Siswa Penerima Dana Bantuan Kesejahteraan</h2>
              <h3>Sekolah Dasar Negeri Pakulonan Barat 02</h3>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 mt-16">
            <p className="col-span-6 p-4 border border-blue-500 rounded-lg bg-white hover:shadow-xl hover:shadow-blue-200 hover:border-blue-400">
              Sistem Pendukung Keputusan (SPK) memiliki peran yang sangat penting dalam meningkatkan kualitas pengambilan keputusan di sekolah. Dengan menggunakan teknologi dan data yang ada, SPK
              dapat membantu mempercepat proses pengambilan keputusan yang akurat dan tepat waktu, sehingga dapat meningkatkan efisiensi dan efektivitas kegiatan di sekolah.
            </p>
            <div className="col-span-6 relative">
              <Image src="/dashboard-2.png" alt="karakter 1 dashboard" fill className="object-contain" />
            </div>
          </div>
          <div className="flex justify-center mt-32 text-sm text-gray-500">Copyright &copy; Ahmad Fahrezi - 2023</div>
        </div>
        <div className="col-span-4 flex flex-col gap-10">
          <div className="w-full h-48 bg-blue-500 border rounded-lg hover:shadow-lg hover:shadow-gray-200 hover:border-blue-400 p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-white">Total Dana Dikelola</h3>
              <Link href="/penerima-bantuan" className="w-7 h-7 flex justify-center items-center rounded-md hover:bg-gray-100 hover:shadow-sm group">
                <i className="pi pi-external-link text-white group-hover:text-gray-700"></i>
              </Link>
            </div>
            <div className="text-5xl font-medium text-white">Rp. 1.722.500</div>
            <div className="text-xs text-white">Terakhir diupdate : 22 Februari 2023</div>
          </div>
          <div className="w-full bg-white border rounded-lg hover:shadow-lg hover:shadow-gray-200 hover:border-blue-400 p-5 flex flex-col gap-4 justify-between">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Penerima Dana Terbaru {new Date().getFullYear()}</h3>
              <Link href="/penerima-bantuan" className="w-7 h-7 flex justify-center items-center rounded-md hover:bg-gray-100 hover:shadow-sm">
                <i className="pi pi-external-link"></i>
              </Link>
            </div>
            {dataPenerima.length === 0 && <div>tidak ada data</div>}
            {(dataPenerima || []).map((item, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="grid grid-cols-3 p-2 border rounded hover:bg-blue-400 group hover:shadow-sm">
                  <span className="col-span-2 border-r pr-4 font-medium group-hover:text-white">{item.nama}</span>
                  <span className="col-span-1 pl-4 text-gray-600 font-light group-hover:text-white">{item.no_induk_sekolah}</span>
                </div>
              </div>
            ))}
            <div className="text-xs">Terakhir diupdate : hari ini</div>
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
            <div className="text-6xl font-medium">
              {totalSiswa} <span className="text-4xl">Siswa</span>
            </div>
            <div className="text-xs">Terakhir diupdate : 22 Februari 2023</div>
          </div>
        </div>
      </div>
    </div>
  );
}
