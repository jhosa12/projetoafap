
import { AcordoProps } from "@/app/dashboard/admcontrato/_types/acordos";
import { forwardRef } from "react";





interface Props{
    acordo:Partial<AcordoProps>
    empresa:{
        nome:string,
        endereco:string,
        cidade:string,
        uf:string,
        cnpj:string,
        telefone:string
    },
    associado:{
        nome:string,
        cpf:string,
        endereco:string,
        cidade:string,
        uf:string
    }

}


export const AcordoComprovante = forwardRef<HTMLDivElement, Props>(({acordo,empresa,associado},ref)=>{

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      };
      
    
    return(
        <div  ref={ref} className="p-6 max-w-4xl mx-auto bg-white text-gray-800">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">COMPROVANTE DE ACORDO</h1>
          <p className="text-sm text-gray-600">Nº {acordo.id_acordo?.toString().padStart(6, '0')}</p>
        </div>
  
        {/* Dados da Empresa */}
        <div className="mb-8 p-4 border-b">
          <h2 className="text-lg font-semibold mb-2">{empresa.nome}</h2>
          <p className="text-sm">{empresa.endereco}</p>
          <p className="text-sm">{empresa.cidade} - {empresa.uf}</p>
          <p className="text-sm">CNPJ: {empresa.cnpj}</p>
          <p className="text-sm">Telefone: {empresa.telefone}</p>
        </div>
  
        {/* Dados do Associado */}
        <div className="mb-8 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">DADOS DO ASSOCIADO</h3>
          <p><span className="font-medium">Nome:</span> {associado.nome}</p>
          <p><span className="font-medium">CPF:</span> {associado.cpf}</p>
          <p><span className="font-medium">Endereço:</span> {associado.endereco}</p>
          <p><span className="font-medium">Cidade/UF:</span> {associado.cidade}/{associado.uf}</p>
        </div>
  
        {/* Dados do Acordo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">DETALHES DO ACORDO</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-medium">Data do Acordo:</p>
              <p>{acordo.dt_criacao && new Date(acordo.dt_criacao).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="font-medium">Valor Total:</p>
              <p className="font-bold">{formatCurrency(acordo?.total_acordo??0)}</p>
            </div>
            <div>
              <p className="font-medium">Período:</p>
              <p>{acordo.data_inicio && new Date(acordo.data_inicio).toLocaleDateString('pt-BR')} a {acordo.data_fim && new Date(acordo.data_fim).toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="font-medium">Forma de Pagamento:</p>
              <p>{acordo.metodo}</p>
            </div>
            <div>
              <p className="font-medium">Status:</p>
              <p className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                acordo.status === 'Ativo' ? 'bg-green-100 text-green-800' : 
                acordo.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {acordo.status}
              </p>
            </div>
            <div>
              <p className="font-medium">Responsável:</p>
              <p>{acordo.realizado_por}</p>
            </div>
          </div>
  
          {acordo.descricao && (
            <div className="mt-4">
              <p className="font-medium">Observações:</p>
              <p className="text-sm italic">{acordo.descricao}</p>
            </div>
          )}
        </div>
  
        {/* Mensalidades do Acordo */}
        {acordo.mensalidadeAcordo && acordo.mensalidadeAcordo.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2 border-b pb-2">PARCELAS DO ACORDO</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">Parcela</th>
                    <th className="py-2 px-4 border-b text-left">Vencimento</th>
                    <th className="py-2 px-4 border-b text-right">Valor</th>
                    <th className="py-2 px-4 border-b text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {acordo.mensalidadeAcordo.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{index + 1}ª</td>
                      <td className="py-2 px-4 border-b">
                        {item.mensalidade.vencimento && new Date(item.mensalidade.vencimento).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-2 px-4 border-b text-right">
                        {item.mensalidade.valor_principal ? formatCurrency(Number(item.mensalidade.valor_principal)) : 'N/A'}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          item.mensalidade.status === 'Pago' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.mensalidade.status || 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
  
        {/* Rodapé */}
        <div className="mt-12 pt-4 border-t text-sm text-gray-600 text-center">
          <p>Este documento não substitui a via original do acordo.</p>
          <p className="mt-2">Emitido em: {new Date().toLocaleDateString('pt-BR')}</p>
          <div className="mt-8 pt-4 border-t">
            <p>_________________________________</p>
            <p>Assinatura do Responsável</p>
          </div>
        </div>
      </div>
    )
})