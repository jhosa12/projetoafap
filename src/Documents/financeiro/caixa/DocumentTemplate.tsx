import Image from "next/image";
import logo from "../../../../public/novaLogo.png"

// DocumentTemplate.js

import React from 'react';
import {  CcustosProps } from "@/pages/financeiro";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { ArrayGeral } from "@/components/financeiro/caixa/modalRelatorio";


interface DadosProps {
  caixa:Array<ArrayGeral>
  ccustos:Array<CcustosProps>
  dataInical:Date,
  dataFinal:Date
}



class DocumentTemplate extends React.Component<DadosProps> {
  render() {
    const {  caixa,ccustos,dataInical,dataFinal} = this.props;
   

    console.log('CHAMOU A IMPRESSAO')
    return (
      <div className='flex flex-col w-full p-2 relative items-center '>
        <span className="absolute" style={{top:0,right:5}}>{new Date().toLocaleDateString()}</span>
        <div className="flex  w-full justify-center items-center mt-4">
          <Image className="flex w-44 h-16  " src={logo} alt="" />
        </div>
        <h2 className='text-xl text-gray-600 text-center font-semibold mt-4 '>RELATÓRIO DE MOVIMENTAÇÃO DE CAIXA</h2>
    {caixa.map((item,index)=>(
     item.lancamentos.length>0 && <div>
      <div key={index} className="inline-flex w-full items-center justify-center gap-4">
           
              <span>{item.nome}</span>
            
            <span>{new Date(dataInical).toLocaleDateString('pt-BR')}-{new Date(dataFinal).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="">
              <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-2 py-1"}},head:{cell:{base:"px-2 py-1"}}}}>
              <TableHead >
                <TableHeadCell>Data</TableHeadCell>
                <TableHeadCell>Método</TableHeadCell>
                <TableHeadCell>Banco</TableHeadCell>
                <TableHeadCell>Documento</TableHeadCell>
                <TableHeadCell>Histórico</TableHeadCell>
                <TableHeadCell>Valor</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y" theme={{ cell: { base: 'px-2 py-2 ' } }}>
                {item.lancamentos.map((it) =>
                (<TableRow key={it.num_seq} className="bg-white text-xs text-black">

                  <TableCell >{new Date(it.datalanc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                  <TableCell >{it?.mensalidade?.form_pagto}</TableCell>
                  <TableCell >{it?.mensalidade?.banco_dest}</TableCell>
                  <TableCell >{it?.descricao}</TableCell>
                  <TableCell >{it?.historico}</TableCell>

                  <TableCell >{Number(it.valor).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}</TableCell>

                </TableRow>)
                )}
              </TableBody>
              
            </Table>
          </div> 
    
          <div className="flex w-full mt-4 justify-center mb-4 border-b-[1px] pb-1 border-black">
            <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-2 py-1"}},head:{cell:{base:"px-2 py-1"}}}}>
              <TableHead>

                <TableHeadCell>CÉDULA</TableHeadCell>
                <TableHeadCell>PIX</TableHeadCell>
                <TableHeadCell>CARTÃO</TableHeadCell>
                <TableHeadCell>TRANSFERÊNCIA</TableHeadCell>
                <TableHeadCell>BOLETO</TableHeadCell>
                <TableHeadCell>DEPOSITO</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y" theme={{ cell: { base: 'px-2 py-2' } }}>
             
                <TableRow className="bg-white text-black">

                  <TableCell >{Number(item.dinheiro).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell >{Number(item.pix).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell >{Number(item.cartao).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell >{Number(item.transferencia).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell >{Number(item.boleto).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                    <TableCell >{Number(item.deposito).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>

                  

                </TableRow>
                
              </TableBody>
              
            </Table>
          </div>
          </div>))}
      </div>
    );
  }
}

export default DocumentTemplate;
