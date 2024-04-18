// PrintButton.js
// PrintButton.tsx

import React, { useContext, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import DocumentTemplate from './DocumentTemplate';
import { AuthContext } from '@/contexts/AuthContext';
import { HiOutlineTicket } from "react-icons/hi";

interface DadosProps{
    nome:string, 
    condicao:string
    material:string
}

  export function PrintButton({
    nome, 
    material,condicao } :DadosProps){
  const componentRef = useRef<DocumentTemplate>(null);
  const {listaConv}=useContext(AuthContext)
  const cadastrado = !!listaConv.id_conv

  return (
    <div>
      <ReactToPrint
        trigger={() => <button disabled={!cadastrado} type="button" className="relative inline-flex ">
        <span   className="uppercase flex justify-center  p-2  z-20 text-sm  rounded-s-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " >
          <HiOutlineTicket size={20}/></span>
        <span  className="relative  flex justify-center items-center top-0 start-5 p-2 h-full text-sm font-medium text-white  rounded-e-lg border border-gray-500 focus:ring-4 focus:outline-none  bg-green-600 hover:bg-green-600 ">
         COMPROVANTE
    </span>
    </button>}
        content={() => componentRef.current}
      />
      <div className='text-white' style={{ display: 'none' }}>
        <DocumentTemplate
          ref={componentRef}
          nome ={nome}
          condicao=''
          material ={material}
        />
      </div>
    </div>
  );
};

export default PrintButton;
