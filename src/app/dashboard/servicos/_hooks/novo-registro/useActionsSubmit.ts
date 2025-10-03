import { useCallback } from 'react';
import { ConvProps } from "../../_types/convalescente";
import { SubmitHandler } from 'react-hook-form';

export function useActionsSubmit(
  isEditMode: boolean,
  id: string | undefined,
  editarRegistro: (id: string, payload: any) => void,
  enviarNovoRegistro: (payload: any) => void,
) {

  const handleSubmit: SubmitHandler<ConvProps> = useCallback(async (data: ConvProps) => {
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
      data: data.data ? new Date(data.data) : null,
      data_inc: fixDate(data.data_inc),
      hora_inc: fixDate(data.hora_inc),

    };
    console.log('Payload antes de enviar (com produtos):', payload);
    console.log('Produtos no payload:', payload.convalescenca_prod);

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
  }, [isEditMode, id, editarRegistro, enviarNovoRegistro]); // Dependências do useCallback

  // O hook agora retorna a função para ser usada pelo componente
  return { handleSubmit };
}