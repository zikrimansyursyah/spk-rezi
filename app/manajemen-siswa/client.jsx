"use client";

import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "@/context";
import { getAllSiswa } from "@/services/user";

// Components
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Menu } from "primereact/menu";

export default function ManajemenSiswa() {
  const { toast } = useContext(AppContext);
  const menuAction = useRef(null);

  // Filter
  const [tipeUser, setTipeUser] = useState(null);
  const [optionTipeUser, setOptionTipeUser] = useState([]);
  const [loadingTipeUser, setLoadingTipeUser] = useState(true);
  const [search, setSearch] = useState("");

  // Table
  const [dataUser, setDataUser] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
  });

  const [selectedData, setSelectedData] = useState(null);

  const actionMenu = [{ label: "Lihat", className: "text-sm" }, { label: "Ubah", className: "text-sm" }, { separator: true }, { label: "Hapus", className: "text-sm" }];

  const getDataSiswa = () => {
    setLoadingTable(true);
    getAllSiswa(lazyParams.first, lazyParams.rows, search)
      .then((res) => {
        if (res.status !== 200) {
          return toast.current.show({ severity: "warn", summary: "Gagal memperoleh data siswa", detail: res.message });
        }

        let dataTemp = [];
        for (let i = 0; i < (res.data || []).length; i++) {
          dataTemp.push({ ...res.data[i], no: lazyParams.first + i + 1 });
        }

        setDataUser(dataTemp);
      })
      .catch((err) => {
        toast.current.show({ severity: "error", summary: "Internal Server Error", detail: err?.message });
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  // Template
  const actionBodyTemplate = (data) => {
    return (
      <>
        <Menu model={actionMenu} popup ref={menuAction} className="mt-2 w-20" onHide={() => setSelectedData(null)} />
        <button
          onClick={(e) => {
            menuAction.current.toggle(e);
            setSelectedData(data);
          }}
          className="border border-transparent h-7 w-7 rounded-full hover:shadow hover:border-gray-200 focus:ring focus:ring-blue-100"
        >
          <i className="pi pi-ellipsis-v text-sm"></i>
        </button>
      </>
    );
  };

  useEffect(() => {
    getDataSiswa();
  }, [lazyParams]);

  return (
    <div>
      <div className="p-4 flex justify-between items-center bg-white border-b shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)]">
        <div className="flex gap-3">
          <div className="w-1 h-12 bg-sky-500 rounded-full"></div>
          <div className="flex flex-col">
            <span className="font-semibold">Manajemen User</span>
            <span className="text-sm text-gray-600">Mengelola data siswa di SD Negeri 02 Pakulonan Barat</span>
          </div>
        </div>
        <div>
          <button className="flex items-center gap-3 bg-[#2293EE] py-2 px-4 rounded-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200">
            <i className="pi pi-plus text-white text-xs font-semibold"></i>
            <span className="text-sm font-medium text-white">Tambah User</span>
          </button>
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="bg-white w-full mt-1 rounded-lg border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)] flex flex-col">
          <div className="py-2 px-4 flex items-center gap-2">
            <i className="pi pi-filter-fill text-[1rem] text-yellow-300"></i>
            <span className="font-medium">Filter</span>
          </div>
          <span className="border-b"></span>
          <div className="py-4 px-4 flex justify-between items-center">
            <div>
              <div className="flex flex-col gap-1">
                <label htmlFor="tipe-pengguna" className="text-sm">
                  Tipe Pengguna
                </label>
                <Dropdown
                  id="tipe-pengguna"
                  value={tipeUser}
                  onChange={(e) => setTipeUser(e.value)}
                  options={optionTipeUser}
                  placeholder="Tipe pengguna"
                  className="p-inputtext-sm"
                  emptyMessage="Tidak ada data"
                  disabled={loadingTipeUser}
                />
              </div>
            </div>
            <div className="flex">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  placeholder="Search"
                  type="search"
                  value={search}
                  onKeyDown={(e) => e.key === "Enter" && getDataSiswa()}
                  onChange={(e) => setSearch(e.target.value)}
                  className="p-inputtext-sm rounded-tr-none rounded-br-none"
                />
              </span>
              <button onClick={getDataSiswa} className="bg-[#2293EE] py-2 px-4 rounded-tr-lg rounded-br-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200">
                <i className="pi pi-search text-white"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white w-full mt-4 p-5 rounded-lg border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)]">
          <DataTable
            showGridlines
            stripedRows
            paginator
            rowsPerPageOptions={[10, 25, 50]}
            rows={lazyParams.rows}
            first={lazyParams.first}
            value={dataUser}
            loading={loadingTable}
            size="small"
            emptyMessage="Data tidak ditemukan"
            dataKey="id"
          >
            <Column field="no" header="#" bodyClassName="td-h-center" headerClassName="th-h-center" />
            <Column field="no_induk_sekolah" header="Nomor Induk Sekolah" />
            <Column field="nama" header="Nama Siswa" />
            <Column field="jenis_kelamin" header="Jenis Kelamin" />
            <Column field="nama_ayah" header="Nama Ayah" />
            <Column field="nama_ibu" header="Nama Ibu" />
            <Column header="Actions" body={actionBodyTemplate} className="w-[5%]" bodyClassName="td-h-center" headerClassName="th-h-center" />
          </DataTable>
        </div>
      </div>
    </div>
  );
}