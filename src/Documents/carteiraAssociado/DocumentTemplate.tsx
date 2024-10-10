import Image from "next/image";
import carteiraDep from "../../../public/carteiraDep.jpeg";

// DocumentTemplate.js

import React from 'react';
interface DadosProps {
  dependentes: Array<Partial<{
    nome: string,
    data_nasc: Date,
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
    data_nasc: Date,
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

}


class DocumentTemplate extends React.Component<DadosProps> {

  render() {
    const { dependentes,
      contrato,
      plano,
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
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: "url('/carteiraTitular.png')",
                            pageBreakInside: 'avoid',
                            height: '230px',
                            fill: 'black',
                            width: '100%',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                        }}  className="relative inline-flex col-span-2 w-full justify-center">
        {/*  <Image alt={'carteiraDep'} height={210} width={362} src={titularFrente} className="object-cover" />
          <Image alt={'carteiraDep'} height={210} width={362} src={titularVerso} className="object-cover " />*/}
          <div className="absolute  flex flex-col justify-center items-center" style={{left:161,top:130,gap:2,width:222}}>
           <span style={{fontSize:10}}>{titular}</span> 
          
           <div className="inline-flex gap-10 ">
            <span className="font-semibold" style={{fontSize:6}}>CONTRATO: {contrato}</span>
            <span className="font-semibold" style={{fontSize:6}}>CATEGORIA: {plano}</span> 
           </div>
         
            <span className="font-semibold" style={{fontSize:7}}>{endereco} - {numero!=0 && numero}</span>
            <span className="font-semibold" style={{fontSize:7}}>{bairro}/{cidade},{uf}</span>
           {celular && <span className="font-semibold" style={{fontSize:7}}>FONE:{celular}</span>}
            <span className="font-semibold" style={{fontSize:7}}>CARTÃO VÁLIDO ATÉ:{venc.toLocaleDateString()}</span>
            </div>
          {<ol className="absolute" style={{right:110,top:50,fontSize:8,listStyleType:'decimal'}}>
           {dependentesTitular.filter(it=>!it.excluido).map(item=>(
            <li key={item.id_dependente} >{item.nome}</li>
           )) }
            </ol>}
          </div>}
          {dependentes.filter(it=>!it.excluido).map((item, index) => {
            return (
              <div key={index}
              style={{
                display: 'flex',
                backgroundRepeat: 'no-repeat',
                backgroundImage: "url('/carteiraDep.jpeg')",
                pageBreakInside: 'avoid',
                height: '230px',
                fill: 'black',
                width: '100%',
              
                backgroundSize: 'contain',
                backgroundPosition: 'center',
            }} 
               className="flex col-span-1  relative w-full  text-sm text-black items-center justify-center">

                <div className="justify-center  " style={{display:'flex',fontSize:8,flexDirection:'column',position:'absolute',bottom:20,left:150,width:200,alignItems:'center',maxWidth:220,lineHeight:2}}>
                  <div style={{margin:0,padding:0,display:'flex',flexDirection:'column',gap:1,lineHeight:1}}>
                    <span style={{fontSize:6,paddingLeft:5}}>Dependente:</span>
                  <h1 style={{fontWeight:'inherit',fontSize:10}}>{item.nome}</h1>
                  </div>
              
                <div style={{fontSize:6}} className="flex w-full justify-around">
                <span >CONTRATO: {contrato}</span>
                <span >CATEGORIA: {plano}</span>
                </div>
                <div style={{fontSize:6}} className="flex w-full justify-around">
                <span>PARENTESCO: {item.grau_parentesco}</span>
                <span >NASC.: {item.data_nasc && new Date(item.data_nasc).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                </div>
              
                <div style={{fontSize:6}} className="flex w-full justify-around">
                
                <span  >ADESÃO: {item.data_adesao && new Date(item.data_adesao).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                <span >CARÊNCIA: {item.carencia && new Date(item.carencia).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                </div>
              
              <span style={{fontStyle:'oblique'}}>Esta carteirinha é de uso individual e intransferível</span>
              <span style={{fontSize:6,fontWeight:'bold'}}  >CARTÃO VÁLIDO ATÉ:	{venc.toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
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