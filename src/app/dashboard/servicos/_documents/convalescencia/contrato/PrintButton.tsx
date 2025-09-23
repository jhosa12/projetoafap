// PrintButton.js
// PrintButton.tsx

import React, { useContext, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DocumentTemplate from './DocumentTemplate';
import { LiaFileContractSolid } from "react-icons/lia";



interface DadosProps{
    nome:string, 
    cpf:string,
    rg:string,
    logradouro:string,
    bairro:string,
    cidade:string,
    uf:string,
    telefone:string,
    contrato:number,
    material:string
}

  export function PrintButton({
    nome, 
    cpf,
    rg,
    logradouro,
    bairro,
    cidade,
    uf,
    telefone,
    contrato,
    material } :DadosProps){
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
      contentRef: componentRef,
      documentTitle: `Contrato - ${nome}`, // É bom deixar o título dinâmico
      onAfterPrint: () => console.log('Impressão concluída ou cancelada.'),
    });
 

  return (
    <div>
      <button onClick={handlePrint} type="button" className="relative inline-flex ">
        <span className="uppercase flex justify-center p-2 z-20 text-sm rounded-s-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white ">
          <LiaFileContractSolid size={20} />
        </span>
        <span className="relative flex justify-center items-center top-0 start-5 p-2 h-full text-sm font-medium text-white rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none bg-blue-600 hover:bg-blue-700 ">
          CONTRATO
        </span>
      </button>
      <div className='text-white' style={{ display: 'none' }}>
        <DocumentTemplate
          ref={componentRef}
          nome ={nome}
          cpf={cpf}
          rg={rg}
          logradouro={logradouro}
          bairro={bairro}
          cidade={cidade}
          uf={uf}
          telefone={telefone}
          contrato={contrato}
          material ={material}
        />
      </div>
    </div>
  );
};

export default PrintButton;
