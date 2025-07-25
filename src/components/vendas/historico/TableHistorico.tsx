
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 
import { LeadProps } from "./Historico";
import { MdCreateNewFolder } from "react-icons/md";

interface Props{
    data: Array<LeadProps>;
    onChangeCategoria: (e: React.ChangeEvent<HTMLSelectElement>, lead: Partial<LeadProps>) => void;
    setLead: React.Dispatch<React.SetStateAction<Partial<LeadProps>>>;
    setModal: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

export const TableHistoricoVendas = ({data, onChangeCategoria, setLead, setModal}: Props) => {


    return(
        <Table className="rounded-none border-none shadow-none">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="px-3 py-1 text-xs text-black font-bold">Nome</TableHead>
            <TableHead className="px-3 py-1 text-xs text-black font-bold">Cidade</TableHead>
            <TableHead className="px-3 py-1 text-xs text-black font-bold">Previsão de Visita</TableHead>
            <TableHead className="px-3 py-1 text-xs text-black font-bold">Data Cad.</TableHead>
            <TableHead className="px-3 py-1 text-xs text-black font-bold">Data Venda</TableHead>
            <TableHead className="px-3 py-1 text-xs text-black font-bold">Categoria</TableHead>
            <TableHead className="px-3 py-1 text-xs text-black font-bold">Vendedor</TableHead>
            <TableHead className="px-3 py-1 text-xs text-black font-bold">Celular1</TableHead>
            <TableHead className="px-3 py-1 text-xs text-black font-bold">Vencimento</TableHead>
            {/* <TableHead className="px-3 py-1 text-xs text-black font-bold"></TableHead> */}
          </TableRow>
        </TableHeader>
      
        <TableBody>
          {data?.map((item, index) => (
            <TableRow
              key={index}
              className="cursor-pointer hover:bg-muted"
              onClick={() => {
                setLead(item);
                setModal(prev=>({...prev,lead:true}));
              }}
            >
              <TableCell className="px-2 py-0 text-[10px] text-black">{item?.nome}</TableCell>
              <TableCell className="px-2 py-0 text-[10px] text-black">
                {item?.cidade}/{item?.uf}
              </TableCell>
              <TableCell className="px-2 py-0 text-[10px] text-black">
                {item?.visita &&
                  new Date(item?.visita).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
              </TableCell>
              <TableCell className="px-2 py-0 text-[10px] text-black">
                {item?.data &&
                  new Date(item?.data).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
              </TableCell>
              <TableCell className="px-2 py-0 text-[10px] text-black">
                {item?.dataVenda &&
                  new Date(item?.dataVenda).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
              </TableCell>
              <TableCell
                className={`px-2 py-0 text-[10px] ${
                  item?.status === "LEAD"
                    ? "text-blue-600"
                    : item.status === "PROSPECCAO"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <select
                  onChange={(e) => onChangeCategoria(e, item)}
                  className="appearance-none border-none bg-transparent text-xs focus:outline-none"
                  value={item?.status}
                >
                  <option value="LEAD">LEAD</option>
                  <option value="PROSPECCAO">PROSPECCAO</option>
                  <option value="PRE VENDA">PRE VENDA</option>
                  <option value="VENDA">VENDA</option>
                </select>
              </TableCell>
              <TableCell className="px-2 py-0 text-[10px] text-black">{item?.consultor}</TableCell>
              <TableCell className="px-2 py-0 text-[10px] text-black">{item?.celular1}</TableCell>
              <TableCell className="px-2 py-0 text-[10px] text-black">
                {item?.vencimento
                  ? new Date(item?.vencimento).toLocaleDateString()
                  : ""}
              </TableCell>
              {/* <TableCell className="px-2 py-0 text-[10px] text-black">
                {item.status === "VENDA" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLead(item);
                      setModal(prev=>({...prev,confirmaPlano:true}));
                    }}
                  >
                    <MdCreateNewFolder size={20} />
                  </button>
                )}
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
}