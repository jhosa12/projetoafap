import { api } from "@/lib/axios/apiClient"
import { AuthContext } from "@/store/AuthContext"
import { useCallback, useContext, useState } from "react"
import { toast } from "sonner"
import { LancamentosProps } from "../_types/types"
import { MensalidadeBaixaProps } from "../../admcontrato/_types/mensalidades"


interface ActionsProps{
    success:()=>Promise<void>,
    loading:string,
    error:string
}


const useActionsCaixa = () => {
    const {infoEmpresa} = useContext(AuthContext)
    const [loading,setLoading] = useState(false)
    const [mensalidade,setMensalidade] = useState<Partial<MensalidadeBaixaProps>>()
    const [modalDados,setModalDados] = useState<boolean>(false)
    const [mov, setMov] = useState<Partial<LancamentosProps>>();

      const buscarMensalidade = useCallback(
        async (n_doc: string) => {
          setLoading(true);
          try {
            const response = await api.post("/mensalidade/baixaDireta", {
              n_doc,
              id_empresa: infoEmpresa?.id,
            });
    
            setMensalidade(response.data);
            setModalDados(true);
          } catch (error: any) {
            console.log("Erro:", error); // Verifique o erro mais claramente
            if (
              error.response &&
              error.response.data &&
              error.response.data.error
            ) {
              toast.error(error.response.data.error);
            } else {
              toast.error("Ocorreu um erro desconhecido.");
            }
          }
    
          setLoading(false);
        },
        [infoEmpresa, mensalidade, modalDados]
      );














      return{
        buscarMensalidade,
        loading,
        modalDados,
        mensalidade,
        setModalDados,
        setLoading,
        mov,
        setMov,
      }
    
}

export default useActionsCaixa
