"use client"

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";

// Components
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import Image from "next/image";

// Services
import { login } from "@/services/user";

// Input Validation
const validationSchema = yup.object().shape({
  username: yup.string().min(4, "minimal 4 digit/karakter").required("masukan username/NIS anda"),
  password: yup.string().min(5, "minimal 6 karakter").required("password harus diisi"),
  is_remember: yup.boolean()
});

export default function Page() {
  const router = useRouter();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    console.log(formik.values)
    login(formik.values).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err.message)
    }).finally(() => {

    })
  }

  const getFormErrorMessage = (name) => {
    return !!(formik.touched[name] && formik.errors[name]) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      is_remember: false,
    },
    validationSchema: validationSchema,
    onSubmit: () => handleLogin(),
  });
  return (
    <div className="h-[100vh] grid grid-cols-12">
      <div className="bg-gradient-to-b from-blue-300 to-blue-500 col-span-7 hidden lg:block"></div>
      <div className="col-span-12 lg:col-span-5 p-10 xl:flex xl:justify-center">
        <div className="h-full flex flex-col justify-between xl:w-[70%]">
          <div className="flex gap-2 items-center">
            <div className="relative w-16 h-16 -ml-4 lg:hidden">
              <Image src="/logo.png" alt="logo sekolah dasar" fill className="object-contain" />
            </div>
            <span className="text-lg font-semibold lg:hidden">SD Negeri Duri Kepa 01</span>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
            <div className="mb-5">
              <h1 className="font-semibold text-3xl">Log In</h1>
              <h4 className=" text-gray-700">Enter your credentials</h4>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="username">Username</label>
              <InputText id="username" name="username" value={formik.values.username} onChange={formik.handleChange} className={`p-inputtext-sm`} />
              {getFormErrorMessage('username')}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="password">Password</label>
              <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} className={`p-inputtext-sm`} inputClassName="w-full" toggleMask />
              {getFormErrorMessage('password')}
            </div>
            <div>
              <Checkbox id="is-remember" onChange={e => formik.setFieldValue('is_remember', e.checked)} checked={formik.values.is_remember}></Checkbox>
              <label htmlFor="is-remember" className="ml-2">remember me</label>
            </div>
            <Button label="Login" type="submit" className="p-button-sm bg-[var(--primary-color)]" loading={loading} loadingIcon="pi pi-spin pi-spinner" iconPos="right" />
          </form>
          <footer className="text-sm">Copyright</footer>
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
}
