import { MetaProps } from '../_types/meta';
import { ConvProps } from './../../servicos/_types/convalescente';
import { PlanosProps } from './../../../../types/planos';
import { useCallback, useState } from "react";
import { PlanoContasProps } from "@/app/dashboard/financeiro/_types/ccustos";
import { GruposProps } from "@/types/setores";
import { api } from '@/lib/axios/apiClient';

export function useHandleCarregarDados() {
  const [arrayPlanoContas, setArrayPlanoContas] = useState<Array<PlanoContasProps>>([]);
  const [arrayGrupos, setArrayGrupos] = useState<Array<GruposProps>>([]);
  const [arrayPlanos, setArrayPlanos] = useState<Array<PlanosProps>>([]);
  const [arrayConv, setArrayConv] = useState<Array<ConvProps>>([]);
  const [arrayMetas, setArrayMetas] = useState<Array<MetaProps>>([]);

  const handleCarregarDados = useCallback(async () => {
    const response = await api.get('/gerenciarAdministrativo');
    setArrayPlanoContas(response.data.plano_contas);
    setArrayGrupos(response.data.grupos);
    setArrayPlanos(response.data.planos);
    setArrayConv(response.data.convalescenca);
    setArrayMetas(response.data.metas);
  }, []);


  return {
    arrayPlanoContas,
    arrayGrupos,
    arrayPlanos,
    arrayConv,
    arrayMetas,
    handleCarregarDados,
  };
}