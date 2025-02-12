import Image from "next/image";
import assinatura from "../../../public/assinatura.jpg"
import parse from 'html-react-parser';

// DocumentTemplate.js

import React, {  Component, useContext } from 'react';
import { AuthContext } from "@/contexts/AuthContext";
import { EmpresaProps } from "@/types/empresa";
import { SanitizeHtml } from "@/utils/sanitizeHtml";
interface DadosProps {
  nome: string,
  cpf: string,
  rg: string,
  endereco: string,
  numero: string,
  bairro: string,
  complemento: string,
  cidade: string,
  estado: string,
  adesao: Date,
  telefone: string,
  contrato: number,
  dependentes: Array<{
    nome: string,
    data_nasc: Date|null,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    sexo: string,
    saveAdd: boolean,
    excluido: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string
   
  }>
  infoEmpresa:EmpresaProps|null
}



class DocumentTemplate extends Component<DadosProps> {

  render() {
    const {
      nome,
      cpf,
      rg,
      endereco,
      infoEmpresa,
      numero,
      bairro,
      complemento,
      cidade,
      estado,
      adesao,
      telefone,
      contrato,
      dependentes
    } = this.props;





    return (
      <div className='flex flex-col w-full   text-black'>
<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <div className="flex justify-center items-center
         mt-4">
          <img style={{ width: '250px', height: '150px' }}  src={infoEmpresa?.logoUrl} alt="logo" />
        </div>
        <div style={{fontSize: '13px'}} className="flex flex-col w-full items-start">
          <h2 style={{ fontSize: '25px' }} className=' mt-4  uppercase text-center font-bold'>{infoEmpresa?.fantasia}</h2>
          <p className='text-center'>CNPJ: {infoEmpresa?.cnpj} INSC. EST.:</p>
          <p className='text-center'>{infoEmpresa?.endereco}</p>
          <p className='text-center'>TELEFONES: {infoEmpresa?.fone} {infoEmpresa?.celular}</p>
        </div>
        </div>
        <br />

        <div className="flex flex-col gap-3 w-full" style={{ fontSize: '13px' }}>
        <span  className="font-semibold ">Contrato: {contrato}</span>
        <div  className="inline-flex justify-between ">
          <span>Contratante: {nome}</span>
          <span>Data Adesão: {new Date(adesao).toLocaleDateString()}</span>
        </div>

        <div  className="inline-flex justify-between">
          <span>Endereço: {endereco}</span>
          <span>Bairro: {bairro}</span>
        </div>

        <div  className="inline-flex justify-between ">
          <span>Cidade: {cidade}</span>
          <span>Est.: {estado}</span>
          <span>Compl.: {complemento}</span>
        </div>
        <div  className="inline-flex justify-between ">
          <span>RG: {rg}</span>
          <span>CPF: {cpf}</span>
          <span>Telefone: {telefone}</span>
        </div>
        </div>
       





        <div style={{ fontSize: '12px' }} className="flex flex-col  justify-center items-center w-full">
        <h1 style={{ fontSize: '13px' }} className='text-xl text-center font-semibold mt-2'>RELAÇÃO DE DEPENDENTES</h1>
          <table className="block  text-left rtl:text-center ">
            <thead className="top-0 uppercase  ">
              <tr>
              <th scope="col" className="px-10 py-1 ">
                  
                </th>
                <th scope="col" className="px-10 py-1 ">
                  NOME
                </th>
                <th scope="col" className="px-10 py-1">
                  PARENTESCO
                </th>
                <th scope="col" className="px-10 py-1">
                  NASC.
                </th>
              </tr>
            </thead>
            <tbody className="divider-y">
              {dependentes?.filter(item=>!item.excluido)?.map((item, index) => (
                <tr key={index} className={` border-t border-black`}>
                    <td className="px-10 py-1 border-r border-black">
                    {index + 1}
                  </td>
                  <td className="px-10 py-1 border-r border-black">
                    {item.nome}
                  </td>
                  <td className="px-10 py-1 border-r border-black">
                    {item.grau_parentesco}
                  </td>
                  <td className="px-10 py-1">
                    {item.data_nasc && new Date(item.data_nasc).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div><br/>

  






        {infoEmpresa?.cont_clausuras && parse(SanitizeHtml(infoEmpresa?.cont_clausuras))}
        
        
        
        
        
        <br /><br />

       
      
          <div className="inline-flex   w-full gap-6 ">


            <div className="flex flex-col  w-1/2  justify-center items-center "style={{paddingTop:85,position:'relative'}}>
            <div  style={{position:'absolute', top:5}}>
            <Image className=" object-cover" width={300} alt="imagemAss" src={assinatura} />
            </div>
           
           
          
            <span className="absolute top-[20px] flex w-full border-b-[1px]  border-black " ></span>
            <span  style={{position:'absolute',top:85}}>CONTRATADA(O)</span>
           

            </div>
            <div className="flex flex-col w-1/2 justify-center items-center" style={{paddingTop:85,position:'relative'}}>
              <span className=" absolute top-[20px]  flex  w-full border-b-[1px] border-black "></span>
              <span  style={{position:'absolute',top:85}} >CONTRATANTE</span>
            </div>


          </div>

       
        <br /><br /><br /><br />
        <div className="inline-flex w-full gap-6 pt-8">
          <div className="flex flex-col w-1/2 justify-center items-center">
            <span className="flex w-full border-b-[1px] border-black "></span>
            <span>TESTEMUNHA</span>
          </div>
          <div className="flex flex-col w-1/2 justify-center items-center">
            <span className="flex w-full border-b-[1px] border-black "></span>
            <span>TESTEMUNHA</span>
          </div>

        </div>


      </div>
    );
  }
}

export default DocumentTemplate;
