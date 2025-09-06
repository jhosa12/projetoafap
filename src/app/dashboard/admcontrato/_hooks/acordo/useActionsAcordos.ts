import { AcordoProps } from "../../_types/acordos";
import { useReactToPrint } from "react-to-print";
import React, { useRef } from "react";
import { pageStyle } from '@/utils/pageStyle';
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";
import { MensalidadeProps } from "../../_types/mensalidades";
import { ConsultoresProps } from "@/types/consultores";
import { ajustarData } from "@/utils/ajusteData";

interface ActionsProps {

  verificarQuebra: (acordo: AcordoProps) => string;
  printComprovante: () => void
  criarAcordo: (data: AcordoProps) => Promise<void>
  comprovanteAcordo: React.RefObject<HTMLDivElement>
  editarAcordo: (data: AcordoProps) => Promise<void>
}

interface UseActionsProps {

  id_contrato_global: number | null;
  id_global: number | null;
  id_empresa: string;
  id_contrato: number | undefined;
  id_associado: number | undefined;
  carregarDados: (id: number) => Promise<void>;
  close: Function;
  consultores: Array<Partial<ConsultoresProps>>;
  mensalidades: Array<Partial<MensalidadeProps>>;

}
const useActionsAcordos = (
  {

    id_empresa,
    carregarDados,
    id_contrato_global,
    id_global,
    id_associado,
    id_contrato,
    close,
    consultores,
    mensalidades


  }: UseActionsProps): ActionsProps => {

  const comprovanteAcordo = useRef<HTMLDivElement>(null)


  const verificarQuebra = (acordo: AcordoProps) => {
    const verifyDates = acordo.mensalidadeAcordo.every(item => item.mensalidade.data_pgto && (item?.mensalidade?.data_pgto <= acordo.data_fim))
    const pagas = acordo.mensalidadeAcordo.every(item => item.mensalidade.data_pgto)
    if (pagas) {
      if (verifyDates) { return 'CUMPRIDO' }
      return 'QUEBRA'
    } else if (new Date(acordo.data_fim) < new Date()) {
      return 'QUEBRA'
    } else {
      return 'PENDENTE'
    }
  }

  const printComprovante = useReactToPrint({

    content() {
      return comprovanteAcordo.current
    },
    pageStyle: pageStyle,

  })


  const criarAcordo = async (data: AcordoProps) => {
    if (!data.data_fim || !data.descricao || !data.id_consultor) {
      toast.info("Preencha todos os campos!");
      return;
    }

    const { dataIni, dataFim } = ajustarData(new Date(), data.data_fim)

    const dt_criacao = new Date();
    const dt_prev = new Date();
    dt_criacao.setTime(
      dt_criacao.getTime() - dt_criacao.getTimezoneOffset() * 60 * 1000
    );
    dt_prev.setTime(
      dt_prev.getTime() - dt_prev.getTimezoneOffset() * 60 * 1000
    );

    toast.promise(
      api.post("/novoAcordo", {
        id_empresa,
        id_contrato_global,
        id_global,
        id_consultor: Number(data.id_consultor),
        status: "A",
        data_inicio: dt_criacao.toISOString(),
        data_fim: dataFim,
        total_acordo: Number(data.total_acordo),
        realizado_por: data.realizado_por,
        descricao: data.descricao,
        metodo: data.metodo,
        dt_criacao: new Date(),
        mensalidades: data.mensalidadeAcordo.map(item => item.mensalidade),
        id_contrato: id_contrato,
        id_associado: id_associado,
      }),
      {
        error: "Erro na requisição",
        success: () => {
          id_global && carregarDados(id_global);
          close();
          return "Acordo criado com sucesso";
        },
        loading: "Criando acordo",
      }
    );
    //  toast.success("Acordo criado com sucesso")
  }

  async function editarAcordo(data: AcordoProps) {
    toast.promise(
      api.put("/editarAcordo", {
        id_acordo: data.id_acordo,
        //status:'A',
        //dt_pgto:new Date(),
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        descricao: data.descricao.toUpperCase(),
        metodo: data.metodo,
        total_acordo: data.total_acordo,
        realizado_por: data.realizado_por,
        id_consultor: Number(data.id_consultor),
        //mensalidade:novasMensalidades
        //mensalidades:data.mensalidade
      }),
      {
        error: "Erro ao efetuar atualização",
        loading: "Efetuando atualização",
        success: "Atualização Efetuada com sucesso!",
      }
    );
  }

  return {

    verificarQuebra,
    printComprovante,
    criarAcordo,
    comprovanteAcordo,
    editarAcordo

  }
}

export default useActionsAcordos;