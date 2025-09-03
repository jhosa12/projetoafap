import { api } from "@/lib/axios/apiClient"
import { AuthContext } from "@/store/AuthContext"
import { MensalidadeBaixaProps } from "@/types/financeiro"
import { useCallback, useContext, useState } from "react"
import { toast } from "sonner"
import { LancamentosProps } from "../_types/types"


interface ActionsProps{
    success:()=>Promise<void>,
    loading:string,
    error:string
}


const useActionsCaixa = () => {
    const {usuario,permissoes,infoEmpresa} = useContext(AuthContext)
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


const handleExcluir = useCallback(async () => {
    toast.promise(
      api.delete(`/caixa/deletar`, {
        data: {
          lanc_id: mov?.lanc_id,
          id_empresa: infoEmpresa?.id,
        },
      }),
      {
        error: (error: any) => {
          console.log(error);
          return "Erro ao deletar lancamento";
        },
        loading: "Solicitando exclusão..",
        success: () => {
          // const novo = [...(data?.lista||[])]
          // const index = novo.findIndex(item=>item.lanc_id===mov?.lanc_id)
          //  novo.splice(index,1)
          //  setData({...data,lista:novo})
          handleChamarFiltro(); // Ensure this is awaited
          setModal({ excluir: false });
          //setModalExc(false)

          return "Deletado com sucesso";
        },
      }
    );
  }, [mov?.lanc_id, data?.lista, infoEmpresa?.id]);











      return{
        buscarMensalidade,
        loading,
        modalDados,
        mensalidade,
        setModalDados,
        setLoading
      }
    
}

export default useActionsCaixa
