"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppContext } from "@/context";
import Image from "next/image";
import Link from "next/link";

import { Menu } from "primereact/menu";
import { logout } from "@/services/user";
import { cn } from "@/utils";

export default function LayoutDashboard({ children }) {
  const { classNames, menu, access_token, loading } = useContext(AppContext);
  const pathname = usePathname();
  const menuContent = useRef(null);
  const menuNavbar = useRef(null);
  const [visibleSidebar, setVisibleSidebar] = useState(false);

  const handleLogout = () => {
    loading({ text: "Sedang proses logout..", visible: true });
    logout()
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        }
      })
      .catch(() => {});
  };

  const accMenu = [{ label: "Logout", className: "text-sm", icon: "pi pi-sign-out", command: handleLogout }];

  const renderMenu = () => {
    let data = menu || [];
    let result = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].nama.toUpperCase() !== "DASHBOARD") {
        if (data[i].nama.toUpperCase() === "DATA PENDUKUNG") {
          result.push(
            <div key={i} className="w-full md:w-fit">
              <Menu
                model={data[i].list.map((v, index) => {
                  return {
                    template: () => {
                      return (
                        <Link key={index} href={v.url} className="p-menuitem-link" onClick={(e) => menuNavbar.current.toggle(e)}>
                          <span className="p-menuitem-text text-sm">{v.nama}</span>
                        </Link>
                      );
                    },
                  };
                })}
                popup
                ref={menuNavbar}
                className="mt-2"
              />
              <button
                className={classNames("w-full flex items-center justify-center gap-2 border px-6 py-2 rounded-xl hover:shadow-md hover:shadow-blue-100 hover:border-blue-300 focus:ring focus:ring-blue-200 active:scale-[0.95] active:ring active:ring-blue-200", {
                  "bg-[#2293EE] font-medium border-[#2293EE] text-white": pathname.includes("absensi") || pathname.includes("prestasi"),
                })}
                onClick={(e) => menuNavbar.current.toggle(e)}
              >
                <span className="text-sm">Data Pendukung</span>
                <i className="pi pi-chevron-down text-xs"></i>
              </button>
            </div>
          );
        } else {
          result.push(
            <Link href={data[i].url} key={i} className="w-full md:w-fit">
              <div
                className={classNames("border px-6 py-2 rounded-xl text-sm text-center hover:shadow-md hover:shadow-blue-100 hover:border-blue-300 active:scale-[0.95] active:ring active:ring-blue-200", {
                  "bg-[#2293EE] font-medium border-[#2293EE] text-white": pathname.includes(data[i].url),
                })}
              >
                {data[i].nama}
              </div>
            </Link>
          );
        }
      }
    }
    return result;
  };

  useEffect(() => {
    setVisibleSidebar(false);
  }, [pathname])

  if (pathname === "/login" || !access_token) {
    return <>{children}</>;
  } else {
    return (
      <>
        <div
          className={cn(classNames("bg-white border-b w-screen h-screen md:h-[4.5rem] px-10 py-10 flex flex-col gap-4 md:gap-0 md:flex-row justify-between items-center fixed top-0 left-0 z-[60]", { "hidden md:flex": !visibleSidebar, "flex": visibleSidebar }))}
        >
          <div className="w-full flex flex-col md:flex-row gap-2 md:gap-6 items-center">
            <div className="w-full md:w-fit flex justify-between items-center">
              <Link href="/">
                <div className="flex items-center">
                  <div className="relative w-14 h-14">
                    <Image src="/logo.png" alt="Logo SD" fill sizes="100%" className="object-contain" />
                  </div>
                  <span className="flex flex-col">
                    <h2 className="font-medium whitespace-nowrap">Sekolah Dasar Negeri</h2>
                    <h4 className="text-sm">Pakulonan Barat 02</h4>
                  </span>
                </div>
              </Link>
              <button 
              onClick={() => setVisibleSidebar(false)}
              className="md:hidden h-12 w-12 flex justify-center items-center border rounded-xl hover:shadow-md hover:shadow-blue-100 hover:border-blue-300 active:ring active:ring-blue-200 focus:ring focus:ring-blue-200"
              >
                <i className="pi pi-arrow-left"></i>
              </button>
            </div>
            <span className="w-full md:w-0 md:h-10 border-t-2 md:border-l-2 mb-2 md:mb-0"></span>
            <div className="w-full flex flex-col md:flex-row items-center gap-4">
              {renderMenu()}
            </div>
          </div>
          <div className="w-full md:w-fit border md:border-none rounded-2xl">
            <Menu model={accMenu} popup ref={menuContent} className="mt-2" />
            <button
              onClick={(e) => menuContent.current.toggle(e)}
              className="w-full flex gap-3 items-center border border-transparent px-4 py-1 rounded-xl hover:shadow-md hover:shadow-blue-100 hover:border-blue-300 active:ring active:ring-blue-200 focus:ring focus:ring-blue-200"
            >
              <span className="h-9 w-9 flex justify-center items-center rounded-full bg-gray-100">
                <i className="pi pi-user"></i>
              </span>
              <span className="h-7 border-l-2"></span>
              <div className="flex flex-col items-start">
                <span>{access_token?.nama}</span>
                <span className="text-xs text-gray-500">{access_token?.no_induk_sekolah || access_token?.nisn || ""}</span>
              </div>
            </button>
          </div>
        </div>
        <div className="md:pt-[5.1rem] min-h-screen bg-[#f7f7f8]">{children}</div>
        <button onClick={() => setVisibleSidebar(true)} className={cn(classNames("bg-white rounded-lg border shadow-lg shadow-gray-300 w-12 h-12 flex justify-center items-center fixed top-4 left-4 md:hidden z-[60]", { "flex": !visibleSidebar, "hidden": visibleSidebar }))}><i className="pi pi-bars"></i></button>
      </>
    );
  }
}
