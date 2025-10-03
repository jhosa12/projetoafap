import { Dispatch, SetStateAction, useCallback } from "react";
import { ConvProps } from "@/app/dashboard/servicos/_types/convalescente";

interface ActionsProps{
  setItemSelecionado: Dispatch<SetStateAction<ConvProps | null>>;
  setModal: Dispatch<SetStateAction<boolean>>;
}

export function useDevolverProduto({ setItemSelecionado, setModal }: ActionsProps) {
  return useCallback((item: ConvProps) => {
    setItemSelecionado(item);
    setModal(true);
  }, [setItemSelecionado, setModal]);
}
