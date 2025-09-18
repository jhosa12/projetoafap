'use client';

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/store/AuthContext";
import { api } from "@/lib/axios/apiClient";
import { ajustarData } from "@/utils/ajusteData";
import { RotaFilterProps, RouteProps } from "../../../../components/cobranca_new/_types/types";
import CobrancaAdmin from "../../../../components/cobranca_new/_components/admin/routeScreen";


const RouteManagement = () => {
  
  const { infoEmpresa, cidadesEmpresa, consultores } = useContext(AuthContext);


  // const initialFilters: RotaFilterProps = {
  //   consultor: "",
  //   bairro: "",
  //   dateRange: {
  //     from: new Date(),
  //     to: new Date(),
  //   },
  //   status: "",
  // };

  // useEffect(() => {
  //   getRotas(initialFilters);
  // }, []);

  // const getRotas = async (data: RotaFilterProps) => {

  //   const {dataIni,dataFim} = ajustarData(data.dateRange?.from,data.dateRange?.to)
  //   try {
  //     const response = await api.post("/cobranca/rotas",
  //       {
  //         startDate:dataIni,
  //         endDate:dataFim
  //       }
  //     );
  //     setRoutes(response.data);
  //   } catch (error) {}
  // };



  return (
    <CobrancaAdmin
      cobradores={consultores}
      empresa={{id_empresa:infoEmpresa?.id!,nome:infoEmpresa?.nome??''}}
      cidadesEmpresa={cidadesEmpresa}
    />
   
  );
};

export default RouteManagement;
