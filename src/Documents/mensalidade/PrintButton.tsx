// PrintButton.js
// PrintButton.tsx

import React, { useContext, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import DocumentTemplate from './ImpressaoCarne';
import { HiOutlineTicket } from "react-icons/hi2";

interface MensalidadeProps {
  id_usuario: number,
  id_contrato: number,
  estorno_dt: Date,
  estorno_user: string,
  dt_exclusao: Date,
  exclusao_motivo: string,
  user_exclusao: string,
  associado: string,
  n_doc: string,
  parcela_n: number,
  vencimento: Date,
  cobranca: Date,
  valor_principal: number,
  close: boolean,
  status: string,
  usuario: string,
  id_mensalidade: number,
  valor_total: number,
  motivo_bonus: string,
  data_pgto: Date,
  referencia: string,
  index: number,
  id_acordo: number

}
interface DadosAssociado{
  nome:string,
  endereco:string,
  plano:string
  bairro:string,
  numero:number,
  cidade:string
  uf:string,
  id_contrato:number
}
interface DadosProps {
  dadosAssociado:DadosAssociado
  arrayMensalidade: Array<Partial<MensalidadeProps>>
}



  export function PrintButtonCarne({dadosAssociado,arrayMensalidade}:DadosProps){
  const componentRef = useRef<DocumentTemplate>(null);

  return (
    <div>
      <ReactToPrint
        trigger={() => <button  type="button" className="relative inline-flex ">
        <span   className="uppercase flex justify-center  p-2  z-20 text-sm  rounded-s-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " ><HiOutlineTicket size={20}/></span>
        <span  className="relative  flex justify-center items-center top-0 start-5 p-2 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 ">
         CARNÊ
    </span>
    </button>}
        content={() => componentRef.current}
      />
      <div className='text-white' style={{ display: 'none' }}>
        <DocumentTemplate
          ref={componentRef}
          dadosAssociado={dadosAssociado}
         arrayMensalidade={arrayMensalidade}
        />
      </div>
    </div>
  );
};

export default PrintButtonCarne;
