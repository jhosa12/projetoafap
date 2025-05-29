'use client'
import Image from "next/image";

import React, { forwardRef } from 'react';
import { Table } from "flowbite-react";
import { MedicoProps } from "@/types/afapSaude";
interface DadosProps {
    dados:Array<MedicoProps>

}


const RelatorioListaMedicos = (
{dados}:DadosProps
)=>{
        return (
            <div  className='flex flex-col w-full gap-3 p-4'>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '10px' }} >
                    <img width={120} height={120} src={'/afapsaude.png'} alt="logo" />
                    <h1 style={{ fontWeight: 'bold', fontSize: '24px' }}>LISTA DE MÉDICOS/PROCEDIMENTOS</h1>
                </div>
              

              

                <div>
                    <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-6 py-1"}},head:{cell:{base:"px-6 py-1"}}}}>
                        <Table.Head>
                            <Table.HeadCell>Especialista</Table.HeadCell>
                            <Table.HeadCell>Procedimentos</Table.HeadCell>
                            
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {dados?.map((item, index) => {
                                
                                // const lucro_particular = item.porcPart-item.valorBruto
                                
                                // const lucro_funeraria =Number(item.porcPart) - (Number(item.porcFun) * Number(item.porcPart) / 100) - item.valorBruto
                                // const lucro_plano =Number(item.porcPart)-(Number(item.porcPlan) * Number(item.porcPart) / 100) -item.valorBruto

                                // totalBruto+=Number(item.valorBruto)
                                // totalParticular+=lucro_particular
                                // totalFuneraria+=lucro_funeraria
                                // totalPlano+=lucro_plano
                                

                            return   ( <Table.Row className="text-black" key={index}>
                                    <Table.Cell className="whitespace-nowrap font-medium ">{item.nome}</Table.Cell>
                                    <Table.Cell>
                                        <Table theme={{root:{shadow:'none'},body:{cell:{base:"px-2 py-1"}},head:{cell:{base:"px-2 py-1"}}}}>
                                            <Table.Head>
                                                <Table.HeadCell>PROCEDIMENTO</Table.HeadCell>
                                                <Table.HeadCell>BRUTO</Table.HeadCell>
                                                <Table.HeadCell>PARTICULAR</Table.HeadCell>
                                                <Table.HeadCell>FUNERÁRIA</Table.HeadCell>
                                                <Table.HeadCell>PLANO</Table.HeadCell>
                                                <Table.HeadCell>REPASSE</Table.HeadCell>
                                            </Table.Head>
                                            <Table.Body className="divide-y">
                                                {item.exames?.map((it, index) => {
                                                    return (
                                                        <Table.Row className="text-black" key={index}>
                                                            <Table.Cell>{it.nome}</Table.Cell>
                                                            <Table.Cell>{Number(it.valorBruto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                                            <Table.Cell>{Number(it.porcPart).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                                            <Table.Cell>{Number(it.porcFun).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                                            <Table.Cell>{Number(it.porcPlan).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                                            <Table.Cell>{Number(it.valorRepasse).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                                                        </Table.Row>
                                                    )
                                                })}
                                            </Table.Body>
                                        </Table>
                                    </Table.Cell>
                                   
                                </Table.Row>)
    })}


{/* <Table.Row className="font-semibold" >
                    <Table.Cell className="whitespace-nowrap  ">
                      Total
                    </Table.Cell>

                    <Table.Cell>{Number(totalBruto).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }</Table.Cell>
                    <Table.Cell >{Number(totalParticular).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                    <Table.Cell>{Number(totalFuneraria).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                    <Table.Cell >{Number(totalPlano).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                  </Table.Row> */}
                        </Table.Body>
                    </Table>
                

                </div>

            </div>
        );
    }


export default RelatorioListaMedicos;
