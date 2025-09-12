import Image from "next/image";
import logo from "../../../../../../public/novaLogo.png"
import { MdOutlineCheckBox } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
// DocumentTemplate.js

import React from 'react';
interface DadosProps {
 contrato:number,
 
 nome_dec:string,
 cpf_dec:string,
 rg_dec:string,
 endereco_dec:string,
 bairro_dec:string,
 numero_dec:number,
 cidade_dec:string,
 uf_dec:string,
 nome_falecido:string,
 data_nasc_falecido:Date|null,
 endereco_falecido:string,
 numero_falecido:number,
 bairro_falecido:string,
 cidade_falecido:string,
 uf_falecido:string,
 autorizado:boolean

}


class AutTanato extends React.Component<Partial<DadosProps>> {

  render() {
    const {
      contrato,
      autorizado,
      nome_dec,
      cpf_dec,
      rg_dec,
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
        <div className="flex flex-col  w-full justify-center items-center mt-4">
          <Image className="flex w-40 h-14  " src={logo} alt="" />
          <div className="flex flex-col justify-center">
          <h2 style={{  }} className=' mt-4  uppercase text-center font-bold'>Assistência Familiar Paraíso</h2>
          <p className=' text-center'>CNPJ: 16.784.573/0001-93</p>
          {/*<p className=' text-center'>RUA ADALTO CASTELO, 393, CENTRO</p>*/}
         {/* <p className=' text-center'>TELEFONES: (88) 997113362 (88)992791293</p>*/ }
        </div>
        </div>
        <br/>
        <br/>
        <h2 className='flex w-full bg-gray-300 justify-center font-semibold mt-2'>AUTORIZAÇÃO PARA PROCEDIMENTO DE TANATOPRAXIA</h2>
        <br/>
      <p style={{padding:'12px'}}>Eu {nome_dec} CPF: {cpf_dec} RG:{rg_dec} , end.: {endereco_dec}, ,
{bairro_dec},{cidade_dec}-{numero_dec??''}, declarante responsável pelo falecido (a) <b>{nome_falecido}</b>, declaração de óbito nº . Declaro que:</p>
       
       <div className="inline-flex justify-start items-start w-full">
       {autorizado? <MdOutlineCheckBox size={30} className="fixed"/>:  <MdCheckBoxOutlineBlank  className="fixed" size={30}/>}
       <p style={{paddingTop:'4px',marginLeft:'30px'}}>
       Autorizo o procedimento de <b>tanatopraxia</b>, no corpo (a) falecido (a) acima
citado, o qual será realizado pelo laboratório <b>ASSISTÊNCIA FAMILIAR PARAÍSO</b>
       </p>
       </div>
<br/>

       <div className="inline-flex  items-center w-full">
      {autorizado ? <MdCheckBoxOutlineBlank  className="fixed" size={30}/>:<MdOutlineCheckBox size={30} className="fixed"/>}
       <p style={{paddingTop:'4px',marginLeft:'30px'}}>
       Não autorizo a realização do procedimento tanatopraxia.
       </p>
       </div>
       <br/>
       <br/>
       <br/>
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
