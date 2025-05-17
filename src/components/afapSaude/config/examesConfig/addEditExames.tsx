import { Button } from "@/components/ui/button";

import { ModalEditExames } from "./modalAddEditExames";
import { useCallback, useContext, useRef, useState } from "react";
import { api } from "@/lib/axios/apiClient";
import { IoIosPrint } from "react-icons/io";
import { useReactToPrint } from "react-to-print";
import RelatorioLucroExames from "@/Documents/afapSaude/relatorioLucroExames";
import pageStyle from "@/utils/pageStyle";
import { ModalConfirmar } from "../../../modals/modalConfirmar";
import { ExamesProps } from "@/types/afapSaude";
import { toast } from "sonner";
import { DataTable } from "../../../ui/data-table";
import {  getExamesColumns } from "./examesColumns";

interface DataProps {
  exames: Array<ExamesProps>;
  setExames: (array: Array<ExamesProps>) => void;
}

export function AddEditExames({ exames, setExames }: DataProps) {
  const resetValues: ExamesProps = {
    data: new Date(),
    id_exame: 0,
    nome: "",
    porcFun: 0,
    porcPart: 0,
    porcPlan: 0,
    usuario: "",
    valorBruto: 0,
    valorFinal: 0,
    obs: "",
    valorRepasse: 0,
  };

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [data, setData] = useState<ExamesProps>(resetValues);
  const currentPage = useRef<HTMLDivElement|null>(null);
  const [openDeletar, setOpenDeletar] = useState<boolean>(false);

  const imprimirRelatorio = useCallback(
    useReactToPrint({
      pageStyle: pageStyle,
      content: () => currentPage.current,
    }),
    []
  );

  const handleDeletarExame = async () => {
    toast.promise(
      api.delete(`/afapSaude/exames/deletarExame/${data.id_exame}`),
      {
        error: "Erro ao deletar exame",
        loading: "Deletando exame.....",
        success: () => {
          const novoArray = [...exames];
          const index = novoArray.findIndex(
            (item) => item.id_exame === data.id_exame
          );
          novoArray.splice(index, 1);
          setExames(novoArray);
          setOpenDeletar(false);
          return "Exame deletado com sucesso!";
        },
      }
    );
  };

  return (
    <div className="space-y-2">
    
        <DataTable
          maxHeight="h-[calc(100vh-200px)]"
          columns={getExamesColumns({
            onEdit: (exame: ExamesProps) => {
              setData({ ...exame, data: new Date() });
              setOpenModal(true);
            },
            onDelete: (exame: ExamesProps) => {
              setData({ ...exame });
              setOpenDeletar(true);
            },
          })}
          data={exames}
        >
          <div className="flex  gap-2 px-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setData({ ...resetValues, data: new Date() });
                setOpenModal(true);
              }}
            >
              Adicionar
            </Button>
            <Button variant="outline" size="sm" onClick={imprimirRelatorio}>
              <IoIosPrint className="h-4 w-4 mr-2" />
              Relatório
            </Button>
          </div>
        </DataTable>
        
  

      {openModal && (
        <ModalEditExames
          exames={exames}
          exame={data}
          setExames={setExames}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
      {openDeletar && (
        <ModalConfirmar
          pergunta="Tem certeza que deseja deletar esse exame?"
          handleConfirmar={handleDeletarExame}
          setOpenModal={()=>setOpenDeletar(false)}
          openModal={openDeletar}
        />
      )}

      <div style={{ display: "none" }}>
        <RelatorioLucroExames ref={currentPage} dados={exames} />
      </div>
    </div>
  );
}
