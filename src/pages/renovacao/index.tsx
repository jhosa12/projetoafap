import { ModalFiltro } from "@/components/renovacao/modalFiltro";
import { Button, Label, Table, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { ModalRenovar } from "@/components/renovacao/modalRenovar";
import { useReactToPrint } from "react-to-print";
import DocumentTemplate from "@/Documents/renovacao/impressao";


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
    empresa:string,
    mensAberto:number|null
}

export interface ListaProps{
    valor_mensalidade:number,
        id_contrato: number,
        mensalidade: Array< {vencimento: Date}>,
        associado: {
            nome: string,
            endereco: string,
            bairro: string,
            id_associado:number
        }
    }


export default function Renovacao(){
const [openModalFiltro,setModalFiltro]=useState<boolean>(false)
const [openModalRen,setModalRen]=useState<boolean>(false)
const [loading,setLoading] =useState<boolean>(false)
const [dataFiltro,setFiltro] = useState<FiltroProps>({contratoInicial:0,empresa:'',mensAberto:0,contratoFinal:0})
const [array,setArray]= useState<Array<ListaProps>>([])
const [MensImp,setMensImp]= useState<Array<DadosImpressao>>([])
const [parcelas,setParcelas] = useState<number>(0)
const componentRef =useRef<DocumentTemplate>(null);




const imprimirCarne =useReactToPrint({
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
                contratos:array?.map(item=>{ return {id_contrato:item.id_contrato,valor_mensalidade:item.valor_mensalidade,id_associado:item.associado.id_associado}}),
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
            quant:dataFiltro.mensAberto
        })

        setArray(response.data)
        
    } catch (error) {
        console.log(error)
    }
    setLoading(false)
}

    return(
        <>
    <div style={{display:'none'}}>
    <DocumentTemplate
    ref={componentRef}
    arrayMensalidade={MensImp}

    
    />

    </div>


        <ModalFiltro setFiltro={setFiltro} dataFiltro={dataFiltro} filtrar={filtrar} openModal={openModalFiltro} setModal={setModalFiltro} loading={loading}/>

        <ModalRenovar  openModal={openModalRen} setOpenModal={setModalRen}  handleRenovar={handleRenovacao}/>
        <div className="flex flex-col w-full">
            <div className="inline-flex w-full justify-end items-end mt-1 gap-8 pr-1">


            <Button  size={'sm'} onClick={()=>setModalFiltro(true)}>Filtrar</Button>
              
                <Button isProcessing={loading} onClick={handleImpressao} size={'sm'}>Imprimir</Button>

                <div className="inline-flex items-end gap-4" >
                    
       <Label  className="text-white" value="Número de parcelas:" />
     
                         <TextInput value={parcelas}  onChange={e=>setParcelas(Number(e.target.value))} type="number" sizing={'sm'}/>
                     
                <Button onClick={()=>{
                if(array.length===0 || !parcelas){
                    toast.info('Sem dados disponiveis para renovação')
                    return;
                }
                    setModalRen(true)}} size={'sm'}>Renovar</Button>
            </div>
            </div>



            <div className="overflow-y-auto overflow-x-auto max-h-[82vh] mt-1 px-2">
                <Table  theme={{ body: { cell: { base: "px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-gray-700" } } }}>
                    <Table.Head className="sticky">
                        <Table.HeadCell>Contrato</Table.HeadCell>
                        <Table.HeadCell>Associado</Table.HeadCell>
                        <Table.HeadCell>Endereço</Table.HeadCell>
                        <Table.HeadCell>Bairro</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      { array?.map((item,index)=>(
                         <Table.Row key={item.id_contrato}>
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