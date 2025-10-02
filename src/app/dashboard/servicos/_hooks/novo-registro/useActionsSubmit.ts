import { ConvProps } from "../../_types/convalescente";

export function useActionsSubmit(
  data: ConvProps,
  isEditMode: boolean,
  id: string | undefined,
  editarRegistro: (id: string, payload: any) => void,
  enviarNovoRegistro: (payload: any) => void,
  produtosAdicionados: any
  
) {

  const fixDate = (date: any) => {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString();
  };

  const toIntOrNull = (val: any) => {
    if (val === undefined || val === null || val === '') return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  };

  const payload = {
    ...data,
    numero_r: toIntOrNull((data as any).numero_r),
    data_inc: fixDate(data.data_inc),
    hora_inc: fixDate(data.hora_inc),
    produtosAdicionados
  };

  if (isEditMode && id) {
    editarRegistro(id, payload);
  } else {
    enviarNovoRegistro(payload);

  }
}