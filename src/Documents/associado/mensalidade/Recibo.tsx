
import {Component}  from 'react';
import BarCode from 'react-barcode';
import { roboto_Mono } from "@/fonts/fonts";
import { EmpresaProps } from "@/types/empresa";

interface DataProps{
   valor:number
   associado:string,
   contrato:number|null,
   n_doc:string,
   vencimento:Date|null,
   referencia:string
   data_pgto:Date|null,
   referente:string,
   infoEmpresa:EmpresaProps|null
}

const array:Array<number> = [1,2]
export  class ReciboMensalidade extends Component<DataProps> {

render(){

    const {valor,
        associado,
        contrato,
        n_doc,
        vencimento,
        referencia,
        data_pgto,
        referente,
        infoEmpresa
    } = this.props;


    return(
        <div className={roboto_Mono.className} style={{display:'flex',flexDirection:'column',width:'100%',paddingInline:'20px',gap:'30px'}}>
           {array.map(()=>(
             <div style={{display:'flex', flexDirection:'column',width:'100%', borderRadius:'10px',border:'1px solid gray',padding:'20px',gap:'10px'}}>
             <div style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'end'}}>
                  <h1 style={{fontSize:'30px',fontWeight:'bold',color:'gray'}}>RECIBO</h1>
                  <span >Nº:  {contrato}</span>
                  <span>Valor: {Number(valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
             </div>
             <div style={{display:'flex',flexDirection:'row',width:'100%',gap:'15px',border:'2px solid gray',paddingLeft:'20px',paddingRight:'20px',paddingTop:'5px',paddingBottom:'5px',borderRadius:'10px',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',flexDirection:'column'}}>
              <span>{`Recebi(emos) de: ${associado}`}</span>
              {/*Mensalidade {n_doc} com referência {referencia}*/}
              <span>Referente a: {referente} </span>
              <span style={{fontSize:'10px'}}>Declaro que, com este pagamento, a mensalidade acima mencionada encontra-se quitada,<br/> não havendo mais valores pendentes relativos ao referido mês.</span>
              </div>
              <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width:'25%',height:'100%'}}>
                  <span style={{fontSize:'9px',color:'gray'}}>CARIMBO</span>
                     <div style={{display:'flex',border:'1px solid gray',width:'100%',height:'80px',paddingBottom:'40px'}}></div> 

                      <span style={{width:'100%',borderBottom:'1px solid gray',paddingTop:'20px'}}></span>  
                      <span style={{fontSize:'9px',color:'gray',fontStyle:'italic'}}>Assinatura</span>  
              </div>
              
             </div>
             <div style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center',width:'100%',gap:'10px',border:'2px solid gray',padding:'20px',borderRadius:'10px'}}>
              <span>{infoEmpresa?.cidade_uf},</span>
              <span>{data_pgto && new Date(data_pgto).toLocaleDateString('pt-BR',{timeZone:'UTC',day:'2-digit',month:'long',year:'numeric'})}</span>
             </div>

             <div style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'end'}}>
                  <div style={{fontSize:'12px',color:'gray',display:'flex',fontWeight:'bold',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                     {infoEmpresa?.endereco} <br/>
                      {infoEmpresa?.cidade_uf}
                      </div>

                      {n_doc && <BarCode
                                      width={2}
                                      height={25}
                                      fontSize={5}
                                      textMargin={0}
                                      margin={0}
                                      marginBottom={0}
                                      value={n_doc} />}
                      
 <img width={100} height={100} src={infoEmpresa?.logoUrl} alt="logo"/>

                
             </div>

      </div>
           ))}

        </div>
    )
}


}