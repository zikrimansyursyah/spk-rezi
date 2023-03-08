"use client";

import { AppContext } from "@/context";
import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";

// Components
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Calendar } from "primereact/calendar";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

// Validation
import { userSchema } from "@/validation/auth";
import { addSiswa } from "@/services/user";

export default function User() {
  const router = useRouter();
  const { classNames, loading, toast } = useContext(AppContext);
  const [isDisableFieldAyah, setIsDisableFieldAyah] = useState(false);
  const [isDisableFieldIbu, setIsDisableFieldIbu] = useState(false);

  const handleAdd = (values) => {
    loading({ text: "Kami sedang menambah data ", visible: true });
    const params = { ...values };
    params.pendapatan_perbulan_ayah = params.pendapatan_perbulan_ayah || 0;
    params.pendapatan_perbulan_ibu = params.pendapatan_perbulan_ibu || 0;

    addSiswa(params)
      .then((res) => {
        if (res.status !== 200) {
          return toast.current.show({
            severity: "warn",
            summary: "Gagal menambah data",
            detail: res.message,
            life: 3000,
          });
        } else {
          return router.push("/manajemen-siswa");
        }
      })
      .catch((err) => {
        return console.error(err);
      })
      .finally(() => {
        loading({ text: null, visible: false });
      });
  };

  const formik = useFormik({
    initialValues: {
      nisn: "",
      no_induk_sekolah: "",
      username: "",
      password: "",
      nama: "",
      tempat_lahir: "",
      tanggal_lahir: "",
      jenis_kelamin: null,
      alamat: "",
      no_telp: "",
      status_tempat_tinggal: null,
      is_ayah_bekerja: 0,
      nama_ayah: "",
      jenis_pekerjaan_ayah: "",
      pendapatan_perbulan_ayah: 0,
      is_ibu_bekerja: 0,
      nama_ibu: "",
      jenis_pekerjaan_ibu: "",
      pendapatan_perbulan_ibu: 0,
    },
    validationSchema: userSchema,
    onSubmit: (values) => handleAdd(values),
  });

  const getFormErrorMessage = (name) => {
    return formik.touched[name] && formik.errors[name] && <small className="p-error">{formik.errors[name]}</small>;
  };

  useEffect(() => {
    setIsDisableFieldAyah(formik.values.is_ayah_bekerja === 0 ? true : false);
  }, [formik.values.is_ayah_bekerja]);

  useEffect(() => {
    setIsDisableFieldIbu(formik.values.is_ibu_bekerja === 0 ? true : false);
  }, [formik.values.is_ibu_bekerja]);

  return (
    <>
      <div className="p-4 flex fixed w-full justify-between items-center bg-white border-b shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)] z-50">
        <div className="flex gap-3">
          <div className="w-1 h-12 bg-sky-500 rounded-full"></div>
          <div className="flex flex-col">
            <span className="font-semibold">Tambah Siswa</span>
            <span className="text-sm text-gray-600">Tambah siswa baru</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.back()} className="flex items-center gap-3 border border-gray-400 bg-white py-2 px-4 rounded-lg hover:shadow-lg hover:border-gray-200 active:scale-[0.97]">
            <i className="pi pi-chevron-left text-slate-900 text-xs font-medium"></i>
            <span className="text-sm font-medium text-slate-900">Kembali</span>
          </button>
          <button
            type="submit"
            onClick={formik.handleSubmit}
            className="flex items-center gap-3 bg-[#2293EE] py-2 px-4 rounded-lg hover:bg-[#4da5ed] active:scale-[0.97] focus:ring focus:ring-blue-200"
          >
            <i className="pi pi-user-plus text-white text-xs font-medium"></i>
            <span className="text-sm font-medium text-white">Simpan</span>
          </button>
        </div>
      </div>
      <div className="p-5 pt-24">
        <form className="w-full p-4 bg-white border shadow-[0px_8px_15px_-3px_rgba(0,0,0,0.02)] rounded-lg grid grid-cols-12">
          <div className="border-r col-span-7 pr-4">
            <div className="flex gap-2">
              <span className="w-1 h-6 bg-[#2293EE] rounded"></span>
              <h2 className="font-semibold mb-3">Informasi Pribadi</h2>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="nama" className="text-sm">
                  Nama Lengkap
                </label>
                <InputText
                  id="nama"
                  name="nama"
                  placeholder="nama lengkap"
                  value={formik.values.nama}
                  onChange={formik.handleChange}
                  className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["nama"] && formik.errors["nama"] })}
                />
                {getFormErrorMessage("nama")}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 flex flex-col gap-1">
                  <label htmlFor="tempat_lahir" className="text-sm">
                    Tempat Lahir
                  </label>
                  <InputText
                    id="tempat_lahir"
                    name="tempat_lahir"
                    placeholder="tempat lahir"
                    value={formik.values.tempat_lahir}
                    onChange={formik.handleChange}
                    className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["tempat_lahir"] && formik.errors["tempat_lahir"] })}
                  />
                  {getFormErrorMessage("tempat_lahir")}
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                  <label htmlFor="tanggal_lahir" className="text-sm">
                    Tanggal Lahir
                  </label>
                  <Calendar
                    inputId="tanggal_lahir"
                    name="tanggal_lahir"
                    placeholder="tanggal lahir"
                    value={formik.values.tanggal_lahir}
                    onChange={formik.handleChange}
                    dateFormat="dd/mm/yy"
                    className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["tanggal_lahir"] && formik.errors["tanggal_lahir"] })}
                  />
                  {getFormErrorMessage("tanggal_lahir")}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="alamat" className="text-sm">
                  Alamat
                </label>
                <InputTextarea
                  id="alamat"
                  name="alamat"
                  placeholder="alamat"
                  value={formik.values.alamat}
                  onChange={formik.handleChange}
                  className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["alamat"] && formik.errors["alamat"] })}
                />
                {getFormErrorMessage("alamat")}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 flex flex-col gap-1">
                  <label htmlFor="no_telp" className="text-sm">
                    Nomor Telepon
                  </label>
                  <InputText
                    id="no_telp"
                    name="no_telp"
                    placeholder="nomor telepon"
                    value={formik.values.no_telp}
                    keyfilter="int"
                    onChange={formik.handleChange}
                    className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["no_telp"] && formik.errors["no_telp"] })}
                  />
                  {getFormErrorMessage("no_telp")}
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                  <label htmlFor="jenis_kelamin" className="text-sm">
                    Jenis Kelamin
                  </label>
                  <Dropdown
                    inputId="jenis_kelamin"
                    name="jenis_kelamin"
                    placeholder="pilih jenis kelamin"
                    value={formik.values.jenis_kelamin}
                    onChange={formik.handleChange}
                    options={[
                      { label: "Laki - Laki", value: "laki-laki" },
                      { label: "Perempuan", value: "perempuan" },
                    ]}
                    className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["jenis_kelamin"] && formik.errors["jenis_kelamin"] })}
                  />
                  {getFormErrorMessage("jenis_kelamin")}
                </div>
              </div>
              <div className="col-span-1 flex flex-col gap-1">
                <label htmlFor="status_tempat_tinggal" className="text-sm">
                  Status Tempat Tinggal
                </label>
                <Dropdown
                  inputId="status_tempat_tinggal"
                  name="status_tempat_tinggal"
                  placeholder="pilih status tempat tinggal"
                  value={formik.values.status_tempat_tinggal}
                  onChange={formik.handleChange}
                  options={[
                    { label: "Rumah Kontrak", value: "mengontrak" },
                    { label: "Rumah Pribadi", value: "pribadi" },
                  ]}
                  className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["status_tempat_tinggal"] && formik.errors["status_tempat_tinggal"] })}
                />
                {getFormErrorMessage("status_tempat_tinggal")}
              </div>
              <div className="grid grid-cols-2 border-t pt-2 mt-2">
                <div className="col-span-1 flex flex-col gap-3 border-r pr-4">
                  <div className="col-span-1 flex flex-col gap-1">
                    <label htmlFor="nama_ayah" className="text-sm">
                      Nama Ayah
                    </label>
                    <InputText
                      id="nama_ayah"
                      name="nama_ayah"
                      placeholder="nama ayah"
                      value={formik.values.nama_ayah}
                      onChange={formik.handleChange}
                      className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["nama_ayah"] && formik.errors["nama_ayah"] })}
                    />
                    {getFormErrorMessage("nama_ayah")}
                  </div>
                  <span className="text-sm">Status Pekerjaan Ayah</span>
                  <div className="flex gap-2 mb-2">
                    <div className="flex gap-2 items-center">
                      <RadioButton
                        inputId="ayah_tidak_bekerja"
                        name="is_ayah_bekerja"
                        value={0}
                        onChange={formik.handleChange}
                        checked={formik.values.is_ayah_bekerja === 0}
                        className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["is_ayah_bekerja"] && formik.errors["is_ayah_bekerja"] })}
                      />
                      <label htmlFor="ayah_tidak_bekerja" className="text-sm">
                        Tidak Bekerja
                      </label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <RadioButton
                        inputId="ayah_bekerja"
                        name="is_ayah_bekerja"
                        value={1}
                        onChange={formik.handleChange}
                        checked={formik.values.is_ayah_bekerja === 1}
                        className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["is_ayah_bekerja"] && formik.errors["is_ayah_bekerja"] })}
                      />
                      <label htmlFor="ayah_bekerja" className="text-sm">
                        Bekerja
                      </label>
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col gap-1">
                    <label htmlFor="jenis_pekerjaan_ayah" className="text-sm">
                      Jenis Pekerjaan Ayah
                    </label>
                    <Dropdown
                      inputId="jenis_pekerjaan_ayah"
                      name="jenis_pekerjaan_ayah"
                      placeholder="pilih jenis pekerjaan"
                      disabled={isDisableFieldAyah}
                      value={formik.values.jenis_pekerjaan_ayah}
                      onChange={formik.handleChange}
                      options={[
                        { label: "Tidak Bekerja", value: "Tidak Bekerja" },
                        { label: "Pegawai Swasta", value: "Pegawai Swasta" },
                        { label: "Aparatur Sipil Negara", value: "Aparatur Sipil Negara" },
                        { label: "Berdagang", value: "Berdagang" },
                        { label: "Wiraswasta", value: "Wiraswasta" },
                        { label: "Freelance", value: "Freelance" },
                      ]}
                      className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["jenis_pekerjaan_ayah"] && formik.errors["jenis_pekerjaan_ayah"] })}
                    />
                    {getFormErrorMessage("jenis_pekerjaan_ayah")}
                  </div>
                  <div className="col-span-1 flex flex-col gap-1">
                    <label htmlFor="pendapatan_perbulan_ayah" className="text-sm">
                      Pendapatan Perbulan Ayah
                    </label>
                    <span className="p-input-icon-left">
                      <i className="text-[0.8rem]">Rp.</i>
                      <InputText
                        id="pendapatan_perbulan_ayah"
                        name="pendapatan_perbulan_ayah"
                        placeholder="pendapatan perbulan"
                        disabled={isDisableFieldAyah}
                        value={formik.values.pendapatan_perbulan_ayah}
                        onChange={formik.handleChange}
                        keyfilter="int"
                        className={classNames({ "p-inputtext-sm": true, "w-full": true, "p-invalid": formik.touched["pendapatan_perbulan_ayah"] && formik.errors["pendapatan_perbulan_ayah"] })}
                      />
                    </span>
                    {getFormErrorMessage("pendapatan_perbulan_ayah")}
                  </div>
                </div>
                <div className="col-span-1 flex flex-col gap-3 pl-4">
                  <div className="col-span-1 flex flex-col gap-1">
                    <label htmlFor="nama_ibu" className="text-sm">
                      Nama Ibu
                    </label>
                    <InputText
                      id="nama_ibu"
                      name="nama_ibu"
                      placeholder="nama ibu"
                      value={formik.values.nama_ibu}
                      onChange={formik.handleChange}
                      className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["nama_ibu"] && formik.errors["nama_ibu"] })}
                    />
                    {getFormErrorMessage("nama_ibu")}
                  </div>
                  <span className="text-sm">Status Pekerjaan Ibu</span>
                  <div className="flex gap-2 mb-2">
                    <div className="flex gap-2 items-center">
                      <RadioButton
                        inputId="ibu_tidak_bekerja"
                        name="is_ibu_bekerja"
                        value={0}
                        onChange={formik.handleChange}
                        checked={formik.values.is_ibu_bekerja === 0}
                        className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["is_ibu_bekerja"] && formik.errors["is_ibu_bekerja"] })}
                      />
                      <label htmlFor="ibu_tidak_bekerja" className="text-sm">
                        Tidak Bekerja
                      </label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <RadioButton
                        inputId="ibu_bekerja"
                        name="is_ibu_bekerja"
                        value={1}
                        onChange={formik.handleChange}
                        checked={formik.values.is_ibu_bekerja === 1}
                        className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["is_ibu_bekerja"] && formik.errors["is_ibu_bekerja"] })}
                      />
                      <label htmlFor="ibu_bekerja" className="text-sm">
                        Bekerja
                      </label>
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col gap-1">
                    <label htmlFor="jenis_pekerjaan_ibu" className="text-sm">
                      Jenis Pekerjaan Ibu
                    </label>
                    <Dropdown
                      inputId="jenis_pekerjaan_ibu"
                      name="jenis_pekerjaan_ibu"
                      placeholder="pilih jenis pekerjaan"
                      disabled={isDisableFieldIbu}
                      value={formik.values.jenis_pekerjaan_ibu}
                      onChange={formik.handleChange}
                      options={[
                        { label: "Tidak Bekerja", value: "Tidak Bekerja" },
                        { label: "Pegawai Swasta", value: "Pegawai Swasta" },
                        { label: "Aparatur Sipil Negara", value: "Aparatur Sipil Negara" },
                        { label: "Berdagang", value: "Berdagang" },
                        { label: "Wiraswasta", value: "Wiraswasta" },
                        { label: "Freelance", value: "Freelance" },
                      ]}
                      className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["jenis_pekerjaan_ibu"] && formik.errors["jenis_pekerjaan_ibu"] })}
                    />
                    {getFormErrorMessage("jenis_pekerjaan_ibu")}
                  </div>
                  <div className="col-span-1 flex flex-col gap-1">
                    <label htmlFor="pendapatan_perbulan_ibu" className="text-sm">
                      Pendapatan Perbulan Ibu
                    </label>
                    <span className="p-input-icon-left">
                      <i className="text-[0.8rem]">Rp.</i>
                      <InputText
                        id="pendapatan_perbulan_ibu"
                        name="pendapatan_perbulan_ibu"
                        placeholder="pendapatan perbulan"
                        disabled={isDisableFieldIbu}
                        value={formik.values.pendapatan_perbulan_ibu}
                        onChange={formik.handleChange}
                        keyfilter="int"
                        className={classNames({ "p-inputtext-sm": true, "w-full": true, "p-invalid": formik.touched["pendapatan_perbulan_ibu"] && formik.errors["pendapatan_perbulan_ibu"] })}
                      />
                    </span>
                    {getFormErrorMessage("pendapatan_perbulan_ibu")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-5 pl-4 flex flex-col justify-between">
            <div>
              <div className="flex gap-2">
                <span className="w-1 h-6 bg-[#2293EE] rounded"></span>
                <h2 className="font-semibold mb-3">Informasi Akademik</h2>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="no_induk_sekolah" className="text-sm">
                    Nomor Induk Siswa
                  </label>
                  <InputText
                    id="no_induk_sekolah"
                    name="no_induk_sekolah"
                    placeholder="nomor induk siswa"
                    keyfilter="int"
                    value={formik.values.no_induk_sekolah}
                    onChange={formik.handleChange}
                    className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["no_induk_sekolah"] && formik.errors["no_induk_sekolah"] })}
                  />
                  {getFormErrorMessage("no_induk_sekolah")}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="nisn" className="text-sm">
                    NISN
                  </label>
                  <InputText
                    id="nisn"
                    name="nisn"
                    placeholder="nisn"
                    keyfilter="int"
                    value={formik.values.nisn}
                    onChange={formik.handleChange}
                    className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["nisn"] && formik.errors["nisn"] })}
                  />
                  {getFormErrorMessage("nisn")}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="username" className="text-sm">
                    Username
                  </label>
                  <InputText
                    id="username"
                    name="username"
                    placeholder="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["username"] && formik.errors["username"] })}
                  />
                  {getFormErrorMessage("username")}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="password" className="text-sm">
                    password
                  </label>
                  <Password
                    id="password"
                    name="password"
                    placeholder="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    toggleMask
                    inputClassName="w-full"
                    className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["password"] && formik.errors["password"] })}
                  />
                  {getFormErrorMessage("password")}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
