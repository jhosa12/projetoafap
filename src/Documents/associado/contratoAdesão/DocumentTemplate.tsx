import parse from 'html-react-parser';

import React, { forwardRef } from 'react';
import { EmpresaProps } from "@/types/empresa";
import { SanitizeHtml } from "@/utils/sanitizeHtml";
import { timesNewRoman } from "@/fonts/fonts";
import { DependentesProps } from '@/app/dashboard/admcontrato/_types/dependentes';
interface DadosProps {
  nome: string,
  cpf: string,
  rg: string,
  endereco: string,
  numero: string,
  bairro: string,
  complemento: string,
  cidade: string,
  estado: string,
  adesao: Date,
  telefone: string,
  contrato: number,
  informacoes_plano?:string
  dependentes: Array<Partial<DependentesProps>>
  infoEmpresa:EmpresaProps|null
}

const DocumentTemplate = React.forwardRef<HTMLDivElement, DadosProps>(({
  nome,
  cpf,
  rg,
  endereco,
  infoEmpresa,
  numero,
  bairro,
  complemento,
  cidade,
  estado,
  adesao,
  telefone,
  contrato,
  dependentes,
  informacoes_plano
}, ref) => {

  return (
    <div className={`${timesNewRoman.className} text-black   px-8 `}>
        {/* Page Header */}
        <header className="border-b-2 border-gray-200 pb-6 mb-8">
          <div className="flex flex-col items-center">
            {infoEmpresa?.logoUrl && (
              <div className="mb-4">
                <img 
                  src={infoEmpresa.logoUrl} 
                  alt="Logo da Empresa" 
                  className="h-24 w-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold uppercase text-center text-gray-800 mb-2">
              {infoEmpresa?.fantasia || 'CONTRATO DE ADESÃO'}
            </h1>
            <div className="text-sm text-center text-gray-600 space-y-1">
              <p>CNPJ: {infoEmpresa?.cnpj}</p>
              <p>{infoEmpresa?.endereco}</p>
              <p>{infoEmpresa?.cidade_uf} | CEP: {infoEmpresa?.ins_estadual || 'N/I'}</p>
              <p>Telefones: {infoEmpresa?.fone} {infoEmpresa?.celular && `| ${infoEmpresa.celular}`}</p>
            </div>
          </div>
        </header>
        {/* Dados do Contratante - Layout Compacto */}
        <section className="mb-4 uppercase">
          <h2 className="text-base font-semibold border-b border-gray-200 pb-1 mb-2">DADOS DO CONTRATANTE</h2>
          
          <div className="">
            <div className="flex flex-wrap gap-6">
              <p className="whitespace-nowrap font-semibold"><span >Contrato:</span> {contrato}</p>
              <p className="whitespace-nowrap"><span className="font-medium">Data:</span> {new Date(adesao).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div className="flex flex-wrap gap-6">
            <p  className="font-medium">CONTRATANTE: {nome}</p>
            <p className="whitespace-nowrap"><span className="font-medium">CPF:</span> {cpf}</p>
           
            </div>

            <div className="flex flex-wrap gap-6">
            <p className="whitespace-nowrap"><span className="font-medium">RG:</span> {rg}</p>
             <p className="whitespace-nowrap"><span className="font-medium">Fone:</span> {telefone}</p>
             
           </div>
            
            
            <div className="flex flex-wrap gap-4">
             
              
              <p className="whitespace-nowrap"><span className="font-medium">Endereço:</span> {endereco}, {numero}</p>
              <p className="whitespace-nowrap"><span className="font-medium">Bairro:</span> {bairro}</p>
              <p className="whitespace-nowrap"><span className="font-medium">Cidade/UF:</span> {cidade}/{estado}</p>
           
            </div>
          
          </div>
        </section>
       

<br/><br/>



        {/* Relação de Dependentes */}
        <section style={{paddingBottom:8}}>
          <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-4">RELAÇÃO DE DEPENDENTES</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">#</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">NOME COMPLETO</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">GRAU DE PARENTESCO</th>
                  <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">DATA DE NASCIMENTO</th>
                </tr>
              </thead>
              <tbody>
                {dependentes?.filter(item => !item.excluido)?.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.nome}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.grau_parentesco}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.data_nasc ? new Date(item.data_nasc).toLocaleDateString('pt-BR') : 'N/I'}
                    </td>
                  </tr>
                ))}
                {(!dependentes || dependentes.length === 0) && (
                  <tr>
                    <td colSpan={4} className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                      Nenhum dependente cadastrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>


      {informacoes_plano &&  <section>
              <span className='whitespace-pre-line'>{informacoes_plano}</span>
        </section>}

  





        {/* Cláusulas do Contrato */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-4">CLÁUSULAS CONTRATUAIS</h2>
          <div className="text-justify text-sm leading-relaxed space-y-3">
            {infoEmpresa?.cont_clausuras ? (
              parse(SanitizeHtml(infoEmpresa.cont_clausuras))
            ) : (
              <p className="text-gray-500 italic">Cláusulas do contrato não disponíveis.</p>
            )}
          </div>
        </section>


       
        
        
        
        
        
                {/* Assinaturas */}
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {/* Assinatura da Empresa */}
            <div className="text-center ">
              <div className="h-24  mb-1 flex items-end justify-center">
                <img 
                  src="/assinatura.webp" 
                  alt="Assinatura" 
                  className="object-fill "
                  style={{height:90,width:200}}
                />
              </div>
              <p className="text-sm font-medium">________________________________________________________</p>
              <p className="text-sm font-medium mt-1">{infoEmpresa?.fantasia || 'REPRESENTANTE LEGAL'}</p>
              <p className="text-xs text-gray-600">CONTRATADA</p>
            </div>

            {/* Assinatura do Contratante */}
            <div className="text-center ">
              <div className="h-16 mb-2"></div>
              <p className="text-sm font-medium">________________________________________________________</p>
              <p className="text-sm font-medium mt-1">{nome}</p>
              <p className="text-xs text-gray-600">CONTRATANTE</p>
              <p className="text-xs mt-1">CPF: {cpf}</p>
            </div>
          </div>

          {/* Testemunhas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="text-center">
              <div className="h-16  mb-1"></div>
              <p className="text-sm font-medium">________________________________________________________</p>
              <p className="text-xs text-gray-600">TESTEMUNHA 1</p>
              <p className="text-xs mt-1">CPF: _____________________________</p>
            </div>
            <div className="text-center">
              <div className="h-16  mb-1"></div>
              <p className="text-sm font-medium">________________________________________________________</p>
              <p className="text-xs text-gray-600">TESTEMUNHA 2</p>
              <p className="text-xs mt-1">CPF: ________________________</p>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <footer className="mt-4 pt-4  text-xs text-center text-gray-500">
          <p>Documento gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
          <p className="mt-1">{infoEmpresa?.fantasia || 'Contrato de Adesão'}</p>
        </footer>


      </div>
    );
});

export default DocumentTemplate;
