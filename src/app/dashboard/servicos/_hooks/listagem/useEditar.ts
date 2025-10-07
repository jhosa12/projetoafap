
import { toast } from "sonner";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ConvProps } from "@/app/dashboard/servicos/_types/convalescente";

export function useEditar(linhaSelecionada: ConvProps | null) {
  const router = useRouter();
  return useCallback(() => {
    if (!linhaSelecionada) {
      toast.error("Por favor, selecione uma linha para Editar.");
      return;
    }
    router.push(`/dashboard/servicos/convalescencia/novoregistro?id=${linhaSelecionada.id_conv_global}`);
  }, [linhaSelecionada, router]);
}
