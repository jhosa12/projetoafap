'use client'
import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { ConsultaProps } from '@/types/afapSaude';

interface DadosProps {
    dados:Array<ConsultaProps>

}


const ListaConsultas = React.forwardRef<HTMLDivElement, DadosProps>((
    { dados }: DadosProps, ref) => {

        return (
            <div ref={ref} className='flex flex-col w-full gap-3 p-4'>
               {/* <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', justifyContent: 'center', gap: '10px' }} >
                    <Image width={120} height={120} src={logo} alt="logo" />
                    <h1 style={{ fontWeight: 'bold', fontSize: '18px' }}>RELATORIO DE CONSULTAS</h1>
                </div>*/}

                <div>
                <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="px-2 py-1 text-xs text-black border border-gray-300">SEQ.</TableHead>
      <TableHead className="px-2 py-1 text-xs text-black border border-gray-300">ORIGEM</TableHead>
      <TableHead className="px-2 py-1 text-xs text-black border border-gray-300">NOME</TableHead>
      <TableHead className="px-2 py-1 text-xs text-black border border-gray-300">ENDEREÇO</TableHead>
      <TableHead className="px-2 py-1 text-xs text-black border border-gray-300">BAIRRO</TableHead>
      <TableHead className="px-2 py-1 text-xs text-black border border-gray-300">CIDADE</TableHead>
      <TableHead className="px-2 py-1 text-xs text-black border border-gray-300">COMPLEMENTO</TableHead>
      <TableHead className="px-2 py-1 text-xs text-black border border-gray-300">CELULAR</TableHead>
      <TableHead className="px-2 py-1 text-xs text-black border border-gray-300">BUSCAR</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {dados?.map((item, index) => (
      <TableRow key={index} className="divide-y">
        <TableCell className="px-2 py-1 text-[11px] text-black border border-gray-300">{item.posicao}</TableCell>
        <TableCell className="px-2 py-1 text-[11px] text-black border border-gray-300">{item.externo}</TableCell>
        <TableCell className="whitespace-nowrap px-2 py-1 text-xs font-medium text-gray-900 border border-gray-300">
          {item.nome}
        </TableCell>
        <TableCell className="px-2 py-1 text-[11px] text-black border border-gray-300">
          {item.endereco}- {item.numero}
        </TableCell>
        <TableCell className="px-2 py-1 text-[11px] text-black border border-gray-300">{item.bairro}</TableCell>
        <TableCell className="px-2 py-1 text-[11px] text-black border border-gray-300">{item.cidade}</TableCell>
        <TableCell className="px-2 py-1 text-[11px] text-black border border-gray-300">{item.complemento}</TableCell>
        <TableCell className="px-2 py-1 text-[11px] text-black border border-gray-300">{item.celular}</TableCell>
        <TableCell className="px-2 py-1 text-[11px] text-black border border-gray-300">{item.buscar}</TableCell>
      </TableRow>
    ))}
    
    <TableRow className="font-semibold">
      <TableCell className="whitespace-nowrap text-xs px-2 py-1">
        Total: {dados?.length}
      </TableCell>
      <TableCell className="px-2 py-1 text-[11px] text-black"></TableCell>
      <TableCell className="px-2 py-1 text-[11px] text-black"></TableCell>
      <TableCell className="px-2 py-1 text-[11px] text-black"></TableCell>
      <TableCell className="px-2 py-1 text-[11px] text-black"></TableCell>
    </TableRow>
  </TableBody>
</Table>

                </div>

            </div>
        );
    }
)

export default ListaConsultas;
