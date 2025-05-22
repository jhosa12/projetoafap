import { Card, CardContent } from "@/components/ui/card";

import { IoAddOutline } from "react-icons/io5";
import { useState } from "react";
import { api } from "@/lib/axios/apiClient";
import { ModalMedico } from "./modalMedico";
import { MedicoProps } from "@/types/afapSaude";
import { toast } from "sonner";
import { DropDownMedicoActions } from "./DropDownMedicoActions";

interface DataProps {
  medicos: Array<MedicoProps>;
  setArray: (array: Array<MedicoProps>) => void;
}
export default function AdmMedico({ medicos, setArray}: DataProps) {
  const [openModal, setOpenModal] = useState(false);
  const [dataMedico, setDataMedico] = useState<Partial<MedicoProps>>({});

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
      <div className="max-h-[calc(100vh-155px)] justify-center items-center p-2 w-full grid grid-cols-4 gap-6 overflow-y-auto">
        {medicos?.map((item) => (
          <Card
            key={item.id_med}
            className="relative col-span-1 h-full max-w-sm"
          >
            <div className="relative">
              <img
                alt="image med"
                className="rounded-t-lg w-full object-fill h-44"
                src={`${process.env.NEXT_PUBLIC_API_URL}/file/${item.imageUrl}`}
              />
              <DropDownMedicoActions
                item={item}
                setOpenModal={setOpenModal}
                setarDadosMedico={setarDadosMedico}
              />
            </div>
            <CardContent className="flex flex-col p-4">
              <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                {item.nome}
              </h5>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {item.espec}
              </span>
            </CardContent>
          </Card>
        ))}

        {/* Botão de adicionar médico */}
        <Card
          onClick={() => {
            setarDadosMedico({
              espec: undefined,
              exames: [],
              file: undefined,
              id_med: undefined,
              imageUrl: undefined,
              nome: undefined,
              sobre: undefined,
              tmpUrl: undefined,
              funeraria: undefined,
              particular: undefined,
              plano: undefined,
              time: undefined,
            });
            setOpenModal(true);
          }}
          className="flex cursor-pointer justify-center items-center max-w-sm bg-gray-200 hover:bg-gray-300 transition-all"
        >
          <IoAddOutline size={60} className="text-gray-600" />
        </Card>
      </div>

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
    </>
  );
}
