"use client";

import { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "@/context";
import { addSiswa, deleteSiswa, getAllSiswa } from "@/services/user";
import Link from "next/link";
import { ExcelRenderer } from "react-excel-renderer";
import FileSaver from "file-saver";

// Components
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Menu } from "primereact/menu";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { validateSchema } from "@/validation";
import { mapperRequest, userImportSchema } from "@/validation/auth";

export default function ManajemenSiswa() {
  const { toast, loading } = useContext(AppContext);
  const menuAction = useRef(null);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleDialogResult, setVisibleDialogResult] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);

  const [successAdd, setSuccessAdd] = useState(0);
  const [failedAdd, setFailedAdd] = useState(0);

  // Filter
  const [search, setSearch] = useState("");

  // Table
  const [dataUser, setDataUser] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
  });

  const [selectedData, setSelectedData] = useState(null);

  const actionMenu = [
    {
      template: () => {
        return (
          <Link href={`/manajemen-siswa/${selectedData?.id}`} className="p-menuitem-link">
            <span className="p-menuitem-text text-sm">Lihat</span>
          </Link>
        );
      },
    },
    {
      template: () => {
        return (
          <Link href={`/manajemen-siswa/${selectedData?.id}?edit=true`} className="p-menuitem-link">
            <span className="p-menuitem-text text-sm">Ubah</span>
          </Link>
        );
      },
    },
    { separator: true },
    {
      label: "Hapus",
      className: "text-sm",
      command: () => {
        confirmDialog({
          message: "Anda yakin ingin menghapus " + selectedData.nama.split(" ")[0] + " ?",
          header: "Hapus Siswa",
          icon: "pi pi-exclamation-circle",
          accept: () => {
            loading({ text: "Kami sedang menghapus data " + selectedData.nama.split(" ")[0], visible: true });
            deleteSiswa(selectedData.id)
              .then((res) => {
                if (res.status !== 200) {
                  return toast.current.show({ severity: "warn", summary: "Gagal menghapus data siswa", detail: res.message });
                }

                toast.current.show({ severity: "success", summary: "Berhasil menghapus data siswa", detail: res.message });
                return getDataSiswa();
              })
              .catch((error) => {
                return toast.current.show({ severity: "error", summary: "Gagal menghapus data siswa", detail: error?.message });
              })
              .finally(() => {
                loading({ text: null, visible: false });
              });
          },
          reject: () => {
            return;
          },
        });
      },
    },
  ];

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
        setTotalRecords(res.count);
      })
      .catch((err) => {
        toast.current.show({ severity: "error", summary: "Internal Server Error", detail: err?.message });
      })
      .finally(() => {
        setLoadingTable(false);
      });
  };

  const handleDownloadTemplate = () => {
    FileSaver.saveAs("/template.xlsx", "Template Import Data Siswa.xlsx");
  };

  const handleUploadFile = (e) => {
    if (!e.target.files || !e.target.files[0]) return;

    const tempFile = e.target.files[0];
    const acceptFile = [".csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];

    if (!acceptFile.includes(tempFile.type)) {
      return toast.current.show({ severity: "warn", summary: "Gagal Upload", detail: "Tipe file harus berformat excel" });
    }
    setFile(tempFile);
    setFileName(e.target.value);
  };

  const handleProcessData = async () => {
    if (!file) {
      return toast.current.show({ severity: "warn", summary: "Gagal Upload", detail: "Kesalahan pada saat membaca file, harap muat ulang halaman" });
    }

    let column, data;

    await ExcelRenderer(file, (err, resp) => {
      if (err) {
        return toast.current.show({ severity: "warn", summary: "Gagal Proses", detail: err });
      }

      column = resp.rows[0];
      data = (resp.rows || []).filter((v, i) => {
        if (i !== 0 && Array.isArray(v) && v.length > 1) {
          return v;
        }
      });
    });

    let dataList = [];
    loading({ text: `Kami sedang menambah 0/${data.length} data`, visible: true });
    for (const dt of data) {
      let temp = {};
      for (let i = 0; i < column.length; i++) {
        if (column[i] === "Username") {
          temp[column[i]] = dt[i].toLowerCase();
        } else {
          temp[column[i]] = dt[i];
        }
      }
      dataList.push(temp);
    }

    let payload = [];
    for (const e of dataList) {
      const res = validateSchema(userImportSchema, e);

      if (res._error) {
        return toast.current.show({ severity: "warn", summary: "Data Tidak Sesuai", detail: `${res.message} pada data ${e["Nama Siswa"]} (${e["NISN"]})` });
      }

      let temp = {};
      for (const dt of Object.keys(res) || []) {
        temp[mapperRequest[dt]] = ["is_ayah_bekerja", "is_ibu_bekerja"].includes(mapperRequest[dt]) ? res[dt] === "Bekerja" : res[dt];
      }
      payload.push(temp);
    }

    let successInsert = 0;
    let failedInsert = 0;
    for (let i = 0; i < payload.length; i++) {
      let isError = false;
      await addSiswa(payload[i])
        .then((res) => {
          if (res.status !== 200) {
            failedInsert++;
            toast.current.show({
              severity: "warn",
              summary: "Gagal menambah data",
              detail: `${res.message}, pada data ${payload[i].nama} (${payload[i].nisn})`,
              sticky: true,
            });
          } else {
            successInsert++;
          }
        })
        .catch((err) => {
          isError = true;
          toast.current.show({
            severity: "warn",
            summary: "Gagal menambah data",
            detail: err.message,
            sticky: true,
          });
        })
        .finally(() => {
          loading({ text: `Kami sedang menambah ${successInsert + failedInsert}/${data.length} data`, visible: true });
        });

      if (isError) {
        loading({ text: null, visible: false });
        break;
      }

      if (payload.length === i + 1) {
        loading({ text: null, visible: false });
        setSuccessAdd(successInsert);
        setFailedAdd(failedInsert);
        setVisibleDialogResult(true);
        setVisibleDialog(false);
        setFile(null);
        setFileName("");

        if (successInsert > 0) {
          getDataSiswa();
        }
      }
    }
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
          className="h-7 w-7 rounded-full border border-transparent hover:border-gray-200 hover:shadow focus:ring focus:ring-blue-100"
        >
          <i className="pi pi-ellipsis-v text-sm"></i>
        </button>
      </>
    );
  };

  const tingkatKelasBodyTemplate = (data) => {
    return (
      <>
        <span>{data.tingkat_kelas === "lulus" ? "Sudah Lulus" : `Kelas ${data.tingkat_kelas}`}</span>
      </>
    );
  };

  useEffect(() => {
    getDataSiswa();
  }, [lazyParams]);

  return (
    <div>
      <div className="fixed z-50 grid w-full grid-cols-2 gap-4 border-b bg-white p-4 pl-20 shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)] md:pl-4">
        <div className="col-span-2 flex gap-3 md:col-span-1">
          <div className="h-12 w-1 rounded-full bg-sky-500"></div>
          <div className="flex flex-col">
            <span className="font-semibold">Manajemen User</span>
            <span className="text-sm text-gray-600">Mengelola data siswa di SD Negeri 02 Pakulonan Barat</span>
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-start gap-2 md:col-span-1 md:justify-end">
          <Link href="/manajemen-siswa/tambah" className="flex h-fit w-fit items-center gap-3 rounded-lg bg-[#2293EE] py-2 px-4 hover:bg-[#4da5ed] focus:ring focus:ring-blue-200 active:scale-[0.97]">
            <i className="pi pi-plus text-xs font-semibold text-white"></i>
            <span className="text-sm font-medium text-white">Tambah Siswa</span>
          </Link>
          <button
            onClick={() => {
              setVisibleDialog(true);
            }}
            className="flex h-fit w-fit items-center gap-3 rounded-lg bg-[#2293EE] py-2 px-4 hover:bg-[#4da5ed] focus:ring focus:ring-blue-200 active:scale-[0.97]"
          >
            <i className="pi pi-file-excel text-xs font-semibold text-white"></i>
            <span className="text-sm font-medium text-white">Import Data Siswa</span>
          </button>
        </div>
      </div>
      <div className="px-4 pb-4 pt-40 md:pt-24">
        <div className="mt-1 flex w-full flex-col rounded-lg border bg-white shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)]">
          <div className="flex items-center gap-2 py-2 px-4">
            <i className="pi pi-filter-fill text-[1rem] text-yellow-300"></i>
            <span className="font-medium">Filter</span>
          </div>
          <span className="border-b"></span>
          <div className="flex items-center justify-between py-4 px-4">
            <div></div>
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
              <button onClick={getDataSiswa} className="rounded-tr-lg rounded-br-lg bg-[#2293EE] py-2 px-4 hover:bg-[#4da5ed] focus:ring focus:ring-blue-200 active:scale-[0.97]">
                <i className="pi pi-search text-white"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-4 w-full rounded-lg border bg-white p-5 shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)]">
          <DataTable
            showGridlines
            responsiveLayout="stack"
            breakpoint="960px"
            stripedRows
            paginator
            lazy
            rowsPerPageOptions={[10, 25, 50]}
            rows={lazyParams.rows}
            first={lazyParams.first}
            value={dataUser}
            loading={loadingTable}
            totalRecords={totalRecords}
            onPage={(e) => setLazyParams(e)}
            size="small"
            emptyMessage="Data tidak ditemukan"
            dataKey="id"
          >
            <Column field="no" header="#" bodyClassName="td-h-center" headerClassName="th-h-center" />
            <Column field="no_induk_sekolah" header="Nomor Induk Sekolah" />
            <Column field="nama" header="Nama Siswa" />
            <Column field="tingkat_kelas" header="Tingkat Kelas" body={tingkatKelasBodyTemplate} />
            <Column field="jenis_kelamin" header="Jenis Kelamin" />
            <Column field="nama_ayah" header="Nama Ayah" />
            <Column field="nama_ibu" header="Nama Ibu" />
            <Column header="Actions" body={actionBodyTemplate} className="w-[5%]" bodyClassName="td-h-center" headerClassName="th-h-center" />
          </DataTable>
        </div>
      </div>
      <ConfirmDialog />
      <Dialog
        header="Import Data Siswa"
        visible={visibleDialog}
        style={{ width: "40vw" }}
        breakpoints={{ "960px": "50vw", "641px": "100vw" }}
        onHide={() => {
          setVisibleDialog(false);
          setFile(null);
          setFileName("");
        }}
      >
        <div className="mb-4 flex">
          <InputText placeholder="Pilih file data" type="file" value={fileName} onChange={handleUploadFile} className="p-inputtext-sm rounded-tr-none rounded-br-none" />
          <button
            onClick={handleProcessData}
            disabled={!file}
            className="flex flex-grow items-center justify-center rounded-r-lg bg-[#2293EE] py-2 px-4 hover:bg-[#4da5ed] focus:ring focus:ring-blue-200 active:scale-[0.97]"
          >
            <span className="text-sm font-medium text-white">Proses File</span>
          </button>
        </div>
        <small>
          <span className="text-red-500">*</span> penambahan data siswa menggunakan fitur import harus sesuai dengan template yang telah disediakan
          <span onClick={handleDownloadTemplate} className="ml-1 cursor-pointer underline">
            Unduh file template Import Data Siswa
          </span>
        </small>
      </Dialog>
      <Dialog
        header="Hasil Import Data Siswa"
        visible={visibleDialogResult}
        style={{ width: "40vw" }}
        breakpoints={{ "960px": "50vw", "641px": "100vw" }}
        onHide={() => {
          setVisibleDialogResult(false);
        }}
      >
        <div className="flex flex-col gap-2">
          <span className="rounded-lg bg-green-100 px-4 py-2 text-lg font-medium">Berhasil : {successAdd}</span>
          <span className="rounded-lg bg-red-100 px-4 py-2 text-lg font-medium">Gagal : {failedAdd}</span>
        </div>
      </Dialog>
    </div>
  );
}
