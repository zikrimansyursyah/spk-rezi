"use client";
import { useRouter } from "next/navigation";

import { getAllUser, logout } from "@/services/user";
import { Button } from "primereact/button";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();

  const [dataUser, setDataUser] = useState([]);

  const handleLogout = () => {
    logout()
      .then((res) => {
        if (res.status === 200) {
          router.push("/login");
        }
      })
      .catch(() => {});
  };

  const handleCari = () => {
    getAllUser()
      .then((res) => {
        setDataUser((prev) => [...prev, ...res.data]);
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <>
      <Button label="Logout" onClick={handleLogout} className="p-button-sm p-button-danger" />
      <Button label="Cari data" onClick={handleCari} className="p-button-sm" />
      {dataUser.map((item, index) => (
        <div key={index} className="pb-4 border-b-2">
          <div>{item.nama}</div>
          <div>{item.nik}</div>
          <div>{item.username}</div>
        </div>
      ))}
    </>
  );
}
