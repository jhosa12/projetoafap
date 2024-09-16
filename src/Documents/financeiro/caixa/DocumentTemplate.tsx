import Image from "next/image";
import logo from "../../../../public/novaLogo.png"

// DocumentTemplate.js

import React from 'react';
import { SomaProps, TagsProps } from "@/components/financeiro/caixa";
import { CaixaProps, CcustosProps } from "@/pages/financeiro";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";


interface DadosProps {
  tag: Array<TagsProps>,
  caixa:Array<CaixaProps>
  somaValor:SomaProps,
  ccustos:Array<CcustosProps>
  dataInical:Date,
  dataFinal:Date
}

interface ArrayGeral{
  nome:string
  lancamentos:Array<CaixaProps>
  pix:number,
  boleto:number,
  cartao:number,
  dinheiro:number,
  transferencia:number,
  deposito:number
}

class DocumentTemplate extends React.Component<DadosProps> {
  render() {
    const { tag, caixa,somaValor,ccustos,dataInical,dataFinal} = this.props;
    const teste = caixa.reduce((acumulador,atual)=>{
          const itemexistente = acumulador.find(item=>item.nome===atual.ccustos_desc)

          if(itemexistente){
            itemexistente?.lancamentos?.push(atual)
            if(atual?.mensalidade?.form_pagto==='BOLETO') itemexistente.boleto+=Number(atual.valor)
           else if (atual?.mensalidade?.form_pagto==='PIX') itemexistente.pix+=Number(atual.valor)
           else if (atual?.mensalidade?.form_pagto==='CARTAO') itemexistente.cartao+=Number(atual.valor)
           else if (atual?.mensalidade?.form_pagto==='DEPOSITO') itemexistente.deposito+=Number(atual.valor)
           else if (atual?.mensalidade?.form_pagto==='DINHEIRO') itemexistente.dinheiro+=Number(atual.valor)
           else if (atual?.mensalidade?.form_pagto==='TRANSFERENCIA') itemexistente.transferencia+=Number(atual.valor)
          }
          else{
            acumulador.push({nome:atual.ccustos_desc,
              lancamentos:[atual],
              boleto:atual?.mensalidade?.form_pagto==='BOLETO'?Number(atual.valor):0,
              pix:atual?.mensalidade?.form_pagto==='PIX'?Number(atual.valor):0,
              cartao:atual?.mensalidade?.form_pagto==='CARTAO'?Number(atual.valor):0,
              deposito:atual?.mensalidade?.form_pagto==='DEPOSITO'?Number(atual.valor):0,
              dinheiro:atual?.mensalidade?.form_pagto==='DINHEIRO'?Number(atual.valor):0,
              transferencia:atual?.mensalidade?.form_pagto==='TRANSFERENCIA'?Number(atual.valor):0
            })
          }

          return acumulador
    },[] as Array<ArrayGeral>)

    console.log(teste)
    return (
      <div className='flex flex-col w-full p-2 relative items-center '>
        <span className="absolute" style={{top:0,right:5}}>{new Date().toLocaleDateString()}</span>
        <div className="flex  w-full justify-center items-center mt-4">
          <Image className="flex w-44 h-16  " src={logo} alt="" />
        </div>
        <h2 className='text-xl text-gray-600 text-center font-semibold mt-4 '>RELATÓRIO DE MOVIMENTAÇÃO DE CAIXA</h2>
    {teste.map((item,index)=>(
     item.lancamentos.length>0 && <div>
      <div key={index} className="inline-flex w-full items-center justify-center gap-4">
           
              <span>{item.nome}</span>
            
            <span>{new Date(dataInical).toLocaleDateString('pt-BR')}-{new Date(dataFinal).toLocaleDateString('pt-BR')}</span>
        </div>
        <div className="">
              <Table theme={{head:{cell:{base:'px-2 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg'}}}}>
              <TableHead >
                <TableHeadCell>Data</TableHeadCell>
                <TableHeadCell>Método</TableHeadCell>
                <TableHeadCell>Banco</TableHeadCell>
                <TableHeadCell>Documento</TableHeadCell>
                <TableHeadCell>Histórico</TableHeadCell>
                <TableHeadCell>Valor</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y" theme={{ cell: { base: 'px-2 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg' } }}>
                {item.lancamentos.map((it) =>
                (<TableRow key={it.num_seq} className="bg-white">

                  <TableCell className="text-black">{new Date(it.datalanc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</TableCell>
                  <TableCell className="text-black">{it?.mensalidade?.form_pagto}</TableCell>
                  <TableCell className="text-black">{it?.mensalidade?.banco_dest}</TableCell>
                  <TableCell className="text-black">{it?.descricao}</TableCell>
                  <TableCell className="text-black">{it?.historico}</TableCell>

                  <TableCell className="text-black">{Number(it.valor).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}</TableCell>

                </TableRow>)
                )}
              </TableBody>
              
            </Table>
          </div> 
    
          <div className="flex w-full mt-4 justify-center mb-4 border-b-[1px] pb-1 border-black">
            <Table>
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

                  <TableCell className="text-black">{Number(item.dinheiro).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell className="text-black">{Number(item.pix).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell className="text-black">{Number(item.cartao).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell className="text-black">{Number(item.transferencia).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                  <TableCell className="text-black">{Number(item.boleto).toLocaleString('pt-BR',{
                    style:'currency',
                    currency:'BRL'
                  })}</TableCell>
                    <TableCell className="text-black">{Number(item.deposito).toLocaleString('pt-BR',{
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
