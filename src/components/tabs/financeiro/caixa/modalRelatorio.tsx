
import { CaixaProps, CcustosProps } from "@/pages/dashboard/financeiro"
import { Button, Checkbox, Dropdown, Modal } from "flowbite-react"
import { useRef, useState } from "react"
import { PiPrinterFill } from "react-icons/pi"
import { TagsProps } from "./caixa"
import { IReactToPrintProps, useReactToPrint } from "react-to-print"
import DocumentTemplate from "@/documents/financeiro/caixa/DocumentTemplate"
import { endOfDay } from "date-fns"

interface DataProps {
    openModal:boolean
    setOpenModal:(open:boolean)=>void
    caixa:Array<CaixaProps>|null
    arrayCcustos:Array<CcustosProps>
    startDate:Date,
    endDate:Date
}

export interface ArrayGeral{
    nome:string
    lancamentos:Array<CaixaProps>
    pix:number,
    boleto:number,
    cartao:number,
    dinheiro:number,
    transferencia:number,
    deposito:number
  }


export function ModalRelatorio({openModal,setOpenModal,caixa,arrayCcustos,startDate,endDate}:DataProps) {
    const current = useRef<DocumentTemplate>(null)
    const [arrayTags,setArrayTags] = useState<Array<TagsProps>>([
        {id:1,desc:'TODOS',check:true},
        {id:2,desc:'PIX',check:true},
        {id:3,desc:'CARTAO',check:true},
        {id:4,desc:'TRANSFERENCIA',check:true},
        {id:5,desc:'DINHEIRO',check:true},
        {id:6,desc:'BOLETO',check:true},
      ]);


      const handleTagImp=(index:number)=>{
        const novoArray = [...arrayTags]
        let mod:Array<TagsProps>=[]
    
        if(index===0){
        
          if(novoArray[index].check){
           mod = novoArray.map(item=>{return {...item,check:false}})
    
          }else{
            mod = novoArray.map(item=>{return {...item,check:true}})
          }
    
    
        }else{
          novoArray[index].check = !novoArray[index].check
          novoArray[0].check =false
          mod=novoArray
        }
    
        setArrayTags(mod)
      }




    const handleImpressao = () => {
      
        const formasDePagamento = ['BOLETO', 'PIX', 'CARTAO CREDITO', 'DEPOSITO', 'DINHEIRO', 'TRANSFERENCIA','CARTAO DEBITO','CARTAO',''] as const;
    
        const caixaMap = caixa?.reduce((map, atual) => {
            const { ccustos_desc, valor, mensalidade } = atual;
            const formPagto = mensalidade?.form_pagto as typeof formasDePagamento[number];
    
            if (!map.has(ccustos_desc)) {
                // Inicializa o item com todas as propriedades
                map.set(ccustos_desc, {
                    nome: ccustos_desc,
                    lancamentos: [],
                    boleto: 0,
                    pix: 0,
                    cartao: 0,
                    deposito: 0,
                    dinheiro: 0,
                    transferencia: 0,
                });
            }
    
            const itemExistente = map.get(ccustos_desc)!;
    
            // Adiciona o lançamento
            itemExistente.lancamentos.push(atual);
    

            switch (formPagto) {
              case 'PIX':atual.tipo==='RECEITA' ?itemExistente.pix -= Number(valor):itemExistente.pix += Number(valor); break;
              case 'BOLETO':atual.tipo==='RECEITA' ?itemExistente.boleto -= Number(valor):itemExistente.boleto += Number(valor); break;
              case 'CARTAO': case 'CARTAO CREDITO': case 'CARTAO DEBITO': atual.tipo==='RECEITA' ?itemExistente.cartao -= Number(valor):itemExistente.cartao += Number(valor); break;
              case 'DINHEIRO':case undefined:case '':case null:atual.tipo==='RECEITA' ?itemExistente.dinheiro += Number(valor):itemExistente.dinheiro -= Number(valor); break;
              default: break;
            }
            // Atualiza a forma de pagamento correspondente
          //  if (formPagto === 'BOLETO') itemExistente.boleto += Number(valor);
         //   else if (formPagto === 'PIX') itemExistente.pix += Number(valor);
           // else if (formPagto === 'CARTAO') itemExistente.cartao += Number(valor);
          //  else if (formPagto === 'DEPOSITO') itemExistente.deposito += Number(valor);
           // else if (formPagto === 'DINHEIRO') itemExistente.dinheiro += Number(valor);
          //  else if (formPagto === 'TRANSFERENCIA') itemExistente.transferencia += Number(valor);
    
            return map;
        }, new Map<string, ArrayGeral>());
    
        // Retorna os valores do mapa como um array
        return  caixaMap ? Array.from(caixaMap.values()):[];
    };
    
    





   
    const ImprimirRelatorio = useReactToPrint({
        content:()=>current.current
      })








    return(
<>
        <Modal
        className="absolute bg-gray-600 overflow-y-auto"
        content={"base"}
        show={openModal}
        onClose={() => setOpenModal(false)}
        size={'md'} 
        popup
        dismissible
      >
        <Modal.Header className="flex text-white items-start justify-between bg-gray-700 rounded-t border-b p-2 border-gray-60">
          <h1 className="text-white">IMPRESSÃO DE RELOTÓRIO</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="flex w-full mt-2 ">
          <Dropdown  size={'sm'}  style={{width:'100%',justifyContent:'space-between', background: '#f6f8fa', paddingTop: 0, paddingBottom: 0, color: '#000', borderWidth: '1px', borderColor: '#dce0e3',outline:'none' }} theme={{ arrowIcon:'flex h-full items-end ml-auto',content: 'p-1 w-full justify-between' }} dismissOnClick={false} label='TAG'  arrowIcon={false} >
         {arrayTags.map((item,index)=>(
               <Dropdown.Item className="flex gap-2 " key={item.id} ><Checkbox onChange={() =>handleTagImp(index) }  checked={item.check} />{item.desc}</Dropdown.Item>
         ))}
          
        

</Dropdown>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button outline  theme={{}}  onClick={() =>ImprimirRelatorio()}>
            <div className="flex justify-center items-center gap-1">
            <PiPrinterFill size={22}/> Imprimir
            </div>
        
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{display:'none'}}>

      <DocumentTemplate dataInical={startDate} dataFinal={endDate} ccustos={arrayCcustos.filter(item=>item.check)}   caixa={handleImpressao()}  ref={current}/>

</div>
   
      </>
    )
}