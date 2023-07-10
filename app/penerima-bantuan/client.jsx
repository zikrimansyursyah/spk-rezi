"use client";

import { AppContext } from "@/context";
import { useContext, useState } from "react";

// Components
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Timeline } from "primereact/timeline";
import { ScrollPanel } from "primereact/scrollpanel";
import { getPenerima } from "@/services/penerimaBantuan";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TabView, TabPanel } from "primereact/tabview";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { TABLE_PENILAIAN } from "@/services/constants";

export default function PenerimaBantuan() {
  const { classNames, loading, toast } = useContext(AppContext);

  const [semester, setSemester] = useState("ganjil");
  const [tahunAjaran, setTahunAjaran] = useState(`${(new Date().getFullYear() - 1).toString()}/${new Date().getFullYear().toString()}`);
  const [tingkatKelas, setTingkatKelas] = useState("1");
  const [limit, setLimit] = useState(3);
  const [dataPenerima, setDataPenerima] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [rawAttributes, setRawAttributes] = useState([]);
  const [rawResult, setRawResult] = useState([]);
  const [rawAkhir, setRawAkhir] = useState([]);

  // Detail Penilaian
  const [savedFilter, setSavedFilter] = useState({ semester, tahunAjaran, tingkatKelas, limit });
  const [rawBobotNilai, setRawBobotNilai] = useState([]);
  const [maximizedDialog, setMaximizedDialog] = useState(false);
  const [dialogDetailPerhitunganVisibility, setDialogDetailPerhitunganVisibility] = useState(false);
  const [visibleSidebarDetail, setVisibleSidebarDetail] = useState(false);
  const [tipeDetail, setTipeDetail] = useState("");
  const [flowPerhitungan, setFlowPerhitungan] = useState([
    {
      point_name: "Start",
      point_icon: "",
      title: "Proses Input Data",
      data: [
        {
          title: "Input Data",
          description: "Admin melakukan input data siswa berupa data diri, data keluarga, data absensi, dan data prestasi",
        },
      ],
    },
    {
      point_name: "Ketentuan Keputusan",
      point_icon: "",
      title: "Data Kriteria, Bobot, dan Penilaian",
      data: [
        {
          title: "Kriteria",
          description: "Detail ketentuan Kriteria",
          link_text: "Click to see details",
          on_click: "table_kriteria",
        },
        {
          title: "Bobot",
          description: "Detail ketentuan Bobot",
          link_text: "Click to see details",
          on_click: "table_bobot",
        },
        {
          title: "Penilaian",
          description: "Detail ketentuan Penilaian",
          link_text: "Click to see details",
          on_click: "table_penilaian",
        },
      ],
    },
    {
      point_name: "Konversi ke Poin",
      point_icon: "",
      title: "Mengkonversi data menjadi poin",
      data: [
        {
          title: "Mengkonversi data menjadi poin",
          description: "Melakukan konversi data siswa menjadi poin berdasarkan ketentuan pada Tabel Kriteria, Tabel Bobot, dan Tabel Penilaian",
          link_text: "Click to see details",
          on_click: "table_konversi_to_poin",
        },
      ],
    },
    {
      point_name: "Konversi ke Matriks",
      point_icon: "",
      title: "Mengkonversi Poin ke Matriks",
      data: [
        {
          title: "Mengkonversi Point ke Matriks",
          description: "Melakukan konversi Poin yang diperoleh dari kode kriteria C1 sampai C6 menjadi bentuk matriks tahap 1 (Xij)",
          link_text: "Click to see details",
          on_click: "table_konversi_to_matriks",
        },
      ],
    },
    {
      point_name: "Normalisasi Matriks",
      point_icon: "",
      title: "Normalisasi data Matriks",
      data: [
        {
          title: "Normalisasi data Matriks",
          description: "Melakukan Normalisasi pada data matriks berdasarkan tipe kriteria (Cost/Benefit)",
          link_text: "Click to see details",
          on_click: "table_normalisasi",
        },
      ],
    },
    {
      point_name: "Perhitungan Akhir",
      point_icon: "",
      title: "Perhitungan Akhir",
      data: [
        {
          title: "Perhitungan Akhir dari Normalisasi",
          description: "Melakukan perhitungan penjumlahan hasil normalisasi kemudian mengurutkan data dengan nilai tertinggi ke terendah",
          link_text: "Click to see details",
          on_click: "table_perhitungan_akhir",
        },
      ],
    },
    {
      point_name: "Selesai",
      point_icon: "",
      title: "Hasil Akhir",
      data: [
        {
          title: "Data Penerima Bantuan",
          description: "Sistem akan mengirimkan data penerima bantuan beserta nilai yang diperoleh",
        },
      ],
    },
  ]);

  // Dialog Detail
  const [titleDetail, setTitleDetail] = useState("");

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

  const getListPenerima = (forDetail = false, user_id = null) => {
    loading({ text: forDetail ? "Kami sedang mengambil detail perhitungan" : "Kami sedang mengkalkulasi penerima bantuan", visible: true });
    getPenerima({ tingkat_kelas: tingkatKelas, semester, tahun_ajaran: tahunAjaran, first: 0, rows: limit !== "All" ? limit : 100, get_all: limit === "All", user_id: user_id || undefined })
      .then((res) => {
        if (res.status === 200 && res.data.ranking.length < 1) {
          setRawData([]);
          setRawAttributes([]);
          setRawResult([]);
          setRawBobotNilai([]);
          setDataPenerima([]);
          setSavedFilter({ semester, tahunAjaran, tingkatKelas, limit });
          return toast.current.show({ severity: "warn", summary: "Tidak Ditemukan", detail: user_id ? "Server bermasalah" : "Tidak dapat menemukan data dengan filter ini" });
        }

        if (forDetail === false) {
          toast.current.show({ severity: res.status === 200 ? "success" : "warn", summary: res.status === 200 ? "Berhasil" : "Gagal", detail: res.message });
        }
        if (res.status === 200) {
          if (forDetail === false) {
            let dataTemp = [];
            for (let i = 0; i < res.data.ranking.length; i++) {
              dataTemp.push({
                no: i + 1,
                ...res.data.ranking[i],
              });
            }

            setDataPenerima(dataTemp);
            setSavedFilter({ semester, tahunAjaran, tingkatKelas, limit });
          } else {
            let dataTempAttributes = [];
            for (const key of Object.keys(res.data.attributes)) {
              dataTempAttributes.push(res.data.attributes[key]);
            }

            let dataTempRawData = [];
            for (const { id } of res.data.ranking) {
              dataTempRawData.push(res.data.data.find((item) => item.id === id));
            }

            let dataTempResult = [];
            let dataTempRawAkhir = [];
            for (const { id, nilai } of res.data.ranking) {
              let dataSiswa = res.data.data.find((item) => item.id === Number(id));

              for (const detail of res.data.result[id]) {
                let result = {};
                let resultAkhir = {};
                result.nama = dataSiswa.nama;
                resultAkhir.nama = dataSiswa.nama;
                resultAkhir.hasil = nilai;
                for (const kode of Object.keys(detail)) {
                  let dataAttribute = res.data.attributes[kode];
                  result.xij = dataSiswa[kode];
                  result.kode_kriteria = kode.toUpperCase();
                  result.hasil = detail[kode].toFixed(3);
                  result.tipe_kriteria = dataAttribute.tipe_kriteria;
                  result.nilai_min = dataAttribute.nilai_min;
                  result.nilai_max = dataAttribute.nilai_max;
                  resultAkhir.kode_bobot = kode.toUpperCase();
                  resultAkhir.rij = detail[kode].toFixed(3);
                  resultAkhir.nilai_bobot = dataAttribute.bobot;
                  resultAkhir.hasil_kali = (parseFloat(detail[kode]) * parseFloat(dataAttribute.bobot)).toFixed(3);
                }
                dataTempResult.push(result);
                dataTempRawAkhir.push(resultAkhir);
              }
            }

            setRawData(dataTempRawData);
            setRawAkhir(dataTempRawAkhir);
            setRawAttributes(dataTempAttributes);
            setRawResult(dataTempResult);
            setRawBobotNilai(res.data.bobot_nilai);
          }
        }
      })
      .finally(() => {
        loading({ text: null, visible: false });
        if (forDetail === true) {
          setDialogDetailPerhitunganVisibility(true);
        }
      });
  };

  // LAYOUT
  const customizeMarker = (item) => {
    return (
      <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800">
        <span className="text-white text-sm">{item.point_name}</span>
        {item.point_icon && <i className={`${item.point_icon} text-white`}></i>}
      </div>
    );
  };

  const customizeContent = (item) => {
    return (
      <div className="py-3 px-5 mb-10 rounded-lg bg-blue-100 w-full min-h-[4rem] shadow-lg shadow-gray-200">
        <span className="font-semibold">{item.title}</span>
        <div className="flex flex-col gap-3 mt-3">
          {(item.data || []).map((data, index) => {
            return (
              <div
                key={index}
                className={classNames("bg-white p-3 rounded-lg flex flex-col gap-2", {
                  "cursor-pointer motion-safe:hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-200": data.link_text && data.on_click,
                })}
                onClick={() => {
                  if (!data.link_text && !data.on_click) return;
                  setTitleDetail(data.title);
                  setTipeDetail(data.on_click);
                  setVisibleSidebarDetail(true);
                }}
              >
                <span className="text-sm">{data.title}</span>
                <span className="text-xs">{data.description}</span>
                {data.link_text && data.on_click && <a className="text-xs text-blue-400">{data.link_text}</a>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getDetailDataPerhitungan = () => {
    if (tipeDetail === "table_kriteria") {
      return (
        <DataTable value={rawAttributes} size="small" showGridlines responsiveLayout="stack" breakpoint="940px">
          <Column field="kode" header="Kode" style={{ textAlign: "center" }} headerClassName="th-h-center" body={(e) => <span>{e.kode && e.kode.toUpperCase()}</span>} />
          <Column field="nama_kriteria" header="Nama Kriteria" headerClassName="th-h-center" />
          <Column field="tipe_kriteria" header="Tipe Kriteria" style={{ textAlign: "center" }} headerClassName="th-h-center" />
        </DataTable>
      );
    } else if (tipeDetail === "table_penilaian") {
      return (
        <DataTable value={TABLE_PENILAIAN} size="small" showGridlines responsiveLayout="stack" breakpoint="940px">
          <Column field="keterangan" header="Keterangan" style={{ textAlign: "center" }} headerClassName="th-h-center" />
          <Column field="nilai" header="Nilai" style={{ textAlign: "center" }} headerClassName="th-h-center" />
        </DataTable>
      );
    } else if (tipeDetail === "table_bobot") {
      return (
        <div>
          <div className="font-medium mb-2">Master Data</div>
          <DataTable value={rawAttributes} size="small" showGridlines responsiveLayout="stack" breakpoint="940px">
            <Column field="kode" header="Kode" style={{ textAlign: "center" }} headerClassName="th-h-center" body={(e) => <span>{e.kode && e.kode.toUpperCase()}</span>} />
            <Column field="nama_kriteria" header="Nama Kriteria" headerClassName="th-h-center" />
            <Column field="bobot" header="Bobot" style={{ textAlign: "center" }} headerClassName="th-h-center" />
            <Column field="nilai_min" header="Nilai Min" style={{ textAlign: "center" }} headerClassName="th-h-center" />
            <Column field="nilai_max" header="Nilai Max" style={{ textAlign: "center" }} headerClassName="th-h-center" />
          </DataTable>
          <div className="font-medium mt-6 mb-2">Detail Kriteria Bobot</div>
          <TabView>
            {rawAttributes.map((item, i) => (
              <TabPanel key={i} header={item.kode?.toUpperCase()}>
                <div className="mb-3">
                  Nama Kriteria : <span className="font-medium">{item.nama_kriteria}</span>
                </div>
                <DataTable value={rawBobotNilai[item.kode?.toUpperCase()]} size="small" showGridlines responsiveLayout="stack" breakpoint="940px">
                  <Column field="nama_nilai" header="Nama Nilai" headerClassName="th-h-center" />
                  <Column field="nilai" header="Nilai" style={{ textAlign: "center" }} headerClassName="th-h-center" />
                </DataTable>
              </TabPanel>
            ))}
          </TabView>
        </div>
      );
    } else if (tipeDetail === "table_konversi_to_poin") {
      const columnGroup = (
        <ColumnGroup>
          <Row>
            <Column header="Nama Siswa" rowSpan={2} headerClassName="th-h-center" />
            <Column header="Hasil Konversi Penilaian" colSpan={6} headerClassName="th-h-center" />
          </Row>
          <Row>
            <Column header="C1" headerClassName="th-h-center" />
            <Column header="C2" headerClassName="th-h-center" />
            <Column header="C3" headerClassName="th-h-center" />
            <Column header="C4" headerClassName="th-h-center" />
            <Column header="C5" headerClassName="th-h-center" />
            <Column header="C6" headerClassName="th-h-center" />
          </Row>
        </ColumnGroup>
      );
      return (
        <>
          <div className="italic mb-3">"detail data masing masing siswa dikonversi menjadi poin penilaian yang ditentukan berdasarkan ketentuan kriteria dan bobot"</div>
          <DataTable value={rawData} size="small" showGridlines headerColumnGroup={columnGroup} responsiveLayout="stack" breakpoint="940px">
            <Column field="nama" header="Nama Siswa" />
            <Column field="c1" header="C1" style={{ textAlign: "center" }} />
            <Column field="c2" header="C2" style={{ textAlign: "center" }} />
            <Column field="c3" header="C3" style={{ textAlign: "center" }} />
            <Column field="c4" header="C4" style={{ textAlign: "center" }} />
            <Column field="c5" header="C5" style={{ textAlign: "center" }} />
            <Column field="c6" header="C6" style={{ textAlign: "center" }} />
          </DataTable>
        </>
      );
    } else if (tipeDetail === "table_konversi_to_matriks") {
      const columnGroup = (
        <ColumnGroup>
          <Row>
            <Column header="Nama Siswa" rowSpan={2} headerClassName="th-h-center" />
            <Column header="Xij" colSpan={6} headerClassName="th-h-center" />
          </Row>
          <Row>
            <Column header="C1" headerClassName="th-h-center" />
            <Column header="C2" headerClassName="th-h-center" />
            <Column header="C3" headerClassName="th-h-center" />
            <Column header="C4" headerClassName="th-h-center" />
            <Column header="C5" headerClassName="th-h-center" />
            <Column header="C6" headerClassName="th-h-center" />
          </Row>
        </ColumnGroup>
      );
      return (
        <>
          <div className="italic mb-3">
            "poin penilaian dirubah menjadi <span className="font-medium not-italic">Xij</span> sebelum dinormalisasi dan dilakukan perhitungan"
          </div>
          <DataTable value={rawData} size="small" showGridlines headerColumnGroup={columnGroup} responsiveLayout="stack" breakpoint="940px">
            <Column field="nama" header="Nama Siswa" />
            <Column field="c1" header="C1" style={{ textAlign: "center" }} />
            <Column field="c2" header="C2" style={{ textAlign: "center" }} />
            <Column field="c3" header="C3" style={{ textAlign: "center" }} />
            <Column field="c4" header="C4" style={{ textAlign: "center" }} />
            <Column field="c5" header="C5" style={{ textAlign: "center" }} />
            <Column field="c6" header="C6" style={{ textAlign: "center" }} />
          </DataTable>
        </>
      );
    } else if (tipeDetail === "table_normalisasi") {
      const rumusTemplate = (data) => {
        if (data.tipe_kriteria.toLowerCase() === "benefit") {
          return <span className="italic">xij/nilai max</span>;
        } else {
          return <span className="italic">nilai min/xij</span>;
        }
      };

      return (
        <>
          <div className="italic mb-3">"Menentukan Hasil Normalisasi dengan perhitungan berdasarkan rumus yang ditentukan (Cost/Benefit)"</div>
          <DataTable
            value={rawResult}
            size="small"
            showGridlines
            rowGroupMode="rowspan"
            groupRowsBy="nama"
            sortMode="single"
            sortField="name"
            sortOrder={1}
            scrollable
            scrollHeight={maximizedDialog ? "650px" : "500px"}
            responsiveLayout="stack" breakpoint="940px"
          >
            <Column field="nama" header="Nama Siswa" />
            <Column field="kode_kriteria" header="Kode Kriteria" style={{ textAlign: "center" }} />
            <Column field="tipe_kriteria" header="Tipe Kriteria" style={{ textAlign: "center" }} />
            <Column field="xij" header="Xij" style={{ textAlign: "center" }} />
            <Column field="nilai_min" header="Nilai Min" style={{ textAlign: "center" }} />
            <Column field="nilai_max" header="Nilai Max" style={{ textAlign: "center" }} />
            <Column field="rumus" header="Rumus" style={{ textAlign: "center" }} body={rumusTemplate} />
            <Column field="hasil" header="Hasil (rij)" style={{ textAlign: "center" }} />
          </DataTable>
        </>
      );
    } else if (tipeDetail === "table_perhitungan_akhir") {
      const hasilTemplate = (data) => {
        return <span>{data.hasil}</span>;
      };
      return (
        <>
          <div className="italic mb-3">"Menentukan Hasil Normalisasi dengan perhitungan berdasarkan rumus yang ditentukan (Cost/Benefit)"</div>
          <DataTable
            value={rawAkhir}
            size="small"
            showGridlines
            rowGroupMode="rowspan"
            groupRowsBy="nama"
            sortMode="single"
            sortField="name"
            sortOrder={1}
            // scrollable
            // scrollHeight={maximizedDialog ? "650px" : "500px"}
            responsiveLayout="stack" breakpoint="940px"
          >
            <Column field="nama" header="Nama Siswa" />
            <Column field="kode_bobot" header="Kode Bobot" style={{ textAlign: "center" }} />
            <Column field="rij" header="Nilai (rij)" style={{ textAlign: "center" }} />
            <Column field="nilai_bobot" header="Nilai Bobot" style={{ textAlign: "center" }} />
            <Column field="hasil_kali" header="rij x Nilai Bobot (R)" style={{ textAlign: "center" }} />
            <Column field="nama" header="Hasil (R1 + R2 + ...RN)" style={{ textAlign: "center" }} body={hasilTemplate} />
          </DataTable>
        </>
      );
    } else {
      return <div>data tidak ditemukan</div>;
    }
  };

  return (
    <>
      <div className="p-4 pl-20 md:pl-4 fixed w-full grid grid-cols-12 gap-4 bg-white border-b shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)] z-50">
        <div className="col-span-12 md:col-span-5 lg:col-span-4 flex gap-3">
          <div className="w-1 h-12 bg-sky-500 rounded-full"></div>
          <div className="flex flex-col">
            <span className="font-semibold">Penerima Bantuan</span>
            <span className="text-sm text-gray-600">Data Siswa Penerima Bantuan Kesejahteraan</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-7 lg:col-span-8 grid grid-cols-12 gap-4">
          <div className="col-span-4 sm:col-span-2 md:col-span-3 lg:col-span-2 flex flex-col gap-1">
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
              }}
              options={[
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
          <div className="col-span-8 sm:col-span-4 md:col-span-4 lg:col-span-3 flex flex-col gap-1">
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
              className="p-inputtext-sm"
            />
          </div>
          <div className="col-span-8 sm:col-span-4 md:col-span-5 lg:col-span-3 flex flex-col gap-1">
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
              className="p-inputtext-sm"
            />
          </div>
          <div className="col-span-4 sm:col-span-2 md:col-span-2 lg:col-span-2 flex flex-col gap-1">
            <label htmlFor="limit" className="text-sm">
              Limit
            </label>
            <Dropdown
              id="limit"
              name="limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              options={[
                { label: 3, value: 3 },
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 40, value: 40 },
                { label: "All", value: "All" },
              ]}
              placeholder="limit"
              className="p-inputtext-sm"
            />
          </div>
          <div className="col-span-12 md:col-span-2 lg:col-span-2 flex items-end">
            <button
              onClick={() => getListPenerima()}
              type="submit"
              className="lg:w-full h-11 flex items-center justify-center gap-3 bg-[#2293EE] py-2 px-4 rounded-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200"
            >
              <i className="pi pi-search text-white text-xs font-medium"></i>
              <span className="text-sm font-medium text-white">Tentukan</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 pt-[22rem] sm:pt-[16rem] md:pt-[12rem] lg:pt-28">
        <div className="bg-white w-full rounded-lg border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)] grid grid-cols-12 gap-4 p-4">
          <div className="col-span-12 md:col-span-9 flex flex-col gap-1">
            <span className="text-lg font-medium">
              Daftar Penerima Bantuan Periode {tahunAjaran} Semester {semester.slice(0, 1).toUpperCase() + semester.slice(1)}
            </span>
            <span className="text-sm text-gray-500">daftar penerima bantuan yang terlampir dibawah ini telah dikalkulasikan secara valid dengan perhitungan Simple Additive Weighting</span>
          </div>
          {dataPenerima.length > 0 && (
            <div className="col-span-12 md:col-span-3 flex items-center justify-end">
              <button
                onClick={() => getListPenerima(true)}
                type="submit"
                className="flex items-center h-fit gap-3 bg-[#2293EE] py-2 px-4 rounded-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200"
              >
                <span className="text-xs font-medium text-white">Lihat Detail Perhitungan</span>
              </button>
            </div>
          )}
        </div>
        {dataPenerima.length === 0 && (
          <div className="flex justify-center items-center mt-10">
            <div className="p-4 bg-[#2293EE] animate-pulse rounded-lg flex flex-col gap-1 items-center">
              <span className="text-white font-medium">Tidak Ada Data</span>
              <span className="text-sm text-white">coba cari data dengan filter yang berbeda</span>
            </div>
          </div>
        )}
      </div>
      <div className="px-4 pb-10 flex flex-col gap-4">
        {(dataPenerima || []).map((item, index) => (
          <div
            key={index}
            className="p-6 bg-white w-full rounded-lg border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.001)] grid grid-cols-12 gap-4 hover:shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.1)] hover:border-blue-400"
          >
            <div className="col-span-2 md:col-span-1 flex items-center">
              <span className="font-medium text-lg pr-8 border-r-2 border-blue-400">{item.no}</span>
            </div>
            <div className="col-span-10 md:col-span-3 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Nama Lengkap</span>
              <span className="font-medium">{item.nama}</span>
            </div>
            <div className="col-span-12 md:col-span-2 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Nomor Induk Sekolah</span>
              <span className="font-medium">{item.no_induk_sekolah}</span>
            </div>
            <div className="col-span-6 sm:col-span-4 md:col-span-2 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Nama Ayah</span>
              <span className="font-medium">{item.nama_ayah}</span>
            </div>
            <div className="col-span-6 sm:col-span-4 md:col-span-2 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Nama Ibu</span>
              <span className="font-medium">{item.nama_ibu}</span>
            </div>
            <div className="col-span-6 sm:col-span-4 md:col-span-1 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Nilai</span>
              <span className="font-medium">{item.nilai}</span>
            </div>
            <div className="col-span-6 sm:col-span-12 md:col-span-1 flex items-center justify-end sm:justify-start md:justify-end">
              <button
                onClick={() => getListPenerima(true, item.id)}
                type="submit"
                className="flex items-center gap-3 bg-[#2293EE] py-2 px-4 rounded-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200"
              >
                <span className="text-[0.6rem] font-medium text-white">Lihat Detail</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        header="Detail Perhitungan Simple Additive Weighting"
        visible={dialogDetailPerhitunganVisibility}
        onHide={() => {
          setTipeDetail("");
          setVisibleSidebarDetail(false);
          setMaximizedDialog(false);
          setDialogDetailPerhitunganVisibility(false);
        }}
        className="w-11/12 h-5/6 rounded-2xl"
        headerClassName="dialog-header-penilaian"
        contentClassName="dialog-content-penilaian"
        breakpoints={{ "1024": "75vw", "960px": "95vw", "641px": "100vw" }}
        maximizable
        maximized={maximizedDialog}
        onMaximize={(e) => {
          setMaximizedDialog(e.maximized);
        }}
      >
        <div className="pt-4 relative">
          <div className="p-5">
            <Timeline value={flowPerhitungan} align="alternate" className="flow" marker={customizeMarker} content={customizeContent} />
          </div>
          {visibleSidebarDetail && (
            <div className="absolute top-0 left-0 right-0 w-full h-full grid grid-cols-12">
              <div
                className="bg-slate-800/10 hidden md:block md:col-span-7"
                onClick={() => {
                  setTipeDetail("");
                  setVisibleSidebarDetail(false);
                }}
              ></div>
              <div className="bg-white col-span-12 md:col-span-5 relative">
                <div className={classNames("p-4 fixed", { "w-screen md:w-[37vw]": !maximizedDialog, "w-screen md:w-[41vw]": maximizedDialog })}>
                  <div className="flex gap-4 items-center">
                    <Button
                      icon="pi pi-times"
                      rounded
                      text
                      aria-label="Close"
                      onClick={() => {
                        setTipeDetail("");
                        setVisibleSidebarDetail(false);
                      }}
                    />
                    <p className="font-medium">{titleDetail}</p>
                  </div>
                  <ScrollPanel className={classNames({ "h-[64vh] pl-2 pt-2": !maximizedDialog, "h-[85vh]": maximizedDialog })}>{getDetailDataPerhitungan()}</ScrollPanel>
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
}
