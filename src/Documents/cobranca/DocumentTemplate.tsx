

// DocumentTemplate.js

import React, { forwardRef } from 'react';
import { UltimosPagProps } from "@/app/dashboard/cobranca/_components/cobranca/cobranca/cobranca";
import { roboto_Mono } from '@/fonts/fonts';


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
  cobrador:Array<string>,
  
  usuario:string,
  ultimosPag:Array<UltimosPagProps>
  empresa:string,
  logo:string
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
  ultimoPag:UltimosPagProps,
  
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


const DocumentTemplate = forwardRef<HTMLDivElement, DadosProps>(({ arrayCobranca, dataInicial, dataFinal, usuario, ultimosPag, cobrador, empresa, logo }, ref) => {
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
        <div ref={ref} className={`${roboto_Mono.className} flex flex-col w-full  items-center`}>
        <span className="text-xs ml-auto">{usuario}-{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        <img   width={150} height={150}  src={logo}/>
        <h1 className="font-semibold text-lg">{empresa}</h1>
        <h2 className="  font-semibold text-base">RELATÓRIO DE COBRANÇA</h2>
        <h3 className="text-xs font-medium">{new Date(dataInicial).toLocaleDateString()} a {new Date(dataFinal).toLocaleDateString()}</h3>
       
      
        <ul className="mt-4 flex flex-col w-full gap-3 ">
          {novoArray.sort((a,b)=>(a.associado?.bairro??'')?.localeCompare(b.associado?.bairro??''))?.map((item)=>{
            const arrayRef = item.referencia?.split('-')
            const tamanho = arrayRef?.length
return(
  <li key={item.id_mensalidade} className="flex flex-col gap-2  border-b-[1px] text-xs border-gray">
  <span className="inline-flex font-medium">{item.id_contrato}-{item.associado?.nome}-END.: {item.associado?.endereco}-Nº{item.associado?.numero}-BAIRRO: {item.associado?.bairro} -  COMPL.: {item.associado?.guia_rua}</span>
  <span className="block">REFERENCIA: {arrayRef && `${arrayRef[0]} até ${tamanho && arrayRef[tamanho-1]}`} - <b className="whitespace-nowrap">TOT.: {formatter.format(item.valor_principal??0)}</b></span>

    <div className='flex  w-full justify-between' >
     <span>CELULAR: {item.associado?.celular1||item.associado?.celular2||item.associado?.telefone}</span> 
      <span>NUMERO ATUAL: {'(___)__ _____-_____'}</span> 
       </div>
    

 <div className="inline-flex w-full">{item.ultimoPag && 
  <span className="whitespace-nowrap">ULTIMO PAGAMENTO: {new Date(item.ultimoPag?._max.data_pgto).toLocaleDateString('pt',{timeZone:'UTC'})}</span>} <span className="flex w-full justify-end">NOVA DATA: 
  ___/___/______</span></div> 
  <span className="flex pt-2 w-full border-b-[1px] border-black">OBSERVAÇÃO:</span>
  
  </li>


)
           

  })}
      

        </ul>
     
     <div className='flex flex-row w-full gap-4'>
     <span>CONTRATOS:{novoArray?.length}</span> 
     <span>TOTAL:{Number(novoArray?.reduce((acc,at)=>{
            acc+=Number(at.valor_principal)
            return acc
     },0)).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
      </div>


       
      </div>
    );
});

export default DocumentTemplate;
