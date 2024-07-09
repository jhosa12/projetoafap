import Image from "next/image";
import logo from "../../../public/logoafap.png"

// DocumentTemplate.js

import React from 'react';
import { Usuario } from "@/components/configuracoes/usuarios/usuario";
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
      guia_rua:string,
      telefone:string,
      celular1:string,
      celular2:string

  }
  
}
interface DadosProps{
  arrayCobranca:Array<Partial<CobrancaProps>>,
  dataInicial:Date,
  dataFinal:Date,
  todos:boolean,
  status:Array<string>,
  cobrador:Array<string>,
  bairros:Array<Partial<{bairro:string,check:boolean}>>
  usuario:string,
  ultimosPag:Array<UltimosPagProsps>
}

interface UltimosPagProsps{
  id_contrato:number,
  _max:{data_pgto:Date}
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
  ultimoPag:UltimosPagProsps,
  
  valor_principal:number,
  associado:Partial<{
      nome:string,
      endereco:string,
      bairro:string,
      numero:string,
      cidade:string,
      uf:string,
      guia_rua:string,
      telefone:string,
      celular1:string,
      celular2:string

  }>

}


class DocumentTemplate extends React.Component<DadosProps> {

  render() {
    const { arrayCobranca,dataInicial,dataFinal,usuario,ultimosPag } = this.props;
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
        acumulador.push({associado:{...atual.associado},cobranca:atual.cobranca,id_acordo:atual.id_acordo,id_contrato:atual.id_contrato,id_mensalidade:atual.id_mensalidade,parcela_n:atual.parcela_n??0,referencia:`${atual.referencia}:${formatter.format(atual.valor_principal??0)}`,status:atual.status,vencimento:atual.vencimento,valor_principal:atual.valor_principal,ultimoPag:ultimosPag.find(item=>item.id_contrato===atual.id_contrato)})

      }

      return acumulador

    },[] as Partial<RefProps>[])


    return (
      <div className='flex flex-col w-full p-2  items-center  '>
        <span className="text-xs ml-auto">{usuario}-{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        <h1 className="font-semibold text-lg">ASSISTÊNCIA FAMILIAR PARAÍSO
         
        </h1>
        <h1 className="  font-semibold text-base">RELATÓRIO DE COBRANÇA</h1>
        <h2 className="text-xs font-medium">{new Date(dataInicial).toLocaleDateString()} a {new Date(dataFinal).toLocaleDateString()}</h2>
       
       
  
       
        <ul className="list-item px-2 mx-3 ">
          {novoArray.map((item,index)=>(

            <li key={item.id_mensalidade} className="flex flex-col p-2 mx-2 border-b-[1px] text-xs border-black">
              <span className="inline-flex">{item.id_contrato}-{item.associado?.nome}-END.: {item.associado?.endereco}-Nº{item.associado?.numero}-BAIRRO: {item.associado?.bairro} -  COMPL.: {item.associado?.guia_rua}</span>
              <span className="block">REFERENCIA: {item.referencia} - <b className="whitespace-nowrap">TOT.: {formatter.format(item.valor_principal??0)}</b></span>
              {item.associado?.celular1&&<span>CELULAR: {item.associado?.celular1}</span>}

             <span className="inline-flex w-full">{item.ultimoPag && 
              <span className="whitespace-nowrap">ULTIMO PAGAMENTO: {new Date(item.ultimoPag?._max.data_pgto).toLocaleDateString('pt',{timeZone:'UTC'})}</span>} <span className="flex w-full justify-end">NOVA DATA: 
              ___/___/______</span></span> 
              
              </li>
        

          ))}
      

        </ul>
     
     


       
      </div>
    );
  }
}

export default DocumentTemplate;
