import Image from "next/image";
import carteiraDep from "../../../public/CarteiraDep2019.jpg";
import titularFrente from "../../../public/titular1.jpeg";
import titularVerso from "../../../public/titular2.jpeg";
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
    close: boolean,
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
      <div className="flex flex-col w-full px-2">
        <div className="grid  grid-cols-2 grid-rows-5 w-full justify-items-center gap-1">

       {cartTitular && <div className="relative inline-flex col-span-2 w-full justify-center">
          <Image alt={'carteiraDep'} height={210} width={362} src={titularFrente} className="object-cover" />
          <Image alt={'carteiraDep'} height={210} width={362} src={titularVerso} className="object-cover " />
          <div className="absolute flex flex-col justify-center items-center" style={{left:145,top:135,gap:2,width:235}}>
           <span style={{fontSize:10}}>{titular}</span> 
          
           <div className="inline-flex gap-10 ">
            <span className="font-semibold" style={{fontSize:6}}>CONTRATO: {contrato}</span>
            <span className="font-semibold" style={{fontSize:6}}>CATEGORIA: {plano}</span> 
           </div>
         
            <span className="font-semibold" style={{fontSize:7}}>{endereco} - {numero}</span>
            <span className="font-semibold" style={{fontSize:7}}>{bairro}/{cidade},{uf}</span>
            <span className="font-semibold" style={{fontSize:7}}>FONE:{celular}</span>
            <span className="font-semibold" style={{fontSize:7}}>CARTÃO VÁLIDO ATÉ:{venc.toLocaleDateString()}</span>
            </div>
          {<ol className="absolute" style={{right:110,top:50,fontSize:8,listStyleType:'decimal'}}>
           {dependentesTitular.map(item=>(
            <li key={item.id_dependente} >{item.nome}</li>
           )) }
            </ol>}
          </div>}
          {dependentes.map((item, index) => {
            return (
              <div key={index} className="flex col-span-1  relative w-full  text-sm text-black items-center justify-center">
                <Image alt={'carteiraDep'} src={carteiraDep} style={{objectFit:'cover',width:355, height:210}}/>
                <span className="absolute " style={{left:40,top:100}}>{item.nome}</span>
                <span className="absolute  " style={{left:40,top:128}}>{contrato}</span>
                <span className="absolute  " style={{left:135,top:128}}>{item.data_nasc && new Date(item.data_nasc).toLocaleDateString()
               
                }</span>
                <span className="absolute" style={{left:245,top:128}}>{item.grau_parentesco}</span>
                <span className="absolute "  style={{left:40,top:158}}>{plano}</span>
                <span className="absolute"  style={{left:40,top:185}}>{venc.toLocaleDateString()}</span>
                <span className="absolute"  style={{left:145,top:185}}>{item.data_adesao && new Date(item.data_adesao).toLocaleDateString()}</span>
                <span className="absolute" style={{left:258,top:185}}>{item.carencia && new Date(item.carencia).toLocaleDateString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default DocumentTemplate;