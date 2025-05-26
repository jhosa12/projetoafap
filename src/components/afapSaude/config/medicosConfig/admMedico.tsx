
import { useState } from "react";
import { api } from "@/lib/axios/apiClient";
import { ModalMedico } from "./modalMedico";
import { MedicoProps } from "@/types/afapSaude";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { getMedicosColumns } from "./medicosColumns";
import PrintDocComponent from "@/components/PrintDocComponent";
import { ModalProcedimentos } from "./modalProcedimentos";
import RelatorioListaMedicos from "@/Documents/afapSaude/ListaMedicos";

interface DataProps {
  medicos: Array<MedicoProps>;
  setArray: (array: Array<MedicoProps>) => void;
}
export default function AdmMedico({ medicos, setArray}: DataProps) {
  const [openModal, setOpenModal] = useState(false);
  const [dataMedico, setDataMedico] = useState<Partial<MedicoProps>>({});
     const [openProcedimentos, setModalProcedimentos] = useState(false);

  const setarDadosMedico = (fields: Partial<MedicoProps>) => {
    setDataMedico((prev: Partial<MedicoProps>) => {
      if (prev) {
        return { ...prev, ...fields };
      } else return { ...fields };
    });
  };

  async function deletarMedico(id: number) {
    toast.promise(api.delete(`/agenda/deletarMedico/${id}`), {
      error: "Erro ao salvar dados",
      loading: "Salvando novos dados...",
      success: () => {
        const novoArray = [...medicos];
        const index = novoArray.findIndex((item) => item.id_med === id);
        novoArray.splice(index, 1);
        setArray(novoArray);
        return "Dados salvos com sucesso!";
      },
    });
  }

  return (
    <>
    
      <DataTable
      columns={getMedicosColumns({ onEdit:value=> {setOpenModal(true),setDataMedico(value)}, onDelete: ()=>{},verify:()=>false,onProced:value=>{setModalProcedimentos(true),setDataMedico(value)} })}
      data={medicos}
      maxHeight="h-[calc(100vh-190px)]"
    >
      <PrintDocComponent textButton="Imprimir Lista"
      >
        <RelatorioListaMedicos dados={medicos??[]} />
      </PrintDocComponent>
    </DataTable>
      {openModal && (
        <ModalMedico
          setDataMedico={setDataMedico}
          openModal={openModal}
          setOpenModal={setOpenModal}
          dataMedico={dataMedico}
          medicos={medicos}
          setArray={setArray}
        />
      )}

            {openProcedimentos && <ModalProcedimentos setMedico={setDataMedico} medicos={medicos} setArrray={setArray} usuario={''} medico={dataMedico} openModal={openProcedimentos} setOpenModal={setModalProcedimentos} />}
    </>
  );
}
