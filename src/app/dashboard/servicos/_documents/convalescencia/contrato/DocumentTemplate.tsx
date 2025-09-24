import { ProdutosProps } from "@/app/dashboard/admcontrato/_types/produtos";
import Image from "next/image";


// DocumentTemplate.js

import React, { forwardRef } from 'react';

export interface DadosProps {
  nome: string,
  cpf: string,
  rg: string,
  logradouro: string,
  bairro: string,
  cidade: string,
  uf: string,
  telefone: string,
  contrato: number,
  material: ProdutosProps[]
}

const DocumentTemplateContrato = forwardRef<HTMLDivElement, DadosProps>((props, ref) => {

  const {
    nome,
    cpf,
    rg,
    logradouro,
    bairro,
    cidade,
    uf,
    telefone,
    contrato,
    material
  } = props;

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long', // Dia da semana por extenso
    year: 'numeric', // Ano completo
    month: 'long', // Mês por extenso
    day: 'numeric' // Dia do mês
  };
  const dataAtual = new Date();
  const dt = dataAtual.toLocaleDateString('pt-BR', options)

  console.log("Conteudo chegado no documento contrato", props)

  return (
    <div className='flex flex-col w-full' ref={ref}>
      <div className="flex w-full justify-center mt-4">
        <Image className="flex w-40 h-16 mr-7 " src={"/logoafap.png"} alt="Logo da AFAP" width={160}
          height={64} />
      </div>

      <h2 className=' mt-4 text-2xl uppercase text-center font-bold'>Assistência Familiar Paraíso</h2>
      <p className='text-2xl uppercase text-center font-bold'>FREITAS NETO COMERCIO E SERVIÇOS FUNERARIOS LTDA-ME</p>
      <p className='text-center'>CNPJ: 16.784.573/0001-93 INSC. EST.:</p>
      <p className='text-center'>RUA ADALTO CASTELO, 393, CENTRO</p>
      <p className='text-center'>TELEFONE: (88)99711-3362</p>
      <h1 className='text-xl text-center font-semibold mt-2'>CONTRATO DE COMPROMISSO</h1>
      <p className='uppercase mx-5 p-2 text-justify'>
        OS SIGNATÁRIOS DE INSTRUMENTOS, DE UM LADO, A EMPRESA COM NOME FANTASIA
        ASSISTÊNCIA FAMILIAR PARAÍSO , E RAZÃO SOCIAL FREITAS NETO COMERCIO E
        SERVIÇOS FUNERARIOS LTDA-ME, INSCRITA NO CNPJ 16.784.573/0001-93, ESTABELECIDA A RUA ADALTO CASTELO, 393, CENTRO, CEDRO-CE.
      </p>
      <p className='uppercase mx-5 p-2 text-justify'>
        DE OUTRO LADO, O(A) SR,(A) {nome}, BRASILEIRO(A),
        PORTADOR(A) DO CPF {cpf} E RG {rg}, RESIDENTE E DOMICILIADO A {logradouro}, BAIRRO {bairro},
        CIDADE {cidade}, UF {uf}, TELEFONE {telefone}, CONTRATO Nº {contrato}.<br />
      </p>
      <p className='uppercase mx-5 p-2 text-justify'>
        Mutualmente convencionam, outorgam e aceitam a saber, as cláusulas e
        condições seguintes:<br />
        1- O beneficiário, salvo as regras que importem na segurança do uso do
        material LOCADO, obriga-se a devolver o material em boas condições de uso,
        higiene e limpeza como: pintura, proteção plástica, rodas, etiquetas de
        segurança e demais acessórios em perfeito estado de conservação e
        funcionamento, caso contrário o locador terá todo o direito a retenção do
        material LOCADO, ou caso de dano, uma indenização de 50% (cinquenta por
        cento) do valor de venda de mercado do material.<br /><br />
        2- O objetivo deste contrato destina-se exclusivamente para uso pessoal de
        seus associados e dependentes. Não podendo sua destinação a terceiros. O
        objetivo desta LOCAÇÃO é oferecer fácil locomoção, segurança e conforto para
        os pacientes que fazem uso do mesmo.<br /><br />
        3- Será cobrado o valor de R$ ___________ mensalmente.<br /><br />
        Assinam este contrato em duas vias de igual teor.<br /><br />
      </p>
      <div className="my-4">
        <span className="px-2 font-semibold">Materiais:</span>
        <ul className="list-disc pl-10 mt-2">
          {material?.map((produto) => (
            <li key={produto.id_produto} className="py-1">
               {produto.descricao}
            </li>
          ))}
        </ul>
      </div><br /><br /><br />
      CEDRO-CE, {dt}.
    </div>
  );
})


DocumentTemplateContrato.displayName = "DocumentTemplateComprovante";

export default DocumentTemplateContrato;
