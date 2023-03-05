"use client";
import { useContext, useState } from "react";
import { AppContext } from "@/context";

export default function Dashboard() {
  const { toast, router } = useContext(AppContext);

  return (
    <>
      <div>Dashboard</div>
    </>
  );
}
