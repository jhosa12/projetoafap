

import { ConsultorLeads, VendasProps } from "./acompanhamento";
import { useEffect, useRef, useState } from "react";
import { MdCall, MdPrint } from "react-icons/md";
import { BiSolidUserPlus } from "react-icons/bi";
import { IoArchive } from "react-icons/io5";
import ResumoVendedor from "@/Documents/vendas/ResumoVendedor";
import { useReactToPrint } from "react-to-print";

import useApiGet from "@/hooks/useApiGet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { pageStyle } from "@/utils/pageStyle";
import { Spinner } from "../../../../components/ui/spinner";


interface DataProps {
  show: boolean,
  setModalVend: (open: boolean) => void
  vendedor: VendasProps,
  startDate: Date,
  endDate: Date,
  leads: Array<ConsultorLeads>
  usuario: string,
  logoUrl: string
}


export interface AdesaoProps {
  id_contrato: number,
  dt_adesao: Date,
  situacao: string,
  associado: { nome: string },
  valor_mensalidade: number
}



interface ResumoVendedorProps {
  adesoes: Array<AdesaoProps>,
  leads: Array<{
    id_lead: number,
    data: Date,
    status: string,
    nome: string
  }>

}


export function ModalVendedor({ endDate, setModalVend, show, startDate, vendedor, usuario, logoUrl }: DataProps) {


  const { data, postData, loading } = useApiGet<ResumoVendedorProps, { startDate: Date, endDate: Date, id_consultor: number | null, consultor: string }>("/vendas/resumoVendedor")
  const componenteRef = useRef<HTMLDivElement>(null);
  const [print, setPrint] = useState(false)






  useEffect(() => {

    postData({ startDate, endDate, id_consultor: vendedor.id_consultor, consultor: vendedor.consultor })

  }, [vendedor.id_consultor])


  useEffect(() => {
    print && handlePrint()

  }, [print])


  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    pageStyle: pageStyle,
    onBeforePrint: async() => setPrint(false),
  })


  return (



    <Dialog open={show} onOpenChange={setModalVend}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col">
              <span>{vendedor?.consultor}</span>
              <span className="text-xs">
                Periodo: {new Date(startDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })} -{" "}
                {new Date(endDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cards de Status */}
            <ul className="inline-flex w-full justify-between text-xs">
              <li className="inline-flex gap-2 items-center bg-blue-600 p-2 text-white rounded-lg">
                <div className="border p-1 rounded-lg">
                  <MdCall size={20} />
                </div>
                <div className="flex flex-col">
                  <span>LEADS</span>
                  {data?.leads.filter((lead) => lead.status === "LEAD").length}
                </div>
              </li>
              <li className="inline-flex gap-2 items-center bg-blue-600 p-2 text-white rounded-lg">
                <div className="border p-1 rounded-lg">
                  <BiSolidUserPlus size={21} />
                </div>
                <div className="flex flex-col">
                  <span>PROSPECÇÕES</span>
                  {data?.leads.filter((lead) => lead.status === "PROSPECCAO").length}
                </div>
              </li>
              <li className="inline-flex gap-2 items-center bg-blue-600 p-2 text-white rounded-lg">
                <div className="border p-1 rounded-lg">
                  <IoArchive size={21} />
                </div>
                <div className="flex flex-col">
                  <span>PRÉ VENDAS</span>
                  {data?.leads.filter((lead) => lead.status === "PREV VENDA").length}
                </div>
              </li>
            </ul>

            {/* Tabela de Adesões */}
            <div className="max-h-[calc(100vh-400px)] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[9px]">CONTRATO</TableHead>
                    <TableHead className="text-[9px]">DATA</TableHead>
                    <TableHead className="text-[9px]">NOME</TableHead>
                    <TableHead className="text-[9px]">STATUS</TableHead>
                    <TableHead className="text-[9px]">VALOR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.adesoes?.map((item) => (
                    <TableRow key={item.id_contrato}>
                      <TableCell className="text-[10px]">{item.id_contrato}</TableCell>
                      <TableCell className="text-[10px]">
                        {new Date(item.dt_adesao).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                      </TableCell>
                      <TableCell className="text-[10px]">{item.associado.nome}</TableCell>
                      <TableCell className="text-[10px]">{item.situacao}</TableCell>
                      <TableCell className="text-[10px]">
                        {Number(item.valor_mensalidade).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell className="font-semibold text-[10px]">
                      TOTAL: {data?.adesoes?.length}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" className="ml-auto" onClick={() => setPrint(!print)}>
            <MdPrint />
            Imprimir Resumo
          </Button>
        </DialogFooter>

        <div style={{ display: "none" }}>
          {print && (
            <ResumoVendedor
              logoUrl={logoUrl}
              usuario={usuario}
              endDate={endDate}
              startDate={startDate}
              vendedor={vendedor.consultor}
              adesoes={data?.adesoes ?? []}
              ref={componenteRef}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}