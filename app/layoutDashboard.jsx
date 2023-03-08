"use client";

import { useState, useContext, useRef } from "react";
import { usePathname } from "next/navigation";
import { AppContext } from "@/context";
import Image from "next/image";
import Link from "next/link";

import { Menu } from "primereact/menu";
import { logout } from "@/services/user";

export default function LayoutDashboard({ children }) {
  const { classNames, menu, access_token, loading } = useContext(AppContext);
  const pathname = usePathname();
  const menuContent = useRef(null);

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
        result.push(
          <Link href={data[i].url} key={i}>
            <div
              className={classNames({
                "border px-6 py-2 rounded-xl hover:shadow-md hover:shadow-blue-100 hover:border-blue-300 active:scale-[0.95] active:ring active:ring-blue-200": true,
                "bg-[#2293EE] font-medium border-[#2293EE] text-white": pathname.includes(data[i].url),
              })}
            >
              {data[i].nama}
            </div>
          </Link>
        );
      }
    }
    return result;
  };

  if (pathname === "/login" || !access_token) {
    return <>{children}</>;
  } else {
    return (
      <div>
        <div
          className={classNames({
            "bg-white border-b h-[4.5rem] w-full px-10 flex justify-between items-center fixed z-20": true,
          })}
        >
          <div className="flex gap-6 items-center">
            <Link href="/">
              <div className="flex items-center">
                <div className="relative w-14 h-14">
                  <Image src="/logo.png" alt="Logo SD" fill sizes="100%" className="object-contain" />
                </div>
                <span className="flex flex-col">
                  <h2 className="font-medium">Sekolah Dasar Negeri 02</h2>
                  <h4 className="text-sm">Pakulonan Barat</h4>
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <span className="h-10 border-l-2"></span>
              {renderMenu()}
            </div>
          </div>
          <div>
            <Menu model={accMenu} popup ref={menuContent} className="mt-2" />
            <button
              onClick={(e) => menuContent.current.toggle(e)}
              className="flex gap-3 items-center border border-transparent px-4 py-1 rounded-xl hover:shadow-md hover:shadow-blue-100 hover:border-blue-300 active:ring active:ring-blue-200 focus:ring focus:ring-blue-200"
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
        <div className="pt-[4.5rem] pb-4 min-h-screen bg-[#f7f7f8]">{children}</div>
      </div>
    );
  }
}
