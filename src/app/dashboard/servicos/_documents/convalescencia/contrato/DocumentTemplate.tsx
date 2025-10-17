import { ProdutosProps } from "@/types/produtos";
import Image from "next/image";
import { forwardRef } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Types and Interfaces

interface DadosProps {
  nome: string;
  cpf: string;
  rg: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  telefone: string;
  contrato: number;
  material: ProdutosProps[];
}

const formatPhoneNumber = (phone: string) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
};

const formatCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const DocumentTemplateContrato = forwardRef<HTMLDivElement, DadosProps>(({
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
}, ref) => {
  const dataAtual = new Date();
  const dataFormatada = format(dataAtual, "'CEDRO-CE, 'dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const clausulas = [
    "O beneficiário, salvo as regras que importem na segurança do uso do material LOCADO, obriga-se a devolver o material em boas condições de uso, higiene e limpeza como: pintura, proteção plástica, rodas, etiquetas de segurança e demais acessórios em perfeito estado de conservação e funcionamento, caso contrário o locador terá todo o direito a retenção do material LOCADO, ou caso de dano, uma indenização de 50% (cinquenta por cento) do valor de venda de mercado do material.",
    "O objetivo deste contrato destina-se exclusivamente para uso pessoal de seus associados e dependentes. Não podendo sua destinação a terceiros. O objetivo desta LOCAÇÃO é oferecer fácil locomoção, segurança e conforto para os pacientes que fazem uso do mesmo.",
    "Será cobrado o valor de R$ ___________ mensalmente."
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white text-gray-800 font-sans" ref={ref}>
      {/* Cabeçalho */}
      <header className="border-b-2 border-gray-200 pb-6 mb-8">
        <div className="flex justify-center mb-4">
          <Image 
            src={"/novaLoga.png"} 
            alt="Logo da AFAP" 
            width={180}
            height={72}
            className="h-auto"
            priority
          />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 uppercase tracking-wide">
          Assistência Familiar Paraíso
        </h1>
        <p className="text-lg md:text-xl font-semibold text-center text-gray-700 mt-2 uppercase">
          Freitas Neto Comércio e Serviços Funerários LTDA-ME
        </p>
        
        <div className="mt-4 text-center text-sm text-gray-600 space-y-1">
          <p>CNPJ: 16.784.573/0001-93 | Insc. Est.:</p>
          <p>Rua Adalto Castelo, 393, Centro - CEP: 63.000-000 - Cedro/CE</p>
          <p>Telefone: {formatPhoneNumber(telefone)} | E-mail: atendimento@afap.com.br</p>
        </div>
      </header>

      {/* Título do Contrato */}
      <h2 className="text-xl font-bold text-center uppercase mb-8 tracking-wider border-b-2 border-t-2 border-gray-200 py-3">
        Contrato de Compromisso
      </h2>

      {/* Corpo do Contrato */}
      <div className="space-y-6 text-justify leading-relaxed">
        <p className="indent-8">
          Por este instrumento particular de contrato de locação, de um lado:
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-600">
          <p className="font-semibold mb-2">LOCADOR:</p>
          <p>ASSISTÊNCIA FAMILIAR PARAÍSO - FREITAS NETO COMÉRCIO E SERVIÇOS FUNERÁRIOS LTDA-ME</p>
          <p>CNPJ: 16.784.573/0001-93, estabelecida à Rua Adalto Castelo, 393, Centro, Cedro-CE.</p>
        </div>

        <p className="text-center font-medium">E DE OUTRO LADO:</p>

        <div className="bg-gray-50 p-4 rounded-md border-l-4 border-green-600">
          <p className="font-semibold mb-2">LOCATÁRIO:</p>
          <p>Sr(a). {nome.toUpperCase()}, brasileiro(a), portador(a) do CPF {formatCPF(cpf)} e RG {rg},</p>
          <p>residente e domiciliado(a) em {logradouro}, {bairro}, {cidade} - {uf}.</p>
          <p>Telefone: {formatPhoneNumber(telefone)}</p>
          <p>Contrato Nº: {contrato.toString().padStart(6, '0')}</p>
        </div>

        <p className="text-center font-medium my-6">
          As partes acima identificadas têm, entre si, justo e contratado o que segue:
        </p>

        {/* Cláusulas */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg border-b border-gray-200 pb-1">CLÁUSULAS E CONDIÇÕES GERAIS</h3>
          
          {clausulas.map((clausula, index) => (
            <div key={index} className="flex gap-3">
              <span className="font-bold">{index + 1}.</span>
              <p className="flex-1">{clausula}</p>
            </div>
          ))}
        </div>

        {/* Materiais */}
        <div className="mt-8">
          <h4 className="font-bold mb-3">RELACÃO DOS MATERIAIS LOCADOS:</h4>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {material?.map((produto, index) => (
                  <tr key={produto.id_produto} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.descricao}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{produto.quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-8 text-justify">
          E por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.
        </p>

        <div className="mt-16 flex flex-col items-center">
          <div className="w-full max-w-md text-center border-t-2 border-gray-300 pt-6">
            <p className="font-semibold">Cedro, {dataFormatada}</p>
            <div className="mt-12 space-y-2">
              <div className="h-0.5 bg-gray-300 w-full my-4"></div>
              <p>_________________________________________</p>
              <p className="text-sm text-gray-600">Assinatura do Contratante</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>Documento gerado eletronicamente - {new Date().toLocaleString('pt-BR')}</p>
        <p className="mt-1">Assinatura digital conforme MP 2.200-2/2001</p>
      </footer>
    </div>
  );
});

DocumentTemplateContrato.displayName = "DocumentTemplateContrato";

export default DocumentTemplateContrato;
