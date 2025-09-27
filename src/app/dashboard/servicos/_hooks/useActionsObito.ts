import { AuthContext } from "@/store/AuthContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { ObitoProps } from "../_types/obito";
import { api } from "@/lib/axios/apiClient";
import { toast } from "sonner";
import { SubmitHandler } from "react-hook-form";
import { ConvProps } from "../_types/convalescente";
import { AssociadoProps } from "../../admcontrato/_types/associado";
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
  const [isDependenteSelecionado, setDependenteSelecionado] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listaAssociado, setListaAssociado] = useState<Partial<AssociadoProps>>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [usarDadosTitular, setUsarDadosTitular] = useState(false)
  const [titular, setTitular] = useState(false)
  const setarCampoAssociado = useCallback((fields: Partial<AssociadoProps>) => {
    setListaAssociado(prev => ({ ...prev, ...fields }));
  }, []);

  useEffect(() => {
    if (!usuario) return signOut();
    listar();
  }, [usuario]);


  async function listar() {
    try {
      const { data } = await api.get<ObitoProps[]>("/obitos/listarServicos");
      setServicos(data);
      console.log("Lista de obitos", data)
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
      id_contrato: dadosassociado.contrato?.id_contrato,
      id_titular: dadosassociado.id_associado,
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

    const promise = api.post("/obitos/adicionarObito", payload)

    console.log("Dados para api de obito:", payload)

    toast.promise(promise, {
      loading: "Salvando dados...",
      success: "Dados registrados com sucesso!",
      error: (err) => err.resposne?.data?.message || 'Erro ao cadastrar. Tente novamente.'
    })

  }

  async function editarObito(data: ObitoProps) {

    const payload = {
      ...data,
      status: data.listacheckida?.find(item => item.status === false) || data.listacheckvolta?.find(item => item.status === false) ? 'PENDENTE' : 'FECHADO'
    }

    const promise = api.put('/obitos/editarObito', payload)

    console.log("Dados de editar para api:", payload)
    toast.promise(promise, {
      loading: 'Atualizando dados',
      success: 'Dados atualizados com sucesso',
      error: (err) => err.response?.data?.message || 'Erro ao atualizar os dados',
    })

    return promise
  }
  const handleCheckboxTitularChange = (checked: boolean) => {
    const isChecked = !!checked;
    setUsarDadosTitular(checked);

    if (isChecked) {

      if (!dadosassociado?.id_global) {
        toast.error("Nenhum associado selecionado. Por favor, busque um primeiro.");
        setUsarDadosTitular(false);
        return;
      }


      setDependenteSelecionado(false);

      setarCampoAssociado({
        nome: dadosassociado.nome,
        data_nasc: new Date(dadosassociado.data_nasc ?? ''),
        cpfcnpj: dadosassociado.cpfcnpj,
        endereco: dadosassociado.endereco,
        numero: dadosassociado.numero,
        bairro: dadosassociado.bairro,
        guia_rua: dadosassociado.guia_rua,
        cep: dadosassociado.cep,
        cidade: dadosassociado.cidade,
        uf: dadosassociado.uf,
        dependentes: [],

      });

      toast.success("Formulário preenchido!")

    } else {

      setarCampoAssociado({
        nome: "",
        data_nasc: undefined,
        cpfcnpj: "",
        endereco: "",
        numero: undefined,
        bairro: "",
        guia_rua: "",
        cep: "",
        cidade: "",
        uf: "",
        dependentes: [],
      });
      toast.success("Formulário limpado!")
    }
  };

  const handleConfirmarSelecaoDependente = () => {

    const indicesSelecionados = Object.keys(rowSelection).map(Number);

    if (indicesSelecionados.length === 1 && dadosassociado?.dependentes) {
      const indice = indicesSelecionados[0];
      const dependentesVisiveis = dadosassociado.dependentes.filter(d => !d.excluido);
      const dependenteEscolhido = dependentesVisiveis[indice];

      if (dependenteEscolhido) {

        const dataNascimento = dependenteEscolhido.data_nasc
          ? new Date(dependenteEscolhido.data_nasc)
          : undefined;

        const dadosParaSetar = {
          nome: dependenteEscolhido.nome,
          data: dataNascimento,
          id_dependente: dependenteEscolhido.id_dependente,
        };

        setarCampoAssociado(dadosParaSetar)

        setDependenteSelecionado(true);
        setIsModalOpen(false);
      }
    } else {

      toast.info("Por favor, selecione apenas um dependente.");

    }
  };

  const onSave: SubmitHandler<ObitoProps> = async (data) => {

    if (!data.nome_falecido || !data.rd_nome) {

      toast.error("Preencha os campos obrigatórios.");
      return false;
    }

    try {
      if (data.id_obitos) {
        await editarObito(data);

      } else {

        await cadastrarObito(data);
      }

      console.log("onSave no hook: Operação bem-sucedida.");
      return true;

    } catch (error) {
      console.error("onSave no hook: A operação da API falhou.", error);

      return false;
    }
  };

  useEffect(() => {
    if (titular) {

      if (dadosassociado?.id_global) {

        setarCampoAssociado({
          nome: dadosassociado.nome ?? '',
          data_nasc: dadosassociado.data_nasc ? new Date(dadosassociado.data_nasc) : undefined,
          endereco: dadosassociado.endereco ?? '',
          bairro: dadosassociado.bairro ?? '',
          numero: dadosassociado.numero ?? undefined,
          cidade: dadosassociado.cidade ?? '',
          cpfcnpj: dadosassociado.cpfcnpj ?? '',
          uf: dadosassociado.uf ?? '',
          dependentes: []
        });
      } else {

        setarCampoAssociado({});
      }
    }

  }, [titular, dadosassociado, setarCampoAssociado]);


  return {

    listaServicos,
    listar,
    setIsModalOpen,
    setDependenteSelecionado,
    setRowSelection,
    setUsarDadosTitular,
    listaAssociado,
    usarDadosTitular,
    isDependenteSelecionado,
    isModalOpen,
    rowSelection,
    handleCheckboxTitularChange,
    handleConfirmarSelecaoDependente,
    deletarObito,
    titular,
    setTitular,
    servico,
    setServico,
    onSave,
    setarCampoAssociado
  }
}

export default useActionsObito;