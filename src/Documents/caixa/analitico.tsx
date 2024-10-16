import { SomaProps } from "@/components/financeiro/caixa/caixa";
import { LancamentosProps } from "@/pages/caixa";





export function Analitico({array,soma}:{array:Array<LancamentosProps>,soma:SomaProps}) {
    return(
       

            <div style={{display:'flex',flexDirection:'column',width:'100%',fontFamily:'Arial,sans-serif',paddingInline:'30px',gap:'30px'}}>
                <div>     
                <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <span style={{whiteSpace:'nowrap'}}>RECEITAS</span>
        <span style={{flexGrow:1,borderBottom:'1px dotted black',margin:'0 10px'}}></span>
        <span style={{whiteSpace:'nowrap'}}>{Number(soma.total).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
       </div>
    
        {array.map((item,index)=>(
           item.tipo === 'RECEITA' && <div key={index} style={{display:'flex',fontSize:'12px',justifyContent:'space-between',width:'100%'}}>
                <span style={{whiteSpace:'nowrap'}}>{item.historico}</span>
                <span style={{whiteSpace:'nowrap'}}>{item?.mensalidade?.form_pagto}</span>
                <span style={{whiteSpace:'nowrap'}}>{Number(item.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
           </div>
        ))}
                </div>


                <div>     
                <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <span style={{whiteSpace:'nowrap'}}>DESPESAS</span>
        <span style={{flexGrow:1,borderBottom:'1px dotted black',margin:'0 10px'}}></span>
        <span style={{whiteSpace:'nowrap'}}>{Number(soma.despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
       </div>
    
        {array.map((item,index)=>(
           item.tipo === 'DESPESA' && <div key={index} style={{display:'flex',fontSize:'12px',justifyContent:'space-between',width:'100%'}}>
                <span style={{whiteSpace:'nowrap'}}>{item.historico}</span>
                <span style={{whiteSpace:'nowrap'}}>{Number(item.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
           </div>
        ))}
                </div>


                <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <span style={{whiteSpace:'nowrap'}}>SALDO</span>
        <span style={{flexGrow:1,borderBottom:'1px dotted black',margin:'0 10px'}}></span>
        <span style={{whiteSpace:'nowrap'}}>{Number(soma.total-soma.despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
       </div>
      
            </div>

        
    )
}