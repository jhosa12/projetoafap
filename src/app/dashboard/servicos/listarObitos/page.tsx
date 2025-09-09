'use client';

import { useState } from "react";
import { ObitoProps } from "@/app/dashboard/admcontrato/_types/associado";
import { Button } from "@/components/ui/button";
import { HiPlusCircle } from "react-icons/hi2";
import { DataTable } from "@/components/ui/data-table";
import { getObitoColumns } from "@/app/dashboard/servicos/_components/obitos/ordemDeServico/obitosColumns";
import useActionsObito from "../_hooks/useActionsObito";

export default function ListarObitos() {
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
        <Button size={"sm"} variant={"outline"}>
          <HiPlusCircle /> Adicionar
        </Button>
      </DataTable>

      {/* Tabela */}
      {/* <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableHead>Tipo</TableHead>
            <TableHead>Data Fal.</TableHead>
            <TableHead>Contrato</TableHead>
            <TableHead>Nome Decl.</TableHead>
            <TableHead>Nome Falecido</TableHead>
            <TableHead>Situação Cont.</TableHead>
            <TableHead>Falecido</TableHead>
            <TableHead>Data Nasc.</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableHeader>
          <TableBody>
            {listaServicos.map((item) => (
              <TableRow
                key={item.id_obitos}
                className="group hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelecionado(item)}
              >
                <TableCell>{item.tipo_atendimento}</TableCell>
                <TableCell>
                  {new Date(item.end_data_falecimento).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.id_contrato}</TableCell>
                <TableCell>{item.rd_nome}</TableCell>
                <TableCell>{item.nome_falecido}</TableCell>
                <TableCell>{item.id_contrato_st}</TableCell>
                <TableCell>{item.falecido}</TableCell>
                <TableCell>
                  {item.data_nascimento
                    ? new Date(item.data_nascimento).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      item.status === "PENDENTE"
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="/servicos/gerarOS"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <HiPencil size={18} className="hover:text-blue-600" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Edita dados</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenConfirm(true);
                          }}
                        >
                          <HiOutlineTrash size={18} className="hover:text-red-600" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Excluir</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div> */}
    </div>
  );
}
