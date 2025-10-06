import { AuthContext } from "@/store/AuthContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { ObitoProps } from "../../_types/obito";
import { api } from "@/lib/axios/apiClient";
import { toast } from "sonner";
import { SubmitHandler } from "react-hook-form";
import { ConvProps } from "../../_types/convalescente";
import { AssociadoProps } from "../../../admcontrato/_types/associado";
import { RowSelectionState } from "@tanstack/react-table";

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

  useEffect(() => {
    if (!usuario) return signOut();
    listar();
  }, [usuario]);


  async function listar() {
    try {
      const { data } = await api.get<ObitoProps[]>("/obitos/listarServicos");
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

    let horaVelorioFormatada = null;
    if (data.hr_velorio && typeof data.hr_velorio === 'string' && data.hr_velorio.includes(':')) {
      const [hours, minutes] = data.hr_velorio.split(':');
      const dataParaHora = new Date();
      dataParaHora.setHours(parseInt(hours, 10));
      dataParaHora.setMinutes(parseInt(minutes, 10));

      if (!isNaN(dataParaHora.getTime())) {
        horaVelorioFormatada = dataParaHora.toISOString();
      }
    }

    const limparNaN = (valor: any) => {
      const num = parseFloat(valor);
      return isNaN(num) ? null : num;
    };

    const formatarDataISO = (dataValor: any) => {
      if (!dataValor || isNaN(new Date(dataValor).getTime())) {
        return null;
      }
      return new Date(dataValor).toISOString();
    }

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
      end_data_falecimento: formatarDataISO(data.end_data_falecimento),
      data_nascimento: formatarDataISO(data.data_nascimento),
      dt_sepultamento: formatarDataISO(data.dt_sepultamento),
      dt_velorio: formatarDataISO(data.dt_velorio),
      hr_velorio: horaVelorioFormatada,

      // Campos numéricos sendo "limpos" para não enviar NaN
      saldo: limparNaN(data.saldo),
      vl_produtos: limparNaN(data.vl_produtos),
      custo: limparNaN(data.custo),

    };

    console.log("Dados mandados para a api:", payload);

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

    const payload = {
      ...data,
      status: data.listacheckida?.find(item => item.status === false) || data.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'
    }

    console.log("Dados de editar para api:", payload)

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
  }
}

export default useActionsObito;