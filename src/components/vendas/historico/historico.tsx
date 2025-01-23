import useApiGet from "@/hooks/useApiGet";
import { DependentesProps } from "@/types/associado";
import { Button, ButtonGroup, Select, Table } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { HiPrinter } from "react-icons/hi2";
import { MdDeleteForever, MdOutlinePlaylistAdd } from "react-icons/md";
import { RiAddCircleFill, RiAlertLine } from "react-icons/ri";
import { TbTransferVertical } from "react-icons/tb";
import { FiltroLeads } from "./filtroHistorico";
import { ModalItem } from "./modelItem/modalItem";
import { IoPrint } from "react-icons/io5";
import { toast } from "react-toastify";
import { set } from "react-hook-form";
import { ModalConfirmar } from "@/components/afapSaude/components/modalConfirmar";
import useApiPost from "@/hooks/useApiPost";



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
    data_nasc:Date,
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
    dependentes:Array<Partial<{nome: string,celular:string,data_nasc:Date,grau_parentesco:string}>>
  }

export function Historico() {
    const {postData,data,setData} = useApiGet<Array<LeadProps>,undefined>("/lead/lista")
    const [lead,setLead] = useState<Partial<LeadProps>>()
    const [modalLead,setModalLead] = useState(false)
    const [categoria,setCategoria] = useState("")
    const [modalConfirma,setModalConfirma] = useState(false)
    const {data:novaCategoria,postData:postCategoria} = useApiPost<LeadProps,{id_lead:number|undefined,categoriaAtual:string,categoriaAnt:string|undefined,usuario:string|undefined}>("/leads/alterarCategoria")
  




        const onChangeCategoria = (e: React.ChangeEvent<HTMLSelectElement>,lead:Partial<LeadProps>) => {
            if (lead.status === e.target.value) {
                return;
          };
            
            
            setCategoria(e.target.value);
            setLead(lead);
            setModalConfirma(true)
        }


        const handleAtualizarCategoria = useCallback(async()=> {
            try {
               await postCategoria({categoriaAtual:categoria,categoriaAnt:lead?.status,usuario:lead?.usuario,id_lead:lead?.id_lead})

               postData(undefined)

               setModalConfirma(false)
               
            } catch (error) {
                console.log(error)
            }

            
        },[categoria,lead?.id_lead])

    

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

            <ModalItem item={lead??{}} open={modalLead} onClose={()=>setModalLead(false)}/>
            <ModalConfirmar pergunta={`Tem certeza que deseja alterar o(a) ${lead?.status} para um(a) ${categoria} ? Essa alteração será contabilizada na faturação!`}     handleConfirmar={handleAtualizarCategoria} openModal={modalConfirma} setOpenModal={setModalConfirma}/>
   
            <div className="flex justify-end">
                        <ButtonGroup >
                            <Button  onClick={()=>{}} type="button" color='light' size='xs'><RiAddCircleFill className='mr-1 h-4 w-4' /> Adicionar</Button>
                            <Button type='button' onClick={()=>{}} color='light' size='xs'>  <IoPrint className='mr-1 h-4 w-4' /> Imprimir</Button>
                            <Button  onClick={() => {}} type="button" color='light' size='xs'><MdDeleteForever className='mr-1 h-4 w-4' /> Excluir</Button>
                        </ButtonGroup>
            </div>
              

      <div className="overflow-y-auto pt-1 px-2 max-h-[calc(100vh-170px)] bg-white  ">
      <Table striped hoverable theme={{ body: { cell: { base: " px-3 py-2  text-xs text-black" } } }}  >
                  <Table.Head theme={{cell:{base:"px-3 py-2 text-xs text-black font-bold bg-gray-50"}}} >
                  <Table.HeadCell >
                              Nome
                          </Table.HeadCell>
                          <Table.HeadCell >
                             Previsão de Visita
                          </Table.HeadCell>
                          <Table.HeadCell >
                             Data
                          </Table.HeadCell>
                          <Table.HeadCell >
                              categoria
                          </Table.HeadCell> 
                          <Table.HeadCell >
                             Vendedor
                          </Table.HeadCell> 
                          <Table.HeadCell >
                             Celular1
                          </Table.HeadCell> 
                          <Table.HeadCell >
                             Celular2
                          </Table.HeadCell> 
                   
                  </Table.Head>
                  <Table.Body  className="divide-y">
                      {data?.map((item,index)=>(
                         
              <>
                   <Table.Row className="bg-white cursor-pointer text-xs font-semibold" key={index} onClick={()=>{setLead(item),setModalLead(true)}} >
                    
                      <Table.Cell className="">
                         {item?.nome} 
                      </Table.Cell>   
                      <Table.Cell className="">
                         {item?.visita && new Date(item?.visita).toLocaleDateString('pt-BR',{timeZone: 'UTC'})} 
                      </Table.Cell> 

                      <Table.Cell className="">
                         {item?.data && new Date(item?.data).toLocaleDateString('pt-BR',{timeZone: 'UTC'})} 
                      </Table.Cell> 
                
                      <Table.Cell onClick={e=>{e.stopPropagation()}} className={`${item?.status === 'LEAD' ? 'text-blue-600' : item.status === 'PROSPECCAO' ? 'text-yellow-500' : 'text-green-500'}`} >
                       <select onChange={e=>onChangeCategoria(e,item)}  className="appearance-none border-none text-xs" value={item?.status}>
                            <option>LEAD</option>
                            <option>PROSPECCAO</option>
                            <option>PRE VENDA</option>
                       </select>
                      </Table.Cell>
                      <Table.Cell >
                       {item?.usuario}
                      </Table.Cell>

                      <Table.Cell >
                       {item?.celular1}
                      </Table.Cell>

                      <Table.Cell >
                       {item?.celular2}
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