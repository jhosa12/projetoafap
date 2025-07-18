
import { Component, forwardRef } from 'react';
import BarCode from 'react-barcode';
import { roboto_Mono } from "@/fonts/fonts";
import Image from 'next/image';

interface DataProps {
    valor: number
    associado: string,
    contrato: number | null,
    n_doc: string,
    vencimento: Date | null,
    referencia: string
    data_pgto: Date | null,
    referente: string,
    logoUrl: string,
    cidade_uf: string,
    endereco: string
}

const array: Array<number> = [1, 2]
export const ReciboMensalidade = forwardRef<HTMLDivElement, DataProps>(({
    valor,
    associado,
    contrato,
    n_doc,
    vencimento,
    referencia,
    data_pgto,
    referente,
    logoUrl, cidade_uf, endereco
}: DataProps, ref) => {


        return (
            <div ref={ref} className={roboto_Mono.className} style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingInline: '20px', gap: '30px' }}>
               
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', borderRadius: '10px', border: '1px solid gray', padding: '20px', gap: '10px', fontSize: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'end' }}>
                            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'gray' }}>RECIBO</h1>
                            <span >Nº:  {contrato}</span>
                            <span>Valor: {Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', gap: '15px', border: '2px solid gray', paddingLeft: '20px', paddingRight: '20px', paddingTop: '5px', paddingBottom: '5px', borderRadius: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span>{`Recebi(emos) de: ${associado}`}</span>
                                {/*Mensalidade {n_doc} com referência {referencia}*/}
                                <span>Referente a: {referente} </span>
                                <span style={{ fontSize: '10px' }}>Declaro que, com este pagamento, a divida acima mencionada encontra-se quitada,<br /> </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '25%', height: '100%' }}>
                                <span style={{ fontSize: '9px', color: 'gray' }}>CARIMBO</span>
                                <div style={{ display: 'flex', border: '1px solid gray', width: '100%', height: '80px', paddingBottom: '40px' }}></div>

                                <span style={{ width: '100%', borderBottom: '1px solid gray', paddingTop: '20px' }}></span>
                                <span style={{ fontSize: '9px', color: 'gray', fontStyle: 'italic' }}>Assinatura</span>
                            </div>

                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', gap: '10px', border: '2px solid gray', padding: '20px', borderRadius: '10px' }}>
                            <span>{cidade_uf},</span>
                            <span>{data_pgto && new Date(data_pgto).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'end' }}>
                            <div style={{ fontSize: '12px', color: 'gray', display: 'flex', fontWeight: 'bold', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                {endereco} <br />
                                {cidade_uf}
                            </div>

                            {n_doc && <BarCode
                                width={2}
                                height={25}
                                fontSize={5}
                                textMargin={0}
                                margin={0}
                                marginBottom={0}
                                value={n_doc} />}

                            <img
                                //fetchPriority='high'
                                src={logoUrl}
                                alt="logo"
                                width={80}
                                height={60}
                               
                            />


                        </div>

                    </div>
             

            </div>
        )
    })