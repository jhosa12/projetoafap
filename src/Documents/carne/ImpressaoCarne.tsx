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
interface DadosProps {
    nome: string,
    id_contrato: number,
    arrayMensalidade: Array<MensalidadeProps>
}


class DocumentTemplate extends React.Component<DadosProps> {

    render() {
        const { nome, id_contrato, arrayMensalidade } = this.props;

        return (
            <div className="flex w-full relative  text-black text-xs mt-2">
                <div className="flex  w-full absolute  h-[250px] ">
                    <Image src={carne} className=" object-cover" alt="modeloCarne" />
                </div>
                <h1 style={{ position: 'absolute', left: "35px", top: '9px' }} >ASSISTENCIA FAMILIAR PARAÍSO</h1>
                <h1 style={{ position: 'absolute', left: "250px", top: '9px', fontWeight: 'bold' }} >ASSISTENCIA FAMILIAR PARAÍSO</h1>
                <span style={{ position: 'absolute', left: '70px', top: '42px' }}>101</span>
                <span style={{ position: 'absolute', left: '140px', top: '42px', fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</span>
                <span style={{ position: 'absolute', left: '140px', top: '75px', fontWeight: 'bold' }}>R$100,00</span>
                <span style={{ position: 'absolute', left: '140px', top: '104px' }}>R$100,00</span>
                <span style={{ position: 'absolute', left: '140px', top: '140px' }}>{new Date().toLocaleDateString()}</span>
                <div style={{ position: 'absolute', left: '32px', top: '172px', width: '180px' }} className="flex flex-col "  >
                    <span style={{ fontSize: '9px', fontWeight: 'bold', margin: '0', padding: '0', lineHeight: '1' }}>JOSÉ HENRIQUE BATISTA DE FREITAS</span>
                    <span style={{ fontSize: '8px', margin: '0', padding: '0', lineHeight: '1' }}>AGROVILA UBALDINHO Nº 22</span>
                    <span style={{ fontSize: '8px', margin: '0', padding: '0', lineHeight: '1' }}>VARZEA DA CONCEIÇÃO-CEDRO/CE</span>
                </div>
                <span style={{ position: 'absolute', left: '250px', top: '42px' }}>RUA ADAUTO CASTELO - 393 CENTRO CEDRO/CE</span>

                <span style={{ position: 'absolute', left: '620px', top: '42px', fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</span> {/*VENCIMENTO*/}
                <span style={{ position: 'absolute', left: '720px', top: '42px' }}>101</span> {/*N PARCELA*/}
                <span style={{ position: 'absolute', left: '705px', top: '72px', fontWeight: 'bold' }}>R$ 100,00</span> {/*VEMCIMENTO*/}
                <span style={{ position: 'absolute', left: '250px', top: '72px' }}>16.784.573/0001-93 - ASSITÊNCIA FAMILIAR PARAÍSO</span> {/*CEDENTE*/}
                <span style={{ position: 'absolute', left: '250px', top: '102px' }}>{new Date().toLocaleDateString()}</span> {/*DATA DOC*/}
                <span style={{ position: 'absolute', left: '380px', top: '102px' }}>10</span> {/*CONTRATO*/}

            </div>
        );
    }
}

export default DocumentTemplate;
