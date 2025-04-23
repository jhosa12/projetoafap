import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import { ExameRealizadoProps } from "@/types/afapSaude";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HiAdjustments } from "react-icons/hi";
import { HiMiniArrowDownOnSquare, HiPrinter } from "react-icons/hi2";
import { BiMoneyWithdraw } from "react-icons/bi";
import { GiReturnArrow } from "react-icons/gi";
import { FaWhatsapp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { SlOptions } from "react-icons/sl";

  interface ExamesTableProps {
    exames: ExameRealizadoProps[];
    selectedExame: ExameRealizadoProps | null;
    onSelectExame: (exame: ExameRealizadoProps) => void;
    onAdd: () => void;
    onEdit: () => void;
    onPrintBudget: () => void;
    onPrintReceipt: () => void;
    onReceive: () => void;
    onRevert: () => void;
    onWhatsApp: () => void;
    onDelete: () => void;
  }
  
  export function ExamesTable({
    exames,
    selectedExame,
    onSelectExame,
    onAdd,
    onEdit,
    onPrintBudget,
    onPrintReceipt,
    onReceive,
    onDelete,
    onRevert,
    onWhatsApp,
  }: ExamesTableProps) {
    return (
      <div className="border-b-[1px]">
        <Table>
          <TableHeader className="text-black">
            <TableRow className="uppercase text-xs text-black">
              <TableHead>Nome</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead>Data Orçamento</TableHead>
              <TableHead>Data Pag.</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exames.map((item) => (
              <TableRow
                key={item.id_exame}
                className={`cursor-pointer text-black text-xs hover:bg-muted/50`}
                onClick={() => onSelectExame(item)}
              >
                <TableCell className="font-medium text-black">{item.nome}</TableCell>
                <TableCell>{item.celular}</TableCell>
                <TableCell>
                  {item.data_orcamento &&
                    new Date(item.data_orcamento).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                </TableCell>
                <TableCell>
                  {item.data_realizado &&
                    new Date(item.data_realizado).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                </TableCell>
                <TableCell>{item.tipoDesc}</TableCell>
                <TableCell>
                  {Number(
                    item.exames.reduce((total, exame) => total + exame.valorFinal, 0)
                  ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === "ORÇAMENTO" ? "warning" : "success"}
                    className="whitespace-nowrap"
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu modal={false} onOpenChange={(open) => open && onSelectExame(item)} >
          <DropdownMenuTrigger asChild>
          
                                  <button>
                                    <SlOptions size={16} />
                                  </button>
          
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onEdit}>
              <HiAdjustments className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPrintBudget}>
              <HiPrinter className="mr-2 h-4 w-4" />
              Orçamento
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onPrintReceipt}>
              <BiMoneyWithdraw className="mr-2 h-4 w-4" />
              Recibo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReceive} className="text-green-600">
              <HiMiniArrowDownOnSquare className="mr-2 h-4 w-4" />
              Receber
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRevert} className="text-yellow-600">
              <GiReturnArrow className="mr-2 h-4 w-4" />
              Estornar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onWhatsApp} className="text-green-500">
              <FaWhatsapp className="mr-2 h-4 w-4" />
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500">
              <MdDelete className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  