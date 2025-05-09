import { SomaProps } from "@/components/tabs/financeiro/caixa/caixa";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { roboto_Mono } from "@/fonts/fonts";
import { LancamentosProps } from "@/types/caixa";

export function Analitico({ array, soma }: { array: Array<LancamentosProps>, soma: SomaProps }) {
    const receitas = array.filter(item => item.tipo === 'RECEITA').sort((a, b) => a.lanc_id - b.lanc_id);
    const despesas = array.filter(item => item.tipo === 'DESPESA').sort((a, b) => a.lanc_id - b.lanc_id);

    return (
        <div className={roboto_Mono.className} style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '30px' }}>

            {/* RECEITAS */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <strong>RECEITAS</strong>
                    <span style={{ flexGrow: 1, borderBottom: '1px dotted black', margin: '0 5px' }}></span>
                    <span style={{ whiteSpace: 'nowrap' }}>
                        {Number(soma?.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                </div>

                <Table className="mt-1">
                   
                    <TableBody>
                        {receitas.map((item, index) => (
                            <TableRow style={{fontSize:'12px'}} key={index}>
                                <TableCell className="truncate">{item.historico}</TableCell>
                                <TableCell className="whitespace-nowrap">{item?.mensalidade?.form_pagto || '-'}</TableCell>
                                <TableCell className="whitespace-nowrap text-right">
                                    {Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* DESPESAS */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <strong style={{ whiteSpace: 'nowrap' }}>DESPESAS</strong>
                    <span style={{ flexGrow: 1, borderBottom: '1px dotted black', margin: '0 5px' }}></span>
                    <span style={{ whiteSpace: 'nowrap' }}>
                        {Number(soma?.despesas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                </div>

                <Table className="mt-1">
                   
                    <TableBody>
                        {despesas.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell >{item.historico}</TableCell>
                                <TableCell className=" text-right">
                                    {Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* SALDO FINAL */}
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ whiteSpace: 'nowrap' }}>SALDO</span>
                <span style={{ flexGrow: 1, borderBottom: '1px dotted black', margin: '0 10px' }}></span>
                <span style={{ whiteSpace: 'nowrap' }}>
                    {(soma.total - soma.despesas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
            </div>

        </div>
    );
}
