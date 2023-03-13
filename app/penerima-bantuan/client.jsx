"use client";

import { AppContext } from "@/context";
import { useContext, useEffect, useState } from "react";

// Components
import { Dropdown } from "primereact/dropdown";

export default function PenerimaBantuan() {
  const { classNames, loading, toast } = useContext(AppContext);

  const [semester, setSemester] = useState("ganjil");
  const [tahunAjaran, setTahunAjaran] = useState(`${(new Date().getFullYear() - 1).toString()}/${new Date().getFullYear().toString()}`);

  const [dataPenerima, setDataPenerima] = useState([
    {
      no: 1,
      nama: "Dzikri Mansyursyah Amin",
      no_induk_sekolah: "123456",
      nama_ayah: "Fox",
      nama_ibu: "Megan",
    },
    {
      no: 2,
      nama: "Dzikri Mansyursyah Amin",
      no_induk_sekolah: "123456",
      nama_ayah: "Fox",
      nama_ibu: "Megan",
    },
    {
      no: 3,
      nama: "Dzikri Mansyursyah Amin",
      no_induk_sekolah: "123456",
      nama_ayah: "Fox",
      nama_ibu: "Megan",
    },
  ]);

  // Options
  const getTahunAjaran = () => {
    let first = new Date().getFullYear() - 5;
    let last = new Date().getFullYear() + 5;

    let result = [];
    for (let i = first; i < last; i++) {
      result.push(`${i}/${i + 1}`);
    }

    return result;
  };

  const optionTahunAjaran = getTahunAjaran();

  return (
    <>
      <div className="p-4 flex fixed w-full justify-between items-center bg-white border-b shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)] z-50">
        <div className="flex gap-3">
          <div className="w-1 h-12 bg-sky-500 rounded-full"></div>
          <div className="flex flex-col">
            <span className="font-semibold">Penerima Bantuan</span>
            <span className="text-sm text-gray-600">Data Siswa Penerima Bantuan Kesejahteraan</span>
          </div>
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label htmlFor="semester_filter" className="text-sm">
              Semester
            </label>
            <Dropdown
              id="semester_filter"
              name="semester_filter"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              options={[
                { label: "Ganjil", value: "ganjil" },
                { label: "Genap", value: "genap" },
              ]}
              placeholder="semester"
              className="p-inputtext-sm w-40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="tahun_ajaran_filter" className="text-sm">
              Tahun Ajaran
            </label>
            <Dropdown
              id="tahun_ajaran_filter"
              name="tahun_ajaran_filter"
              value={tahunAjaran}
              onChange={(e) => setTahunAjaran(e.target.value)}
              options={optionTahunAjaran}
              placeholder="tahun ajaran"
              className="p-inputtext-sm w-26"
            />
          </div>
          <button type="submit" className="h-11 flex items-center gap-3 bg-[#2293EE] py-2 px-4 rounded-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200">
            <i className="pi pi-search text-white text-xs font-medium"></i>
            <span className="text-sm font-medium text-white">Tentukan</span>
          </button>
        </div>
      </div>
      <div className="px-4 pb-4 pt-32">
        <div className="bg-white w-full rounded-lg border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)] flex justify-between items-center p-4">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-medium">
              Daftar Penerima Bantuan Periode {tahunAjaran} Semester {semester.slice(0, 1).toUpperCase() + semester.slice(1)}
            </span>
            <span className="text-sm text-gray-500">daftar penerima bantuan yang terlampir dibawah ini telah dikalkulasikan secara valid dengan perhitungan Simple Additive Weighting</span>
          </div>
          <button type="submit" className="flex items-center h-fit gap-3 bg-[#2293EE] py-2 px-4 rounded-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200">
            <span className="text-xs font-medium text-white">Lihat Detail Perhitungan</span>
          </button>
        </div>
      </div>
      <div className="px-4 flex flex-col gap-4">
        {(dataPenerima || []).map((item, index) => (
          <div
            key={index}
            className="p-6 bg-white w-full rounded-lg border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)] grid grid-cols-12 gap-4 hover:shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.1)] hover:border-blue-400"
          >
            <div className="col-span-1 flex items-center">
              <span className="font-medium text-lg pr-8 border-r-2 border-blue-400">{item.no}</span>
            </div>
            <div className="col-span-3 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Nama Lengkap</span>
              <span className="font-medium">{item.nama}</span>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Nomor Induk Sekolah</span>
              <span className="font-medium">{item.no_induk_sekolah}</span>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Nama Ayah</span>
              <span className="font-medium">{item.nama_ayah}</span>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Nama Ibu</span>
              <span className="font-medium">{item.nama_ibu}</span>
            </div>
            <div className="col-span-2 flex items-center justify-end">
              <button type="submit" className="flex items-center gap-3 bg-[#2293EE] py-2 px-4 rounded-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200">
                <span className="text-xs font-medium text-white">Lihat Detail</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
