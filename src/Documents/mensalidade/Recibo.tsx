import { MensalidadeProps } from "@/types/financeiro";
import {Component}  from 'react';
import logo from "../../../public/novaLogo.png"
import Image from "next/image";
import BarCode from 'react-barcode';

interface DataProps{
   valor:number
   associado:string,
   contrato:number,
   n_doc:string,
   vencimento:Date|null,
   referencia:string
   data_pgto:Date
}


export  class ReciboMensalidade extends Component<DataProps> {

render(){

    const {valor,associado,contrato,n_doc,vencimento,referencia,data_pgto} = this.props;


    return(
        <div style={{display:'flex',flexDirection:'column',width:'100%',paddingInline:'20px',gap:'30px'}}>
            <div style={{display:'flex', flexDirection:'column',width:'100%', borderRadius:'10px',border:'1px solid gray',padding:'20px',gap:'10px'}}>
                   <div style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'end'}}>
                        <h1 style={{fontSize:'30px',fontWeight:'bold',color:'gray'}}>RECIBO</h1>
                        <span >Nº:  {contrato}</span>
                        <span>Valor: {Number(valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
                   </div>
                   <div style={{display:'flex',flexDirection:'row',width:'100%',gap:'15px',border:'2px solid gray',paddingLeft:'20px',paddingRight:'20px',paddingTop:'5px',paddingBottom:'5px',borderRadius:'10px',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',flexDirection:'column'}}>
                    <span>{`Recebi(emos) de: ${associado}`}</span>
                    
                    <span>Referente a: Mensalidade {n_doc} com referência {referencia}</span>
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
                    <span>CEDRO,</span>
                    <span>{new Date(data_pgto).toLocaleDateString('pt-BR',{timeZone:'UTC',day:'2-digit',month:'long',year:'numeric'})}</span>
                   </div>

                   <div style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'end'}}>
                        <div style={{fontSize:'14px',color:'gray',display:'flex',fontWeight:'bold',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                           Rua Adauto Castelo, 393 <br/>
                            Centro, Cedro/CE
                            </div>

                            {n_doc && <BarCode
                                            width={2}
                                            height={25}
                                            fontSize={5}
                                            textMargin={0}
                                            margin={0}
                                            marginBottom={0}
                                            value={n_doc} />}
                            
       <Image width={100} height={100} src={logo} alt="logo"/>
  
                      
                   </div>

            </div>





            <div style={{display:'flex', flexDirection:'column',width:'100%', borderRadius:'10px',border:'1px solid gray',padding:'20px',gap:'10px'}}>
                   <div style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'end'}}>
                        <h1 style={{fontSize:'30px',fontWeight:'bold',color:'gray'}}>RECIBO</h1>
                        <span >Nº:  {contrato}</span>
                        <span>Valor: {Number(valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
                   </div>
                   <div style={{display:'flex',flexDirection:'row',width:'100%',gap:'15px',border:'2px solid gray',paddingLeft:'20px',paddingRight:'20px',paddingTop:'5px',paddingBottom:'5px',borderRadius:'10px',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',flexDirection:'column'}}>
                    <span>{`Recebi(emos) de: ${associado}`}</span>
                    
                    <span>Referente a: Mensalidade {n_doc} com referência {referencia}</span>
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
                    <span>CEDRO,</span>
                    <span>{new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})}</span>
                   </div>

                   <div style={{display:'flex',flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'end'}}>
                        <div style={{fontSize:'14px',color:'gray',display:'flex',fontWeight:'bold',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                           Rua Adauto Castelo, 393 <br/>
                            Centro, Cedro/CE
                            </div>

                            {n_doc && <BarCode
                                            width={2}
                                            height={25}
                                            fontSize={5}
                                            textMargin={0}
                                            margin={0}
                                            marginBottom={0}
                                            value={n_doc} />}
                            
       <Image width={100} height={100} src={logo} alt="logo"/>
  
                      
                   </div>

            </div>
        </div>
    )
}


}