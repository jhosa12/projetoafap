import { SalesTracking } from "@/components/vendas/sales/SalesTracking";
import { AuthContext } from "@/store/AuthContext";
import { useContext } from "react";

const mockSetores = [
    { id_grupo: 1, descricao: "Vendas Diretas" },
    { id_grupo: 2, descricao: "Televendas" },
    { id_grupo: 3, descricao: "E-commerce" },
    { id_grupo: 4, descricao: "Parcerias" }
  ];

export default function Sales(){

  const {selectEmp} = useContext(AuthContext);



    return(
           <SalesTracking
                      empresa={selectEmp}
                      setores={mockSetores}
                      logoUrl="/placeholder.svg"
                    />
    )
}