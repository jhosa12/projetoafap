
import React from 'react';
import { Table } from "flowbite-react";
import { ConsultaProps } from '@/types/afapSaude';

interface DadosProps {
    dados:Array<ConsultaProps>

}


class ListaConsultas extends React.Component<DadosProps> {

    render() {
        const { dados } = this.props;


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
               {/* <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '10px' }} >
                    <Image width={120} height={120} src={logo} alt="logo" />
                    <h1 style={{ fontWeight: 'bold', fontSize: '18px' }}>RELATORIO DE CONSULTAS</h1>
                </div>*/}
            
                <div>
                    <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-2 py-1 text-xs text-black"}},head:{cell:{base:"px-2 py-1 text-xs text-black"}}}}>
                        <Table.Head>
                            <Table.HeadCell>NOME</Table.HeadCell>
                            <Table.HeadCell>ENDEREÇO</Table.HeadCell>
                            <Table.HeadCell>BAIRRO</Table.HeadCell>
                            <Table.HeadCell>CIDADE</Table.HeadCell>
                            <Table.HeadCell>COMPLEMENTO</Table.HeadCell>
                            <Table.HeadCell>CELULAR</Table.HeadCell>
                            <Table.HeadCell>BUSCAR</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {dados?.map((item, index) => {
                                


                            return   ( <Table.Row key={index}>
                                    <Table.Cell className="whitespace-nowrap text-xs font-medium text-gray-900 ">{item.nome}</Table.Cell>
                                    <Table.Cell>{item.endereco}- {item.numero}</Table.Cell>
                                    <Table.Cell>{item.bairro}</Table.Cell>
                                    <Table.Cell>{item.cidade}</Table.Cell>
                                    <Table.Cell>{item.complemento}</Table.Cell>
                                    <Table.Cell>{item.celular}</Table.Cell>
                                    <Table.Cell>{item.buscar}</Table.Cell>
                                </Table.Row>)
    })}


{<Table.Row className="font-semibold" >
                    <Table.Cell className="whitespace-nowrap text-base">
                      Total: {dados?.length}
                    </Table.Cell>

                    <Table.Cell>{ }</Table.Cell>
                    <Table.Cell >{}</Table.Cell>
                    <Table.Cell>{}</Table.Cell>
                    <Table.Cell >{}</Table.Cell>
                  </Table.Row>}
                        </Table.Body>
                    </Table>
                

                </div>

            </div>
        );
    }
}

export default ListaConsultas;
