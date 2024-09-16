import Image from "next/image";
import logo from "../../../public/novaLogo.png"

// DocumentTemplate.js

import React from 'react';

import { Table } from "flowbite-react";


interface DadosProps {
    usuario:string,
    dataInicio:Date,
    dataFim:Date
}



class Fechamento extends React.Component<DadosProps> {
  render() {
    const {dataFim,dataInicio,usuario} = this.props;
 
 
    return (
      <div className='flex flex-col w-full p-2   gap-5 '>
       <div className="flex  w-full justify-center ">
       <Image width={150} height={150} src={logo} alt="logo"/>
       </div>
       <h1 style={{fontWeight:'bold',fontSize:'25px',textAlign:'center'}}>Resumo de Caixa</h1>
       <div className="flex flex-col gap-2 pl-5 ">
       <span>Usuário: {usuario}</span>
       <span>Data Expedição: {new Date().toLocaleDateString('pt-BR')}</span>
       <span>Periodo do Caixa:  {new Date().toLocaleDateString('pt-BR')} -  {new Date().toLocaleDateString('pt-BR')}</span>
       </div>

<div className="p-2">
       <Table>
        <Table.Head>
            <Table.HeadCell>CÉDULA</Table.HeadCell>
            <Table.HeadCell>PIX</Table.HeadCell>
            <Table.HeadCell>CARTÃO</Table.HeadCell>
            <Table.HeadCell>TRANSFERÊNCIA</Table.HeadCell>
        </Table.Head>
        <Table.Body>
            <Table.Row>
                <Table.Cell>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
                <Table.Cell>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
                <Table.Cell>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
                <Table.Cell>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>

            </Table.Row>
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
        <span style={{fontStyle:'italic'}}>Assinatura</span>
        </div>

       
      
       </div>
      </div>
    );
  }
}

export default Fechamento;
