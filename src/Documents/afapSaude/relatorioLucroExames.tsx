
import Image from "next/image";
import logo from "../../../public/afapsaude.png"
import React from 'react';
import { Table } from "flowbite-react";
import { ExamesProps } from "@/pages/afapSaude";
interface DadosProps {
    dados:Array<ExamesProps>

}


class RelatorioLucroExames extends React.Component<DadosProps> {

    render() {
        const { dados } = this.props;
        let totalParticular = 0;
        let totalFuneraria = 0;
        let totalPlano = 0;
        let totalBruto= 0;

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
                    <Image width={120} height={120} src={logo} alt="logo" />
                    <h1 style={{ fontWeight: 'bold', fontSize: '25px' }}>RELATORIO LUCRO POR EXAMES</h1>
                </div>
              

              

                <div>
                    <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-6 py-1"}},head:{cell:{base:"px-6 py-1"}}}}>
                        <Table.Head>
                            <Table.HeadCell>EXAME</Table.HeadCell>
                            <Table.HeadCell>VALOR BRUTO</Table.HeadCell>
                            <Table.HeadCell>LUCRO PARTICULAR</Table.HeadCell>
                            <Table.HeadCell>LUCRO FUNERÁRIA</Table.HeadCell>
                            <Table.HeadCell>LUCRO PLANO</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {dados?.map((item, index) => {
                                
                                const lucro_particular = item.porcPart-item.valorBruto
                                
                                const lucro_funeraria =Number(item.porcPart) - (Number(item.porcFun) * Number(item.porcPart) / 100) - item.valorBruto
                                const lucro_plano =Number(item.porcPart)-(Number(item.porcPlan) * Number(item.porcPart) / 100) -item.valorBruto

                                totalBruto+=Number(item.valorBruto)
                                totalParticular+=lucro_particular
                                totalFuneraria+=lucro_funeraria
                                totalPlano+=lucro_plano
                                

                            return   ( <Table.Row className="text-black" key={index}>
                                    <Table.Cell className="whitespace-nowrap font-medium ">{item.nome}</Table.Cell>
                                    <Table.Cell>{Number(item.valorBruto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                    <Table.Cell>{Number(lucro_particular).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                    <Table.Cell>{Number(lucro_funeraria).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                    <Table.Cell>{Number(lucro_plano).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                </Table.Row>)
    })}


<Table.Row className="font-semibold" >
                    <Table.Cell className="whitespace-nowrap  ">
                      Total
                    </Table.Cell>

                    <Table.Cell>{Number(totalBruto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }</Table.Cell>
                    <Table.Cell >{Number(totalParticular).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                    <Table.Cell>{Number(totalFuneraria).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                    <Table.Cell >{Number(totalPlano).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                  </Table.Row>
                        </Table.Body>
                    </Table>
                

                </div>

            </div>
        );
    }
}

export default RelatorioLucroExames;
