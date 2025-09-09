import { EmpresaProps } from "@/types/empresa";
import React, { forwardRef } from "react";



interface Props{
    infoEmpresa: EmpresaProps|null
    titular:string,
    contrato:number
}



export const CartaNovoAssociado = forwardRef<HTMLDivElement, Props>(({ contrato, infoEmpresa, titular }, ref) => {
        return (
           <div ref={ref} style={{display:'flex',flexDirection:'column',width:'100%',gap:'50px'}}>

            <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                <img width={200} height={200} src={infoEmpresa?.logoUrl} alt="logo" />
                <div style={{display:'flex',flexDirection:'column',marginLeft:'20px',fontSize:'12px'}}>
                <h1 style={{fontSize:'20px',fontWeight:'bold'}}>{infoEmpresa?.razao_social}</h1>
                <span>Endereço: {infoEmpresa?.endereco}</span>
                <span>CNPJ: {infoEmpresa?.cnpj}</span>
                <span>Telefones: {infoEmpresa?.fone}-{infoEmpresa?.celular}</span>
                </div>
            </div>


            <div>
                <strong>Sr(a). {titular}</strong><br/><br/>
               <p> Seja bem vindo a(o) <strong>{infoEmpresa?.razao_social}</strong></p><br/>
               <p> É um enorme prazer em tê-la(o) como nossa associada(o). Temos certeza que lhe prestaremos um
atendimento de excelência.</p><br/>
<p>Com imensa satisfação estamos enviando sua carteira de associado da nossa empresa. Nela
constam os dados necessários para que possa usufruir dos benefícios de nosso plano, alem dos boletos para pagamento.</p><br/>
<span>Você é nossa associado(a) <strong>{contrato}</strong></span><br/><br/>
<p>Atenção, a apresentação desta carteira será obrigatória em qualquer atendimento.</p><br/>
</div>
           </div>
        )
});