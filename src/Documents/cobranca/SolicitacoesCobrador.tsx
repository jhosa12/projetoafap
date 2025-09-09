import { SolicitacaoCobradorProps } from "@/app/dashboard/cobranca/types/types";
import { roboto_Mono } from "@/fonts/fonts";
import { forwardRef } from "react";

interface SolicitacoesCobradorProps {
  solicitacoes: SolicitacaoCobradorProps[];
  dataEmissao?: Date;
  consultor:string
}

export const SolicitacoesCobrador = forwardRef<HTMLDivElement, SolicitacoesCobradorProps>(({ solicitacoes, dataEmissao = new Date(),consultor }, ref) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const font = roboto_Mono.className

  if(!font) return null

  return (
    <div ref={ref} className={`${font}`}>
      {/* Cabeçalho */}
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold mb-2">SOLICITAÇÕES PARA COBRANÇA</h1>
        <p className="text-sm text-gray-600">Emitido em: {formatDate(dataEmissao)}</p>
        <p className="text-sm text-gray-600">Consultor: {consultor}</p>
      </div>

      {/* Tabela de Solicitações */}
      <div >
        <table className="min-w-full border border-gray-200 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2 text-left">ID</th>
              <th className="border px-2 py-2 text-left">Contrato</th>
              <th className="border px-2 py-2 text-left">Cliente</th>
              <th className="border px-2 py-2 text-left">Categoria</th>
              <th className="border px-2 py-2 text-left">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {solicitacoes?.map((solicitacao, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border px-2 py-2">{solicitacao.id_global}</td>
                <td className="border px-2 py-2">{solicitacao.id_contrato}</td>
                <td className="border px-2 py-2">{solicitacao.nome_cliente}</td>
                <td className="border px-2 py-2">{solicitacao.categoria}</td>
                <td className="border px-2 py-2">{solicitacao.descricao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Rodapé */}
      <div className="mt-8 text-sm text-gray-600">
        <p>Total de solicitações: {solicitacoes?.length}</p>
      </div>
    </div>
  );
});