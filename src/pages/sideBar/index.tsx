import { AppSidebar } from "@/components/sideBarTeste/app-sideBar";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";





export default function SideBar() {
    const {selectEmp,empresas} =useContext(AuthContext)


    return(
        <AppSidebar empresas={empresas} empresa={selectEmp} />
    )
}