import Image from "next/image";
import logo from "../../../../../../public/novaLogo.png";
import { MdOutlineCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import React, { forwardRef } from 'react';
import { ObitoProps } from "../../_types/obito";
import { EmpresaProps } from "@/types/empresa";

interface DadosProps {
  dados: Partial<ObitoProps>;
  autorizado: boolean;
  empresa?:EmpresaProps|null
}

const AutTanato = forwardRef<HTMLDivElement, DadosProps>((
  { autorizado, dados,empresa }, ref
) => {
  return (
    <div ref={ref} className="p-6 max-w-4xl mx-auto text-xs leading-tight font-sans">
      {/* Cabeçalho */}
           <div className="border-b-2 border-gray-800 pb-1.5 mb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
           <img width={150} height={150} src={empresa?.logoUrl} alt="" />
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-gray-900 uppercase">
                {empresa?.fantasia}
              </h1>
              <p className="text-[10px] text-gray-600 mt-0.5">CNPJ: {empresa?.cnpj}</p>
              <p className="text-[10px] text-gray-600">{empresa?.endereco}/{empresa?.cidade_uf}</p>
              <p className="text-[10px] text-gray-600">Tel: {empresa?.celular} | {empresa?.celular2}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-600">
              <p>Data de Emissão:</p>
              <p className="font-semibold text-gray-900">
                {new Date().toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mb-6">
        <h1 className="text-base font-bold uppercase mb-1">AUTORIZAÇÃO PARA PROCEDIMENTO DE TANATOPRAXIA</h1>
       
      </div>

      {/* Dados do Declarante e Falecido */}
      <div className="mb-6 p-4 border uppercase border-gray-200 rounded bg-gray-50">
        <p className="mb-2">
          Eu <strong>{dados?.rd_nome || '________________________'}</strong>, portador(a) do CPF: 
          <strong> {dados?.cpf_cnpj || '_________________'} </strong> e RG: 
          <strong> {dados?.rd_rg || '______________'}</strong>,
        </p>
        <p className="mb-2">
          residente e domiciliado(a) em: <strong>{dados?.rd_endereco || '________________________'}</strong>,
          Nº <strong>{dados?.rd_numero || '____'}</strong>, <strong>{dados?.rd_bairro || '________________'}</strong>, 
          <strong> {dados?.rd_cidade || '________________'}</strong> - <strong>{dados?.rd_uf || '__'}</strong>,
        </p>
        <p>
          declaro-me responsável pelo(a) falecido(a) <strong>{dados?.nome_falecido || '________________________'}</strong>,
          declaração de óbito nº <strong>{dados?.id_obitos || '__________'}</strong>.
        </p>
      </div>

      {/* Termos de Autorização */}
      <div className="mb-8">
        <p className="mb-4 font-semibold">Por meio deste documento, declaro que:</p>
        
        <div className={`flex items-start mb-3 p-3 rounded ${autorizado ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-50'}`}>
          <div className="mt-1 mr-2">
            {autorizado ? 
              <MdOutlineCheckBox className="text-green-600" size={20} /> : 
              <MdCheckBoxOutlineBlank className="text-gray-400" size={20} />
            }
          </div>
          <div>
            <p className="font-medium">AUTORIZO</p>
            <p>O procedimento de <strong>TANATOPRAXIA</strong> no corpo do(a) falecido(a) acima citado, 
            o qual será realizado pelo laboratório <strong>ASSISTÊNCIA FAMILIAR PARAÍSO</strong>.</p>
          </div>
        </div>

        <div className={`flex items-start p-3 rounded ${!autorizado ? 'bg-red-50 border-l-4 border-red-500' : 'bg-gray-50'}`}>
          <div className="mt-1 mr-2">
            {!autorizado ? 
              <MdOutlineCheckBox className="text-red-600" size={20} /> : 
              <MdCheckBoxOutlineBlank className="text-gray-400" size={20} />
            }
          </div>
          <div>
            <p className="font-medium">NÃO AUTORIZO</p>
            <p>A realização do procedimento de tanatopraxia no corpo do(a) falecido(a).</p>
          </div>
        </div>
      </div>

      {/* Assinaturas */}
      <div className="mt-12 grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="h-16 border-b border-gray-400 mb-2"></div>
          <p className="text-xs font-semibold">{dados?.rd_nome || '________________________'}</p>
          <p className="text-2xs text-gray-600">Assinatura do Responsável</p>
          <p className="text-2xs">CPF: {dados?.cpf_cnpj || '________________'}</p>
        </div>

        <div className="text-center">
          <div className="h-16 border-b border-gray-400 mb-2"></div>
          <p className="text-xs font-semibold">ASSISTÊNCIA FAMILIAR PARAÍSO</p>
          <p className="text-2xs text-gray-600">Responsável</p>
         
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-10 text-center text-2xs text-gray-600">
        <p>
          {empresa?.cidade_uf || 'Cedro'}, {new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </p>
        <p className="mt-1">Documento gerado eletronicamente</p>
      </div>
    </div>
  );
});

AutTanato.displayName = 'AutTanato';

export default AutTanato;