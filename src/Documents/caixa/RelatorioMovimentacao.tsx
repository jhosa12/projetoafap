import Image from "next/image";
import logo from "../../../public/novaLogo.png"

// DocumentTemplate.js

import React, { forwardRef } from 'react';

import { SomaProps } from "@/components/tabs/financeiro/caixa/caixa";
import Sintetico from "./sintetico";
import { Analitico } from "./analitico";
import { roboto_Mono } from "@/fonts/fonts";
import { EmpresaProps } from "@/types/empresa";
import { LancamentosProps } from "@/types/caixa";


interface DadosProps {
  tipoRelatorio: string,
  usuario: string,
  soma: SomaProps,
  array: Array<LancamentosProps>,
  startDate: Date,
  endDate: Date,
  infoEmpresa:EmpresaProps|null
}

const RelatorioMovimentacao = forwardRef<HTMLDivElement, DadosProps>((
{tipoRelatorio,usuario,soma,array,startDate,endDate,infoEmpresa}:DadosProps,ref
)=>{
    return (
      <div ref={ref} className={roboto_Mono.className} style={{display: 'flex', flexDirection: 'column',padding:8,gap:20}} >
        <div className="flex  w-full justify-center ">
          <img width={150} height={150} src={infoEmpresa?.logoUrl??''} alt="logo" />
        </div>
        <h1 style={{ fontWeight: 'bold', fontSize: '24px', textAlign: 'center' }}>Relatório de Movimentação de Caixa</h1>
        <div style={{fontSize:'14px'}} className="flex flex-col gap-1 ">
          <span>Usuário: {usuario}</span>
          <span>Data Expedição: {new Date().toLocaleDateString('pt-BR')}</span>
          <span>Periodo do Caixa:  {new Date(startDate).toLocaleDateString('pt-BR')} -  {new Date(endDate).toLocaleDateString('pt-BR')}</span>
        </div>


        {tipoRelatorio === 'SINTETICO' && <Sintetico soma={soma} />}

        {tipoRelatorio === 'ANALITICO' && <Analitico array={array} soma={soma} />}

     


       

        <br />
    

        <div className="flex flex-col items-center gap-5">
      
          <div className="flex flex-col items-center">
            <span>___________________________________________________</span>
            <span style={{ fontStyle: 'italic' }}>Assinatura</span>
          </div>



        </div>
      </div>
    );
  }
)

export default RelatorioMovimentacao;
