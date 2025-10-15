import { ColumnDef } from "@tanstack/react-table";
import { GanhadoresProps } from "../../../_types/ganhadores";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useActionsSorteios } from "../../../_hooks/useActionsSorteios";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel } from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";


export const getColunasGanhadores: ColumnDef<GanhadoresProps>[] = [
  {
    accessorKey: "titular",
    header: "Ganhador",
    cell: ({ row }) => (
      <span className="font-semibold text-black uppercase">{row.original.titular}</span>
    ),
  },
  {
    accessorKey: "premio",
    header: "Prêmio",
    cell: ({ row }) => (
      <span className="font-semibold text-black  uppercase">{row.original.premio}</span>
    ),
  },
  {
    accessorKey: "endereco",
    header: "Endereço",
    cell: ({ row }) => (
      <span className="font-semibold text-black uppercase">
        {row.original.endereco} Nº {row.original.numero}
      </span>
    ),
  },
  {
    accessorKey: "bairro",
    header: "Bairro",
    cell: ({ row }) => (
      <span className="font-semibold text-black uppercase">{row.original.bairro}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {

      const [openModal, setOpenModal] = useState(false);
      const [novoStatus, setNovoStatus] = useState(row.original.status);
      const [statusSelecionado, setStatusSelecionado] = useState<string | null>(null);

      const { editarStatusGanhador, listarGanhadores } = useActionsSorteios()

      function handleChangeStatus(value: string) {
        setStatusSelecionado(value)
        setOpenModal(true);


      }

      async function handleConfirmar() {

        if (statusSelecionado && statusSelecionado !== novoStatus) {
          await editarStatusGanhador({

            id_contrato_global: row.original.id_contrato_global,
            status: statusSelecionado,

          })

          setNovoStatus(statusSelecionado)
          listarGanhadores({});

        }
        setOpenModal(false);
        setStatusSelecionado(null);

      }
      return (

        <div>
          <Select value={novoStatus} onValueChange={handleChangeStatus}>
            <SelectTrigger className="w-auto gap-2 min-w-0 flex items-center justify-between">
              {novoStatus === "ENTREGUE" ? (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Entregue
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  Pendente
                </Badge>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="ENTREGUE">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Entregue
                  </Badge>
                </SelectItem>
                <SelectItem value="PENDENTE">
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    Pendente
                  </Badge>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {openModal && (
            <ModalConfirmar
              openModal={openModal}
              setOpenModal={() => setOpenModal(false)}
              handleConfirmar={handleConfirmar}
              pergunta={`Deseja alterar o status para "${novoStatus}"?`}
            />
          )}
        </div>

      )
    }
  },
  {
    accessorKey: "data_sorteio",
    header: "Data do Sorteio",
    cell: ({ row }) => (
      <span className="text-black">
        {row.original.data_sorteio
          ? new Date(row.original.data_sorteio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
          : ""}
      </span>
    ),
  },
];