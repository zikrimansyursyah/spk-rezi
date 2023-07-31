"use client";

import { AppContext } from "@/context";
import { useContext, useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { ExcelRenderer } from "react-excel-renderer";
import FileSaver from "file-saver";

// Components
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Menu } from "primereact/menu";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";

// Validation
import { absensiSchema, mapperRequestAbsensi } from "@/validation/absensi";
import { getDropdownSiswa, getIdSiswaByNIS } from "@/services/user";
import { addAbsen, deleteAbsen, editAbsen, getAllAbsen } from "@/services/absensi";
import { validateSchema } from "@/validation";

export default function User() {
  const router = useRouter();
  const { classNames, loading, toast } = useContext(AppContext);
  const menuAction = useRef(null);

  const optionBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleDialogResult, setVisibleDialogResult] = useState(false);
  const [file, setFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [successAdd, setSuccessAdd] = useState(0);
  const [failedAdd, setFailedAdd] = useState(0);

  // Table
  const [bulan, setBulan] = useState(optionBulan[new Date().getMonth()]);
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [loadingTable, setLoadingTable] = useState(true);
  const [dataAbsensi, setDataAbsensi] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
  });

  const [optionSiswa, setOptionSiswa] = useState([]);
  const [loadingOptionSiswa, setLoadingOptionSiswa] = useState(true);
  const [tingkatKelas, setTingkatKelas] = useState("all");
  const [tingkatKelasFilter, setTingkatKelasFilter] = useState("all");

  // Dialog
  const [visibleDialogAdd, setVisibleDialogAdd] = useState(false);
  const [tipeDialog, setTipeDialog] = useState("tambah");

  const [selectedData, setSelectedData] = useState(null);

  // Options
  const getTahun = () => {
    let first = new Date().getFullYear() - 10;
    let last = new Date().getFullYear() + 10;

    let result = [];
    for (let i = first; i < last; i++) {
      result.push(`${i}`);
    }

    return result;
  };

  const optionTahun = getTahun();

  const actionMenu = [
    {
      label: "Ubah",
      className: "text-sm",
      command: () => {
        setTipeDialog("ubah");
        setVisibleDialogAdd(true);
        getListSiswa();
        const params = { ...selectedData };
        delete params.nama;
        delete params.id;
        delete params.no;
        delete params.no_induk_sekolah;
        formik.setValues(params);
      },
    },
    { separator: true },
    {
      label: "Hapus",
      className: "text-sm",
      command: () => {
        confirmDialog({
          message: "Anda yakin ingin menghapus Absen " + selectedData.nama.split(" ")[0] + " ?",
          header: "Hapus Data Absen",
          icon: "pi pi-exclamation-circle",
          accept: () => {
            loading({ text: "Kami sedang menghapus data Absen " + selectedData.nama.split(" ")[0], visible: true });
            deleteAbsen(selectedData.id)
              .then((res) => {
                if (res.status !== 200) {
                  return toast.current.show({ severity: "warn", summary: "Gagal menghapus data absen", detail: res.message });
                }

                toast.current.show({ severity: "success", summary: "Berhasil menghapus data absen", detail: res.message });
                return getDataAbsensi();
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

  const getDataAbsensi = () => {
    setLoadingTable(true);
    getAllAbsen({ first: lazyParams.first, rows: lazyParams.rows, bulan, tahun, tingkat_kelas: tingkatKelasFilter })
      .then((res) => {
        if (res.status !== 200) {
          return toast.current.show({ severity: "warn", summary: "Gagal", detail: res?.message });
        }

        let dataTemp = [];
        for (let i = 0; i < res.data.length; i++) {
          dataTemp.push({
            ...res.data[i],
            no: lazyParams.first + i + 1,
          });
        }
        setDataAbsensi(dataTemp);
        setTotalRecords(res.count);
      })
      .finally(() => setLoadingTable(false));
  };

  const handleAdd = (values) => {
    if (Number(formik.values.jumlah_pertemuan) - (Number(formik.values.hadir) + Number(formik.values.izin) + Number(formik.values.sakit) + Number(formik.values.alfa)) !== 0) {
      return;
    }

    if (tipeDialog === "tambah") {
      loading({ text: "Kami sedang menambah absensi", visible: true });
      addAbsen(values)
        .then((res) => {
          toast.current.show({ severity: res.status === 200 ? "success" : "warn", summary: res.status === 200 ? "Berhasil" : "Gagal", detail: res?.message });
          if (res.status === 200) {
            setVisibleDialogAdd(false);
            formik.resetForm();
            getDataAbsensi();
          }
          return;
        })
        .finally(() => {
          loading({ text: null, visible: false });
        });
    } else if (tipeDialog === "ubah") {
      loading({ text: "Kami sedang mengubah absensi", visible: true });
      editAbsen(values)
        .then((res) => {
          toast.current.show({ severity: res.status === 200 ? "success" : "warn", summary: res.status === 200 ? "Berhasil" : "Gagal", detail: res?.message });
          if (res.status === 200) {
            setVisibleDialogAdd(false);
            formik.resetForm();
            getDataAbsensi();
          }
          return;
        })
        .finally(() => {
          loading({ text: null, visible: false });
        });
    }
  };

  const getListSiswa = (tingkat_kelas = "all") => {
    setLoadingOptionSiswa(true);
    getDropdownSiswa(tingkat_kelas)
      .then((res) => {
        if (res.status !== 200) {
          return toast.current.show({ severity: "warn", summary: "Gagal memperoleh data siswa", detail: res.message });
        }

        setOptionSiswa(res.data.map((v) => ({ label: v.nama, value: v.id })));
      })
      .finally(() => setLoadingOptionSiswa(false));
  };

  const handleDownloadTemplate = () => {
    FileSaver.saveAs("/Template Import Data Absen.xlsx", "Template Import Data Absen.xlsx");
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

    loading({ text: `Kami sedang menambah 0/${data.length} data`, visible: true });

    let dataList = [];
    let detailData = [];
    let isWrongNIS = false;
    for (const dt of data) {
      let temp = {};

      const getIdSiswa = await getIdSiswaByNIS(dt[0]);
      if (getIdSiswa.status !== 200) {
        isWrongNIS = true;
        toast.current.show({
          severity: "warn",
          summary: "Nomor Induk Salah",
          detail: `Nomor Induk Sekolah tidak ditemukan, pada data ${dt[1]} (${dt[0]})`,
          sticky: true,
        });
      } else {
        temp["id_siswa"] = getIdSiswa.id_siswa;
        for (let i = 0; i < column.length; i++) {
          let columnName = column[i].toString().toLowerCase();
          if (!["nomor induk siswa", "nama"].includes(columnName)) {
            temp[mapperRequestAbsensi[columnName]] = mapperRequestAbsensi[columnName] === "tahun" ? dt[i].toString() : dt[i];
          }
        }
      }

      if (!isWrongNIS) {
        const res = validateSchema(absensiSchema, temp);
        if (res._error) {
          loading({ text: null, visible: false });
          return toast.current.show({ severity: "warn", summary: "Data Tidak Sesuai", sticky: true, detail: `${res.message} pada data ${dt[1]} (${dt[0]})` });
        }

        if (!optionBulan.includes(temp.bulan.charAt(0).toUpperCase() + temp.bulan.slice(1).toLowerCase())) {
          loading({ text: null, visible: false });
          return toast.current.show({ severity: "warn", summary: "Data Tidak Sesuai", sticky: true, detail: `Pengisian kolom bulan tidak sesuai pada data ${dt[1]} (${dt[0]})` });
        }

        if (temp.jumlah_pertemuan - (temp.hadir + temp.izin + temp.sakit + temp.alfa) < 0) {
          loading({ text: null, visible: false });
          return toast.current.show({ severity: "warn", summary: "Data Tidak Sesuai", sticky: true, detail: `Jumlah data kehadiran melebihi jumlah pertemuan` });
        }

        dataList.push(temp);
        detailData.push({
          nama: dt[1],
          nis: dt[0],
        });
      }
    }

    let successInsert = 0;
    let failedInsert = 0;
    for (let i = 0; i < dataList.length; i++) {
      let isError = false;
      await addAbsen(dataList[i])
        .then((res) => {
          if (res.status !== 200) {
            failedInsert++;
            toast.current.show({
              severity: "warn",
              summary: "Gagal menambah data",
              detail: `${res.message}, pada data ${detailData[i].nama} (${detailData[i].nis})`,
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

      if (dataList.length === i + 1) {
        loading({ text: null, visible: false });
        setSuccessAdd(successInsert);
        setFailedAdd(failedInsert);
        setVisibleDialogResult(true);
        setVisibleDialog(false);
        setFile(null);
        setFileName("");

        if (successInsert > 0) {
          getDataAbsensi();
        }
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      id_siswa: "",
      bulan: "",
      tahun: "",
      hadir: 0,
      izin: 0,
      sakit: 0,
      alfa: 0,
      jumlah_pertemuan: "",
    },
    validationSchema: absensiSchema,
    onSubmit: (values) => handleAdd(values),
  });

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

  const getFormErrorMessage = (name) => {
    return formik.touched[name] && formik.errors[name] && <small className="p-error">{formik.errors[name]}</small>;
  };

  useEffect(() => {
    getDataAbsensi();
  }, [lazyParams, bulan, tahun, tingkatKelasFilter]);

  return (
    <>
      <div className="fixed z-50 grid w-full grid-cols-2 gap-4 border-b bg-white p-4 pl-20 shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)] md:pl-4">
        <div className="col-span-2 flex gap-3 md:col-span-1">
          <div className="h-12 w-1 rounded-full bg-sky-500"></div>
          <div className="flex flex-col">
            <span className="font-semibold">Absensi</span>
            <span className="text-sm text-gray-600">Rekap Absensi Siswa</span>
          </div>
        </div>
        <div className="col-span-2 flex items-center gap-2 md:col-span-1 md:justify-end">
          <button
            onClick={() => {
              setTipeDialog("tambah");
              setVisibleDialogAdd(true);
              getListSiswa();
            }}
            type="submit"
            className="flex items-center gap-3 rounded-lg bg-[#2293EE] py-2 px-4 hover:bg-[#4da5ed] focus:ring focus:ring-blue-200 active:scale-[0.97]"
          >
            <i className="pi pi-plus text-xs font-medium text-white"></i>
            <span className="text-sm font-medium text-white">Tambah Absensi</span>
          </button>
          <button
            onClick={() => {
              setVisibleDialog(true);
            }}
            className="flex h-fit w-fit items-center gap-3 rounded-lg bg-[#2293EE] py-2 px-4 hover:bg-[#4da5ed] focus:ring focus:ring-blue-200 active:scale-[0.97]"
          >
            <i className="pi pi-file-excel text-xs font-semibold text-white"></i>
            <span className="text-sm font-medium text-white">Import Data Absensi</span>
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
          <div className="grid grid-cols-12 gap-4 py-4 px-4">
            <div className="col-span-12 flex flex-col gap-1 sm:col-span-4 md:col-span-2">
              <label htmlFor="tingkat_kelas" className="text-sm">
                Tingkat Kelas
              </label>
              <Dropdown
                inputId="tingkat_kelas"
                name="tingkat_kelas"
                placeholder="pilih tingkat kelas"
                value={tingkatKelasFilter}
                onChange={(e) => {
                  setTingkatKelasFilter(e.target.value);
                }}
                options={[
                  { label: "All", value: "all" },
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" },
                  { label: "4", value: "4" },
                  { label: "5", value: "5" },
                  { label: "6", value: "6" },
                ]}
                className={classNames({ "p-inputtext-sm": true })}
              />
            </div>
            <div className="col-span-12 flex flex-col gap-1 sm:col-span-4 md:col-span-2">
              <label htmlFor="bulan" className="text-sm">
                Bulan
              </label>
              <Dropdown
                id="bulan"
                name="bulan"
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
                options={optionBulan}
                placeholder="bulan"
                className="p-inputtext-sm"
                emptyMessage="Tidak ada data"
              />
            </div>
            <div className="col-span-12 flex flex-col gap-1 sm:col-span-4 md:col-span-2">
              <label htmlFor="tahun" className="text-sm">
                Tahun
              </label>
              <Dropdown
                id="tahun"
                name="tahun"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                options={optionTahun}
                placeholder="tahun"
                className="p-inputtext-sm w-26"
                emptyMessage="Tidak ada data"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 w-full rounded-lg border bg-white p-5 shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)]">
          <DataTable
            showGridlines
            stripedRows
            paginator
            responsiveLayout="stack"
            breakpoint="960px"
            lazy
            rowsPerPageOptions={[10, 25, 50]}
            rows={lazyParams.rows}
            first={lazyParams.first}
            value={dataAbsensi}
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
            <Column field="hadir" header="Hadir" />
            <Column field="izin" header="Izin" />
            <Column field="sakit" header="Sakit" />
            <Column field="alfa" header="Alfa" />
            <Column field="jumlah_pertemuan" header="Jumlah Pertemuan" />
            <Column header="Actions" body={actionBodyTemplate} className="w-[5%]" bodyClassName="td-h-center" headerClassName="th-h-center" />
          </DataTable>
        </div>
        <ConfirmDialog />
      </div>
      <Dialog
        header={tipeDialog === "tambah" ? "Tambah Absensi" : `Edit Absensi ${selectedData?.nama ? selectedData.nama.split(" ")[0] : ""}`}
        dismissableMask
        visible={visibleDialogAdd}
        breakpoints={{ "1440px": "45vw", "1024px": "75vw", "641px": "95vw" }}
        onHide={() => {
          setVisibleDialogAdd(false);
          setTingkatKelas("all");
          formik.resetForm();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-5 gap-4">
            {tipeDialog === "tambah" && (
              <div className="col-span-5 flex flex-col gap-1 sm:col-span-2">
                <label htmlFor="tingkat_kelas" className="text-sm">
                  Tingkat Kelas
                </label>
                <Dropdown
                  inputId="tingkat_kelas"
                  name="tingkat_kelas"
                  placeholder="pilih tingkat kelas"
                  value={tingkatKelas}
                  onChange={(e) => {
                    setTingkatKelas(e.target.value);
                    getListSiswa(e.target.value);
                  }}
                  options={[
                    { label: "All", value: "all" },
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                    { label: "5", value: "5" },
                    { label: "6", value: "6" },
                  ]}
                  className={classNames({ "p-inputtext-sm": true })}
                />
              </div>
            )}
            <div className={classNames({ "flex flex-col gap-1": true, "col-span-5 sm:col-span-3": tipeDialog === "tambah", "col-span-5": tipeDialog !== "tambah" })}>
              <label htmlFor="id_siswa" className="text-sm">
                Siswa
              </label>
              <Dropdown
                id="id_siswa"
                name="id_siswa"
                value={formik.values.id_siswa}
                onChange={formik.handleChange}
                options={optionSiswa}
                placeholder="pilih siswa"
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["id_siswa"] && formik.errors["id_siswa"] })}
                emptyMessage="Tidak ada data"
                disabled={loadingOptionSiswa || tipeDialog === "ubah"}
              />
              {getFormErrorMessage("id_siswa")}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3 flex flex-col gap-1">
              <label htmlFor="bulan" className="text-sm">
                Bulan
              </label>
              <Dropdown
                id="bulan"
                name="bulan"
                value={formik.values.bulan}
                onChange={formik.handleChange}
                options={optionBulan}
                placeholder="bulan"
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["bulan"] && formik.errors["bulan"] })}
                emptyMessage="Tidak ada data"
              />
              {getFormErrorMessage("bulan")}
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <label htmlFor="tahun" className="text-sm">
                Tahun
              </label>
              <Dropdown
                id="tahun"
                name="tahun"
                value={formik.values.tahun}
                onChange={formik.handleChange}
                options={optionTahun}
                placeholder="tahun"
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["tahun"] && formik.errors["tahun"] })}
                emptyMessage="Tidak ada data"
              />
              {getFormErrorMessage("tahun")}
            </div>
          </div>
          <p className="border-t pt-2 font-medium">Informasi Kehadiran</p>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-5 flex flex-col gap-1 sm:col-span-2">
              <label htmlFor="jumlah_pertemuan" className="text-sm">
                Jumlah Pertemuan
              </label>
              <InputText
                id="jumlah_pertemuan"
                name="jumlah_pertemuan"
                value={formik.values.jumlah_pertemuan}
                onChange={formik.handleChange}
                placeholder="jumlah pertemuan"
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["jumlah_pertemuan"] && formik.errors["jumlah_pertemuan"] })}
                keyfilter="int"
              />
              {getFormErrorMessage("jumlah_pertemuan")}
            </div>
            <div className="col-span-5 sm:col-span-3">
              <p className="text-right text-xs">
                Sisa alokasi jumlah pertemuan <span className="text-xs font-semibold italic">(harus 0)</span>
              </p>
              <p className="text-right text-lg font-semibold">{formik.values.jumlah_pertemuan - formik.values.hadir - formik.values.izin - formik.values.sakit - formik.values.alfa}</p>
              {formik.values.jumlah_pertemuan - formik.values.hadir - formik.values.izin - formik.values.sakit - formik.values.alfa < 0 && (
                <p className="text-right text-xs text-red-500">kehadiran melebihi jumlah pertemuan</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 flex flex-col gap-1">
              <label htmlFor="hadir" className="text-sm">
                Hadir
              </label>
              <InputText
                id="hadir"
                name="hadir"
                value={formik.values.hadir}
                onChange={formik.handleChange}
                placeholder="hadir"
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["hadir"] && formik.errors["hadir"] })}
                keyfilter="int"
              />
              {getFormErrorMessage("hadir")}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
              <label htmlFor="izin" className="text-sm">
                Izin
              </label>
              <InputText
                id="izin"
                name="izin"
                value={formik.values.izin}
                onChange={formik.handleChange}
                placeholder="izin"
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["izin"] && formik.errors["izin"] })}
                keyfilter="int"
              />
              {getFormErrorMessage("izin")}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
              <label htmlFor="sakit" className="text-sm">
                Sakit
              </label>
              <InputText
                id="sakit"
                name="sakit"
                value={formik.values.sakit}
                onChange={formik.handleChange}
                placeholder="sakit"
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["sakit"] && formik.errors["sakit"] })}
                keyfilter="int"
              />
              {getFormErrorMessage("sakit")}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
              <label htmlFor="alfa" className="text-sm">
                Alfa
              </label>
              <InputText
                id="alfa"
                name="alfa"
                value={formik.values.alfa}
                onChange={formik.handleChange}
                placeholder="alfa"
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["alfa"] && formik.errors["alfa"] })}
                keyfilter="int"
              />
              {getFormErrorMessage("alfa")}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <button
              onClick={() => {
                setVisibleDialogAdd(false);
                setTingkatKelas("all");
                formik.resetForm();
              }}
              className="rounded-lg border border-gray-400 bg-white py-2 px-4 text-sm font-medium text-slate-900 hover:border-gray-200 hover:shadow-lg active:scale-[0.97]"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={formik.handleSubmit}
              className="rounded-lg bg-[#2293EE] py-3 px-4 text-sm font-medium text-white hover:bg-[#4da5ed] focus:ring focus:ring-blue-200 active:scale-[0.97]"
            >
              {tipeDialog === "tambah" ? "Simpan" : "Ubah"}
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        header="Import Data Absensi"
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
          <InputText
            placeholder="Pilih file data"
            type="file"
            value={fileName}
            onChange={handleUploadFile}
            className="p-inputtext-sm"
            style={{ borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
          />
          <button
            onClick={handleProcessData}
            disabled={!file}
            className="flex flex-grow items-center justify-center rounded-r-lg bg-[#2293EE] py-2 px-4 hover:bg-[#4da5ed] focus:ring focus:ring-blue-200 active:scale-[0.97]"
          >
            <span className="text-sm font-medium text-white">Proses File</span>
          </button>
        </div>
        <small>
          <span className="text-red-500">*</span> penambahan data absensi menggunakan fitur import harus sesuai dengan template yang telah disediakan
          <span onClick={handleDownloadTemplate} className="ml-1 cursor-pointer underline">
            Unduh file template Import Absen Siswa
          </span>
        </small>
      </Dialog>
      <Dialog
        header="Hasil Import Data Absensi"
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
    </>
  );
}
