import Image from "next/image";
import logo from "../../../../../../public/novaLogo.png"

// DocumentTemplate.js

import React from 'react';
import { ArrayProdutoProps } from "@/app/dashboard/admcontrato/_types/array-produtos";
import { PlanosProps } from "@/types/planos";

interface DadosProps {
  tipo_atendimento: string,
  atendente: string,
  contrato: number,
  descricao_plano: string,
  informacoes_plano: string,
  situacao: string,
  falecido: string,
  nome_dec: string,
  cpf_dec: string,
  endereco_dec: string,
  bairro_dec: string,
  numero_dec: number,
  cidade_dec: string,
  uf_dec: string,
  nome_falecido: string,
  data_nasc_falecido: Date | null,
  nome_pai: string,
  nome_mae: string,
  estado_civil: string,
  religiao: string,
  profissao: string,
  naturalidade_falecido: string,
  endereco_falecido: string,
  numero_falecido: number,
  bairro_falecido: string,
  cidade_falecido: string,
  uf_falecido: string,
  inumado: string,
  data_falecimento: Date,
  hora_falecimento: Date,
  local_falecimento: string,
  laudo_medico: string,
  medico: string,
  cemiterio: string,
  crm: string,
  data_sepultamento: Date,
  hora_sepultamento: Date,
  observacoes: string,
  obito_itens: Array<Partial<ArrayProdutoProps>>,
}


class OrdemServico extends React.Component<Partial<DadosProps>> {

  render() {
    const {
      tipo_atendimento,
      atendente,
      contrato,
      descricao_plano,
      informacoes_plano,
      situacao,
      falecido,
      nome_dec,
      cpf_dec,
      endereco_dec,
      bairro_dec,
      numero_dec,
      cidade_dec,
      uf_dec,
      nome_falecido,
      data_nasc_falecido,
      naturalidade_falecido,
      nome_pai,
      nome_mae,
      estado_civil,
      religiao,
      profissao,
      endereco_falecido,
      numero_falecido,
      bairro_falecido,
      cidade_falecido,
      uf_falecido,
      inumado,
      data_falecimento,
      hora_falecimento,
      local_falecimento,
      cemiterio,
      laudo_medico,
      medico,
      data_sepultamento,
      hora_sepultamento,
      crm,
      observacoes,
      obito_itens,
    } = this.props;

    return (
      <div className='flex flex-col w-full p-2 border-[1px] '>
        <div className="inline-flex  w-full justify-start items-center mt-4">
          <Image className="flex w-44 h-16  " src={logo} alt="" />
          <div className="flex flex-col text-justify">
            <h2 style={{}} className=' mt-4  uppercase text-start font-bold'>Assistência Familiar Paraíso</h2>
            <p className=' text-start'>CNPJ: 16.784.573/0001-93 INSC. EST.:</p>
            <p className=' text-start'>RUA ADALTO CASTELO, 393, CENTRO</p>
            <p className=' text-start'>TELEFONES: (88) 997113362 (88)992791293</p>
          </div>
        </div>
        <h2 className='flex w-full bg-gray-300 justify-center font-semibold mt-2'>FICHA DE ATENDIMENTO/AUTORIZAÇÃO DE SERVIÇO</h2>
        <div className="flex w-full justify-between">
          <span className="px-2 pt-2" >Tipo Atendimento:{tipo_atendimento}</span>
          <span className="px-2 pt-2" >Atendente:{atendente}</span>
        </div>
        <div className="flex w-full justify-between">
          <span className="px-2 " >Contrato: {contrato}</span>
          <span className="px-2 " >Plano: {descricao_plano}</span>
          <span className="px-2 " >Situação: {situacao}</span>
        </div>



        <span className="px-2 ">Falecido</span>

        <div className="flex w-full justify-between">
          <span className="px-2 ">Nome Cliente: {nome_dec}</span>
          <span className="px-2 ">CNPJ/CPF: {cpf_dec}</span>
        </div>

        <span className="px-2 ">Endereço:{endereco_dec}-{bairro_dec} N°{numero_dec}-{cidade_dec}/{uf_dec}</span>
        <h2 className='flex w-full bg-gray-300 font-semibold mt-2'>DADOS DO FALECIDO</h2>
        <div className="flex w-full justify-between">
          <span className="px-2 ">Nome: {nome_falecido}</span>
          <span className="px-2 ">Data Nasc: {data_nasc_falecido && new Date(data_nasc_falecido).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
        </div>
        <span className="px-2 ">Naturalidade:{naturalidade_falecido}</span>
        <div className="flex w-full justify-between">
          <span className="px-2 ">Nome do Pai: {nome_pai}</span>
          <span className="px-2 ">Nome da Mãe: {nome_mae}</span>
        </div>

        <div className="flex w-full justify-between">
          <span className="px-2 ">Estado Civil:{estado_civil}</span>
          <span className="px-2 ">Religião:{religiao}</span>
          <span className="px-2 ">Profissão:{profissao}</span>
        </div>
        <div className="flex w-full justify-between">
          <span className="px-2 ">Endereço: {endereco_falecido}</span>
          <span className="px-2 ">N°: {numero_falecido}</span>
          <span className="px-2 ">Bairro: {bairro_falecido}</span>
          <span className="px-2 ">Cidade: {cidade_falecido}</span>
          <span className="px-2 ">UF: {uf_falecido}</span>
        </div>
        <span className="px-2 ">Inumado: {inumado}</span>
        <div className="flex w-full justify-between">
          <span className="px-2 ">Data Falecimento: {data_falecimento && new Date(data_falecimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
          <span className="px-2 ">Hora Falecimento: {hora_falecimento && new Date(hora_falecimento).toLocaleTimeString('pt-BR', { timeZone: 'UTC' })}</span>
        </div>

        <span className="px-2 ">Local Falecimento: {local_falecimento}</span>
        <span className="px-2 ">Cemitério: {cemiterio}</span>
        <span className="px-2 ">Laudo Médico: {laudo_medico}</span>
        <div className="flex w-full justify-between">
          <span className="px-2 ">Médico: {medico}</span>
          <span className="px-2 ">CRM: {crm}</span>
        </div>


        <div className="flex w-full justify-between">
          <span className="px-2 ">Data Sepultamento: {data_sepultamento && new Date(data_sepultamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
          <span className="px-2 ">Hora Sepultamento: {hora_sepultamento && new Date(hora_sepultamento).toLocaleTimeString('pt-BR', { timeZone: 'UTC' })}</span>
        </div>

        <span className="px-2 ">Observações: {observacoes}</span>

        <h2 className='flex w-full bg-gray-300 font-semibold mt-2'>PRODUTOS/SERVIÇOS</h2>

        {/* Cabeçalho da tabela */}
        <div className="flex w-full bg-gray-100 border-b border-gray-300">
          <span className="flex-1 px-2 py-1 font-semibold border-r border-gray-300">Descrição</span>
          <span className="w-16 px-2 py-1 font-semibold text-center border-r border-gray-300">Qtd</span>
          <span className="w-24 px-2 py-1 font-semibold text-center border-r border-gray-300">Valor Unit.</span>
          <span className="w-20 px-2 py-1 font-semibold text-center border-r border-gray-300">Desconto</span>
          <span className="w-20 px-2 py-1 font-semibold text-center border-r border-gray-300">Acréscimo</span>
          <span className="w-24 px-2 py-1 font-semibold text-center">Total</span>
        </div>

        {/* Dados da tabela */}
        <ul className="flex flex-col w-full">
          {obito_itens?.map((servico) => (
            <li
              key={servico.id_ob_itens}
              className="flex w-full border-b border-gray-200 hover:bg-gray-50"
            >
              <span className="flex-1 px-2 py-1 border-r border-gray-300">{servico.descricao_item}</span>
              <span className="w-16 px-2 py-1 text-center border-r border-gray-300">{servico.quantidade}</span>
              <span className="w-24 px-2 py-1 text-center border-r border-gray-300">R$ {servico.valor_unit}</span>
              <span className="w-20 px-2 py-1 text-center border-r border-gray-300">R$ {servico.desconto}</span>
              <span className="w-20 px-2 py-1 text-center border-r border-gray-300">R$ {servico.acrescimo}</span>
              <span className="w-24 px-2 py-1 text-center font-semibold">R$ {servico.valor_total}</span>
            </li>
          ))}
        </ul>

        <h1 className='flex w-full bg-gray-300 font-semibold mt-2'>RECEBIMENTOS</h1>

        <h2 className='flex w-full bg-gray-300 font-semibold mt-2'>BENEFÍCIOS DO PLANO</h2>

        <span className="px-2 whitespace-pre-line" >{informacoes_plano}</span>

        <div className="flex flex-row w-full p-2">
          <div className="flex flex-col w-1/2 p-2 justify-center items-center " >


            <span className="flex w-full border-b-[1px]  border-black"></span>
            <span className="pt-2  text-center ">{nome_dec}</span>
          </div>




          <div className="flex flex-col w-1/2 p-2 justify-center items-center " >
            <span className="flex w-full border-b-[1px]  border-black"></span>

            <span className="pt-2  text-center ">ASSISTEÊNCIA FAMILIAR PARAISO</span>
          </div>

        </div>

        <span className="p-2 text-center">Cedro - {new Date().toLocaleDateString('pt-BR', {
          weekday: 'long', // Dia da semana por extenso
          year: 'numeric', // Ano completo
          month: 'long', // Mês por extenso
          day: 'numeric'
        })}</span>
      </div>
    );
  }
}

export default OrdemServico;
