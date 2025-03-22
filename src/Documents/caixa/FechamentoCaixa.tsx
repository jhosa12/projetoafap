import Image from "next/image";
import logo from "../../../public/novaLogo.png"

// DocumentTemplate.js

import React from 'react';

import { Table } from "flowbite-react";
import { FechamentoProps } from "@/pages/dashboard/caixa";




interface DadosProps {


  fechamento: FechamentoProps,

}

class FechamentoResumo extends React.Component<DadosProps> {

  render() {
    const { fechamento } = this.props;

    return (
      <div className='flex flex-col w-full p-2   gap-5 '>
        <div className="flex  w-full justify-center ">
          <Image width={150} height={150} src={logo} alt="logo" />
        </div>
        <h1 style={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>Resumo de Caixa</h1>
        <div className="flex flex-col gap-2 pl-5 ">
          <span>Caixa: {fechamento.usuario}</span>
          <span>Data Expedição: {new Date().toLocaleDateString('pt-BR')}-{new Date().toLocaleTimeString('pt-BR')}</span>
          <span>Data Fechamento:  {new Date(fechamento.data).toLocaleDateString('pt-BR')}-{new Date(fechamento.data).toLocaleTimeString('pt-BR')}</span>
        </div>
        <div className="p-2">
          <Table theme={{ root: { shadow: 'none' }, body: { cell: { base: "px-4 py-1 " } } }}>
            <Table.Head theme={{ cell: { base: "bg-gray-50 px-4 py-1 " } }}>
              <Table.HeadCell>CÉDULA</Table.HeadCell>
              <Table.HeadCell>PIX</Table.HeadCell>
              <Table.HeadCell>CARTÃO</Table.HeadCell>
              <Table.HeadCell>TRANSFERÊNCIA</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{Number(fechamento.caixaCad.cedulas).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell>{Number(fechamento.caixaCad.pix).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell>{Number(fechamento.caixaCad.cartao).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                <Table.Cell>{Number(fechamento.caixaCad.transferencia).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>

              </Table.Row>
            </Table.Body>
          </Table>
        </div>




        <br />
        <span style={{ color: 'red' }}>Observação: {fechamento.observacao}</span>

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
