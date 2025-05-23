
'use client'

import logo from "../../../public/afapsaudelogo.jpg"
import React, { forwardRef } from 'react';
import { Table } from "flowbite-react";
import { roboto_Mono } from "@/fonts/fonts";
import { ExameRealizadoProps } from '@/types/afapSaude';
import Image from 'next/image';
interface DadosProps {
    dados: ExameRealizadoProps
    usuario: string,


}

const Orcamento = forwardRef<HTMLDivElement, DadosProps>((
{dados,usuario}:DadosProps,ref
)=>{

    if(!logo){
        return null
    }


    
       
        let total = 0;
        let totaldesconto = 0;
        // const options: Intl.DateTimeFormatOptions = {
        //     weekday: 'long', // Dia da semana por extenso
        //     year: 'numeric', // Ano completo
        //     month: 'long', // Mês por extenso
        //     day: 'numeric' // Dia do mês
        
        // };
    
     //  const dataAtual = new Date();
      //  const dt = dataAtual.toLocaleDateString('pt-BR', options)

        return (
            <div ref={ref} className={`${roboto_Mono.className} flex flex-col gap-3 p-2`}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'end', justifyContent: 'center', gap: '10px' }} >
                    <Image    width={60} height={60} src={logo} alt="logoEmp" />
                    <h1 style={{ fontWeight: 'bold', fontSize: '20px' }}>ORÇAMENTO - EXAMES LABORATORIAIS</h1>
                </div>
                <div  style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'space-between', gap: '5px',border:'1px solid #cdd3dd',borderRadius:'5px',fontSize:'13px' }}>
                    <h1 style={{fontStyle:'oblique', fontWeight: 'inherit',width:'100%',paddingLeft:'10px',padding:'5px',backgroundColor:'#e8ebf0',borderTopLeftRadius:'5px',borderTopRightRadius:'5px' }}>Solicitante:</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%',gap: '10px',padding:'10px' }}>
                        <div style={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }}>
                        <span>Nome: {dados.nome}</span>
                        <span>Nasc.: {dados.data_nasc && new Date(dados.data_nasc).toLocaleDateString('pt-BR')}</span>
                        <span>Celular: {dados.celular}</span>
                        </div>
                        <div style={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }}>
                        <span>Endereço: {dados.endereco}</span>
                        <span>N°: {dados.numero}</span>
                        <span>Bairro: {dados.bairro}</span>
                        <span>Cidade: {dados.cidade}</span>
                        </div>
                   
                    </div>
                  
                </div>

                <div  style={{fontSize:'13px', display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'space-between', gap: '5px',border:'1px solid #cdd3dd',borderRadius:'5px' }}>
                    <h1 style={{fontStyle:'oblique', fontWeight: 'inherit',width:'100%',paddingLeft:'10px',padding:'5px',backgroundColor:'#e8ebf0',borderTopLeftRadius:'5px',borderTopRightRadius:'5px' }}>Tipo de Convênio:</h1>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%',gap: '10px',padding:'10px' }}>
                        <span>Convênio Selecionado: {dados.tipoDesc}</span>
                       
                   
                    </div>
                  
                </div>






                <p className="italic " style={{ textAlign: 'justify',fontSize:'12px' }}>
                Importante: Os exames laboratoriais listados neste orçamento são realizados por um laboratório parceiro certificado. Nossa empresa atua apenas como intermediária, oferecendo o serviço de agendamento e recebimento dos resultados para facilitar o atendimento aos nossos clientes.
                </p>
                <div>
                    <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-4 py-1 text-black"}},
                    head:{cell:{base:"px-4 py-1 text-black"}}}}>
                        <Table.Head>
                            <Table.HeadCell>EXAME</Table.HeadCell>
                            <Table.HeadCell>VALOR</Table.HeadCell>
                            <Table.HeadCell>Desconto</Table.HeadCell>
                            <Table.HeadCell>TOTAL</Table.HeadCell>
                            <Table.HeadCell>OBSERVAÇÕES</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {dados?.exames?.map((item, index) => {
                            total += Number(item?.valorFinal)
                            totaldesconto += Number(item?.desconto)
                             return  ( <Table.Row className="text-xs" key={index}>
                                    <Table.Cell className=" font-medium text-gray-900 ">{item.nome}</Table.Cell>
                                    <Table.Cell>{Number(item.valorFinal+item.desconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                    <Table.Cell>{Number(item.desconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                    <Table.Cell>{Number(item.valorFinal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                    <Table.Cell className=" font-medium text-gray-900 ">{item.obs}</Table.Cell>
                                </Table.Row>)
    })}


<Table.Row className="font-semibold" >
                    <Table.Cell className="whitespace-nowrap  ">
                      Total
                    </Table.Cell>

                    <Table.Cell>{Number(total+totaldesconto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }</Table.Cell>
                    <Table.Cell >{totaldesconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                    
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

                        <span style={{fontSize:'14px'}} className="pt-2  text-center italic">Assinatura e Carimbo do Profissional de Saúde</span>
                        
                    </div>


                    <span style={{position:'absolute',top:'0px',right:'10px',fontSize:'14px'}}>{usuario} {new Date().toLocaleDateString('pt-BR')}</span>

            </div>
        );
    }
)

export default Orcamento;
