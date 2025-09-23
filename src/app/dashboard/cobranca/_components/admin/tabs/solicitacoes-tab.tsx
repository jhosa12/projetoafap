
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { SolicitacoesCobrador } from "@/Documents/cobranca/SolicitacoesCobrador";
import { pageStyle } from "@/utils/pageStyle";
import { SolicitacaoCobradorProps } from "../../../types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/lib/axios/apiClient";

export function SolicitacoesTab({ solicitacoes,consultor,id,getRotas }: { solicitacoes: Array<SolicitacaoCobradorProps>,consultor:string,id:number,getRotas:()=>void }) {
  const currentRef = useRef<HTMLDivElement>(null)


  const handleStatusChange = async( value: string,index:number) => {
    // setStatuses(prev => ({
    //   ...prev,
    //   [id]: value
    // }))
    // Here you would typically make an API call to update the status
    solicitacoes[index].status = value
  toast.promise(
    api.post("/cobranca/solicitacoes/status",{
      id_rota:id,
      solicitacoes
    }),
    {
      error:"Erro ao atualizar Solicitações",
      success:async(res)=>{
        getRotas()
          return "Atualização realizada com sucesso!"
      }
    }
  )
  }

  const handlePrint = useReactToPrint({
    contentRef: currentRef,
    pageStyle: pageStyle
  }) 

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size={'sm'} variant="outline" onClick={handlePrint} >
          <Printer />
          Imprimir Lista
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Contrato</TableHead>
            <TableHead>Status</TableHead>
           
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitacoes?.map((solicitacao,index) => (
            <TableRow className="text-xs" key={solicitacao.id_global}>
              <TableCell>{solicitacao.nome_cliente}</TableCell>
              <TableCell>
                <Badge className="text-xs" variant="outline">{solicitacao.categoria}</Badge>
              </TableCell>
              <TableCell>{solicitacao.descricao}</TableCell>
              <TableCell>{solicitacao.id_contrato}</TableCell>
              <TableCell>
                <Select 
                  value={solicitacao.status}
                  onValueChange={(value) => handleStatusChange(value,index)}
                >
                  <SelectTrigger className="h-8 text-xs w-36">
                    <SelectValue asChild>
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          solicitacao.status === 'PENDENTE' ? 'bg-yellow-500 ' :
                          solicitacao.status === 'CONCLUIDO' ? 'bg-green-500' :
                          solicitacao.status === 'NEGADO' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`} />
                        {!solicitacao.status || solicitacao.status === 'PENDENTE' ? 'PENDENTE' :
                         solicitacao.status === 'CONCLUIDO' ? 'CONCLUIDO' :
                         solicitacao.status === 'NEGADO' ? 'NEGADO' : 'EM ANDAMENTO'}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
                        PENDENTE
                      </div>
                    </SelectItem>
                    <SelectItem value="CONCLUIDO">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                        CONCLUÍDO
                      </div>
                    </SelectItem>
                    <SelectItem value="NEGADO">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
                        NEGADO
                      </div>
                    </SelectItem>
                    <SelectItem value="EM ANDAMENTO">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                        EM ANDAMENTO
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
           
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div style={{ display: 'none' }}>
        <SolicitacoesCobrador consultor={consultor}  ref={currentRef} solicitacoes={solicitacoes} /> 
      </div>
    </div>
  )
}
