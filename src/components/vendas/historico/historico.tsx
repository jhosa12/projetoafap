import useApiGet from "@/hooks/useApiGet";
import { DependentesProps } from "@/types/associado";
import { Button, Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { HiPrinter } from "react-icons/hi2";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { RiAlertLine } from "react-icons/ri";
import { TbTransferVertical } from "react-icons/tb";
import { FiltroLeads } from "./filtroHistorico";



export interface LeadProps {
    index: number,
    id_lead: number,
    visita: Date,
    id_usuario: string,
    id_plano:number,
    plano:string,
    origem:string,
    valor_mensalidade:number
    nome: string,
    endereco: string,
    possuiPet : string
    planoPet :  string,
    status: string,
    bairro: string,
    numero: number,
    data_nasc:string,
    cep:string,
    rg:string,
    cpfcnpj:string,
    guia_rua:string,
    cidade: string,
    celular1: string,
    vencimento:Date|undefined,
    celular2: string,
    empresaAtual: string,
    servicosUsados: string,
    motivo: string,
    planodesaude: string,
    indicacao: string,
    usuario: string,
    data: Date,
    dependentes:Array<Partial<DependentesProps>>
  }

export function Historico() {
    const {postData,data} = useApiGet<Array<LeadProps>,undefined>("/lead/lista")



    const reqDados = useCallback(async()=> {
        try {
           postData(undefined)
           
        } catch (error) {
            console.log(error)
        }
    },[])

    useEffect(()=>{
        reqDados()
    },[])
    

    return(
        <div className="flex-col w-full px-2 bg-white   ">


   

              <div className="inline-flex w-full justify-end items-end gap-4">
           
                    <FiltroLeads   produtos={[]} filtroEstoque={async()=>{}} loading={false}/>
              

              </div>

      <div className="overflow-y-auto mt-1 px-2 max-h-[calc(100vh-170px)] bg-white  rounded-lg ">
      <Table hoverable theme={{ body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }}  >
                  <Table.Head >
                  <Table.HeadCell >
                              Nome
                          </Table.HeadCell>
                          <Table.HeadCell >
                              Empresa
                          </Table.HeadCell>
                          <Table.HeadCell >
                              categoria
                          </Table.HeadCell> 
                          <Table.HeadCell >
                             Vendedor
                          </Table.HeadCell> 
                   
                         
                      
                  </Table.Head>
                  <Table.Body className="divide-y">
                      {data?.map((item,index)=>(
                         
              <>
                   <Table.Row className="bg-white cursor-pointer text-xs font-semibold" key={index} onClick={()=>{}} >
                    
                      <Table.Cell className="">
                         {item?.nome} 
                      </Table.Cell>   
                      <Table.Cell className="">
                         {item?.empresaAtual} 
                      </Table.Cell>  
                  
                  
                      <Table.Cell >
                       {item?.status}
                      </Table.Cell>
                      <Table.Cell >
                       {item?.usuario}
                      </Table.Cell>
                   
                      
                     </Table.Row>
                 
                     </>
                     ))}
          
                      
                     
                  </Table.Body>
              
              </Table>
             
      
      
      </div>
            
              </div>
    )
}