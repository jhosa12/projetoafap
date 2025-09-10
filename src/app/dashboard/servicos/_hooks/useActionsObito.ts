import { AuthContext } from "@/store/AuthContext";
import { useContext, useEffect, useState } from "react";
import { ObitoProps } from "../_types/obito";
import { api } from "@/lib/axios/apiClient";
import { toast } from "sonner";

interface ActionsProps {

  // --- Estados que a UI irá ler ---
  listaServicos: ObitoProps[];

  // --- Funções de Ação (handlers) ---
  listar (): Promise<void>;
  deletarObito (os: ObitoProps): Promise<void>;

}

const useActionsObito = () => {
  const { usuario, signOut } = useContext(AuthContext);
  const [listaServicos, setServicos] = useState<ObitoProps[]>([]);


  useEffect(() => {
    if (!usuario) return signOut();
    listar();
  }, [usuario]);


  async function listar() {
    try {
      const { data } = await api.get<ObitoProps[]>("/obitos/listarServicos");
      setServicos(data);
    } catch (err) {
      //console.error(err);
      toast.error("Não foi possível carregar os registros.");
    }
  }

  async function deletarObito(os: ObitoProps) {
    if (!os?.id_obitos) {
      toast.warning("Selecione um registro para excluir.");
      return;
    }

    toast.promise(
      api.delete("/obitos/deletar", {
        data: { id_obitos: os.id_obitos },
      }),
      {
        loading: "Excluindo registro...",
        success: () => {
          listar();
          // setOpenConfirm(false);
          return "Registro excluído com sucesso!";
        },
        error: "Erro ao excluir registro.",
      }
    );
  }

  return {

    listaServicos,
    listar,
    deletarObito,
    
  }
}

export default useActionsObito;