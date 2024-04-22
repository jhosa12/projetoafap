import Image from "next/image";
import logo from "../../../../public/logoafap.png"

// DocumentTemplate.js

import React from 'react';
interface DadosProps{
    nome:string, 
    material:string,
    condicao:string
}


class DocumentTemplate extends React.Component<DadosProps> {
   
  render() {
    const {  nome, material,condicao } = this.props;

   
         

    return (
      <div className='flex flex-col w-full p-2 border-[1px] '>
        <div className="flex  w-full justify-center items-center mt-4">
        <Image className="flex w-44 h-16  " src={logo} alt="" />
        </div>
        <h2 className='text-xl text-center font-semibold mt-2'>COMPROVANTE</h2>
        <span className="px-2 pt-2" >Nome do Cliente:{nome}</span>
        <span className="px-2 pt-2" >Data de Devolução:{new Date().toLocaleDateString('pt-BR')}</span>
        <span className="px-2 pt-2 mx-5">Itens Devolvidos:</span>
        <ul className="list-item px-2 mx-3 font-semibold">
          <li className="p-2 mx-2 ">{material}</li>

        </ul>
        <span className="p-2">Condição do(s) Item(s):{condicao}</span>
        <div className="flex flex-row w-full">
          <div className="flex-col w-1/2 items-center justify-center" >
         
        <div className="flex  w-full py-2  ">
          <span className="flex w-10/12 border-b-[1px] p-2 border-black"></span>
        </div>
        <span className="pt-2 px-2 ">Assinatura do Recebedor</span>
          </div>

          <div className="flex-col w-1/2 items-center justify-center" >
        
        <div className="flex  w-full py-2">
          <span className="flex w-10/12 border-b-[1px] p-2 border-black"></span>
        </div>
        <span className="pt-2 px-2 ">Assinatura do Resposável pela Entrega</span>
          </div>

        </div>
      
       
        <p className=" mx-5 p-2 text-justify">Este comprovante confirma a devolução dos itens listados acima pelo cliente mencionado
           na data indicada. Os itens foram verificados quanto à sua condição e quantidade conforme
            mencionado acima.</p>
            <span className="p-2 text-center">Cedro - {new Date().toLocaleDateString('pt-BR',{
           weekday: 'long', // Dia da semana por extenso
            year: 'numeric', // Ano completo
            month: 'long', // Mês por extenso
            day: 'numeric'})}</span>
      </div>
    );
  }
}

export default DocumentTemplate;
