// PrintButton.js
// PrintButton.tsx

import React, { useContext, useRef } from 'react';
import ReactToPrint from 'react-to-print';
import DocumentTemplate from './CarteiraAssociado';
import { LiaFileContractSolid } from "react-icons/lia";
import { AuthContext } from '@/store/AuthContext';


interface DadosProps{
  dependentes:Array<Partial<{
    nome: string,
    data_nasc: Date,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    sexo: string,
    saveAdd: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string,
   
  }>>
  contrato:number,
  plano:string,
  tipoButton:boolean
    
}

  export function PrintButton(){
  const componentRef = useRef<DocumentTemplate>(null);


  return (
    <div>
      <ReactToPrint
        trigger={() => <button  type="button" className="relative inline-flex ">
        <span   className="uppercase flex justify-center  p-2  z-20 text-sm  rounded-s-lg rounded-s-gray-100 rounded-s-2 border bg-gray-700 border-gray-600 placeholder-gray-400 text-white " ><LiaFileContractSolid size={20}/></span>
        <span  className="relative  flex justify-center items-center top-0 start-5 p-2 h-full text-sm font-medium text-white  rounded-e-lg border border-blue-700 focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 ">
         CARTEIRA TESTE
    </span>
    </button>}
        content={() => componentRef.current}
      />
      <div className='text-white' style={{ display: 'none' }}>
    
      </div>
    </div>
  );
};

export default PrintButton;
