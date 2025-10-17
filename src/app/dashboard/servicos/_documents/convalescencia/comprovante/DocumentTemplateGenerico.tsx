import { ProdutosProps } from "@/types/produtos";
import Image from "next/image";
import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DadosProps {
  nome: string;
  cpf?: string;
  endereco?: string;
  telefone?: string;
  itens?: Array<{
    descricao: string;
    quantidade: number;
    observacao?: string;
  }>;
}

const DocumentTemplateComprovanteGenerico = forwardRef<HTMLDivElement, DadosProps>((props, ref) => {
  const { 
    nome, 
    cpf = 'Não informado',
    endereco = 'Não informado',
    telefone = 'Não informado',
    itens = []
  } = props;

  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(currentDate, "HH:mm's'", { locale: ptBR });

  return (
    <div ref={ref} className="w-full max-w-4xl mx-auto p-6 bg-white text-gray-800">
      {/* Cabeçalho */}
      <div className="border-b-2 border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <Image 
                src={"/novaLogo.png"} 
                alt="Logo da AFAP" 
                width={160} 
                height={64} 
                className="h-16 w-auto"
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-800">AFAP</h1>
                <p className="text-sm text-gray-600">Assistencia Familiar Paraiso</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Comprovante de Devolução</p>
            <p className="text-xs text-gray-500">Nº {Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
          </div>
        </div>
      </div>

      {/* Dados do Cliente */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Dados do Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Nome:</p>
            <p className="text-gray-900">{nome}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">CPF:</p>
            <p className="text-gray-900">{cpf}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Endereço:</p>
            <p className="text-gray-900">{endereco}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Telefone:</p>
            <p className="text-gray-900">{telefone}</p>
          </div>
        </div>
      </div>

      {/* Itens Devolvidos */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Itens Devolvidos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {itens.length > 0 ? (
                itens.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.descricao}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.quantidade}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{item.observacao || 'Nenhuma'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">
                    Nenhum item listado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assinaturas */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="h-20 border-b border-gray-300 mb-2"></div>
            <p className="text-sm font-medium text-gray-700">Assinatura do Recebedor</p>
          </div>
          <div className="text-center">
            <div className="h-20 border-b border-gray-300 mb-2"></div>
            <p className="text-sm font-medium text-gray-700">Assinatura do Responsável</p>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-10 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        <p>Documento gerado em {formattedDate} às {formattedTime}</p>
        <p className="mt-1">Este é um documento gerado automaticamente. Em caso de dúvidas, entre em contato conosco.</p>
        <p className="mt-2 text-gray-400">AFAP © {currentDate.getFullYear()} - Todos os direitos reservados</p>
      </div>
    </div>
  );
});

DocumentTemplateComprovanteGenerico.displayName = "DocumentTemplateComprovanteGenerico";
export default DocumentTemplateComprovanteGenerico;
