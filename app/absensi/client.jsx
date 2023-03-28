"use client";

import { AppContext } from "@/context";
import { useContext, useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

// Components
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Menu } from "primereact/menu";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";

// Validation
import { absensiSchema } from "@/validation/absensi";
import { getDropdownSiswa } from "@/services/user";
import { addAbsen, deleteAbsen, editAbsen, getAllAbsen } from "@/services/absensi";

export default function User() {
  const router = useRouter();
  const { classNames, loading, toast } = useContext(AppContext);
  const menuAction = useRef(null);

  const optionBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

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
          className="border border-transparent h-7 w-7 rounded-full hover:shadow hover:border-gray-200 focus:ring focus:ring-blue-100"
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
      <div className="p-4 flex fixed w-full justify-between items-center bg-white border-b shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)] z-50">
        <div className="flex gap-3">
          <div className="w-1 h-12 bg-sky-500 rounded-full"></div>
          <div className="flex flex-col">
            <span className="font-semibold">Absensi</span>
            <span className="text-sm text-gray-600">Rekap Absensi Siswa</span>
          </div>
        </div>
        <button
          onClick={() => {
            setTipeDialog("tambah");
            setVisibleDialogAdd(true);
            getListSiswa();
          }}
          type="submit"
          className="flex items-center gap-3 bg-[#2293EE] py-2 px-4 rounded-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200"
        >
          <i className="pi pi-plus text-white text-xs font-medium"></i>
          <span className="text-sm font-medium text-white">Tambah Absensi</span>
        </button>
      </div>
      <div className="px-4 pb-4 pt-24">
        <div className="bg-white w-full mt-1 rounded-lg border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)] flex flex-col">
          <div className="py-2 px-4 flex items-center gap-2">
            <i className="pi pi-filter-fill text-[1rem] text-yellow-300"></i>
            <span className="font-medium">Filter</span>
          </div>
          <span className="border-b"></span>
          <div className="py-4 px-4 flex gap-4 items-center">
            <div className="flex flex-col gap-1">
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
            <div className="flex flex-col gap-1">
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
                className="p-inputtext-sm w-48"
                emptyMessage="Tidak ada data"
              />
            </div>
            <div className="flex flex-col gap-1">
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
        <div className="bg-white w-full mt-4 p-5 rounded-lg border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)]">
          <DataTable
            showGridlines
            stripedRows
            paginator
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
        style={{ width: "40vw" }}
        onHide={() => {
          setVisibleDialogAdd(false);
          setTingkatKelas("all");
          formik.resetForm();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-5 gap-4">
            {tipeDialog === "tambah" && (
              <div className="col-span-2 flex flex-col gap-1">
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
            <div className={classNames({ "flex flex-col gap-1": true, "col-span-3": tipeDialog === "tambah", "col-span-5": tipeDialog !== "tambah" })}>
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
            <div className="col-span-2 flex flex-col gap-1">
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
            <div className="col-span-3">
              <p className="text-xs text-right">
                Sisa alokasi jumlah pertemuan <span className="text-xs font-semibold italic">(harus 0)</span>
              </p>
              <p className="text-right text-lg font-semibold">{formik.values.jumlah_pertemuan - formik.values.hadir - formik.values.izin - formik.values.sakit - formik.values.alfa}</p>
              {formik.values.jumlah_pertemuan - formik.values.hadir - formik.values.izin - formik.values.sakit - formik.values.alfa < 0 && (
                <p className="text-xs text-red-500 text-right">kehadiran melebihi jumlah pertemuan</p>
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
              className="text-sm font-medium text-slate-900 border border-gray-400 bg-white py-2 px-4 rounded-lg hover:shadow-lg hover:border-gray-200 active:scale-[0.97]"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={formik.handleSubmit}
              className="bg-[#2293EE] py-3 px-4 rounded-lg text-sm font-medium text-white hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200"
            >
              {tipeDialog === "tambah" ? "Simpan" : "Ubah"}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
