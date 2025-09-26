import { Delete, Edit } from "lucide-react";
import { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LancamentosProps, ResponseCaixaProps } from "../_types/types";

interface Props {
  data: Partial<ResponseCaixaProps> | undefined;
  permissoes: string[];
  setModal: (modal: { [key: string]: boolean }) => void;
  setMov: (mov: Partial<LancamentosProps>) => void;
}

const TableCaixaComponent = memo(({ data, permissoes, setModal, setMov }: Props) => {
    return (
    <div className="flex flex-col bg-white overflow-y-auto mt-2 px-2 h-[calc(100vh-130px)]">
      <Table>
        <TableHeader className="sticky top-0 bg-white z-5 border-b-[1px] border-gray-300">
          <TableRow className="h-8">
            <TableHead className="h-8 px-2 text-[11px] font-medium bg-gray-50 border border-gray-300">
              Nº
            </TableHead>
                <TableHead className="h-8 px-2 text-[11px] font-medium bg-gray-50 border border-gray-300">
                  DATA
                </TableHead>
                <TableHead className="h-8 px-2 text-[11px] font-medium bg-gray-50 border border-gray-300">
                  CONTA
                </TableHead>
                <TableHead className="h-8 px-2 text-[11px] font-medium bg-gray-50 border border-gray-300">
                  C.CUSTOS
                </TableHead>
                <TableHead className="h-8 px-2 text-[11px] font-medium bg-gray-50 border border-gray-300">
                  DOCUMENTO
                </TableHead>
                <TableHead className="h-8 px-2 text-[11px] font-medium bg-gray-50 border border-gray-300">
                  HISTÓRICO
                </TableHead>
                <TableHead className="h-8 px-2 text-[11px] font-medium bg-gray-50 border border-gray-300">
                  TIPO
                </TableHead>
                <TableHead className="h-8 px-2 text-[11px] font-medium bg-gray-50 border border-gray-300">
                  VALOR
                </TableHead>
                <TableHead className="h-8 px-2 text-[11px] font-medium bg-gray-50 border border-gray-300">
                  AÇÕES
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data?.lista?.map((item) => (
                <TableRow key={item.lanc_id} className="h-8 hover:bg-gray-50 text-black">
                  <TableCell className="p-0 px-2 text-[10px] font-medium border border-gray-300">
                    {item.num_seq}
                  </TableCell>
                  <TableCell 
                    className="p-0 px-2 text-[10px] font-medium border border-gray-300"
                    data-tooltip-id="tooltip-hora"
                    data-tooltip-place="bottom"
                    data-tooltip-content={new Date(item.datalanc).toLocaleTimeString()}
                  >
                    {new Date(item.data).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell className="p-0 px-2 text-[10px] font-medium border border-gray-300">
                    {item.conta}
                  </TableCell>
                  <TableCell className="p-0 px-2 text-[10px] font-medium whitespace-nowrap border border-gray-300">
                    {item.ccustos_desc}
                  </TableCell>
                  <TableCell className="p-0 px-2 text-[10px] font-medium border border-gray-300">
                    {item.notafiscal
                      ? item.notafiscal.toUpperCase()
                      : item?.descricao?.toUpperCase()}
                  </TableCell>
                  <TableCell className="p-0 px-2 text-[10px] font-medium border border-gray-300">
                    {item.historico}
                  </TableCell>
                  <TableCell 
                    className={`p-0 px-2 text-[10px] font-semibold border border-gray-300 ${
                      item.tipo === "RECEITA" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {item.tipo}
                  </TableCell>
                  <TableCell className="p-0 px-2 text-[10px] font-semibold border border-gray-300">
                    {Number(item.valor).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="p-0 px-2 text-[10px] font-medium space-x-4 whitespace-nowrap border border-gray-300">
                    <button
                      disabled={
                        item.conta === "1.01.002" ||
                        !permissoes.includes("ADM2.1.3")
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        setMov({ ...item });
                        setModal({ lancar: true });
                      }}
                      className="font-medium text-gray-500 hover:text-cyan-600 disabled:cursor-not-allowed"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                    disabled={
                      item.conta === "1.01.002" ||
                      !permissoes.includes("ADM2.1.4")
                    }
                    onClick={() => {
                      setMov({ lanc_id: item.lanc_id });
                      setModal({ excluir: true });
                    }}
                    className="font-medium text-gray-500 hover:text-red-600 disabled:cursor-not-allowed"
                  >
                    <Delete size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  );
});

export const TableCaixa = TableCaixaComponent;