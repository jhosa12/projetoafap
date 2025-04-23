import { Button } from "@/components/ui/button";

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
    <div className="flex justify-between  gap-2 mb-2 flex-wrap">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-blue-500"
          onClick={onAdd}
        >
          <HiDocumentAdd  />
          <span className=" sm:inline">Adicionar</span>
        </Button>

      
      </div>
    </div>
  );
}