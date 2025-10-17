 import Image from "next/image";
import React, { forwardRef } from 'react';
import { ObitoProps } from "../../_types/obito";
import { EmpresaProps } from "@/types/empresa";

interface DadosProps {
  data: Partial<ObitoProps>;
  empresa: EmpresaProps | null;
}

const IncineracaoMateriais = forwardRef<HTMLDivElement, DadosProps>(({ data, empresa }, ref) => {
  const formatDate = (date?: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  return (
    <div ref={ref} className="w-full bg-white p-3 text-gray-900 text-xs">
      {/* Header */}
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

      {/* Título */}
      <div className="text-center mb-4">
        <h1 className="text-base font-bold uppercase">AUTORIZAÇÃO PARA INCINERAÇÃO DE MATERIAIS</h1>
        <p className="text-xs mt-1">Nº {data.id_obitos?.toString().padStart(6, '0') || '------'}</p>
      </div>

      {/* Dados do Falecido */}
      <div className="mb-4">
        <h3 className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 mb-1 uppercase border-l-4 border-gray-800">
          Dados do Falecido
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-2">
          <div className="flex">
            <span className="font-semibold w-24">Nome:</span>
            <span className="flex-1">{data.nome_falecido || '------------------------'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Data do Óbito:</span>
            <span>{formatDate(data.end_data_falecimento) || '--/--/----'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-24">CPF:</span>
            <span>{data.cpf || '---.---.--- --'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold w-32">Nascimento:</span>
            <span>{formatDate(data.data_nascimento) || '--/--/----'}</span>
          </div>
        </div>
      </div>

      {/* Itens para Incineração */}
      <div className="mb-4">
        <h3 className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 mb-2 uppercase border-l-4 border-gray-800">
          Itens para Incineração
        </h3>
        <div className="border border-gray-300 rounded p-3 bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-1 text-left text-[10px] w-1/12">Qtd.</th>
                <th className="border border-gray-300 p-1 text-left text-[10px]">Descrição do Item</th>
                <th className="border border-gray-300 p-1 text-left text-[10px] w-1/4">Observações</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((item) => (
                <tr key={item}>
                  <td className="border border-gray-200 p-1 h-8"></td>
                  <td className="border border-gray-200 p-1"></td>
                  <td className="border border-gray-200 p-1"></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[9px] text-gray-500 mt-1">
            Preencha a quantidade, descrição e observações dos itens a serem incinerados.
          </p>
        </div>
      </div>

      {/* Autorização */}
      <div className="mb-4 p-3 border border-gray-300 rounded bg-gray-50">
        <p className="text-justify mb-4">
          Eu, <strong>________________________________________</strong>, portador(a) do CPF <strong>______.______.______-__</strong>, 
          em meu nome e/ou como representante legal, <strong>AUTORIZO</strong> a <strong>{empresa?.fantasia || '_______________________'}</strong>, 
          inscrita no CNPJ <strong>{empresa?.cnpj || '_______________________'}</strong>, a proceder com a incineração dos 
          materiais relacionados acima, oriundos do serviço funerário prestado ao falecido(a) acima identificado(a).
        </p>
        
        <p className="text-justify mb-4">
          Declaro estar ciente de que a incineração será realizada de acordo com as normas ambientais vigentes e que não 
          serei responsável por quaisquer materiais após a autorização da queima.
        </p>

        <div className="mt-6 mb-2">
          <p className="text-center font-semibold mb-6">
            {empresa?.cidade_uf || 'Cedro'}, {new Date().toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          
          <div className="border-t border-gray-400 pt-8 text-center">
            <p>________________________________________</p>
            <p className="text-[10px] mt-1">Assinatura do Responsável</p>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-6 text-center text-[9px] text-gray-500 border-t border-gray-200 pt-2">
        <p>Documento gerado em {new Date().toLocaleString('pt-BR')}</p>
        <p>{empresa?.fantasia} - {empresa?.endereco} - {empresa?.cidade_uf} - {empresa?.celular}</p>
      </div>
    </div>
  );
});

IncineracaoMateriais.displayName = 'IncineracaoMateriais';

export default IncineracaoMateriais;
