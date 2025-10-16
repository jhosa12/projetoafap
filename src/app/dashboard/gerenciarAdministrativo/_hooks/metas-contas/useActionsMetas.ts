import { api } from "@/lib/axios/apiClient";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { SubmitHandler } from "react-hook-form";
import { MetaProps } from "../../_types/meta";
import { AuthContext } from "@/store/AuthContext";

export interface FormFiltro {
  startDate?: string | undefined,
  endDate?: string | undefined,
  id_empresa: string | undefined,

}

export const useActionsMetas = (id_empresa: string | undefined, isEditMode?: boolean, filtros?: FormFiltro) => {
  const [arrayMetas, setArrayMetas] = useState<MetaProps[]>([]);
  const { usuario, signOut } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!usuario) return signOut();
    listarMetas();
  }, [usuario]);


  async function listarMetas() {
    if (!id_empresa) {
      toast.error("Selecione uma empresa.");
      return;
    }

    try {
      const payload = {
        id_empresa,
        ...filtros
      };

      await toast.promise(
        api.post<MetaProps[]>("/vendas/filtroMetas", payload)
          .then(({ data }) => {
            setArrayMetas(data);
          }),
        {
          loading: "Carregando metas...",
          error: "Erro ao carregar metas."
        }
      );
    } catch (error) {
      toast.error("Erro ao carregar metas.");
    }
  };

  const adicionarMeta = async (data: MetaProps) => {
    if (!id_empresa) return;

    const payload = {
      id_grupo: 1,
      id_empresa,
      id_conta: data.id_conta || null,
      date: data.date,
      dateFimMeta: data.dateFimMeta,
      valor: data.valor,
      descricao: data.descricao,
    }

    try {
      const response = await api.post('/vendas/novaMeta', payload)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw error.response.data;
      }
      throw error;
    }
  };


  async function editarMeta(dadosForm: any) {

    if (!dadosForm.descricao) {
      toast.error("Preencha todos os campos obrigatórios.")
      return
    }


    const payload = {

      id_meta: dadosForm.id_meta,
      id_empresa: dadosForm.id_empresa,
      descricao: dadosForm.descricao,
      id_conta: dadosForm.id_conta,
      date: dadosForm.date,
      dateFimMeta: dadosForm.dateFimMeta,
      valor: dadosForm.valor,
      data_lanc: dadosForm.data_lanc

    }

    console.log("Dados para editar", payload)

    try {
      const response = await api.put('/vendas/editarMeta', payload)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async function deletarMeta(meta: MetaProps) {

    try {

      const response = await api.delete('/vendas/deletarMeta', {
        data: {
          id_meta: meta.id_meta
        }
      })

      listarMetas()

    } catch (error) {

      throw error
    }
  }

  const onSave: SubmitHandler<MetaProps> = async (data: MetaProps) => {

    try {
      if (data.id_meta) {
        await editarMeta(data)
        toast.success("Meta editada com sucesso!")
        await listarMetas()
        return true

      } else {

        await adicionarMeta(data)
        toast.success("Meta adicionada com sucesso!")
        await listarMetas()
        return true;

      }

    } catch (error) {
      throw error;
    }
  };

  return {

    listarMetas,
    adicionarMeta,
    editarMeta,
    deletarMeta,
    onSave,
    arrayMetas,
    loading

  }
}