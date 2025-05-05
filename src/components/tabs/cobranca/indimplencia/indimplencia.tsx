import { api } from "@/lib/axios/apiClient"; 
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { IoPrint } from "react-icons/io5";
import { AuthContext } from "@/store/AuthContext";
import { HiFilter } from "react-icons/hi";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import RelatorioInadimplencia from "@/Documents/relatorioCobranca/RelatorioIndimplencia";
import useApiGet from "@/hooks/useApiGet";
import { ResInadimplenciaApiProps } from "@/types/cobranca";

// shadcn/ui imports (um por pacote)
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import { ModalFiltroCobranca } from "../modalCobranca";
import { SubmitHandler } from "react-hook-form";
import ReactPaginate from "react-paginate";

interface ReqProps{
  id_empresa:string
  n_parcelas:number,
  param:string,
  startDate:Date,
  endDate:Date,
  status:Array<string>,
  bairros:Array<string>
}
interface ContagemProps{
  n1:number,
  n2:number,
  n3:number,
  nn:number
}
export interface FormProps{
  startDate:Date,
  endDate:Date,
  periodo:boolean,
  id_empresa:string,
  param_nparcela:string,
  numeroParcelas:number,
  radio:boolean
  status:string,
  cobrador:Array<string>
  bairros:Array<string>
}
export interface UltimosPagProsps { /* … */ }

export function Inadimplencia() {
  const [arrayBairros, setArrayBairros] = useState<Partial<{ bairro: string; check: boolean; id_empresa: string }>[]>(
    []
  );
  const componenteRef = useRef<RelatorioInadimplencia>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filtro, setFiltro] = useState(false);
  const { consultores, selectEmp, permissoes, usuario } = useContext(AuthContext);
  const [isPrint, setIsPrint] = useState(false);
  const [cont, setContagem] = useState<ContagemProps>();
  const { data, loading, postData } = useApiGet<ResInadimplenciaApiProps, ReqProps>("/cobranca/inadimplencia");

  const itemsPerPage = 19;
  const pageCount = Math.ceil((data?.filtered.length ?? 0) / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = data?.filtered.slice(offset, offset + itemsPerPage);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected)

  }
  

  // calculo dos badges
  const contagem = useCallback(() => {
    if (!data) return;
    setContagem({
      n1: data.filtered.filter((i) => i.overdueCount === 1).length,
      n2: data.filtered.filter((i) => i.overdueCount === 2).length,
      n3: data.filtered.filter((i) => i.overdueCount === 3).length,
      nn: data.filtered.filter((i) => i.overdueCount > 3).length,
    });
  }, [data]);

  useEffect(() => { contagem(); }, [data, contagem]);

  // impressão
  const imprimirRelatorio = useReactToPrint({
    onBeforeGetContent: () => setIsPrint(true),
    onAfterPrint: () => setIsPrint(false),
    content: () => componenteRef.current,
    pageStyle: `@page { size: landscape; margin: 1rem }`,
  });
  useEffect(() => { isPrint && imprimirRelatorio(); }, [isPrint]);

  // carregar bairros
  useEffect(() => {
    api.get("/bairros").then((res) => {
      setArrayBairros(res.data);
    });
  }, []);

  // submissão de filtro
  const handleInadimplencia:SubmitHandler<FormProps> = async (dataReq) => {
    postData({
      startDate: dataReq.periodo ? new Date("1900-01-01") : dataReq.startDate,
      endDate: dataReq.periodo ? new Date() : dataReq.endDate,
      id_empresa: selectEmp,
      n_parcelas: Number(dataReq.numeroParcelas),
      status: dataReq.status.split(",").map((s) => s.trim()),
      param: dataReq.param_nparcela,
      bairros: dataReq.bairros,
    });
  };

  return (
    <div className="flex w-full justify-center text-black">
      {/* relatório oculto para print */}
      <div className="hidden">{isPrint && <RelatorioInadimplencia ref={componenteRef} usuario={usuario?.nome} dados={data?.filtered ?? []} />}</div>

      <div className="flex flex-col w-full h-[calc(100vh-100px)]">
        {/* Contadores e botões */}
        <div className="flex justify-between items-end p-2">
          <div className="flex gap-4">
            <Badge variant="outline">1 Mensalidade: {cont?.n1}</Badge>
            <Badge variant="secondary">2 Mensalidades: {cont?.n2}</Badge>
            <Badge variant="warning">3 Mensalidades: {cont?.n3}</Badge>
            <Badge variant="danger">Mais de 3: {cont?.nn}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!permissoes.includes("ADM3.1")}
              onClick={() => setFiltro(true)}
            >
              <HiFilter  /> FILTRO
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!permissoes.includes("ADM3.2")}
              onClick={() => setIsPrint(true)}
            >
              <IoPrint  /> IMPRIMIR
            </Button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-y-auto p-2 max-h-[70vh]">
          <Table>
            <TableHeader >
              <TableRow className="text-xs font-semibold text-black">
              <TableHead className="text-black">TITULAR</TableHead>
              <TableHead className="text-black">ENDEREÇO</TableHead>
              <TableHead className="text-black">BAIRRO</TableHead>
              <TableHead className="text-black">GUIA DE RUA</TableHead>
              <TableHead className="text-black">TELEFONES</TableHead>
              <TableHead className="text-black">COBRANÇA</TableHead>
              <TableHead className="text-black">ULT. PAG</TableHead>
              <TableHead className="text-black">PARCELAS</TableHead>
              <TableHead className="text-black">VALOR</TableHead>
              </TableRow>
            
            </TableHeader>
            <TableBody>
              {currentItems?.map((item, i) => (
                <TableRow className="text-black text-[10px]"key={i}>
                  <TableCell>{item.associado.nome}</TableCell>
                  <TableCell>
                    {item.associado.endereco}
                    {item.associado.numero && ` - Nº${item.associado.numero}`}
                  </TableCell>
                  <TableCell>{item.associado.bairro}</TableCell>
                  <TableCell>{item.associado.guia_rua}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {item.associado.celular1 || item.associado.celular2 || item.associado.telefone}
                  </TableCell>
                  <TableCell>
                    {item.cobranca &&
                      new Date(item.cobranca).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </TableCell>
                  <TableCell>
                    {item.lastPaidPayment &&
                      new Date(item.lastPaidPayment).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </TableCell>
                  <TableCell>{item.overdueCount}</TableCell>
                  <TableCell>
                    {Number(item.totalOverdueAmount).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Resumos */}
        <div className="flex justify-between text-xs px-2">
          <span>CONTRATOS: {data?.filtered.length}</span>
          <span>
            MENSALIDADES:{" "}
            {data?.filtered.reduce((sum, it) => sum + it.overdueCount, 0)}
          </span>
          <span>
            VALOR:{" "}
            {data
              ?.filtered.reduce((sum, it) => sum + it.totalOverdueAmount, 0)
              .toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
          </span>
          <span>TOTAL DE ATIVOS: {data?.active}</span>
        </div>

        {/* Paginação shadcn/ui */}
        {data && <div className="flex w-full  justify-end mt-1 pr-2 ">
<ReactPaginate
previousLabel={(<IoIosArrowDropleftCircle className="mr-2 h-5 w-5" />)}
nextLabel={(<IoIosArrowDroprightCircle className="mr-2 h-5 w-5" />)}
breakLabel={'...'}
breakClassName="breack-me"
pageCount={pageCount}
marginPagesDisplayed={2}
pageRangeDisplayed={5}
onPageChange={handlePageClick}
containerClassName={'pagination inline-flex text-gray-600 gap-4 ml-auto justify-end   rounded-lg  font-sans text-[13px] '}
activeClassName={'active text-blue-600'}

/>
</div>}
      </div>

      {/* Modal de filtro */}
      {filtro && (
        <ModalFiltroCobranca
          inad
          setArrayBairros={setArrayBairros}
          empresa={selectEmp}
          selectCobrador={consultores}
          listarCobranca={handleInadimplencia}
          loading={loading}
          setFiltro={setFiltro}
          show={filtro}
          arrayBairros={arrayBairros}
        />
      )}
    </div>
  );
}
