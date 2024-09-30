






import { EstoqueProps, ProdutosProps } from "@/pages/estoque"
import { Button, Table} from "flowbite-react"
import { useContext, useEffect, useState } from "react";


import { AuthContext } from "@/contexts/AuthContext";
import { RiAlertLine } from "react-icons/ri";
import { ModalFiltroMov } from "./modalFiltro";
import { api } from "@/services/apiClient";
import { HiArrowDown } from "react-icons/hi2";
import { MdKeyboardArrowDown } from "react-icons/md";


interface DataProps{
   
    usuario:string,
    id_usuario:string
}

interface HistoricoProps{
    data:Date,
    descricao:string,
    empresa:string,
    id_mov:number,
    produtos:Array<{produto:string,id_produto:number,quantidade:number}>,
    tipo:string,
    usuario:string
    }

export function HistoricoMov({id_usuario,usuario}:DataProps){
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
    const [openModal,setOpenModal]= useState<boolean>(false)
    const {empresas} = useContext(AuthContext)
    const [historico,setHistorico] = useState<Array<HistoricoProps>>([])
   




    const handleFiltro = async({startDate,endDate,id_empresa,signal}:{startDate:Date,endDate:Date,id_empresa:string,signal?:AbortSignal})=>{
        try {
            const response = await api.post('/estoque/historico/filtro',{
                startDate,
                endDate,
                id_empresa
            },{signal})

            setHistorico(response.data)
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        handleFiltro({startDate:new Date(),endDate:new Date(),id_empresa:'',signal})

        return ()=>{
            controller.abort()
        }
    },[])
  

    const toogleAberto = (index: number) => {
        setAbertos((prev: { [key: number]: boolean }) => ({
          ...Object.keys(prev).reduce((acc, key) => {
            acc[Number(key)] = false;
            return acc;
          }, {} as { [key: number]: boolean }),
          [index]: !prev[index]
        }));
      };


    return(
        <>
        <ModalFiltroMov handleFiltro={handleFiltro} openModal={openModal} setOpenModal={setOpenModal} empresas={empresas}/>
        <div className="flex-col w-full px-2   ">
        
            <Button theme={{color:{
                light: "border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100   "
            }}} 
            color={"light"}
             size={'sm'} 
             className="ml-auto"
             onClick={()=>setOpenModal(true)}
             >FILTRO
             </Button> 

        <div className="overflow-y-auto mt-1 px-2 max-h-[79vh] ">
        <Table hoverable theme={{ body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }}  >
                    <Table.Head >
                            <Table.HeadCell >
                                DESCRIÇÃO
                            </Table.HeadCell>
                            <Table.HeadCell >
                                DATA
                            </Table.HeadCell> 
                            <Table.HeadCell >
                               EMPRESA
                            </Table.HeadCell> 
                            <Table.HeadCell >
                                USUÁRIO
                            </Table.HeadCell>
                            <Table.HeadCell >
                                TIPO
                            </Table.HeadCell>
                            <Table.HeadCell >
                               
                            </Table.HeadCell>
                        
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {historico?.map((item,index)=>{
                           
                
                 return  (<>  <Table.Row  className="bg-white hover:cursor-pointer " key={index} onClick={()=>toogleAberto(index)} >
                      
                        <Table.Cell className="font-semibold">
                           {item.descricao} 
                        </Table.Cell>   
                    
                    
                        <Table.Cell className="text-black font-semibold  inline-flex items-center gap-2">
                         {new Date(item.data).toLocaleDateString('pt-BR')}
                        </Table.Cell>
                        <Table.Cell className="text-black font-semibold ">
                         {item.empresa}
                        </Table.Cell>
                        <Table.Cell className="text-black font-semibold " >
                       {item.usuario}
                          
                        </Table.Cell>
                        <Table.Cell className="text-black font-semibold" >
                       {item.tipo}
                          
                        </Table.Cell>
                        <Table.Cell className="text-black font-semibold" >
                        <MdKeyboardArrowDown size={16}/>
                          
                        </Table.Cell>
                       </Table.Row>
                       {
                        abertos[index] && item.produtos.map(prod=>(
                            <Table.Row className="bg-slate-100" key={prod.id_produto}>
                                <Table.Cell className="text-black ">{prod.produto}</Table.Cell>
                                <Table.Cell className="text-black ">QUANTIDADE: {prod.quantidade}</Table.Cell>
                                <Table.Cell className="text-black "></Table.Cell>
                                <Table.Cell className="text-black "></Table.Cell>
                                <Table.Cell className="text-black "></Table.Cell>
                                <Table.Cell className="text-black "></Table.Cell>
                            </Table.Row>

                        ))
                       }
                       
                       </>
                    
                    )

                     
                            
})}

            
                        
                       
                    </Table.Body>
                
                </Table>
        
        
        
        </div>
              
                </div>
                
                </>
    )
}