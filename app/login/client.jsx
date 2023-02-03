"use client";

import { useEffect, useState } from "react";
import { getAllUser } from "@/services/user";

export default function Client({ children }) {
  const [user, setUser] = useState([]);
  const [stateServer, setStateServer] = useState(false);

  const getUser = () => {
    getAllUser(0, 10).then((res) => {
      setUser((prev) => [...prev, ...res.data]);
    });
  };

  useEffect(() => {
    setStateServer(JSON.parse(children._payload.value).cookies);
  }, []);

  return (
    <>
      <div>login</div>
      <div className="">{stateServer.access_token}</div>
      <button className="py-2 px-4 bg-blue-200 font-semibold rounded-md" onClick={getUser}>
        GET USER
      </button>
      <div className="flex flex-col gap-4">
        {user.map((item, index) => (
          <div key={index} className="py-2 px-4 text-sm font-medium bg-teal-400">
            {item.nama}
          </div>
        ))}
      </div>
    </>
  );
}
