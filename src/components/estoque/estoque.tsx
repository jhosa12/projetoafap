import { EstoqueProps, FormProps, ProdutosProps } from "@/pages/estoque"
import { Button, Select, Table, TextInput } from "flowbite-react"
import { useContext, useEffect, useRef, useState } from "react";
import { ModalMov } from "./modalMovimentacao";
import { ModalNovoProduto } from "./modalNovoProduto";
import { AuthContext } from "@/contexts/AuthContext";
import {RiAlertLine} from "react-icons/ri";
import { MdKeyboardArrowDown, MdOutlinePlaylistAdd } from "react-icons/md";
import { FiltroEstoque } from "./PopoverFiltro";
import { get } from "http";
import { TbTransferVertical } from "react-icons/tb";
import useApi from "@/hooks/useApiPost";
import { EmpresaProps } from "@/types/empresa";
import { HiPrinter } from "react-icons/hi2";
import { useReactToPrint } from "react-to-print";
import RelatorioEstoque from "@/Documents/estoque/RelatorioEstoque";
import ImpressaoCarne from "@/Documents/mensalidade/ImpressaoCarne";



interface DataProps{
   
    empresas:Array<EmpresaProps>
    usuario:string,
    id_usuario:string,
    selectProdutos:Array<ProdutosProps>,
    reqProdutos:()=>Promise<void>,
    permissoes:Array<string>
     
}

export function Estoque({id_usuario,usuario,empresas,selectProdutos,reqProdutos,permissoes}:DataProps){
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
    const [mov,setMov]= useState<boolean>(false)
    const [openModal,setOpenModal]= useState<boolean>(false)
    const {data,loading,postData} = useApi<Array<EstoqueProps>,FormProps>('/estoque/listar')
    const componentRef =useRef<RelatorioEstoque>(null);
    const handleFiltroEstoque = async()=>{

     await postData({grupo:'',descricao:'',id_produto:null,id_empresa:undefined}) 
     console.log(data)
    
    }

    useEffect(()=>{
      handleFiltroEstoque()
    },[])



    const handleImpressao = useReactToPrint({
      pageStyle: `
  @page {
      margin: 1rem;
  }
  @media print {
      body {
          -webkit-print-color-adjust: exact;
      }
      @page {
          size: auto;
          margin: 1rem;
      }
      @page {
          @top-center {
              content: none;
          }
          @bottom-center {
              content: none;
          }
      }
  }
`,
      documentTitle: 'MOVIMENTAÇÃO DE ESTOQUE',

      content: () => componentRef.current,
     

  })

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
        <div className="flex-col w-full px-2 bg-white   ">

          <div style={{display:'none'}}>
            <RelatorioEstoque usuario={usuario} ref={componentRef} dados={data ?? []}/>
          </div>

      { mov && <ModalMov permissoes={permissoes}  setModalNovo={setOpenModal} reqDadosEstoq={postData} id_usuario={id_usuario} usuario={usuario} empresas={empresas} produtos={selectProdutos??[]}  setOpenModal={setMov}/>}
    { openModal && <ModalNovoProduto reqProdutos={reqProdutos} reqDadosEstoq={postData} permissoes={permissoes}  openModal={openModal} setOpenModal={setOpenModal}/>}

                <div className="inline-flex w-full justify-end items-end gap-4">
             
                    <FiltroEstoque empresas={empresas} produtos={selectProdutos??[]} loading={loading}  filtroEstoque={postData}/>
                    <Button  onClick={()=>setMov(true)} color={'green'} size={'sm'}><TbTransferVertical className="mr-2 h-5 w-5" /> Movimentar</Button>

                    <Button color={'blue'} onClick={()=>setOpenModal(true)}  size={'sm'}><MdOutlinePlaylistAdd className="mr-2 h-5 w-5"/>Novo Produto</Button>

                    <Button color={'gray'} onClick={handleImpressao}  size={'sm'}><HiPrinter className="mr-2 h-5 w-5"/>Imprimir</Button>
                </div>

        <div className="overflow-y-auto mt-1 px-2 max-h-[calc(100vh-170px)] bg-white  rounded-lg ">
        <Table hoverable theme={{ body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }}  >
                    <Table.Head >
                    <Table.HeadCell >
                                EMPRESA
                            </Table.HeadCell>
                            <Table.HeadCell >
                                DESCRIÇÃO
                            </Table.HeadCell>
                            <Table.HeadCell >
                                QUANTIDADE
                            </Table.HeadCell> 
                            <Table.HeadCell >
                               CODIGO PRODUTO
                            </Table.HeadCell> 
                     
                           
                        
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {data?.map((item,index)=>(
                           
                <>
                     <Table.Row className="bg-white cursor-pointer " key={index} onClick={()=>toogleAberto(index)} >
                      
                        <Table.Cell className="font-semibold text-[14px]">
                           {item?.empresa} 
                        </Table.Cell>   
                        <Table.Cell className="font-semibold text-[14px]">
                           {item?.produtos?.descricao} 
                        </Table.Cell>  
                    
                    
                        <Table.Cell className="text-black font-semibold text-[14px] inline-flex items-center gap-2">
                         {item?.quantidade} {item?.quantidade === 0 && <RiAlertLine size={18} color="red" />}
                        </Table.Cell>
                        <Table.Cell className="text-black font-semibold text-[14px]">
                         {item?.produtos?.cod_prod}
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