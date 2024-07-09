import Image from "next/image";
import logo from "../../../public/logoafap.png"

// DocumentTemplate.js

import React from 'react';
interface CobrancaProps{
  id_mensalidade:number,
  id_contrato:number,
  id_acordo:number,
  referencia:string,
  status:string,
  parcela_n:number,
  vencimento:Date,
  cobranca:Date,
  
  valor_principal:number,
  associado:{
      nome:string,
      endereco:string,
      bairro:string,
      numero:string,
      cidade:string,
      uf:string,
      guia_rua:string

  }
  
}
interface DadosProps{
  arrayCobranca:Array<Partial<CobrancaProps>>
}

interface RefProps{

  id_mensalidade:number,
  id_contrato:number,
  id_acordo:number,
  referencia:string,
  status:string,
  parcela_n:number,
  vencimento:Date,
  cobranca:Date,
  
  valor_principal:number,
  associado:Partial<{
      nome:string,
      endereco:string,
      bairro:string,
      numero:string,
      cidade:string,
      uf:string,
      guia_rua:string

  }>

}


class DocumentTemplate extends React.Component<DadosProps> {

  render() {
    const { arrayCobranca } = this.props;
    let formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    const novoArray =arrayCobranca.reduce((acumulador,atual)=>{
      const itemExistente = acumulador.find((item)=>item.id_contrato===atual.id_contrato);
      if(itemExistente){
           itemExistente.valor_principal= Number(itemExistente.valor_principal??0)+Number(atual.valor_principal);
           itemExistente.referencia=`${itemExistente.referencia} - ${atual.referencia}:${formatter.format(atual.valor_principal??0)}`
      }
      else{
        acumulador.push({associado:{...atual.associado},cobranca:atual.cobranca,id_acordo:atual.id_acordo,id_contrato:atual.id_contrato,id_mensalidade:atual.id_mensalidade,parcela_n:atual.parcela_n??0,referencia:`${atual.referencia}:${formatter.format(atual.valor_principal??0)}`,status:atual.status,vencimento:atual.vencimento,valor_principal:atual.valor_principal})
      }

      return acumulador

    },[] as Partial<RefProps>[])


    return (
      <div className='flex flex-col w-full p-2  '>
       
       
  
       
        <ul className="list-item px-2 mx-3 ">
          {novoArray.map((item,index)=>(

            <li className="flex flex-col p-2 mx-2 border-b-[1px] text-xs border-black">
              <span>{item.id_contrato}-{item.associado?.nome}-END.: {item.associado?.endereco}-Nº{item.associado?.numero}-BAIRRO: {item.associado?.bairro} - COMPL.: {item.associado?.guia_rua}</span>
              <span>REFERENCIA: {item.referencia} - <span className="font-semibold">TOTAL: {formatter.format(item.valor_principal??0)}</span></span>
              
              </li>
        

          ))}
      

        </ul>
     
     


       
      </div>
    );
  }
}

export default DocumentTemplate;
