import { useCallback } from 'react';
import { ConvProps } from "../../_types/convalescente";

export function useActionsSubmit(
  data: ConvProps,
  isEditMode: boolean,
  id: string | undefined,
  editarRegistro: (id: string, payload: any) => void,
  enviarNovoRegistro: (payload: any) => void,
) {

  const handleSubmit = useCallback(async (event?: React.FormEvent<HTMLFormElement>) => {
    // Previne o comportamento padrão de recarregar a página do formulário
    if (event) {
      event.preventDefault();
    }

    const fixDate = (date: any) => {
      if (!date) return undefined; // Enviar undefined é melhor que null para o Prisma em alguns casos
      const d = new Date(date);
      return isNaN(d.getTime()) ? undefined : d.toISOString();
    };

    const toIntOrNull = (val: any) => {
      if (val === undefined || val === null || val === '') return null;
      const n = Number(val);
      return isNaN(n) ? null : n;
    };

    const payload = {
      ...data,
      numero_r: toIntOrNull((data as any).numero_r),
      data: data.data ? data.data : undefined,
      data_inc: fixDate(data.data_inc),
      hora_inc: fixDate(data.hora_inc), // Se hora_inc for só hora, cuidado com o fuso horário de toISOString()
    };

    // Remove chaves com valor undefined para não enviar para o Prisma
    Object.keys(payload).forEach(key => {
      if ((payload as any)[key] === undefined) {
        delete (payload as any)[key];
      }
    });

    if (isEditMode && id) {
      await editarRegistro(id, payload);
    } else {
      await enviarNovoRegistro(payload);
    }
  }, [data, isEditMode, id, editarRegistro, enviarNovoRegistro]); // Dependências do useCallback

  // O hook agora retorna a função para ser usada pelo componente
  return { handleSubmit };
}