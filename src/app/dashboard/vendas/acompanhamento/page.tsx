'use client';

import { SalesTracking } from "@/app/dashboard/vendas/_components/sales/SalesTracking";
import { AuthContext } from "@/store/AuthContext";
import { useContext } from "react";



export default function Sales() {

  const { selectEmp } = useContext(AuthContext);



  return (
    <SalesTracking
      empresa={selectEmp}
      logoUrl="/placeholder.svg"
    />
  )
}