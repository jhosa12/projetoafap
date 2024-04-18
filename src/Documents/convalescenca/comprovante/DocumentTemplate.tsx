import Image from "next/image";
import logo from "../../../../public/logoafap.png"

// DocumentTemplate.js

import React from 'react';
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


class DocumentTemplate extends React.Component<DadosProps> {
   
  render() {
    const {  nome, 
        cpf,
        rg,
        logradouro,
        bairro,
        cidade,
        uf,
        telefone,
        contrato,
        material } = this.props;

   
         

    return (
      <div className='flex flex-col w-1/2 p-2 border-[1px] '>
        <div className="flex  w-full justify-center items-center mt-4">
        <Image className="flex w-1/2 h-16  " src={logo} alt="" />
        </div>
        <h2 className='text-xl text-center font-semibold mt-2'>COMPROVANTE</h2>
        <span className="px-2 pt-2" >Data de Devolução:</span>
        <span className="px-2 pt-2 mx-5">Itens Devolvidos:</span>
        <ul className="list-item px-2 mx-3 font-semibold">
          <li className="p-2 mx-2 ">CADEIRA DE RODAS</li>

        </ul>
        <span className="p-2">Condição do(s) Item(s):</span>
        <span className="pt-2 px-2 text-center">Assinatura do Recebedor</span>
        <div className="flex  w-full py-2 justify-center items-center  ">
          <span className="flex w-10/12 border-b-[1px] p-2 border-black"></span>
        </div>
        <span className="p-2">Cedro - {new Date().toLocaleDateString('pt-BR',{month:'long'})}</span>
        <p className=" mx-5 p-2 text-justify">Este comprovante confirma a devolução dos itens listados acima pelo paciente mencionado
           na data indicada. Os itens foram verificados quanto à sua condição e quantidade conforme
            mencionado acima.</p>
      </div>
    );
  }
}

export default DocumentTemplate;
