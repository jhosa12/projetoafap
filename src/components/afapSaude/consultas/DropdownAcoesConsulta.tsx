// components/DropdownAcoesConsulta.tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { SlOptions } from "react-icons/sl";
import { MdEdit, MdDelete } from "react-icons/md";
import { HiPrinter, HiMiniArrowDownOnSquare } from "react-icons/hi2";
import { BiMoneyWithdraw } from "react-icons/bi";
import { GiReturnArrow } from "react-icons/gi";
import { FaWhatsapp } from "react-icons/fa";
import { ConsultaProps } from "@/types/afapSaude";


interface DropdownAcoesConsultaProps {
  item: ConsultaProps;
  setData: (data: ConsultaProps) => void;
  setModal: (modal: { [key: string]: boolean }) => void;
  handleWhatsAppClick: (telefone: string) => void;
  verifyPermissions: (permission: string) => boolean
}

export const DropdownAcoesConsulta: React.FC<DropdownAcoesConsultaProps> = ({
  item,
  setData,
  setModal,
  verifyPermissions,
  handleWhatsAppClick,
}) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button>
          <SlOptions size={17} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 shadow-none">
        <DropdownMenuGroup>
          <DropdownMenuItem
           
            onClick={() => {
              setData(item);
              setModal({ editar: true });
            }}
          >
            <MdEdit />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={verifyPermissions("AFS3.4")}
            onClick={() => {
              setData(item);
              setModal({ printProntuario: true });
            }}
          >
            <HiPrinter className=" h-3 w-3" />
            Prontuário
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setData(item);
              setModal({ printRecibo: true });
            }}
          >
            <BiMoneyWithdraw className=" h-3 w-3" />
            Recibo
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={verifyPermissions("AFS3.5")}
            onClick={() => {
              setData(item);
              setModal({ receber: true });
            }}
          >
            <HiMiniArrowDownOnSquare className="h-3 w-3" />
            Receber
          </DropdownMenuItem>
          <DropdownMenuItem
          disabled={verifyPermissions("AFS3.6")}
            onClick={() => {
              setData(item);
              setModal({ estornar: true });
            }}
          >
            <GiReturnArrow className="h-3 w-3" />
            Estornar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleWhatsAppClick(item?.celular)}
          >
            <FaWhatsapp className=" h-3 w-3" />
            Contato
          </DropdownMenuItem>
          <DropdownMenuItem
          disabled={verifyPermissions("AFS3.3")}
            onClick={() => {
              setData(item);
              setModal({ deletar: true });
            }}
          >
            <MdDelete />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
