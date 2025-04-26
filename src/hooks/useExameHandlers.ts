// hooks/useExamesHandlers.ts
import { useCallback, useState } from 'react';
import { api } from '@/lib/axios/apiClient';
import { toast } from 'sonner';
import useApiPut from '@/hooks/useApiPut';
import { ExameRealizadoProps } from '@/types/afapSaude';
import { FiltroForm } from '@/components/afapSaude/exames/filtro';
import { removerFusoDate } from '@/utils/removerFusoDate';

interface UseExamesHandlersParams {
  exameSelected: ExameRealizadoProps;
  examesRealizados: ExameRealizadoProps[];
  setExames: React.Dispatch<React.SetStateAction<ExameRealizadoProps[]>>;
  listarExamesRealizados: Function;
  setModal: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  setExameSelected: React.Dispatch<React.SetStateAction<ExameRealizadoProps>>;
  valorInicial: ExameRealizadoProps;
}

export function useExamesHandlers({
  exameSelected,
  examesRealizados,
  setExames,
  listarExamesRealizados,
  setModal,
  setExameSelected,
  valorInicial,
}: UseExamesHandlersParams) {
  const [formPag, setFormPag] = useState<string>("");

  const { postData: handleEstorno } = useApiPut<any, { id_exame: number }>(
    "/afapSaude/estornarExame",
    () => listarExamesRealizados(),
    () => setModal({ estornar: false })
  );

  const handleReceberExame = useCallback(async () => {
    if (!formPag) {
      toast.warning("Selecione a forma de pagamento");
      return;
    }
    if (!exameSelected.id_exame) {
      toast.warning("Selecione um exame para receber consulta");
      return;
    }
    if (exameSelected.status === "RECEBIDO") {
      toast.warning("Exame já recebido");
      return;
    }
    const {newDate:dataAtual} = removerFusoDate(new Date());
   

    toast.promise(
      api.put("/afapSaude/receberExame", {
        id_exame: exameSelected.id_exame,
        datalanc: dataAtual,
        descricao: "EXAME",
        historico: `EXAME.${exameSelected.id_exame}-${exameSelected.nome}-${exameSelected.tipoDesc}`,
        valor: exameSelected.exames.reduce((acc, item) => acc + item.valorFinal, 0),
        forma_pagamento: formPag,
      }),
      {
        loading: "Recebendo exame...",
        success: () => {
          listarExamesRealizados();
          setModal({ receber: false });
          return "Exame recebido com sucesso!";
        },
        error: "Erro ao receber exame",
      }
    );
  }, [exameSelected, formPag]);

  const handleDeletar = useCallback(async () => {
    if (!exameSelected.id_exame) {
      toast.warning("Selecione um exame para deletar");
      return;
    }
    toast.promise(
      api.delete(`/afapSaude/deletarExame/${exameSelected.id_exame}`),
      {
        loading: "Deletando exame...",
        success: () => {
          setExames(
            examesRealizados.filter(item => item.id_exame !== exameSelected.id_exame)
          );
          setModal({ deletar: false });
          return "Exame deletado com sucesso!";
        },
        error: "Erro ao deletar exame",
      }
    );
  }, [exameSelected, examesRealizados]);

  const handleNovoExame = useCallback(
    async (data: ExameRealizadoProps) => {
      if (data.exames.length === 0) {
        toast.error("Adicione ao menos um exame!");
        return;
      }
      const {newDate:dataAtual} = removerFusoDate(new Date());
      const {newDate:dataPrev} = removerFusoDate(data.data_prev);
    

      toast.promise(
        api.post("/afapSaude/examesRealizados/novoExame", {
          ...data,
         // user: data.usuario,
          data_orcamento: dataAtual,
          data_realizado: undefined,
          data_prev: dataPrev,
        }),
        {
          loading: "Gerando novo exame...",
          success: response => {
            setExames([...examesRealizados, response.data]);
            setExameSelected(valorInicial);
            setModal({ administrar: false });
            return "Exame gerado com sucesso!";
          },
          error: "Erro ao gerar novo exame",
        }
      );
    },
    [examesRealizados]
  );

  const handleEditarExame = useCallback(
    async (data: ExameRealizadoProps) => {
      if (!data.id_exame) {
        toast.error("Selecione um exame para editar");
        return;
      }
      const {newDate:dataPrev} = removerFusoDate(data.data_prev ? new Date(data.data_prev):undefined);
      toast.promise(
        api.put("/afapSaude/examesRealizados/editar",{ ...data,data_prev: dataPrev }),
        {
          loading: "Editando exame...",
          success: response => {
            setExames([
              ...examesRealizados.filter(item => item.id_exame !== data.id_exame),
              response.data,
            ]);
            setExameSelected(valorInicial);
            setModal({ administrar: false });
            return "Exame editado com sucesso!";
          },
          error: "Erro ao editar exame",
        }
      );
    },
    [examesRealizados]
  );

 

  const onRevert = useCallback(async () => {
    if (!exameSelected.id_exame || exameSelected.status !== "RECEBIDO") return;
    await handleEstorno({ id_exame: exameSelected.id_exame });
  }, [exameSelected]);

  return {
    formPag,
    setFormPag,
    handleReceberExame,
    handleDeletar,
    handleNovoExame,
    handleEditarExame,
    onRevert,
  };
}
