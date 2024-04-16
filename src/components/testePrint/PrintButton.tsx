// PrintButton.js
// PrintButton.tsx

import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import DocumentTemplate from './DocumentTemplate';

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
  const componentRef = useRef<DocumentTemplate>(null);

  return (
    <div>
      <ReactToPrint
        trigger={() => <button className='text-white'>Gerar Contrato de Compromisso</button>}
        content={() => componentRef.current}
      />
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
