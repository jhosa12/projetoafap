import Image from "next/image";
import logo from "../../../public/logoafap.png"

// DocumentTemplate.js

import React from 'react';
interface DadosProps {
 contrato:number,
 
 nome_dec:string,
 cpf_dec:string,
 endereco_dec:string,
 bairro_dec:string,
 numero_dec:number,
 cidade_dec:string,
 uf_dec:string,
 nome_falecido:string,
 data_nasc_falecido:Date,
 endereco_falecido:string,
 numero_falecido:number,
 bairro_falecido:string,
 cidade_falecido:string,
 uf_falecido:string,

}


class AutTanato extends React.Component<Partial<DadosProps>> {

  render() {
    const {
      contrato,
      nome_dec,
      cpf_dec,
      endereco_dec,
      bairro_dec,
      numero_dec,
      cidade_dec,
      uf_dec,
      nome_falecido,
      data_nasc_falecido,
      endereco_falecido,
      numero_falecido,
      bairro_falecido,
      cidade_falecido,
      uf_falecido,
     } = this.props;

    return (
      <div className='flex flex-col w-full p-2 border-[1px] '>
        <div className="inline-flex  w-full justify-start items-center mt-4">
          <Image className="flex w-44 h-16  " src={logo} alt="" />
          <div className="flex flex-col text-justify">
          <h2 style={{  }} className=' mt-4  uppercase text-start font-bold'>Assistência Familiar Paraíso</h2>
          <p className=' text-start'>CNPJ: 16.784.573/0001-93 INSC. EST.:</p>
          <p className=' text-start'>RUA ADALTO CASTELO, 393, CENTRO</p>
          <p className=' text-start'>TELEFONES: (88) 997113362 (88)992791293</p>
        </div>
        </div>
        <h2 className='flex w-full bg-gray-300 justify-center font-semibold mt-2'>FICHA DE ATENDIMENTO/AUTORIZAÇÃO DE SERVIÇO</h2>
        <div className="flex w-full justify-between">
        <span className="px-2 pt-2" >Tipo Atendimento:{}</span>
        <span className="px-2 pt-2" >Atendente:{}</span>
        </div>
      
       
        
      
    
      

     
      
      
     
    
     
      

      

      
      
     

        <h1 className='flex w-full bg-gray-300 font-semibold mt-2'>RECEBIMENTOS</h1>
       
        <div className="flex flex-row w-full p-2">
          <div className="flex flex-col w-1/2 p-2 justify-center items-center " >


            <span className="flex w-full border-b-[1px]  border-black"></span>
            <span className="pt-2  text-center ">{nome_dec}</span>
          </div>




          <div className="flex flex-col w-1/2 p-2 justify-center items-center " >
            <span className="flex w-full border-b-[1px]  border-black"></span>

            <span className="pt-2  text-center ">ASSISTEÊNCIA FAMILIAR PARAISO</span>
          </div>

        </div>

       
        <span className="p-2 text-center">Cedro - {new Date().toLocaleDateString('pt-BR', {
          weekday: 'long', // Dia da semana por extenso
          year: 'numeric', // Ano completo
          month: 'long', // Mês por extenso
          day: 'numeric'
        })}</span>
      </div>
    );
  }
}

export default AutTanato;
