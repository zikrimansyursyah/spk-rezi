"use client"
import { getAllKaryawan } from "@/services/user";
import { useState, use } from "react";

function getData() {
  let result = null;
  getAllKaryawan(0, 10).then((res) => {
    result = res.data.data
  })
    .catch((error) => {
      result = res.data
    })

  return result;
}

export default function Login() {
  const [userData, setUserData] = useState([]);

  const data = use(getData())


  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world! Login
      </h1>
      {(userData || []).map((item, index) => (
        <div key={index}>{item.nama}</div>
      ))}
    </>
  )
}