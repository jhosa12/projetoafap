
'use client'


import React from 'react';
import { Table } from "flowbite-react";
import { roboto_Mono } from "@/fonts/fonts";
import { ConsultaProps, ExamesProps } from '@/pages/dashboard/afapSaude';
interface DadosProps {
    dados: Array<ConsultaProps>,
    usuario: string,
    medico:string,
    especialidade:string,
    exames:Array<ExamesProps>
}


class ReciboRepasse extends React.Component<DadosProps> {

    render() {
        const { dados,usuario,medico,especialidade,exames } = this.props;
        let total = 0;
        let totalUnitario = 0;
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long', // Dia da semana por extenso
            year: 'numeric', // Ano completo
            month: 'long', // Mês por extenso
            day: 'numeric' // Dia do mês
        };

        
       const dataAtual = new Date();
      //  const dt = dataAtual.toLocaleDateString('pt-BR', options)

        return (
            <div className={`${roboto_Mono.className} flex flex-col w-full  gap-3 `}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '5px' }} >
                    <img fetchPriority='high' className='w-[120px] h-[120px]'  src={'/afapsaude.png'} alt="logo" />
                    <h1 style={{ fontWeight: 'bold', fontSize: '20px' }}>RECIBO DE REPASSE - CONSULTAS/PROCEDIMENTOS</h1>
                </div>
                
                  
                        <div style={{display: 'flex',borderBottom:'1px solid #cdd3dd',padding:'10px',fontSize:'12px',gap:'10px',justifyContent:'center' }}>
                       {medico}-{especialidade}
                        </div>
                 
                

                <div>
                    <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-3 py-1 text-black"}},
                    head:{cell:{base:"px-3 py-1 text-black"}}}}>
                        <Table.Head>
                            <Table.HeadCell>NOME</Table.HeadCell>
                            <Table.HeadCell>DATA</Table.HeadCell>
                            <Table.HeadCell>STATUS</Table.HeadCell>
                            <Table.HeadCell>PROCEDIMENTOS</Table.HeadCell>
                            <Table.HeadCell>VALOR</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {dados?.filter((item) => item.retorno !== 'SIM').map((item, index) => {
                                    totalUnitario = item.procedimentos.reduce((acc,atual)=>{
                                        const value = exames.find((exame) => exame.id_exame === atual.id_exame)?.valorRepasse
                                    return acc+= Number(value)
                                },0)
                                total += totalUnitario
                             return  ( <Table.Row className="text-[10px]" key={index}>
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 ">{item.nome}</Table.Cell>
                                    <Table.Cell>{item.data_prev && new Date(item.data_prev).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</Table.Cell>
                                    <Table.Cell>{item.status}</Table.Cell>
                                    <Table.Cell className='flex flex-col'>{item.procedimentos?.map((it,ind)=>(<span key={ind}>({it.nome})</span>))}</Table.Cell>
                                    <Table.Cell>{Number(totalUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                   
                                </Table.Row>)
    })}


<Table.Row className="font-semibold text-[11px]" >
                    <Table.Cell className="whitespace-nowrap  ">
                      Total
                    </Table.Cell>

                    <Table.Cell>{}</Table.Cell>
                    <Table.Cell >{}</Table.Cell>
                    <Table.Cell >{}</Table.Cell>
                    <Table.Cell>{Number(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }</Table.Cell>
                   
                  </Table.Row>
                        </Table.Body>
                    </Table>

               { /*  <div style={{display:"flex",flexDirection:'column',marginTop:'10px',fontSize:'14px'}}>
                    <span ><b>Total Previsto:</b> {Number(total+totaldesconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>

                    <span ><b>Desconto:</b> {Number(totaldesconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <span ><b>Total Orçamento:</b> {Number(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>*/}



               

                </div>

                <div className="flex flex-col w-full p-2 justify-end items-center " style={{marginTop:'50px'}} >
                        <span className="flex w-1/2 border-b-[1px]  border-black"></span>

                        <span style={{fontSize:'10px'}} className="pt-2  text-center italic">Assinatura e Carimbo do Profissional de Saúde</span>
                        
                    </div>


                    <span style={{position:'absolute',top:'0px',right:'10px',fontSize:'12px'}}>{usuario} {dataAtual.toLocaleDateString('pt-BR')}</span>

            </div>
        );
    }
}

export default ReciboRepasse;
