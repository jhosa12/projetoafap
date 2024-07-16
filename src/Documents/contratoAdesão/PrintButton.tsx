// PrintButton.js
// PrintButton.tsx

import React, { useContext, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import DocumentTemplate from './DocumentTemplate';
import { LiaFileContractSolid } from "react-icons/lia";
import { AuthContext } from '@/contexts/AuthContext';



  export function PrintButton( ){
  const componentRef = useRef<DocumentTemplate>(null);
  const {dadosassociado}=useContext(AuthContext)
  const cadastrado = !!dadosassociado?.contrato?.id_contrato

  return (
    <div>
      <ReactToPrint
        trigger={() => <button disabled={!cadastrado} type="button" className=" inline-flex ">
        <span   className="uppercase flex justify-center  p-2  z-20 text-sm  rounded-s-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " ><LiaFileContractSolid size={20}/></span>
        <span  className="relative  flex justify-center items-center top-0 start-5 p-2 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 ">
         CONTRATO
    </span>
    </button>}
        content={() => componentRef.current}
      />
      <div className='text-white' style={{ display: 'none' }}>
        <DocumentTemplate
          ref={componentRef}
          nome={dadosassociado?.nome ??''}
          cpf={dadosassociado?.cpf??''}
          rg={dadosassociado?.rg??''}
          endereco={dadosassociado?.endereco??''}
          numero={String(dadosassociado?.numero)??''}
          bairro={dadosassociado?.bairro??''}
          complemento={dadosassociado?.guia_rua??''}
          cidade={dadosassociado?.cidade??''}
          adesao={new Date(dadosassociado?.contrato?.dt_adesao ?? '')}
          telefone={dadosassociado?.celular1??''}
          contrato={dadosassociado?.contrato?.id_contrato??0}
          dependentes={dadosassociado?.dependentes??[]}
          estado={dadosassociado?.uf??''}

        
        />
      </div>
    </div>
  );
};

export default PrintButton;
