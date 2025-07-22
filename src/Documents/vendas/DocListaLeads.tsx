
import Image from "next/image";
import React from 'react';
import { Table } from "flowbite-react";
import { AdesaoProps } from "@/components/vendas/modalVendedor";
import { roboto_Mono } from "@/fonts/fonts";
import { LeadProps } from "@/components/vendas/historico/historico";
interface DadosProps {
   leads:Array<LeadProps>,
 
}


class DocListaLeads extends React.Component<DadosProps> {

    render() {
        const { leads } = this.props;
      
      /*  const options: Intl.DateTimeFormatOptions = {
            weekday: 'long', // Dia da semana por extenso
            year: 'numeric', // Ano completo
            month: 'long', // Mês por extenso
            day: 'numeric' // Dia do mês
        };*/
        const dataAtual = new Date();
       // const dt = dataAtual.toLocaleDateString('pt-BR', options)

        return (
          <div className={`${roboto_Mono.className} flex flex-col w-full gap-2 p-4 text-black `}>

                 {/* <span className="text-xs ml-auto ">{usuario}-{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>*/}
            

                <div>
                    <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-2 py-1 text-xs  border border-black"}},head:{cell:{base:"px-2 py-1 border border-black border-b-[1px]"}}}}>
                        <Table.Head>
                            <Table.HeadCell>STATUS</Table.HeadCell>
                            <Table.HeadCell>NOME</Table.HeadCell>
                            <Table.HeadCell>DATA</Table.HeadCell>
                            <Table.HeadCell>CONSULTOR</Table.HeadCell>
                            <Table.HeadCell>ENDEREÇO</Table.HeadCell>
                            <Table.HeadCell>BAIRRO</Table.HeadCell>
                            <Table.HeadCell>CELULAR</Table.HeadCell>
                            <Table.HeadCell>VENC.</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {leads?.map((item, index) => {
                                
                            return   ( <Table.Row className="text-black" key={index}>
                                    <Table.Cell >{item.status}</Table.Cell>
                                    <Table.Cell>{item.nome}</Table.Cell>
                                    <Table.Cell>{item.data && new Date(item.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</Table.Cell>
                                    <Table.Cell>{item.consultor}</Table.Cell>
                                    <Table.Cell>{item.endereco} Nº {item.numero}</Table.Cell>
                                    <Table.Cell>{item.bairro}</Table.Cell>
                                    <Table.Cell>{item.celular1}</Table.Cell>
                                    <Table.Cell>{item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</Table.Cell>
                                </Table.Row>)
    })}


<Table.Row className="font-bold" >
                    <Table.Cell className="whitespace-nowrap  ">
                      TOTAL: {leads?.length}
                    </Table.Cell>
                   
                  </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        );
    }
}

export default DocListaLeads;
