import Image from "next/image";
import logo from "../../../public/novaLogo.png"

// DocumentTemplate.js

import React from 'react';

import { Table } from "flowbite-react";

import { SomaProps } from "@/components/tabs/financeiro/caixa/caixa";
import Sintetico from "./sintetico";
import { Analitico } from "./analitico";
import { roboto_Mono } from "@/fonts/fonts";
import { EmpresaProps } from "@/types/empresa";
import { LancamentosProps } from "@/types/caixa";


interface DadosProps {
  tipoRelatorio: string,
  usuario: string,
  soma: SomaProps,
  array: Array<LancamentosProps>,
  startDate: Date,
  endDate: Date,
  infoEmpresa:EmpresaProps|null
}

class RelatorioMovimentacao extends React.Component<DadosProps> {


  /* gerarRelatorioSintetico = ():{cedula:number,pix:number,cartao:number,transferencia:number} => {
         const {array} = this.props;
         let totais ={
           cedula:0,
           pix:0,
           cartao:0,
           transferencia:0
         }
 
         array.forEach(lancamento => {
           const valor = Number(lancamento?.valor)
           switch (lancamento.mensalidade?.form_pagto) {
             case 'DINHEIRO':
               totais.cedula += valor;
               break;
             case 'PIX':
               totais.pix += valor;
               break;
             case 'CARTAO':
               totais.cartao += valor;
               break;
             case 'TRANSFERENCIA':
               totais.transferencia += valor;
               break;
             default:
               break;
           }
         });
     
         return totais;
   }*/



  render() {
    const { startDate, endDate, usuario, soma, tipoRelatorio,infoEmpresa } = this.props;


    return (
      <div className={roboto_Mono.className} style={{display: 'flex', flexDirection: 'column',padding:8,gap:20}} >
        <div className="flex  w-full justify-center ">
          <img width={150} height={150} src={infoEmpresa?.logoUrl} alt="logo" />
        </div>
        <h1 style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>Relatório de Movimentação de Caixa</h1>
        <div style={{fontSize:'14px'}} className="flex flex-col gap-1 ">
          <span>Usuário: {usuario}</span>
          <span>Data Expedição: {new Date().toLocaleDateString('pt-BR')}</span>
          <span>Periodo do Caixa:  {new Date(startDate).toLocaleDateString('pt-BR')} -  {new Date(endDate).toLocaleDateString('pt-BR')}</span>
        </div>


        {tipoRelatorio === 'SINTETICO' && <Sintetico soma={soma} />}

        {tipoRelatorio === 'ANALITICO' && <Analitico array={this.props.array} soma={soma} />}

        {/*<div className="p-2">
       <Table>
        <Table.Head>
            <Table.HeadCell>CÉDULA</Table.HeadCell>
            <Table.HeadCell>PIX</Table.HeadCell>
            <Table.HeadCell>CARTÃO</Table.HeadCell>
            <Table.HeadCell>TRANSFERÊNCIA</Table.HeadCell>
        </Table.Head>
        <Table.Body>
            <Table.Row>
                <Table.Cell>{Number(soma.dinheiro).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
                <Table.Cell>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
                <Table.Cell>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
                <Table.Cell>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>

            </Table.Row>
        </Table.Body>
       </Table>
       </div>*/}


       

        <br />
    

        <div className="flex flex-col items-center gap-5">
          {/*   <div className="flex flex-col items-center">
        <div style={{width:160,height:75,borderWidth:'1px',borderColor:'black'}}></div>
        <span style={{fontStyle:'italic'}}>Carimbo</span>
        </div>*/}
          <div className="flex flex-col items-center">
            <span>___________________________________________________</span>
            <span style={{ fontStyle: 'italic' }}>Assinatura</span>
          </div>



        </div>
      </div>
    );
  }
}

export default RelatorioMovimentacao;
