// PrintButton.js
// PrintButton.tsx

import React, {useRef } from 'react';
import ReactToPrint from 'react-to-print';
import DocumentTemplate from './DocumentTemplate';
import { LiaFileContractSolid } from "react-icons/lia";


interface DadosProps {
  winners: Array<Partial<{
    id_contrato:number,
    titular:string,
    endereco:string,
    bairro:string,
    numero:number,
    premio:string,
    data_sorteio:Date,
    status:string
  }>>

}

  export function PrintButton({winners}:DadosProps ){
  const componentRef = useRef<DocumentTemplate>(null);



  return (
    <div>
      <ReactToPrint
        trigger={() => <button type="button" className=" inline-flex ">
        <span   className="uppercase flex justify-center  p-2  z-20 text-sm  rounded-s-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " ><LiaFileContractSolid size={20}/></span>
        <span  className="relative  flex justify-center items-center top-0 start-5 p-2 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 ">
         RELATÓRIO DE ENTREGA
    </span>
    </button>}
        content={() => componentRef.current}
      />
      <div className='text-white' style={{ display: 'none' }}>
        <DocumentTemplate
          ref={componentRef}
         winners={winners}
        />
      </div>
    </div>
  );
};

export default PrintButton;
