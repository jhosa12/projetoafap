
import Image from "next/image";
import React from 'react';
import { Table } from "flowbite-react";
import { AdesaoProps } from "@/components/vendas/modalVendedor";
interface DadosProps {
   adesoes:Array<AdesaoProps>,
   startDate:Date,
   endDate:Date,
   vendedor:string,
   usuario:string

}


class ResumoVendedor extends React.Component<DadosProps> {

    render() {
        const { adesoes,endDate,startDate,vendedor,usuario } = this.props;
      
      /*  const options: Intl.DateTimeFormatOptions = {
            weekday: 'long', // Dia da semana por extenso
            year: 'numeric', // Ano completo
            month: 'long', // Mês por extenso
            day: 'numeric' // Dia do mês
        };*/
        const dataAtual = new Date();
       // const dt = dataAtual.toLocaleDateString('pt-BR', options)

        return (
            <div className='flex flex-col w-full gap-2 p-4 text-black'>
                  <span className="text-xs ml-auto ">{usuario}-{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '10px' }} >
                  <img src={'/afapsaude.jpg'} alt="logo" width={120} height={120} />
                    <h1 style={{ fontWeight: 'bold', fontSize: '25px' }}>RESUMO DE VENDAS</h1>
                </div>
              

              <span style={{  fontSize: '15px' }}>VENDEDOR: {vendedor}</span>
              <span style={{  fontSize: '15px' }}>PERIODO: {new Date(startDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} - {new Date(endDate).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</span>

                <div>
                    <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-6 py-1"}},head:{cell:{base:"px-6 py-1"}}}}>
                        <Table.Head>
                            <Table.HeadCell>CONTRATO</Table.HeadCell>
                            <Table.HeadCell>ASSOCIADO</Table.HeadCell>
                            <Table.HeadCell>ADESÃO</Table.HeadCell>
                            <Table.HeadCell>SITUAÇÃO</Table.HeadCell>
                            <Table.HeadCell>VALOR</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {adesoes?.map((item, index) => {
                                
                              

                               
                                

                            return   ( <Table.Row className="text-black" key={index}>
                                    <Table.Cell className="whitespace-nowrap font-medium ">{item.id_contrato}</Table.Cell>
                                    <Table.Cell>{item.associado.nome}</Table.Cell>
                                    <Table.Cell>{item.dt_adesao && new Date(item.dt_adesao).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</Table.Cell>
                                    <Table.Cell>{item.situacao}</Table.Cell>
                                    <Table.Cell>{Number(item.valor_mensalidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                </Table.Row>)
    })}


<Table.Row className="font-bold" >
                    <Table.Cell className="whitespace-nowrap  ">
                      TOTAL: {adesoes?.length}
                    </Table.Cell>
                    <Table.Cell>{}</Table.Cell>
                    <Table.Cell >{}</Table.Cell>
                    <Table.Cell>{}</Table.Cell>
                    <Table.Cell >{Number(adesoes?.reduce((acc, curr) => acc + Number(curr.valor_mensalidade), 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                  </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        );
    }
}

export default ResumoVendedor;
