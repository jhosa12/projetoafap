import { ModalFiltro } from "@/components/renovacao/modalFiltro";
import { Button, ButtonGroup,Table} from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { api } from "@/lib/axios/apiClient";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import DocumentTemplate from "@/Documents/renovacao/impressao";
import pageStyle from "@/utils/pageStyle";
import { AuthContext } from "@/store/AuthContext";
import { IoPrint } from "react-icons/io5";
import { FaFilter } from "react-icons/fa6";
import { PopoverRenovar } from "@/components/renovacao/popOverRenovar";
import { themeLight } from "@/components/tabs/admContrato/acordos/screen";




 interface MensalidadeProps {
    n_doc: string,
    parcela_n: number,
    vencimento: Date,
    cobranca: Date,
    valor_principal: number,
    id_contrato:number,
    id_mensalidade: number,
   // valor_total: number,
    referencia: string,
}
export interface DadosImpressao{
    nome:string,
    endereco:string,
    bairro:string,
    numero:number,
    cidade:string
    uf:string,
    
    mensalidade:Array<MensalidadeProps>
}


export interface FiltroProps{
 
    contratoInicial:number|null,
    contratoFinal:number|null,
    mensAberto:number|null
}

export interface ListaProps{
        planos:{acrescimo:number,valor:number},
        id_contrato: number,
        id_contrato_global: number,
        id_empresa:string
        mensalidade: Array< {vencimento: Date}>,
        associado: {
            id_global: number,
            nome: string,
            endereco: string,
            bairro: string,
            id_associado:number,
            _count:{dependentes:number}
        }
    }


export default function Renovacao(){
const {infoEmpresa} = useContext(AuthContext)
const [openModalFiltro,setModalFiltro]=useState<boolean>(false)
const [loading,setLoading] =useState<boolean>(false)
const [dataFiltro,setFiltro] = useState<FiltroProps>({contratoInicial:null,mensAberto:null,contratoFinal:null})
const [array,setArray]= useState<Array<ListaProps>>([])
const [MensImp,setMensImp]= useState<Array<DadosImpressao>>([])
const [parcelas,setParcelas] = useState<number|null>(0)
const componentRef =useRef<DocumentTemplate>(null);



const imprimirCarne =useReactToPrint({
    pageStyle:pageStyle,
    documentTitle:'CARNÊ ASSOCIADO',
    content:()=>componentRef.current,
    onAfterPrint() {
        setMensImp([])
       
    },
    onBeforeGetContent(){
       
    },
    onBeforePrint(){
        setLoading(false)
    }
 

})







const handleImpressao =async ()=>{
    if(array.length===0){
        toast.info('Nenhum contrato no grid!')
        return

    }
    setLoading(true)
    try {
        const response = await api.post('/renovacao/impressao',{
            contratos:array.map(item=>{return item.id_contrato})
        })
       setMensImp(response.data)
    } catch (error) {
            toast.error('erro na busca')
    }

   
}


useEffect(()=>{

   
MensImp.length>0 && imprimirCarne()



},[MensImp])



const handleRenovacao = async()=>{
  
    try {

        const response = await toast.promise(
            api.post('/renovacao',{
                contratos:array?.map(item=>{ return {id_contrato:item.id_contrato,valor_mensalidade:item.planos.valor,id_associado:item.associado.id_associado,acrescimo:item.planos.acrescimo,dependentes:item.associado._count.dependentes,id_global:item.associado.id_global,id_contrato_global:item.id_contrato_global,id_empresa:item.id_empresa}}),
                quantidade:parcelas
            }),
            {
                error:'Erro na renovação',
                pending:'Executando Renovação....Aguarde',
                success:'Renovação realizada com sucesso!'
            }
        )

      toast.success(response.data)
        
    } catch (error) {
        console.log(error)
    }
}



const filtrar = async()=>{
    setLoading(true)
    
    try {

        const response = await api.post('/renovacao/filtro',{
            contratoInicial:dataFiltro.contratoInicial,
            contratoFinal:dataFiltro.contratoFinal,
            quant:dataFiltro.mensAberto,
            id_empresa:infoEmpresa?.id
        })

        setArray(response.data)
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
    setLoading(false)
    setModalFiltro(false)
}

    return(
        <>
    <div style={{display:'none'}}>
    <DocumentTemplate
    ref={componentRef}
    arrayMensalidade={MensImp}

    
    />

    </div>


       {openModalFiltro && <ModalFiltro 
      
        setFiltro={setFiltro}
        dataFiltro={dataFiltro}
        filtrar={filtrar} 
        openModal={openModalFiltro} 
        setModal={setModalFiltro} 
        loading={loading}/>}

     
        <div className="flex flex-col w-full h-[100vh] p-1 bg-white text-black">
            <div className="inline-flex w-full justify-end items-end mt-1 gap-8 pr-1">

      <ButtonGroup>
                <Button theme={themeLight} onClick={()=>setModalFiltro(true)} type="button" color='light' size='xs'><FaFilter className='mr-1 h-4 w-4' />Filtrar</Button>

               {/*<PopoverReagendamento setSelecionadas={setLinhasSelecionadas} id_usuario={usuario?.id} mensalidades={linhasSelecionadas} id_global={dadosAssociado.id_global}/>*/}

                <Button theme={themeLight} isProcessing={loading} onClick={handleImpressao} color='light' size='xs'>  <IoPrint className='mr-1 h-4 w-4' /> Imprimir</Button>
              
              {/*  <PopoverVencimento    />*/}
             
               <PopoverRenovar setParcelas={setParcelas} n_Parcelas={parcelas} handleFunction={handleRenovacao}/>
            
            </ButtonGroup>
     
              
             

            </div>



            <div className="overflow-y-auto overflow-x-auto max-h-[82vh] mt-1 px-2">
                <Table  theme={{root:{shadow:'none'}, body: { cell: { base: "px-4 py-1 text-xs " } },head:{cell:{base:"px-4 py-1 text-xs"}} }}>
                    <Table.Head className="sticky">
                        <Table.HeadCell>Contrato</Table.HeadCell>
                        <Table.HeadCell>Associado</Table.HeadCell>
                        <Table.HeadCell>Endereço</Table.HeadCell>
                        <Table.HeadCell>Bairro</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="text-black divide-y">
                      { array?.map((item,index)=>(
                         <Table.Row  key={item.id_contrato}>
                              <Table.Cell className="font-semibold">{item.id_contrato}</Table.Cell>
                            <Table.Cell>{item.associado.nome}</Table.Cell>
                            <Table.Cell>{item.associado.endereco}</Table.Cell>
                            <Table.Cell>{item.associado.bairro}</Table.Cell>
                         </Table.Row>
                      ))
                       }
                    </Table.Body>
                </Table>

            </div>
        </div>
        </>
    )
}