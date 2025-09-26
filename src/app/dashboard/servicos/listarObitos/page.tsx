"use client"

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { getObitoColumns } from "@/app/dashboard/servicos/_components/obitos/ordemDeServico/obitosColumns";
import useActionsObito from "../_hooks/useActionsObito";
import { ObitoProps } from "../_types/obito";
import { ModalObitoForm } from "../_components/obitos/tabs-modal/modal-obito-form";
import { Pencil, PlusCircle } from "lucide-react";
import { AuthContext } from "@/store/AuthContext";



export default function ListarObitos() {


  const [openOs, setOpenOs] = useState(false);
  const { selectEmp } = useContext(AuthContext)
  const { listaServicos, deletarObito, onSave, servico, setServico } = useActionsObito()




  return (
    <div className="px-6 mt-2 space-y-4">
      <h1 className="text-2xl font-semibold border-b border-b-gray-300 text-gray-900">
        Histórico de O.S's
      </h1>
      <DataTable
        columns={getObitoColumns({
        onDelete(obito) {
          deletarObito(obito);
        },
          onEdit(obito) {
            console.log("DADOS DO ÓBITO AO CLICAR EM EDITAR:", obito); 
          setOpenOs(true);
          setServico(obito);
        }
        })}
        data={listaServicos}>
        <Button onClick={() => {

          setServico(null)
          setOpenOs(true)
        
        }} size={"sm"} variant={"outline"}>
          <PlusCircle /> Adicionar
        </Button>
      </DataTable>

      <ModalObitoForm
        isFormOpen={openOs}
        selectedObito={servico}
        setIsFormOpen={() => setOpenOs(false)}
        setSelectedObito={setServico}
        selectEmp={selectEmp}
        onSave={onSave}
      />
    </div>
  );
}
