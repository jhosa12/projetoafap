import { AuthContext } from "@/store/AuthContext";
import { useContext, useEffect, useState } from "react";
import { ObitoProps } from "../_types/obito";
import { api } from "@/lib/axios/apiClient";
import { toast } from "sonner";
import { SubmitHandler } from "react-hook-form";

interface ActionsProps {

  // --- Estados que a UI irá ler ---
  listaServicos: ObitoProps[];

  // --- Funções de Ação (handlers) ---
  listar (): Promise<void>;
  deletarObito (os: ObitoProps): Promise<void>;

}

const useActionsObito = () => {
  const { usuario, signOut,selectEmp } = useContext(AuthContext);
  const [listaServicos, setServicos] = useState<ObitoProps[]>([]);
  const [servico,setServico] = useState<ObitoProps>({} as ObitoProps)


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


  const onSave:SubmitHandler<ObitoProps> = async(data)=>{
    data.id_obitos ?   await editarObito(data) : await cadastrarObito(data)
  }


  const cadastrarObito = async(data:ObitoProps)=> {
    const [hours, minutes] = (data.hr_velorio ?? '').split(':');
    const newDate = new Date();
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    if (!data.nome_falecido || !data.rd_nome) {
        toast.info("Preencha todos os campos obrigatórios");
        return;
    }

    toast.promise(
        api.post("/obitos/adicionarObito", {
            ...data,id_empresa:selectEmp, hr_velorio: newDate, obito_itens: data.obito_itens, tipo_atendimento: data.tipo_atendimento?? "ASSOCIADO",
            status: data.listacheckida?.find(item => item.status === false) || data.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'
        }),
        {
            error: (erro=>{
              console.log(erro)
              return 'Erro ao Realizar Cadastro'
            }),
            loading: 'Cadastrando óbito',
            success: (response) => {
//setServico({ ...servico, id_obitos: response.data })
                return 'Cadastrado com sucesso!'
            }
        }
    )

}

   async function editarObito(data:ObitoProps) {
        toast.promise(
            api.put('/obitos/editarObito', {
                ...data,
                status: data.listacheckida?.find(item => item.status === false) || data.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'

            }),
            {
                error: 'Erro ao atualizar os dados',
                loading: 'Atualizando dados',
                success: 'Dados atualizados com sucesso'
            }
        )
    }

  return {

    listaServicos,
    listar,
    deletarObito,
    servico,
    setServico,
    onSave
  }
}

export default useActionsObito;