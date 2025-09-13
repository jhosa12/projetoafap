import { SomaProps } from "../../financeiro/_components/tabs/caixa/caixa";








export default function Sintetico({soma}:{soma: SomaProps|undefined}) {
    return (
        
      <div style={{display:'flex',flexDirection:'column',width:'100%',fontFamily:'Arial,sans-serif',paddingInline:'30px',gap:'30px'}}>

      <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <span style={{whiteSpace:'nowrap'}}>RECEITA CÉDULA</span>
        <span style={{flexGrow:1,borderBottom:'1px dotted black',margin:'0 10px'}}></span>
        <span style={{whiteSpace:'nowrap'}}>{Number(soma?.dinheiro).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
       </div>
       <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <span style={{whiteSpace:'nowrap'}}>RECEITA PIX</span>
        <span style={{flexGrow:1,borderBottom:'1px dotted black',margin:'0 10px'}}></span>
        <span style={{whiteSpace:'nowrap'}}>{Number(soma?.pix).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
       </div>
       <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <span style={{whiteSpace:'nowrap'}}>RECEITA CARTÃO</span>
        <span style={{flexGrow:1,borderBottom:'1px dotted black',margin:'0 10px'}}></span>
        <span style={{whiteSpace:'nowrap'}}>{Number(soma?.cartao).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
       </div>
       <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <span style={{whiteSpace:'nowrap'}}>RECEITA DEPÓSITO</span>
        <span style={{flexGrow:1,borderBottom:'1px dotted black',margin:'0 10px'}}></span>
        <span style={{whiteSpace:'nowrap'}}>{Number(soma?.deposito).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
       </div>

       <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <span style={{whiteSpace:'nowrap'}}>RECEITA TRANSFÊRENCIA</span>
        <span style={{flexGrow:1,borderBottom:'1px dotted black',margin:'0 10px'}}></span>
        <span style={{whiteSpace:'nowrap'}}>{Number(soma?.transferencia).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
       </div>

      <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <span style={{whiteSpace:'nowrap'}}>TOTAL DE RECEITAS</span>
        <span style={{flexGrow:1,borderBottom:'1px dotted black',margin:'0 10px'}}></span>
        <span style={{whiteSpace:'nowrap'}}>{Number(soma?.total).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
       </div>
       <div style={{display:'flex',justifyContent:'space-between',width:'100%'}}>
        <span style={{whiteSpace:'nowrap'}}>TOTAL DE DESPESAS</span>
        <span style={{flexGrow:1,borderBottom:'1px dotted black',margin:'0 10px'}}></span>
        <span style={{whiteSpace:'nowrap'}}>{Number(soma?.despesas).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
       </div>
      </div>
    )
}