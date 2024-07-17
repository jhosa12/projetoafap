import Image from "next/image";
import logo from "../../../public/logoafap.png"
import carne from "../../../public/carne.png"

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
     
        return (
            <ul className="flex flex-col w-full">
            {arrayMensalidade.map((item,index)=>(
               item.status==='A'&& <li key={item.id_mensalidade} style={{borderBottom:'1px dotted',lineHeight: '1'}} className="flex w-full relative text-black text-xs ">
                
                    <Image src={carne} className=" object-cover  h-[250px]" alt="modeloCarne" />
               
                <h1 style={{ position: 'absolute', left: "35px", top: '9px' }} >ASSISTENCIA FAMILIAR PARAÍSO</h1>
                <h1 style={{ position: 'absolute', left: "250px", top: '9px', fontWeight: 'bold' }} >ASSISTENCIA FAMILIAR PARAÍSO</h1>
                <span style={{ position: 'absolute', left: '70px', top: '42px' }}>{item.parcela_n}</span>
                <span style={{ position: 'absolute', left: '140px', top: '42px', fontWeight: 'bold' }}>{item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span>
                <span style={{ position: 'absolute', left: '140px', top: '75px', fontWeight: 'bold' }}>{item.valor_total}</span>
                <span style={{ position: 'absolute', left: '140px', top: '104px' }}>{item.valor_total}</span>
                <span style={{ position: 'absolute', left: '140px', top: '140px' }}>{new Date().toLocaleDateString('pt-BR')}</span>
                <div style={{ position: 'absolute', left: '32px', top: '172px', width: '180px' }} className="flex flex-col "  >
                    <span style={{ fontSize: '9px', fontWeight: 'bold', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.nome}</span>
                    <span style={{ fontSize: '8px', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.endereco}- {dadosAssociado.numero}</span>
                    <span style={{ fontSize: '8px', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.bairro}-{dadosAssociado.cidade}/{dadosAssociado.uf}</span>
                </div>
                <span style={{ position: 'absolute', left: '250px', top: '42px' }}>RUA ADAUTO CASTELO - 393 CENTRO CEDRO/CE</span>

                <span style={{ position: 'absolute', left: '620px', top: '42px', fontWeight: 'bold' }}>{item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</span> {/*VENCIMENTO*/}
                <span style={{ position: 'absolute', left: '720px', top: '42px' }}>{item.parcela_n}</span> {/*N PARCELA*/}
                <span style={{ position: 'absolute', left: '705px', top: '72px', fontWeight: 'bold' }}>{item.valor_total}</span> {/*Valor doc*/}
                <span style={{ position: 'absolute', left: '250px', top: '72px' }}>16.784.573/0001-93 - ASSITÊNCIA FAMILIAR PARAÍSO</span> {/*CEDENTE*/}
                <span style={{ position: 'absolute', left: '250px', top: '102px' }}>{new Date().toLocaleDateString('pt-BR')}</span> {/*DATA DOC*/}
                <span style={{ position: 'absolute', left: '380px', top: '102px' }}>{dadosAssociado.id_contrato}</span> {/*CONTRATO*/}
                <span style={{ position: 'absolute', left: '470px', top: '102px' }}>{dadosAssociado.plano}</span> {/*CONTRATO*/}
                <div style={{ position: 'absolute', left: '250px', top: '185px' }} className="flex flex-col "  >
                    <span style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.nome}</span>
                    <span style={{ fontSize: '9px', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.endereco}-{dadosAssociado.numero}</span>
                    <span style={{ fontSize: '9px', margin: '0', padding: '0', lineHeight: '1' }}>{dadosAssociado.bairro}-{dadosAssociado.cidade}/{dadosAssociado.uf}</span>
                </div>
            </li>)
    )}
            
            </ul>
        );
    }
}

export default DocumentTemplate;
