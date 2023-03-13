"use client";

import { AppContext } from "@/context";
import { useContext, useEffect, useState, useRef } from "react";
import { useFormik } from "formik";

// Components
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Menu } from "primereact/menu";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";

// Validation
import { getDropdownSiswa } from "@/services/user";
import { addPrestasi, deletePrestasi, editPrestasi, getPrestasi } from "@/services/prestasi";
import { prestasiSchema } from "@/validation/prestasi";

export default function Prestasi() {
  const { classNames, loading, toast } = useContext(AppContext);
  const menuAction = useRef(null);

  // Table
  const [semester, setSemester] = useState("all");
  const [tahunAjaran, setTahunAjaran] = useState(`${(new Date().getFullYear() - 1).toString()}/${new Date().getFullYear().toString()}`);
  const [loadingTable, setLoadingTable] = useState(true);
  const [dataPrestasi, setDataPrestasi] = useState([]);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
  });

  const [optionSiswa, setOptionSiswa] = useState([]);
  const [loadingOptionSiswa, setLoadingOptionSiswa] = useState(true);

  // Dialog
  const [visibleDialogAdd, setVisibleDialogAdd] = useState(false);
  const [tipeDialog, setTipeDialog] = useState("tambah");

  const [selectedData, setSelectedData] = useState(null);

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
        delete params.prestasi;
        formik.setValues(params);
      },
    },
    { separator: true },
    {
      label: "Hapus",
      className: "text-sm",
      command: () => {
        confirmDialog({
          message: "Anda yakin ingin menghapus data Prestasi " + selectedData.nama.split(" ")[0] + " ?",
          header: "Hapus Data Prestasi",
          icon: "pi pi-exclamation-circle",
          accept: () => {
            loading({ text: "Kami sedang menghapus data Absen " + selectedData.nama.split(" ")[0], visible: true });
            deletePrestasi(selectedData.id)
              .then((res) => {
                toast.current.show({ severity: res.status === 200 ? "success" : "warn", summary: res.status === 200 ? "Berhasil" : "Gagal", detail: res?.message });
                if (res.status === 200) {
                  getDataPrestasi();
                }
                return;
              })
              .finally(() => loading({ text: null, visible: false }));
          },
          reject: () => {
            return;
          },
        });
      },
    },
  ];

  const getDataPrestasi = () => {
    setLoadingTable(true);
    getPrestasi({ first: lazyParams.first, rows: lazyParams.rows, semester, tahun_ajaran: tahunAjaran })
      .then((res) => {
        if (res.status !== 200) {
          return toast.current.show({ severity: "warn", summary: "Gagal", detail: res?.message });
        }

        let dataTemp = [];
        for (let i = 0; i < res.data.length; i++) {
          dataTemp.push({
            ...res.data[i],
            prestasi: res.data[i].ranking,
            no: lazyParams.first + i + 1,
          });
        }
        setDataPrestasi(dataTemp);
      })
      .finally(() => setLoadingTable(false));
  };

  const handleAdd = (values) => {
    if (tipeDialog === "tambah") {
      loading({ text: "Kami sedang menambah data prestasi", visible: true });
      addPrestasi(values)
        .then((res) => {
          toast.current.show({ severity: res.status === 200 ? "success" : "warn", summary: res.status === 200 ? "Berhasil" : "Gagal", detail: res?.message });
          if (res.status === 200) {
            setVisibleDialogAdd(false);
            formik.resetForm();
            getDataPrestasi();
          }
          return;
        })
        .finally(() => {
          loading({ text: null, visible: false });
        });
    } else if (tipeDialog === "ubah") {
      loading({ text: "Kami sedang mengubah data prestasi", visible: true });
      editPrestasi(values)
        .then((res) => {
          toast.current.show({ severity: res.status === 200 ? "success" : "warn", summary: res.status === 200 ? "Berhasil" : "Gagal", detail: res?.message });
          if (res.status === 200) {
            setVisibleDialogAdd(false);
            formik.resetForm();
            getDataPrestasi();
          }
          return;
        })
        .finally(() => {
          loading({ text: null, visible: false });
        });
    }
  };

  const getListSiswa = () => {
    if (optionSiswa.length > 0) {
      return;
    }

    setLoadingOptionSiswa(true);
    getDropdownSiswa()
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
      semester: "",
      tahun_ajaran: "",
      ranking: "",
    },
    validationSchema: prestasiSchema,
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

  const rankingBodyTemplate = (data) => {
    return <span>{`Rangking kelas ke-${data.prestasi}`}</span>;
  };

  const getFormErrorMessage = (name) => {
    return formik.touched[name] && formik.errors[name] && <small className="p-error">{formik.errors[name]}</small>;
  };

  useEffect(() => {
    getDataPrestasi();
  }, [lazyParams, semester, tahunAjaran]);

  return (
    <>
      <div className="p-4 flex fixed w-full justify-between items-center bg-white border-b shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)] z-50">
        <div className="flex gap-3">
          <div className="w-1 h-12 bg-sky-500 rounded-full"></div>
          <div className="flex flex-col">
            <span className="font-semibold">Prestasi</span>
            <span className="text-sm text-gray-600">Data Prestasi Siswa</span>
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
          <span className="text-sm font-medium text-white">Tambah Data Prestasi</span>
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
              <label htmlFor="semester_filter" className="text-sm">
                Semester
              </label>
              <Dropdown
                id="semester_filter"
                name="semester_filter"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                options={[
                  { label: "All", value: "all" },
                  { label: "Ganjil", value: "ganjil" },
                  { label: "Genap", value: "genap" },
                ]}
                placeholder="semester"
                className="p-inputtext-sm w-48"
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
            value={dataPrestasi}
            loading={loadingTable}
            onPage={(e) => setLazyParams(e)}
            size="small"
            emptyMessage="Data tidak ditemukan"
            dataKey="id"
          >
            <Column field="no" header="#" bodyClassName="td-h-center" headerClassName="th-h-center" />
            <Column field="no_induk_sekolah" header="Nomor Induk Sekolah" />
            <Column field="nama" header="Nama Siswa" />
            <Column field="tahun_ajaran" header="Tahun Ajaran" />
            <Column field="prestasi" header="Prestasi" body={rankingBodyTemplate} />
            <Column header="Actions" body={actionBodyTemplate} className="w-[5%]" bodyClassName="td-h-center" headerClassName="th-h-center" />
          </DataTable>
        </div>
        <ConfirmDialog />
      </div>
      <Dialog
        header={tipeDialog === "tambah" ? "Tambah Data Prestasi" : `Ubah Data Prestasi`}
        dismissableMask
        visible={visibleDialogAdd}
        style={{ width: "40vw" }}
        onHide={() => {
          setVisibleDialogAdd(false);
          formik.resetForm();
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 flex flex-col gap-1">
              <label htmlFor="semester" className="text-sm">
                Semester
              </label>
              <Dropdown
                id="semester"
                name="semester"
                value={formik.values.semester}
                onChange={formik.handleChange}
                options={[
                  { label: "Ganjil", value: "ganjil" },
                  { label: "Genap", value: "genap" },
                ]}
                placeholder="semester"
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["semester"] && formik.errors["semester"] })}
              />
              {getFormErrorMessage("semester")}
            </div>
            <div className="col-span-1 flex flex-col gap-1">
              <label htmlFor="tahun_ajaran" className="text-sm">
                Tahun Ajaran
              </label>
              <Dropdown
                id="tahun_ajaran"
                name="tahun_ajaran"
                value={formik.values.tahun_ajaran}
                onChange={formik.handleChange}
                options={optionTahunAjaran}
                placeholder="tahun ajaran"
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["tahun_ajaran"] && formik.errors["tahun_ajaran"] })}
              />
              {getFormErrorMessage("tahun_ajaran")}
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-1">
            <label htmlFor="ranking" className="text-sm">
              Ranking
            </label>
            <Dropdown
              id="ranking"
              name="ranking"
              value={formik.values.ranking}
              onChange={formik.handleChange}
              options={[{ label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "10" }]}
              placeholder="ranking"
              optionValue="label"
              className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["ranking"] && formik.errors["ranking"] })}
            />
            {getFormErrorMessage("ranking")}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <button
              onClick={() => {
                setVisibleDialogAdd(false);
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
