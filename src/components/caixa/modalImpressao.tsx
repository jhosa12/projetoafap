import RelatorioSintetico from "@/Documents/caixa/RelatorioMovimentacao";
import { LancamentosProps } from "@/pages/caixa";
import { Button, Modal, Select } from "flowbite-react";
import { useCallback, useRef, useState } from "react";
import { PiPrinterFill } from "react-icons/pi";
import { useReactToPrint } from "react-to-print";
import { SomaProps } from "../financeiro/caixa/caixa";



interface DataProps{
    startDate:Date,
    endDate:Date,
  
    usuario: string,
    array:Array<LancamentosProps>,
    openModal:boolean
    setOpenModal:(value:boolean)=>void
}







export function ModalImpressao({openModal,setOpenModal,startDate,endDate,usuario,array}:DataProps) {
    const [selectRelatorio,setSelectRelatorio] = useState('SINTETICO')
    const currentPage = useRef<RelatorioSintetico>(null)



    const handleGerirRelatorio = useCallback(()=>{

 
      return array.reduce((acumulador, atual) => {
        const valor = Number(atual.valor);
       
  
        switch (atual?.mensalidade?.form_pagto) {
          case 'PIX':
            acumulador.pix += valor;
            break;
          case 'BOLETO':
            acumulador.boleto += valor;
            break;
          case 'CARTAO':
          case 'CARTÃO CREDITO':
          case 'CARTÃO DEBITO':
            acumulador.cartao += valor;
            break;
          case 'DINHEIRO':
          case '':
            acumulador.dinheiro += valor;
            break;
          default:
            break; // Adicione uma ação padrão se necessário
        }
  
        if (atual.tipo === 'DESPESA') {
          acumulador.despesas += valor;
        }
        if(atual.tipo === 'RECEITA'){
          acumulador.total+= valor;
        }
  
        return acumulador;
      }, { pix: 0, boleto: 0, cartao: 0, dinheiro: 0, deposito: 0, total: 0, transferencia: 0,despesas:0 } as SomaProps);
     

    },[selectRelatorio])


    const ImprimirRelatorio = useReactToPrint({
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
        content:()=>currentPage.current,
    })
    return (
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
          <h2 className="text-white">IMPRESSÃO DE RELOTÓRIO</h2>
        </Modal.Header>
        <Modal.Body className="mt-2">

            <Select onChange={(e)=>setSelectRelatorio(e.target.value)}>
                <option value="SINTETICO">SINTÉTICO</option>
                <option value="ANALITICO">ANÁLITICO</option>
            </Select>
   
        </Modal.Body>
        <Modal.Footer>
          <Button outline  theme={{}}  onClick={() =>ImprimirRelatorio()}>
            <div className="flex justify-center items-center gap-1">
            <PiPrinterFill size={22}/> Imprimir
            </div>
        
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ display: "none" }}>
        {/* Renderiza o componente de fechamento apenas uma vez */}
        <RelatorioSintetico tipoRelatorio={selectRelatorio} soma={handleGerirRelatorio()} usuario={usuario} startDate={startDate} endDate={endDate} array={array} ref={currentPage} />
      </div>
   
      </>
    )


}