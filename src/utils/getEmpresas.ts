import { AuthContext } from "@/store/AuthContext";
import { EmpresaProps } from "@/types/empresa";
import { useContext } from "react";




export const useGetEmpresasSaude = ():{empresas:EmpresaProps[]} => {
            const {empresas} = useContext(AuthContext);
            const empresasSaude = empresas.filter(empresa => empresa.nome.includes("SAUDE")||empresa.nome.includes("SAÚDE "));
            return {empresas:empresasSaude}
}