import { SomaProps } from "@/components/tabs/financeiro/caixa/caixa";
import { roboto_Mono } from "@/fonts/fonts";
import { LancamentosProps } from "@/types/caixa";






export function Analitico({ array, soma }: { array: Array<LancamentosProps>, soma: SomaProps }) {
        return (
                <div className={roboto_Mono.className} style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '30px' }}>
                        <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <strong>RECEITAS</strong>
                                        <span style={{ flexGrow: 1, borderBottom: '1px dotted black', margin: '0 10px' }}></span>
                                        <span style={{ whiteSpace: 'nowrap' }}>{Number(soma?.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                                        <ul style={{display:'flex',flexDirection:'column',gap:'8px',marginTop:'14px'}}>
                                        {array?.sort((a, b) => a.lanc_id - b.lanc_id)?.map((item, index) => (
                                        item.tipo === 'RECEITA' && <li key={index} style={{ display: 'flex', fontSize: '13px', justifyContent: 'space-between', width: '100%',borderBottom:'1px solid gray'}}>
                                                <span className="truncate" style={{ whiteSpace: 'nowrap' }}>{item.historico}</span>
                                                <span style={{ whiteSpace: 'nowrap' }}>{item?.mensalidade?.form_pagto}</span>
                                                <span style={{ whiteSpace: 'nowrap' }}>{Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                        </li>
                                ))}
                                        </ul>
                               
                        </div>


                        <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                        <strong style={{ whiteSpace: 'nowrap' }}>DESPESAS</strong>
                                        <span style={{ flexGrow: 1, borderBottom: '1px dotted black', margin: '0 10px' }}></span>
                                        <span style={{ whiteSpace: 'nowrap' }}>{Number(soma?.despesas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                                <ul style={{display:'flex',flexDirection:'column',gap:'8px',marginTop:'14px'}}>
                                {array.sort((a, b) => a.lanc_id - b.lanc_id)?.map((item, index) => (
                                        item.tipo === 'DESPESA' && <li key={index} style={{ display: 'flex', fontSize: '13px', justifyContent: 'space-between', width: '100%',borderBottom:'1px solid gray' }}>
                                                <span className="truncate" style={{ whiteSpace: 'nowrap' }}>{item.historico}</span>
                                                <span style={{ whiteSpace: 'nowrap' }}>{Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                        </li>
                                ))}
                                </ul>
                           
                        </div>


                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span style={{ whiteSpace: 'nowrap' }}>SALDO</span>
                                <span style={{ flexGrow: 1, borderBottom: '1px dotted black', margin: '0 10px' }}></span>
                                <span style={{ whiteSpace: 'nowrap' }}>{Number(soma.total - soma.despesas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>

                </div>


        )
}