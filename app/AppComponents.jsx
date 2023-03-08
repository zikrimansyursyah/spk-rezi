"use client";

import { useState, useRef } from "react";
import { AppContext } from "@/context";

// Components
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";
import Loading from "@/components/Loading";

export default function AppComponents({ children, menu, accessToken }) {
  const toast = useRef(null);
  const [loadingStatus, setLoadingStatus] = useState({
    visible: false,
    text: null,
  });

  return (
    <AppContext.Provider value={{ toast: toast, menu: menu, access_token: accessToken, classNames: classNames, loading: setLoadingStatus }}>
      {children}
      <Toast ref={toast} className="font-inter" />
      <Loading status={loadingStatus} />
    </AppContext.Provider>
  );
}
