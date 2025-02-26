



// DocumentTemplate.js
import React from 'react';
import { Table } from "flowbite-react";
import { roboto_Mono } from '@/fonts/fonts';


interface ResponseProps{
    id_contrato:number,
    dt_adesao:Date,
    dt_cancelamento:Date,
    associado:{
            nome:string,
            endereco:string,
            bairro:string,
            cidade:string,
            celular1:string,
        
    }
}

interface DadosProps {
    dados:Array<ResponseProps>|[],
    usuario:string|undefined,
    logo:string|undefined,
    periodo:{start:Date,end:Date}
    tipo:string

}





class AtivosInativos extends React.Component<DadosProps> {
  render() {
    const {dados,usuario,logo,periodo,tipo} = this.props;
    return (
      <div className={`${roboto_Mono.className} flex flex-col w-full  gap-5`}>
       <div className="flex  w-full justify-center ">
       <img width={100} height={100} src={logo} alt="logo"/>
       </div>
       <h1 style={{fontWeight:'bold',fontSize:'18px',textAlign:'center'}}>RELATÓRIO DE CONTRATOS {tipo}S</h1>
       <div style={{display:'flex',flexDirection:'column',gap:'5px',fontSize:12}}>
       <span>Usuário: {usuario}</span>
       <span>Data Expedição: {new Date().toLocaleDateString('pt-BR')}</span>
       <span>Periodo: {periodo.start && new Date(periodo.start).toLocaleDateString('pt-BR')} -  {periodo.end && new Date(periodo.end).toLocaleDateString('pt-BR')}</span>

       </div>

<div >
       <Table theme={{root:{shadow:'none'}, body: { cell: { base: " px-1 py-1 text-[10px] text-black" } },head: { cell: { base: "px-1 py-1  text-[11px] text-black" } }}} >
        <Table.Head style={{fontSize:'9px'}}>
       
            <Table.HeadCell>ASSOCIADO</Table.HeadCell>
            <Table.HeadCell>ENDEREÇO</Table.HeadCell>
            <Table.HeadCell>BAIRRO</Table.HeadCell>
            <Table.HeadCell>ADESÃO</Table.HeadCell>
            <Table.HeadCell>CANCEL.</Table.HeadCell>
       
        </Table.Head>
        <Table.Body className="divide-y text-black" >
          {dados?.map((item,index)=>(
            <Table.Row key={index} >
            <Table.Cell >{item.id_contrato} - {item?.associado.nome}</Table.Cell>
            <Table.Cell>{item?.associado.endereco}</Table.Cell>
            <Table.Cell >{item?.associado.bairro}</Table.Cell>
            <Table.Cell >{item?.dt_adesao?new Date(item.dt_adesao).toLocaleDateString('pt-BR',{timeZone:'UTC'}):''}</Table.Cell>
            <Table.Cell >{item?.dt_cancelamento?new Date(item.dt_cancelamento).toLocaleDateString('pt-BR',{timeZone:'UTC'}):''}</Table.Cell>
         
        </Table.Row>
          ))  }


<Table.Row  className='font-bold text-[14px]' >
<Table.Cell className='text-start' >TOTAL: {dados.length}</Table.Cell>
            <Table.Cell >{}</Table.Cell>
            <Table.Cell>{}</Table.Cell>
            <Table.Cell >{}</Table.Cell>
            <Table.Cell >{}</Table.Cell>
           
        </Table.Row>
        </Table.Body>
       </Table>
       </div>
      </div>
    );
  }
}

export {AtivosInativos};
