import Image from "next/image";
import carteiraDep from "../../../public/carteiraDep.jpeg";

// DocumentTemplate.js

import React from 'react';
import { EmpresaProps } from "@/types/empresa";
interface DadosProps {
  dependentes: Array<Partial<{
    nome: string,
    data_nasc: Date | null,
    grau_parentesco: string,
    data_adesao: Date,
    carencia: Date,
    id_dependente: number,
    cad_dh: Date,
    close: boolean,
    sexo: string,
    saveAdd: boolean,
    excluido: boolean,
    dt_exclusao: Date,
    user_exclusao: string,
    exclusao_motivo: string,
    
  
  }>>
  contrato: number,
  plano:string,
  titular:string,
  endereco:string,
  numero:number|null,
  bairro:string,
  cidade:string,
  celular:string,
  uf:string,
  cartTitular:boolean
  dependentesTitular:Array<Partial<{
    nome: string,
    data_nasc: Date | null,
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
    exclusao_motivo: string,
  
  }>>
  infoEmpresa:EmpresaProps|null

}


class DocumentTemplate extends React.Component<DadosProps> {

  render() {
    const { dependentes,
      contrato,
      plano,
      infoEmpresa,
      titular,
      endereco,
      numero,
      bairro,
      cidade,
      celular,
      uf,
      dependentesTitular,
      cartTitular
    } = this.props;

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // Dia da semana por extenso
      year: 'numeric', // Ano completo
      month: 'long', // Mês por extenso
      day: 'numeric' // Dia do mês
    };
    const dataAtual = new Date();
  //  const dt = dataAtual.toLocaleDateString('pt-BR', options)
  const venc = new Date(dataAtual.getFullYear() + 1, dataAtual.getMonth(), dataAtual.getDate())

    return (
      <div className="flex flex-col w-full ">
        <div className="grid  grid-cols-2 grid-rows-5 w-full justify-items-center gap-1">

       {cartTitular && <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: "url('/frenteverso.jpg')",
                            pageBreakInside: 'avoid',
                            height: '230px',
                            color:'white',
                            fill: 'black',
                            width: '100%',
                            fontSize:7,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                        }}  className="relative inline-flex col-span-2 w-full justify-center">
        {/*  <Image alt={'carteiraDep'} height={210} width={362} src={titularFrente} className="object-cover" />
          <Image alt={'carteiraDep'} height={210} width={362} src={titularVerso} className="object-cover " />*/}

          <div style={{position:'absolute',left:42,top:85,gap:20,display:'flex',flexDirection:'column',fontWeight:'bold'}}>
            <span>.</span>
            <span>.</span>
            <span>{infoEmpresa?.celular}</span>
            <span style={{width:'63%'}}>{infoEmpresa?.endereco}</span>
          </div>
          <div className="absolute  flex flex-col  items-start" style={{left:161,top:20,gap:8,width:222}}>
           <span style={{fontSize:9,fontWeight:'bold'}}>{titular}</span> 
          
         
            <span className="font-semibold" >CONTRATO: {contrato}</span>
            <span className="font-semibold" >CATEGORIA: {plano}</span> 
            <span className="font-semibold" >ADESÃO: {contrato}</span>
            <span className="font-semibold" >CPF: {contrato}</span>
            <span className="font-semibold" >RG: {plano}</span> 
          
         
            <span className="font-semibold" >{endereco} - {numero!=0 && numero}</span>
            <span className="font-semibold" >{bairro}/{cidade},{uf}</span>
           {celular && <span className="font-semibold" >FONE:{celular}</span>}
            <span className="font-semibold" >CARTÃO VÁLIDO ATÉ: {venc.toLocaleDateString()}</span>
            </div>
            <div style={{position:'absolute',right:260,top:40,fontSize:9,fontWeight:'bold'}}>
              <span >DEPENDENTES:</span>
            {<ol className="absolute" style={{listStyleType:'decimal'}}>
           {dependentesTitular?.filter(it=>!it.excluido)?.map(item=>(
            <li style={{textWrap:'nowrap',textAlign:'left'}} key={item.id_dependente} >{item.nome}</li>
           )) }
            </ol>}
            </div>
        
          </div>}
          {dependentes.filter(it=>!it.excluido)?.map((item, index) => {
            return (
              <div key={index}
              style={{
                display: 'flex',
                backgroundRepeat: 'no-repeat',
                backgroundImage: "url('/dependenteCartao.png')",
                pageBreakInside: 'avoid',
                height: '220px',
                fill: 'black',
                width: '100%',
                color:'white',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
            }} 
               className="flex col-span-1  relative w-full  text-sm text-black items-center justify-center">

                <div style={{position:'absolute',display:'flex',flexDirection:'column',fontSize:10,top:18,left:160,lineHeight:1}}>  
                  <span>{infoEmpresa?.fantasia}</span>
                  <span>CNPJ: {infoEmpresa?.cnpj}</span>
                  <span>TELEFONES: {infoEmpresa?.fone}</span>
                </div>

                <div  style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',fontSize:9,position:'absolute',top:90,left:25,lineHeight:2,gap:17,width:'100%'}}>
               
                  
                  <h1 style={{fontWeight:'bold',fontSize:10,gridColumn: '1 / -1'}}>{item.nome}</h1>
                 
             
                <span > {contrato}</span>
                <span > {item.data_nasc && new Date(item.data_nasc).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
     
             
                <span>{item.grau_parentesco}</span>
               
                <span style={{gridColumn: '1 / -1'}} >{plano}</span>
              
              
                <span  > {venc.toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                <span  > {item.data_adesao && new Date(item.data_adesao).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                <span > {item.carencia && new Date(item.carencia).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                
              
            
           
                </div>
              
              
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default DocumentTemplate;