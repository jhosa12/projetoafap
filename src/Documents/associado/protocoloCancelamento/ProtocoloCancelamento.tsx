

import React from "react";
import { EmpresaProps } from "@/types/empresa";
import { timesNewRoman } from "@/fonts/fonts";


interface Props{
    infoEmpresa: EmpresaProps|null
    titular:string,
    contrato:number,
    cpf:string,
    endereco:string,
    bairro:string,
    cidade:string,
    usuario:string
}



export class ProtocoloCancelamento extends React.Component<Props> {


    render(){
        const {contrato,infoEmpresa,titular,bairro,cidade,endereco,cpf,usuario} = this.props
        return (
           <div style={{display:'flex',flexDirection:'column',width:'100%',gap:'50px'}} className={timesNewRoman.className}>

            <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                <img width={200} height={200} src={infoEmpresa?.logoUrl} alt="logo" />
                <div style={{display:'flex',flexDirection:'column',marginLeft:'20px',fontSize:'12px'}}>
                <h1 style={{fontSize:'20px',fontWeight:'bold'}}>{infoEmpresa?.razao_social}</h1>
                <span>Endereço: {infoEmpresa?.endereco}</span>
                <span>CNPJ: {infoEmpresa?.cnpj}</span>
                <span>Telefones: {infoEmpresa?.fone}-{infoEmpresa?.celular}</span>
                </div>
            </div>


            <div style={{display:'flex',flexDirection:'column',width:'100%',gap:'10px'}}>
                <strong style={{textAlign:'center',fontSize:'20px'}}>TERMO DE CANCELAMENTO</strong><br/><br/>
               <p>Pelo presente instrumento, eu, {titular}, CPF/CNPJ nº {cpf}, residente/endereço {endereco}-{bairro}-{cidade}, titular do plano/serviço de contrato nº {contrato}, venho por meio deste solicitar o cancelamento do referido serviço, ciente e de acordo com as condições abaixo:</p><br/>
               <p>1.Declaro que a partir da data de assinatura deste termo, não poderei mais usufruir dos benefícios, vantagens ou qualquer outro direito relacionado ao plano/serviço contratado.<br/><br/>
2.Estou ciente de que, caso haja valores pendentes, estes deverão ser quitados conforme os termos do contrato vigente.<br/><br/>
3.Reconheço que eventuais taxas ou multas por cancelamento antecipado (se aplicáveis) serão cobradas de acordo com as condições previamente acordadas no contrato.<br/><br/>
4.Confirmo que recebi todas as informações necessárias sobre o cancelamento e seus efeitos, não restando dúvidas quanto às implicações desta solicitação.<br/><br/>
5.Autorizo expressamente a rescisão do contrato, abrindo mão de qualquer reivindicação futura relacionada ao plano/serviço ora cancelado.</p><br/>
<p>Por estar de acordo com todas as cláusulas acima, firmo o presente termo de cancelamento.</p><br/>


</div>


<div style={{display:'flex',justifyContent:'space-between',width:'100%',marginTop:'50px',fontSize:'16px'}} >
         <div className="flex flex-col w-1/2 p-2 justify-center items-center " >
                        <span className="flex w-full border-b-[1px]  border-black"></span>

                        <span className="pt-2  text-center italic">Assinatura do Cliente</span>
                      
                    </div>

                    <div className="flex flex-col w-1/2 p-2 justify-center items-center " >
                        <span className="flex w-full border-b-[1px]  border-black"></span>

                        <span className="pt-2  text-center italic">Assinatura do Representante da Empresa</span>
                        
                    </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <span>{infoEmpresa?.cidade_uf}</span>
                    <span>{new Date().toLocaleDateString('pt-BR')}-{new Date().toLocaleTimeString('pt-BR')}</span>
                    <span>{usuario}</span>
          </div>
           </div>
        )
    }

}