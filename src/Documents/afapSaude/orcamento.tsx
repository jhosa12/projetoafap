



import Image from "next/image";
import logo from "../../../public/afapsaude.png"


import React from 'react';
import { ExameRealizadoProps } from "@/components/afapSaude/exames/exames";
import { Table } from "flowbite-react";
interface DadosProps {
    dados: ExameRealizadoProps

}


class Orcamento extends React.Component<DadosProps> {

    render() {
        const { dados } = this.props;
        let total = 0;
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long', // Dia da semana por extenso
            year: 'numeric', // Ano completo
            month: 'long', // Mês por extenso
            day: 'numeric' // Dia do mês
        };
        const dataAtual = new Date();
        const dt = dataAtual.toLocaleDateString('pt-BR', options)

        return (
            <div className='flex flex-col w-full gap-3 p-4'>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '10px' }} >
                    <Image width={150} height={150} src={logo} alt="logo" />
                    <h1 style={{ fontWeight: 'bold', fontSize: '30px' }}>ORÇAMENTO - EXAMES LABORATORIAIS</h1>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', gap: '10px' }}>
                    <span>NOME:{dados.nome}</span>
                    <span>CELULAR:{dados.celular}</span>
                </div>
                <p className="italic " style={{ textAlign: 'justify' }}>
                Importante: Os exames laboratoriais listados neste orçamento são realizados por um laboratório parceiro certificado. Nossa empresa atua apenas como intermediária, oferecendo o serviço de agendamento e recebimento dos resultados para facilitar o atendimento aos nossos clientes.
                </p>

                <div>
                    <Table theme={{body:{cell:{base:"px-6 py-1 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-black"}}}}>
                        <Table.Head>
                            <Table.HeadCell>EXAME</Table.HeadCell>
                            <Table.HeadCell>VALOR</Table.HeadCell>
                            <Table.HeadCell>OBSERVAÇÕES</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {dados?.exames?.map((item, index) => {
                            total += Number(item?.valorFinal)


                             return  ( <Table.Row key={index}>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">{item.nome}</Table.Cell>
                                    <Table.Cell>{Number(item.valorFinal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">{item.obs}</Table.Cell>
                                </Table.Row>)
    })}


<Table.Row className="font-semibold" >
                    <Table.Cell className="whitespace-nowrap  ">
                      Total
                    </Table.Cell>

                    <Table.Cell>{Number(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }</Table.Cell>
                    <Table.Cell >{}</Table.Cell>
                   
                  </Table.Row>
                        </Table.Body>
                    </Table>
               

                </div>

            </div>
        );
    }
}

export default Orcamento;
