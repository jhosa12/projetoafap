import Image from "next/image";
import carteiraDep from "../../../public/carteiraDep.jpeg";

// DocumentTemplate.js

import React from 'react';
import { EmpresaProps } from "@/types/empresa";
import { space } from "postcss/lib/list";
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
  adesao:Date,
  cpf:string,
  rg:string,
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
      cartTitular,
      adesao,
      cpf,
      rg
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
                            //backgroundRepeat: 'no-repeat',
                            //backgroundImage: "url('/frenteverso.png')",
                            pageBreakInside: 'avoid',
                            height: '202px',
                            border: '1px dashed black',
                            fill: 'black',
                            width: '90%',
                            fontSize:7,
                          //  backgroundSize: 'contain',
                           // backgroundPosition: 'center',
                        }}  className="relative inline-flex col-span-2 w-full justify-center">
        {/*  <Image alt={'carteiraDep'} height={210} width={362} src={titularFrente} className="object-cover" />
          <Image alt={'carteiraDep'} height={210} width={362} src={titularVerso} className="object-cover " />*/}
                     <img
                            src="/frenteverso.png"
                            alt="Fundo do carnê"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                zIndex: -1
                            }}
                        />
<div style={{position:'absolute',fontWeight:'bold',display:'flex',flexDirection:'column',fontSize:10,top:18,left:140,lineHeight:1}}>  
                  <span>{infoEmpresa?.fantasia}</span>
                  <span>CNPJ: {infoEmpresa?.cnpj}</span>
                  <span>TELEFONES: {infoEmpresa?.fone}</span>
                </div>

                <div  style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',fontSize:9,position:'absolute',top:85,left:25,lineHeight:2,gap:13,width:'50%',fontWeight:'bold'}}>
               
                  
                  <h1 style={{fontSize:10,gridColumn: '1 / -1'}}>{titular}</h1>
                 
                 
                <span > {contrato}</span>
                <span > {adesao && new Date(adesao).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                <span  > {adesao && new Date(adesao).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>

                <div style={{gridColumn: '1 / -1',display:'flex',width:'100%',justifyContent:'space-between'}} >
                <span style={{display:'flex',width:'100%'}}>{plano}</span>
                <span style={{display:'flex',width:'100%'}}>{cpf}</span>
                </div>
              
                <span style={{gridColumn: '1 / -1'}} >{endereco}-{bairro},{cidade}</span>
                
                </div>
    
            <div style={{position:'absolute',right:260,top:30,fontSize:9,fontWeight:'bold'}}>
             
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
               // backgroundRepeat: 'no-repeat',
               // backgroundImage: "url('/dependenteCartao.png')",
                pageBreakInside: 'avoid',
                height: '202px',
                fill: 'black',
                width: '92%',
                border: '1px dashed black',
               // backgroundSize: 'contain',
               // backgroundPosition: 'center',
            }} 
               className="flex col-span-1  relative w-full  text-sm text-black items-center justify-center">
                     <img
                            src="/dependenteCartao.png"
                            alt="dependente"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                zIndex: -1
                            }}
                        />
                <div style={{position:'absolute',display:'flex',flexDirection:'column',fontSize:10,top:18,left:140,lineHeight:1,fontWeight:'bold'}}>  
                  <span>{infoEmpresa?.fantasia}</span>
                  <span>CNPJ: {infoEmpresa?.cnpj}</span>
                  <span>TELEFONES: {infoEmpresa?.fone}</span>
                </div>

                <div  style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',fontSize:9,position:'absolute',top:80,left:25,lineHeight:2,gap:15,width:'100%',fontWeight:'bold'}}>
               
                  
                  <h1 style={{fontSize:10,gridColumn: '1 / -1'}}>{item.nome}</h1>
                 
             
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