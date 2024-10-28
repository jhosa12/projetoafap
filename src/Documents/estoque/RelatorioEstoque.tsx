import Image from "next/image";
import logo from "../../../public/novaLogo.png"

// DocumentTemplate.js

import React from 'react';

import { Table } from "flowbite-react";
import { HistoricoProps } from "@/components/estoque/historico/historico";
import { EstoqueProps } from "@/pages/estoque";


interface DadosProps {
    dados:Array<EstoqueProps> | []
    usuario:string
}





class RelatorioEstoque extends React.Component<DadosProps> {
  render() {
    const {dados,usuario} = this.props;
 
    return (
      <div className='flex flex-col w-full  gap-5 '>
       <div className="flex  w-full justify-center ">
       <Image width={100} height={100} src={logo} alt="logo"/>
       </div>
       <h1 style={{fontWeight:'bold',fontSize:'16px',textAlign:'center'}}>Relatório de Estoque</h1>
       <div className="flex flex-col gap-2">
       <span>Usuário: {usuario}</span>
       <span>Data Expedição: {new Date().toLocaleDateString('pt-BR')}</span>
       </div>

<div >
       <Table theme={{ body: { cell: { base: " px-6 py-2  text-xs text-black" } } }} >
        <Table.Head style={{fontSize:'9px'}}>
            <Table.HeadCell>EMPRESA</Table.HeadCell>
            <Table.HeadCell>PRODUTO</Table.HeadCell>
            <Table.HeadCell>QUANTIDADE</Table.HeadCell>
       
        </Table.Head>
        <Table.Body className="divide-y" >
          {dados?.map((item,index)=>(
            <Table.Row key={index} >
            <Table.Cell className="text-black">{item?.empresa}</Table.Cell>
            <Table.Cell className="text-black">{item?.produtos?.descricao}</Table.Cell>
            <Table.Cell className="text-black">{item?.quantidade}</Table.Cell>
         
        </Table.Row>
          ))  }
        </Table.Body>
       </Table>
       </div>
      </div>
    );
  }
}

export default RelatorioEstoque;
