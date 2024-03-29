"use client";
import { useState, useContext } from "react";
import { useFormik } from "formik";
import { AppContext } from "@/context";

// Components
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import Image from "next/image";

// Services
import { login } from "@/services/user";

// Validation
import { loginSchema } from "@/validation/auth";

export default function Client() {
  const { toast, classNames } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    login(formik.values)
      .then((res) => {
        if (res.status !== 200) {
          return toast.current.show({ severity: "warn", summary: "Gagal Login", detail: res.message });
        }
        toast.current.show({ severity: "success", summary: "Login Berhasil", detail: "Anda akan segera dialihkan ke halaman Dashboard" });
        // COOKIES SUDAH DI SET DI BE

        window.location.reload();
      })
      .catch((err) => {
        toast.current.show({ severity: "error", summary: "Internal Server Error", detail: err?.message });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getFormErrorMessage = (name) => {
    return formik.touched[name] && formik.errors[name] && <small className="p-error">{formik.errors[name]}</small>;
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      is_remember: false,
    },
    validationSchema: loginSchema,
    onSubmit: () => handleLogin(),
  });
  return (
    <div className="h-[100vh] grid grid-cols-12">
      <div className="bg-gradient-to-b from-blue-300 to-blue-500 col-span-7 hidden lg:block"></div>
      <div className="col-span-12 lg:col-span-5 p-10 xl:flex xl:justify-center">
        <div className="h-full flex flex-col justify-between xl:w-[70%]">
          <div className="flex gap-2 items-center">
            <div className="relative w-16 h-16 -ml-4 lg:hidden">
              <Image src="/logo.png" alt="logo sekolah dasar" fill sizes="100%" className="object-contain" />
            </div>
            <span className="text-lg font-semibold lg:hidden">SD Negeri Pakulonan Barat 02</span>
          </div>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
            <div className="mb-5">
              <h1 className="font-semibold text-3xl">Log In</h1>
              <h4 className=" text-gray-700">Enter your credentials</h4>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="username">
                Username
              </label>
              <InputText
                id="username"
                name="username"
                placeholder="username atau NIS anda"
                value={formik.values.username}
                disabled={loading}
                onChange={formik.handleChange}
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["username"] && formik.errors["username"] })}
              />
              {getFormErrorMessage("username")}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="password">
                Password
              </label>
              <Password
                id="password"
                name="password"
                placeholder="password anda"
                value={formik.values.password}
                disabled={loading}
                onChange={formik.handleChange}
                className={classNames({ "p-inputtext-sm": true, "p-invalid": formik.touched["password"] && formik.errors["password"] })}
                inputClassName="w-full"
                toggleMask
              />
              {getFormErrorMessage("password")}
            </div>
            <div>
              <Checkbox id="is-remember" onChange={(e) => formik.setFieldValue("is_remember", e.checked)} checked={formik.values.is_remember}></Checkbox>
              <label htmlFor="is-remember" className="ml-2">
                remember me
              </label>
            </div>
            <Button label="Login" type="submit" className="p-button-sm bg-[var(--primary-color)]" loading={loading} loadingIcon="pi pi-spin pi-spinner" iconPos="right" />
          </form>
          <footer className="text-sm">Copyright SDN Pakulonan Barat 2</footer>
        </div>
      </div>
    </div>
  );
}
