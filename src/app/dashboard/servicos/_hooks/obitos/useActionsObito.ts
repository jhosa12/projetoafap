import { AuthContext } from "@/store/AuthContext";
import {useContext, useEffect, useState } from "react";
import { ObitoProps } from "../../_types/obito";
import { api } from "@/lib/axios/apiClient";
import { toast } from "sonner";
import { SubmitHandler } from "react-hook-form";
import { AssociadoProps } from "../../../admcontrato/_types/associado";
import { ProdutosProps } from "@/types/produtos";
import { removerFusoDate } from "@/utils/removerFusoDate";

interface ActionsProps {

  // --- Estados que a UI irá ler ---
  titular: boolean;
  listaServicos: ObitoProps[];
  listaAssociado: Partial<AssociadoProps>
  usarDadosTitular: (value: boolean) => void;
  isDependenteSelecionado: (value: boolean) => void;
  isModalOpen: (value: boolean) => void;
  rowSelection: (value: boolean) => void;
  handleCheckboxTitularChange: (value: boolean) => void;
  handleConfirmarSelecaoDependente: (value: boolean) => void;

  //Funções para alterar o estado
  setIsModalOpen: (value: boolean) => void;
  setDependenteSelecionado: (value: boolean) => void;
  setRowSelection: (value: boolean) => void;
  setUsarDadosTitular: (value: boolean) => void;
  setTitular: (value: boolean) => void;


  // --- Funções de Ação (handlers) ---
  listar(): Promise<void>;
  deletarObito(os: ObitoProps): Promise<void>;
  setarCampoAssociado: (fields: Partial<AssociadoProps>) => void

}

const useActionsObito = () => {
  const { usuario, signOut, infoEmpresa, dadosassociado, limparDados } = useContext(AuthContext);
  const [listaServicos, setServicos] = useState<ObitoProps[]>([]);
  const [servico, setServico] = useState<ObitoProps | null>(null)
  const [produtos,setProdutosObito]=useState<Array<ProdutosProps>>([])
  useEffect(() => {
    Promise.all([
        listar(),
        listarProdutos()
    ])
    
  }, [usuario,infoEmpresa?.id]);



  const listarProdutos = async()=>{
        const response = await api.post('/produtos/listar')
        setProdutosObito(response.data)
  }


  async function listar() {
    try {
      const { data } = await api.post<ObitoProps[]>("/obitos/listarServicos",{id_empresa:infoEmpresa?.id});
      console.log("Dados recebidos da API:", data)
      setServicos(data);

    } catch (err) {

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
  const cadastrarObito = async (data: ObitoProps) => {

  

    const limparNaN = (valor: any) => {
      const num = parseFloat(valor);
      return isNaN(num) ? null : num;
    };

    const {newDate:end_data_falecimento} = removerFusoDate(data.end_data_falecimento)
    const {newDate:data_nascimento} = removerFusoDate(data?.data_nascimento??undefined)
    const {newDate:dt_velorio} = removerFusoDate(data.dt_velorio)
    const {newDate:dt_sepultamento} = removerFusoDate(data.dt_sepultamento)
    const {newDate:hr_velorio} = removerFusoDate(data.hr_velorio)

    

    const payload = {
      ...data,
      id_contrato_global: dadosassociado.contrato?.id_contrato_global,
      id_empresa: infoEmpresa?.id,
      id_titular: dadosassociado?.id_associado,
      id_associado_global: dadosassociado?.id_global,
      id_contrato: dadosassociado.contrato?.id_contrato,
      situacao_contrato: dadosassociado.contrato?.situacao,
      tipo_atendimento: data.tipo_atendimento ?? "ASSOCIADO",
      status: data.listacheckida?.find(item => item.status === false) || data.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO',

      // Datas sendo formatadas para o padrão ISO
      end_data_falecimento,
      data_nascimento,
      dt_sepultamento,
      dt_velorio,
      hr_velorio,

      // Campos numéricos sendo "limpos" para não enviar NaN
      saldo: limparNaN(data.saldo),
      vl_produtos: limparNaN(data.vl_produtos),
      custo: limparNaN(data.custo),

    };

    

    try {
      const response = await api.post("/obitos/adicionarObito", payload);
      setServicos(prev => [...prev, response.data]);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async function editarObito(data: ObitoProps) {

    const {newDate:end_data_falecimento} = removerFusoDate(data.end_data_falecimento)
    const {newDate:data_nascimento} = removerFusoDate(data?.data_nascimento??undefined)
    const {newDate:dt_velorio} = removerFusoDate(data.dt_velorio)
    const {newDate:dt_sepultamento} = removerFusoDate(data.dt_sepultamento)
    const {newDate:hr_velorio} = removerFusoDate(data.hr_velorio)

    const payload = {
      ...data,
      end_data_falecimento,
      data_nascimento,
      dt_velorio,
      dt_sepultamento,
      hr_velorio,
      status: data.listacheckida?.find(item => item.status === false) || data.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'
    }

 

    return toast.promise(
      api.put('/obitos/editarObito', payload),
      {
        loading: 'Atualizando dados',
        success: 'Dados atualizados com sucesso',
        error: (err) => err.response?.data?.message || 'Erro ao atualizar os dados',
      }
    )
  }

  const onSave: SubmitHandler<ObitoProps> = async (data) => {

    if (!data.nome_falecido || !data.rd_nome || !data.end_data_falecimento) {
      toast.error("Preencha os campos obrigatórios.");
      return false;
    }

    try {
      if (data.id_obitos) {

        const response = await editarObito(data as ObitoProps);
        await listar(); 
        return true;

      } else {

        const response = await cadastrarObito(data as ObitoProps);
        toast.success("Dados cadastrados com sucesso!")
        await listar(); 
        return true;
      }


    } catch (error) {

      throw error;
    }
  };












  return {

    listaServicos,
    listar,
    deletarObito,
    servico,
    setServico,
    onSave,
    produtos
  }
}

export default useActionsObito;