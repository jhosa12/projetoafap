import Image from "next/image";
import logo from "../../../public/novaLogo.png"

// DocumentTemplate.js

import React from 'react';

import { Table } from "flowbite-react";
import { HistoricoProps } from "@/components/estoque/historico/historico";


interface DadosProps {
    dados:Partial< HistoricoProps>
}





class RelatorioMov extends React.Component<DadosProps> {
  render() {
    const {dados} = this.props;
 
    return (
      <div className='flex flex-col w-full p-2   gap-5 '>
       <div className="flex  w-full justify-center ">
       <Image width={150} height={150} src={logo} alt="logo"/>
       </div>
       <h1 style={{fontWeight:'bold',fontSize:'25px',textAlign:'center'}}>Relatório de Movimentação</h1>
       <div className="flex flex-col gap-2 pl-5 ">
       <span>Usuário: {dados.usuario}</span>
       <span>Data Expedição: {new Date().toLocaleDateString('pt-BR')}</span>
       <span>Data Movimentação:  {dados.data &&new Date(dados.data).toLocaleDateString('pt-BR',{timeZone:'UTC'})} </span>
       <span>Empresa: {dados.empresa}</span>
       <span>Tipo: {dados.tipo}</span>
       
       </div>

<div >
       <Table >
        <Table.Head>
            <Table.HeadCell>PRODUTO</Table.HeadCell>
            <Table.HeadCell>QUANTIDADE</Table.HeadCell>
       
        </Table.Head>
        <Table.Body className="divide-y">
          {dados.produtos?.map((item,index)=>(
            <Table.Row key={index}>
            <Table.Cell className="text-black">{item.produto}</Table.Cell>
            <Table.Cell className="text-black">{item.quantidade}</Table.Cell>
         
        </Table.Row>
          ))  }
        </Table.Body>
       </Table>
       </div>


       <span className="pl-5">Observações:</span>
    
       <br/>
       <br/>

       <div className="flex flex-col items-center gap-5">
    {/*   <div className="flex flex-col items-center">
        <div style={{width:160,height:75,borderWidth:'1px',borderColor:'black'}}></div>
        <span style={{fontStyle:'italic'}}>Carimbo</span>
        </div>*/}
        <div className="flex flex-col items-center">
        <span>___________________________________________________</span>
        <span style={{fontStyle:'italic'}}>Assinatura do expedidor</span>
        </div>

        <div className="flex flex-col items-center">
        <span>___________________________________________________</span>
        <span style={{fontStyle:'italic'}}>Assinatura do recebedor</span>
        </div>

       
      
       </div>
      </div>
    );
  }
}

export default RelatorioMov;
