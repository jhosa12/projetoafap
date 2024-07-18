import Image from "next/image";
import logo from "../../../public/logoafap.png"
import carne from "../../../public/carneAtualizado.png"
import BarCode from 'react-barcode';

// DocumentTemplate.js

import React from 'react';


interface MensalidadeProps {
    id_usuario: number,
    id_contrato: number,
    estorno_dt: Date,
    estorno_user: string,
    dt_exclusao: Date,
    exclusao_motivo: string,
    user_exclusao: string,
    associado: string,
    n_doc: string,
    parcela_n: number,
    vencimento: Date,
    cobranca: Date,
    valor_principal: number,
    close: boolean,
    status: string,
    usuario: string,
    id_mensalidade: number,
    valor_total: number,
    motivo_bonus: string,
    data_pgto: Date,
    referencia: string,
    index: number,
    id_acordo: number

}
interface DadosAssociado{
    nome:string,
    endereco:string,
    plano:string
    bairro:string,
    numero:number,
    cidade:string
    uf:string,
    id_contrato:number
}
interface DadosProps {
    dadosAssociado:DadosAssociado
    arrayMensalidade: Array<Partial<MensalidadeProps>>
}


class DocumentTemplate extends React.Component<DadosProps> {

    render() {
        const { dadosAssociado, arrayMensalidade } = this.props;
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });
        return (
            <ul className="flex flex-col w-full justify-center items-center pt-4">
            {arrayMensalidade.map((item,index)=>(
               item.status==='A'&& <li key={item.id_mensalidade} style={{display:'block',position:'relative',borderBottom:'1px dotted',lineHeight: '1'}} className="flex w-full  text-black text-xs ">
                
                    <Image src={carne} className=" object-cover  h-[250px]" alt="modeloCarne"  />
               
                <h1 style={{fontSize:'13px', position: 'absolute', left: "45px", top: '19px' }} >ASSISTENCIA FAMILIAR PARAÍSO</h1>
                <h1 style={{fontSize:'13px', position: 'absolute', left: "330px", top: '19px', fontWeight: 'bold' }} >ASSISTENCIA FAMILIAR PARAÍSO</h1>
                <span style={{ position: 'absolute', left: '100px', top: '62px' }}>{item.parcela_n}</span>
                <span style={{ position: 'absolute', left: '170px', top: '62px', fontWeight: 'bold' }}>{item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                <span style={{ position: 'absolute', left: '170px', top: '105px', fontWeight: 'bold' }}>{formatter.format(Number(item.valor_principal))}</span>
                {/*<span style={{ position: 'absolute', left: '140px', top: '104px' }}>{item.valor_principal}</span>*/}
                <span style={{ position: 'absolute', left: '170px', top: '190px' }}>{new Date().toLocaleDateString('pt-BR')}</span>
                <div style={{ position: 'absolute', left: '45px', top: '230px', width: '180px' }} className="flex flex-col "  >
                    <span style={{ fontSize: '9px', fontWeight: 'bold', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.nome}</span>
                    <span style={{ fontSize: '8px', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.endereco}- {dadosAssociado.numero}</span>
                    <span style={{ fontSize: '8px', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.bairro}-{dadosAssociado.cidade}/{dadosAssociado.uf}</span>
                </div>
                <span style={{ position: 'absolute', left: '330px', top: '62px' }}>RUA ADAUTO CASTELO - 393 CENTRO CEDRO/CE</span>

                <span style={{ position: 'absolute', left: '810px', top: '62px', fontWeight: 'bold' }}>{item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span> {/*VENCIMENTO*/}
                <span style={{ position: 'absolute', left: '940px', top: '62px' }}>{item.parcela_n}</span> {/*N PARCELA*/}
                <span style={{ position: 'absolute', left: '940px', top: '102px', fontWeight: 'bold' }}>{formatter.format(Number(item.valor_principal))}</span> {/*Valor doc*/}
                <span style={{ position: 'absolute', left: '330px', top: '102px' }}>16.784.573/0001-93 - ASSITÊNCIA FAMILIAR PARAÍSO</span> {/*CEDENTE*/}
                <span style={{ position: 'absolute', left: '360px', top: '142px' }}>{new Date().toLocaleDateString('pt-BR')}</span> {/*DATA DOC*/}
                <span style={{ position: 'absolute', left: '490px', top: '142px' }}>{dadosAssociado.id_contrato}</span> {/*CONTRATO*/}
                <span style={{ position: 'absolute', left: '600px', top: '142px' }}>{dadosAssociado.plano}</span> {/*CONTRATO*/}
                <span style={{ position: 'absolute', left: '150px', top: '315px',fontSize:'14px',fontWeight:'bold' }}>{dadosAssociado.id_contrato}</span>
                <div style={{ position: 'absolute', left: '330px', top: '235px' }} className="flex flex-col "  >
                    <span style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.nome}</span>
                    <span style={{ fontSize: '9px', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.endereco}-{dadosAssociado.numero}</span>
                    <span style={{ fontSize: '9px', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.bairro}-{dadosAssociado.cidade}/{dadosAssociado.uf}</span>
                </div>
                <div  style={{display:'flex', flexDirection:'column',position: 'absolute', left: '330px', top: '182px',zIndex:2 }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', padding: '0', lineHeight: '1' }}>PIX: 16.784.573/0001-93</span>
                    <span style={{ fontSize: '9px', margin: '0', padding: '0', lineHeight: '1' }}>TITULAR FREITAS NETO COMERCIO E SERVIÇO- LTDA-ME</span>
                    <span style={{ fontSize: '9px', margin: '0', padding: '0', lineHeight: '1',fontStyle:'italic' }}>MANTENHA SEU PLANO DE EM DIA</span>
                </div>
               
                <div style={{position: 'absolute', left: '720px', top: '290px',width:'300px',height:'30px',zIndex:2 }}>
                    {item.n_doc && <BarCode
                     width={3}
                      height={30} 
                      fontSize={10}
                      textMargin={0}
                      margin={0}
                    
                      value={item.n_doc}/>}
                  
                </div>
            </li>)
    )}
            
            </ul>
        );
    }
}

export default DocumentTemplate;
