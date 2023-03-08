"use client";
import { useContext, useState } from "react";
import { AppContext } from "@/context";

export default function Dashboard() {
  const { toast } = useContext(AppContext);

  return (
    <>
      <div>Dashboard</div>
    </>
  );
}
