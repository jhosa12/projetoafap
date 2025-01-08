import Image from "next/image";
import logo from "../../../public/novaLogo.png"

// DocumentTemplate.js

import React from 'react';

import { Table } from "flowbite-react";
import { LancamentosProps } from "@/pages/caixa";
import { SomaProps } from "@/components/financeiro/caixa/caixa";
import Sintetico from "./sintetico";
import { Analitico } from "./analitico";


interface DadosProps {
  tipoRelatorio: string,
  usuario: string,
  soma: SomaProps,
  array: Array<LancamentosProps>,
  startDate: Date,
  endDate: Date
}

class FechamentoResumo extends React.Component<DadosProps> {


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
    const { startDate, endDate, usuario, soma, tipoRelatorio } = this.props;


    return (
      <div className='flex flex-col w-full p-2   gap-5 '>
        <div className="flex  w-full justify-center ">
          <Image width={150} height={150} src={logo} alt="logo" />
        </div>
        <h1 style={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>Resumo de Caixa</h1>
        <div className="flex flex-col gap-2 pl-5 ">
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

export default FechamentoResumo;
