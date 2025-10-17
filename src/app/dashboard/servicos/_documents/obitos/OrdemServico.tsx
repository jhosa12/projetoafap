import Image from "next/image";
import logo from "../../../../../../public/novaLogo.png";
import React, { forwardRef } from "react";
import { ArrayProdutoProps } from "@/app/dashboard/admcontrato/_types/array-produtos";
import { ObitoProps } from "../../_types/obito";
import { EmpresaProps } from "@/types/empresa";

interface DadosProps {
 data:Partial<ObitoProps>
 empresa:EmpresaProps|null
}


const OrdemServico = forwardRef<HTMLDivElement, Partial<DadosProps>>((
  {
  data,
  empresa
  },
  ref
) => {
  const formatDate = (date?: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const formatTime = (time?: Date) => {
    if (!time) return "-";
    return new Date(time).toLocaleTimeString("pt-BR", {
    //timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value?: number | string | null) => {
    if (!value || value === null) return "0,00";
    return Number(value).toFixed(2).replace(".", ",");
  };

  const totalServicos = data?.obito_itens?.reduce(
    (acc, item) => acc + Number(item.valor_total || 0),
    0
  );

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

      {/* Document Title */}
      <div className="bg-gray-800 text-white text-center py-1 mb-2">
        <h2 className="text-xs font-bold uppercase tracking-wide">
        {`Ordem de Serviço Funerário - o.s. nº ${data?.id_obitos}`}
        </h2>
      </div>
      {/* Service Information */}
      <div className="mb-2">
        <h3 className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 mb-1 uppercase border-l-4 border-gray-800">
          Informações do Atendimento
        </h3>
        <div className="grid grid-cols-5 gap-x-2 gap-y-1 px-2">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Tipo de Atendimento</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.tipo_atendimento || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Atendente</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.atendente || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Nº Contrato</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.id_contrato || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Plano</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.contrato?.planos?.descricao || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Situação</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.id_contrato_st || "-"}</span>
          </div>
        </div>
      </div>

      {/* Declarant Information */}
      <div className="mb-2">
        <h3 className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 mb-1 uppercase border-l-4 border-gray-800">
          Dados do Declarante
        </h3>
        <div className="grid grid-cols-4 gap-x-2 gap-y-1 px-2">
          <div className="flex flex-col col-span-3">
            <span className="text-[9px] text-gray-500 font-medium">Nome</span>
            <span className="text-[10px] whitespace-nowrap font-semibold text-gray-900">{data?.rd_nome || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">CPF/CNPJ</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.cpf_cnpj || "-"}</span>
          </div>
          <div className="flex flex-col col-span-4">
            <span className="text-[9px] text-gray-500 font-medium">Endereço</span>
            <span className="text-[10px] font-semibold text-gray-900">
              {data?.rd_endereco}, Nº {data?.rd_numero} - {data?.rd_bairro} - {data?.rd_cidade}/{data?.rd_uf}
            </span>
          </div>
        </div>
      </div>
      {/* Deceased Information */}
      <div className="mb-2">
        <h3 className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 mb-1 uppercase border-l-4 border-gray-800">
          Dados do Falecido
        </h3>
        <div className="grid grid-cols-4 gap-x-2 gap-y-1 px-2">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Nome Completo</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.nome_falecido || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Data de Nascimento</span>
            <span className="text-[10px] font-semibold text-gray-900">{formatDate(data?.data_nascimento)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Naturalidade</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.naturalidade || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Estado Civil</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.estado_civil || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Nome do Pai</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.nome_pai || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Nome da Mãe</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.nome_mae || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Religião</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.religiao || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Profissão</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.profissao || "-"}</span>
          </div>
          <div className="flex flex-col col-span-4">
            <span className="text-[9px] text-gray-500 font-medium">Endereço</span>
            <span className="text-[10px] font-semibold text-gray-900">
              {data?.end_rua}, Nº {data?.end_numero} - {data?.end_bairro} - {data?.end_cidade}/{data?.end_uf}
            </span>
          </div>
        </div>
      </div>

      {/* Death Information */}
      <div className="mb-2">
        <h3 className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 mb-1 uppercase border-l-4 border-gray-800">
          Informações do Óbito
        </h3>
        <div className="grid grid-cols-4 gap-x-2 gap-y-1 px-2">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Data do Falecimento</span>
            <span className="text-[10px] font-semibold text-gray-900">{formatDate(data?.end_data_falecimento)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Hora do Falecimento</span>
            <span className="text-[10px] font-semibold text-gray-900">{formatTime(data?.end_hora_falecimento)}</span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-[9px] text-gray-500 font-medium">Local do Falecimento</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.end_local_falecimento || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Médico Responsável</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.dc_nome_medico || "-"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">CRM</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.dc_crm || "-"}</span>
          </div>
          <div className="flex flex-col col-span-4">
            <span className="text-[9px] text-gray-500 font-medium">Laudo Médico</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.dc_laudo_med || "-"}</span>
          </div>
        </div>
      </div>

      {/* Burial Information */}
      <div className="mb-2">
        <h3 className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 mb-1 uppercase border-l-4 border-gray-800">
          Informações do Sepultamento
        </h3>
        <div className="grid grid-cols-4 gap-x-2 gap-y-1 px-2">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Data do Sepultamento</span>
            <span className="text-[10px] font-semibold text-gray-900">{formatDate(data?.dt_sepultamento)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 font-medium">Hora do Sepultamento</span>
            <span className="text-[10px] font-semibold text-gray-900">{formatTime(data?.dt_sepultamento)}</span>
          </div>
          <div className="flex flex-col ">
            <span className="text-[9px] text-gray-500 font-medium">Cemitério</span>
            <span className="text-[10px] font-semibold text-gray-900">{data?.cemiterio || "-"}</span>
          </div>
          <div className="flex flex-col ">
            <span className="text-[9px] text-gray-500 font-medium">Tipo de Inumação</span>
            <span className="text-[10px] font-semibold text-gray-900">{"-"}</span>
          </div>
        </div>
      </div>

      {/* Observations */}
      {data?.observacoes_gerais && (
        <div className="mb-2">
          <h3 className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 mb-1 uppercase border-l-4 border-gray-800">
            Observações
          </h3>
          <div className="px-2">
            <p className="text-[9px] text-gray-900 whitespace-pre-line uppercase">{data?.observacoes_gerais}</p>
          </div>
        </div>
      )}

      {/* Products/Services Table */}
      <div className="mb-2">
        <h3 className="text-[10px] font-bold text-gray-800 bg-gray-100 px-2 py-0.5 mb-1 uppercase border-l-4 border-gray-800">
          Produtos e Serviços
        </h3>
        <div className="border border-gray-300">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr className="text-[9px]">
                <th className="px-1.5 py-0.5 text-left font-semibold border-b border-gray-300">
                  Descrição
                </th>
                <th className="px-1.5 py-0.5 text-center font-semibold border-b border-l border-gray-300 w-10">
                  Qtd
                </th>
                <th className="px-1.5 py-0.5 text-right font-semibold border-b border-l border-gray-300 w-16">
                  Valor Unit.
                </th>
                <th className="px-1.5 py-0.5 text-right font-semibold border-b border-l border-gray-300 w-14">
                  Desconto
                </th>
                <th className="px-1.5 py-0.5 text-right font-semibold border-b border-l border-gray-300 w-14">
                  Acréscimo
                </th>
                <th className="px-1.5 py-0.5 text-right font-semibold border-b border-l border-gray-300 w-16">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.obito_itens?.map((servico, index) => (
                <tr
                  key={servico.id_ob_itens || index}
                  className="text-[9px] border-b border-gray-200 last:border-0"
                >
                  <td className="px-1.5 py-0.5 text-gray-900">
                    {servico.descricao_item || "-"}
                  </td>
                  <td className="px-1.5 py-0.5 text-center border-l border-gray-200">
                    {servico.quantidade || 0}
                  </td>
                  <td className="px-1.5 py-0.5 text-right border-l border-gray-200">
                    R$ {formatCurrency(servico.valor_unit)}
                  </td>
                  <td className="px-1.5 py-0.5 text-right border-l border-gray-200">
                    R$ {formatCurrency(servico.desconto)}
                  </td>
                  <td className="px-1.5 py-0.5 text-right border-l border-gray-200">
                    R$ {formatCurrency(servico.acrescimo)}
                  </td>
                  <td className="px-1.5 py-0.5 text-right font-semibold border-l border-gray-200">
                    R$ {formatCurrency(servico.valor_total)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100">
                <td
                  colSpan={5}
                  className="px-1.5 py-0.5 text-right font-bold text-[9px] text-gray-900 border-t-2 border-gray-300"
                >
                  VALOR TOTAL:
                </td>
                <td className="px-1.5 py-0.5 text-right font-bold text-[9px] text-gray-900 border-t-2 border-l border-gray-300">
                  R$ {formatCurrency(totalServicos)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Benefits */}
      {/* {data?.contrato?.planos?.informacoes_plano && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-2 mb-3 uppercase border-l-4 border-gray-800">
            Benefícios do Plano
          </h3>
          <div className="px-3">
            <p className="text-xs text-gray-900 whitespace-pre-line">
              {data?.contrato?.planos?.informacoes_plano}
            </p>
          </div>
        </div>
      )} */}

      {/* Signatures */}
      <div className="mt-8 pt-3 ">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-full border-[1px] border-gray-800 mb-1"></div>
            <span className="text-[9px] font-semibold text-gray-900 text-center">
              {data?.rd_nome || "Declarante"}
            </span>
            <span className="text-[9px] text-gray-600 text-center">
              Assinatura do Declarante
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full border-[1px] border-gray-800 mb-1"></div>
            <span className="text-[9px] font-semibold text-gray-900 text-center">
              {empresa?.fantasia}
            </span>
            <span className="text-[9px] text-gray-600 text-center">
              Assinatura do Responsável
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 text-center">
        <p className="text-[9px] text-gray-600">
          Cedro - {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
});

OrdemServico.displayName = "OrdemServico";

export default OrdemServico;
