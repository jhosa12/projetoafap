import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HiMiniArrowDownOnSquare,
  HiPrinter,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { BiMoneyWithdraw } from "react-icons/bi";
import { HiAdjustments, HiDocumentAdd } from "react-icons/hi";

interface ExamesToolbarProps {
  onAdd: () => void;
  onEdit: () => void;
  onPrintBudget: () => void;
  onPrintReceipt: () => void;
  onReceive: () => void;
  onRevert: () => void;
  onWhatsApp: () => void;
  onDelete: () => void;
}

export function ExamesToolbar({
  onAdd,
  onEdit,
  onPrintBudget,
  onPrintReceipt,
  onReceive,
  onRevert,
  onWhatsApp,
  onDelete,
}: ExamesToolbarProps) {
  return (
    <div className="flex justify-between  gap-2 mb-4 flex-wrap">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500"
          onClick={onAdd}
        >
          <HiDocumentAdd  />
          <span className="hidden sm:inline">Adicionar</span>
        </Button>

        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <Button className="text-black" variant="outline" size="sm">
              Ações
            </Button>
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
      </div>
    </div>
  );
}