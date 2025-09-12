"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HiPlusCircle } from "react-icons/hi2";
import { DataTable } from "@/components/ui/data-table";
import { getObitoColumns } from "@/app/dashboard/servicos/_components/obitos/ordemDeServico/obitosColumns";
import useActionsObito from "../_hooks/useActionsObito";
import { ObitoProps } from "../_types/obito";
import { ModalObitoForm } from "../_components/obitos/tabs-modal/modal-obito-form";
import { Newspaper, PlusCircle } from "lucide-react";



export default function ListarObitos() {
  const router = useRouter()
  const [selecionado, setSelecionado] = useState<ObitoProps | null>(null);
  const [openOs, setOpenOs] = useState(false);

  const { listaServicos, listar ,deletarObito } = useActionsObito()

  return (
    <div className="px-6 mt-2 space-y-4">
      <h1 className="text-2xl font-semibold border-b border-b-gray-300 text-gray-900">
        Histórico de O.S's
      </h1>
      <DataTable columns={getObitoColumns({
        onDelete(obito) {
          deletarObito(obito);
        },
        onEdit(obito) {
          setOpenOs(true);
          setSelecionado(obito);
        }
      })} data={listaServicos}>
        <Button onClick={()=>setOpenOs(true)} size={"sm"} variant={"outline"}>
          <PlusCircle /> Adicionar
        </Button>
      </DataTable>

<ModalObitoForm
isFormOpen={openOs}
selectedObito={selecionado}
setIsFormOpen={()=>setOpenOs(false)}
setSelectedObito={setSelecionado}

/>
    </div>
  );
}
