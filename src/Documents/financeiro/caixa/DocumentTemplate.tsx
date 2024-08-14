import Image from "next/image";
import logo from "../../../../public/novaLogo.png"

// DocumentTemplate.js

import React from 'react';
import { SomaProps, TagsProps } from "@/components/financeiro/caixa";
import { CaixaProps, CcustosProps } from "@/pages/financeiro/login";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";


interface DadosProps {
  tag: Array<TagsProps>,
  caixa:Array<CaixaProps>
  somaValor:SomaProps,
  ccustos:Array<CcustosProps>
  dataInical:Date,
  dataFinal:Date
}

class DocumentTemplate extends React.Component<DadosProps> {
  render() {
    const { tag, caixa,somaValor,ccustos,dataInical,dataFinal} = this.props;

    return (
      <div className='flex flex-col w-full p-2 relative items-center '>
        <span className="absolute" style={{top:0,right:5}}>{new Date().toLocaleDateString()}</span>
        <div className="flex  w-full justify-center items-center mt-4">
          <Image className="flex w-44 h-16  " src={logo} alt="" />
        </div>
        <h2 className='text-xl text-gray-600 text-center font-semibold mt-4 '>RELATÓRIO DE MOVIMENTAÇÃO DE CAIXA</h2>
        <div className="inline-flex w-full items-center justify-center gap-4">
            {ccustos.map(item=>(
              <span>{item.descricao}</span>
            ))}
            <span>{new Date(dataInical).toLocaleDateString('pt-BR')}-{new Date(dataFinal).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="">
            <Table >
              <TableHead>
                <TableHeadCell>Data</TableHeadCell>
                <TableHeadCell>Método</TableHeadCell>
                <TableHeadCell>Banco</TableHeadCell>
                <TableHeadCell>Documento</TableHeadCell>
                <TableHeadCell>Histórico</TableHeadCell>
                <TableHeadCell>Valor</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y" theme={{ cell: { base: 'px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg' } }}>
                {caixa.map((item) =>
                (<TableRow className="bg-white">

                  <TableCell className="text-black">{new Date(item.datalanc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                  <TableCell className="text-black">{item.mensalidade.form_pagto}</TableCell>
                  <TableCell className="text-black">{item.mensalidade.banco_dest}</TableCell>
                  <TableCell className="text-black">{item.descricao}</TableCell>
                  <TableCell className="text-black">{item.historico}</TableCell>

                  <TableCell className="text-black">{Number(item.valor).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}</TableCell>

                </TableRow>)
                )}
              </TableBody>
              
            </Table>
          </div>
          <h2 className='text-xl text-gray-600 text-center font-semibold mt-4'>RESUMO</h2>
          <div className="">
            <Table border={0}>
              <TableHead>

                <TableHeadCell>CÉDULA</TableHeadCell>
                <TableHeadCell>PIX</TableHeadCell>
                <TableHeadCell>CARTÃO</TableHeadCell>
                <TableHeadCell>TRANSFERÊNCIA</TableHeadCell>
                <TableHeadCell>BOLETO</TableHeadCell>
                <TableHeadCell>DEPOSITO</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y" theme={{ cell: { base: 'px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg' } }}>
             
                <TableRow className="bg-white">

                  <TableCell className="text-black">{Number(somaValor.dinheiro).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell className="text-black">{Number(somaValor.pix).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell className="text-black">{Number(somaValor.cartao).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell className="text-black">{Number(somaValor.transferencia).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell className="text-black">{Number(somaValor.boleto).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                    <TableCell className="text-black">{Number(somaValor.deposito).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>

                  

                </TableRow>
                
              </TableBody>
              
            </Table>
          </div>
      </div>
    );
  }
}

export default DocumentTemplate;
