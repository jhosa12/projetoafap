// DocumentTemplate.js

import React, { forwardRef } from 'react';
import { AssociadoProps, ContratoProps } from "@/app/dashboard/admcontrato/_types/associado";
import { EmpresaProps } from "@/types/empresa";
import { roboto_Mono } from '@/fonts/fonts';
interface DadosProps {
  dados: Partial<AssociadoProps>
  infoEmpresa: EmpresaProps | null
}
const ContratoResumo = forwardRef<HTMLDivElement, DadosProps>(({ dados, infoEmpresa }, ref) => {

    return (
      <div ref={ref} className={`flex flex-col w-full ${roboto_Mono.className}`} style={{ fontSize: '12px' }}>
        <div className="flex  w-full justify-center items-center mt-4">
          <img width={150} height={150} src={infoEmpresa?.logoUrl} alt="" />
        </div>
        <h1 className=' text-lg text-center font-semibold mt-2'>RESUMO DE CONTRATO</h1>
        <h2 style={{ display: 'flex', width: '100%', padding: 1, backgroundColor: 'gray', color: 'white', fontSize: '15px', paddingLeft: '16px' }} >DADOS DO CONTRATO</h2>
        <div style={{ display: 'flex', width: '100%', padding: 1, justifyContent: 'space-between' }}>
          <span><b>Contrato:</b> {dados.contrato?.id_contrato}</span>
          <span><b>Plano:</b> {dados.contrato?.plano}</span>
          <span><b>Mensalidade:</b> {dados.contrato?.valor_mensalidade}</span>
          <span><b>Data Adesão:</b> {dados.contrato?.dt_adesao && new Date(dados.contrato?.dt_adesao).toLocaleDateString('pt-BR')}</span>
        </div>
        <div style={{ display: 'flex', width: '100%', padding: 1, justifyContent: 'space-between' }}>
          <span><b>Consultor:</b> {dados.contrato?.consultor}</span>
          <span><b>Cobrador:</b> {dados.contrato?.cobrador}</span>
          <span><b>Acréscimo:</b> { }</span>
          <span><b>Carência:</b> {dados.contrato?.dt_carencia && new Date(dados.contrato?.dt_carencia).toLocaleDateString('pt-BR')}</span>
        </div>
        <div style={{ display: 'flex', width: '100%', padding: 1, justifyContent: 'space-between' }}>
          <span><b>Situação:</b> {dados.contrato?.situacao}</span>
          <span><b>Desconto:</b> { }</span>
          <span><b>Data Cancelamento:</b>{dados.contrato?.dt_cancelamento && new Date(dados.contrato?.dt_cancelamento).toLocaleDateString('pt-BR')}</span>

        </div>
        <h2 style={{ display: 'flex', width: '100%', padding: 1, backgroundColor: 'gray', color: 'white', fontSize: '15px', paddingLeft: '16px' }} >DADOS DO TITULAR</h2>
        <div style={{ display: 'flex', width: '100%', padding: 1, justifyContent: 'space-between' }}>
          <span><b>Nome:</b> {dados.nome}</span>
          <span><b>CPF:</b> {dados.cpfcnpj}</span>
          <span><b>RG:</b> {dados.rg}</span>
          <span><b>Est. Civil:</b> { }</span>
        </div>

        <div style={{ display: 'flex', width: '100%', padding: 1, justifyContent: 'space-between' }}>
          <span><b>Data Nasc.:</b> {dados.data_nasc && new Date(dados.data_nasc).toLocaleDateString('pt-BR')}</span>
          <span><b>Idade:</b> { }</span>
          <span><b>Religião:</b> { }</span>
          <span><b>Profissão:</b> {dados.profissao}</span>
        </div>

        <div style={{ display: 'flex', width: '100%', padding: 1, justifyContent: 'space-between' }}>

          <span><b>Telefone:</b> {dados.telefone}</span>
          <span><b>Celular:</b> {dados.celular1}</span>
          <span><b>Email:</b> {dados.email}</span>
        </div>
        <div style={{ display: 'flex', width: '100%', padding: 1, justifyContent: 'space-between' }}>

          <span><b>Endereço:</b> {dados.endereco}</span>
          <span><b>Nº:</b> {dados.numero}</span>
          <span><b>Bairro:</b> {dados.bairro}</span>
          <span><b>Cidade:</b> {dados.cidade}/{dados.uf}</span>
        </div>


        <h2 style={{ display: 'flex', width: '100%', padding: 1, backgroundColor: 'gray', color: 'white', fontSize: '15px', paddingLeft: '16px' }} >DEPENDENTES</h2>
        <div style={{ display: 'flex', width: '100%', padding: 1, fontSize: '12px' }}>
          <table>

            <tr style={{ paddingRight: 10, paddingLeft: 10 }} >
              <th style={{ paddingRight: 10, paddingLeft: 10 }}>Nome</th>
              <th style={{ paddingRight: 10, paddingLeft: 10 }}>Data Nasc</th>
              <th style={{ paddingRight: 10, paddingLeft: 10 }}>Adesão</th>
              <th style={{ paddingRight: 10, paddingLeft: 10 }}>Carência</th>
              <th style={{ paddingRight: 10, paddingLeft: 10 }}>Parentesco</th>
              <th style={{ paddingRight: 10, paddingLeft: 10 }}>Religião</th>
            </tr>


            {dados.dependentes?.map((item, index) => (
              <tr style={{ paddingRight: 10, paddingLeft: 10 }} key={index}>
                <td style={{ paddingRight: 10, paddingLeft: 10 }}>{item.nome}</td>
                <td style={{ paddingRight: 10, paddingLeft: 10 }}>{item.data_nasc && new Date(item.data_nasc).toLocaleDateString('pt-BR')}</td>
                <td style={{ paddingRight: 10, paddingLeft: 10 }}>{item.data_adesao && new Date(item.data_adesao).toLocaleDateString('pt-BR')}</td>
                <td style={{ paddingRight: 10, paddingLeft: 10 }}>{item.carencia && new Date(item.carencia).toLocaleDateString('pt-BR')}</td>
                <td style={{ paddingRight: 10, paddingLeft: 10 }}>{item.grau_parentesco}</td>
                <td style={{ paddingRight: 10, paddingLeft: 10 }}>{ }</td>
              </tr>
            ))}

          </table>
        </div>
        <h2 style={{ display: 'flex', width: '100%', padding: 1, backgroundColor: 'gray', color: 'white', fontSize: '15px', paddingLeft: '16px' }} >MENSALIDADES</h2>

        <div style={{ display: 'flex', width: '100%', padding: 1, fontSize: '12px' }}>
          <table>

            <tr style={{ paddingRight: 7, paddingLeft: 7 }} >
              <th style={{ paddingRight: 7, paddingLeft: 7 }}>Parc.Nº</th>
              <th style={{ paddingRight: 7, paddingLeft: 7 }}>Documento</th>
              <th style={{ paddingRight: 7, paddingLeft: 7 }}>Valor</th>
              <th style={{ paddingRight: 7, paddingLeft: 7 }}>Vencimento</th>
              <th style={{ paddingRight: 7, paddingLeft: 7 }}>Cobrança</th>
              <th style={{ paddingRight: 7, paddingLeft: 7 }}>Situação</th>
              <th style={{ paddingRight: 7, paddingLeft: 7 }}>Data Pagto</th>
              <th style={{ paddingRight: 7, paddingLeft: 7 }}>Valor Pago</th>
            </tr>


            {dados.mensalidade?.map((item, index) => (
              <tr style={{ paddingRight: 7, paddingLeft: 7, lineHeight: 1, fontSize: '11px' }} key={index}>
                <td style={{ paddingRight: 7, paddingLeft: 7, textAlign: 'center' }}>{item.parcela_n}</td>
                <td style={{ paddingRight: 7, paddingLeft: 7, textAlign: 'center' }}>{item.n_doc}</td>
                <td style={{ paddingRight: 7, paddingLeft: 7, textAlign: 'center' }}>{Number(item.valor_principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td style={{ paddingRight: 7, paddingLeft: 7, textAlign: 'center' }}>{item.vencimento && new Date(item.vencimento).toLocaleDateString('pt-BR')}</td>
                <td style={{ paddingRight: 7, paddingLeft: 7, textAlign: 'center' }}>{item.cobranca && new Date(item.cobranca).toLocaleDateString('pt-BR')}</td>
                <td style={{ paddingRight: 7, paddingLeft: 7, fontWeight: 'bold', textAlign: 'center', color: item.status === 'P' ? 'green' : 'red' }}>{item.status}</td>
                <td style={{ paddingRight: 7, paddingLeft: 7, textAlign: 'center' }}>{item.data_pgto && new Date(item.data_pgto).toLocaleDateString('pt-BR')}</td>
                <td style={{ paddingRight: 7, paddingLeft: 7, textAlign: 'center' }}>{Number(item.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>

              </tr>
            ))}

          </table>
        </div>
        <span>Pagas: {dados.mensalidade?.reduce((acc, curr) => curr.status === 'P' ? acc + 1 : acc, 0)}</span>

        <span>Aberto: {dados.mensalidade?.reduce((acc, curr) => curr.status !== 'P' ? acc + 1 : acc, 0)}</span>





      </div>
    );
});

export default ContratoResumo;




