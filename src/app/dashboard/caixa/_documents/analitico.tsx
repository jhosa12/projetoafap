
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { roboto_Mono } from "@/fonts/fonts";
import { LancamentosProps } from "../_types/types";
import { SomaProps } from "../../financeiro/_components/tabs/caixa/caixa";




export function Analitico({ array, soma }: { array: Array<LancamentosProps>, soma: SomaProps }) {
    const receitas = array.filter(item => item.tipo === 'RECEITA').sort((a, b) => a.lanc_id - b.lanc_id);
    const despesas = array.filter(item => item.tipo === 'DESPESA').sort((a, b) => a.lanc_id - b.lanc_id);

    return (
        <div
        className={`${roboto_Mono.className} text-sm text-black w-full flex flex-col gap-10 print:p-0 print:m-0 print:w-full print:overflow-visible`}
    >
      {/* RECEITAS */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold tracking-wide text-green-700">Receitas</h2>
          <div className="flex-1 mx-4 border-b border-dotted border-black" />
          <span className="font-medium">
            {Number(soma?.total).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Histórico</TableHead>
              <TableHead>Forma Pagamento</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receitas.map((item, index) => (
              <TableRow className="text-xs" key={index}>
                <TableCell className="break-words whitespace-normal max-w-[100%] text-wrap">
                  {item.historico}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {item?.mensalidade?.form_pagto || "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right text-green-600 font-semibold">
                  {Number(item.valor).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* DESPESAS */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold tracking-wide text-red-700">Despesas</h2>
          <div className="flex-1 mx-4 border-b border-dotted border-black" />
          <span className="font-medium">
            {Number(soma?.despesas).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Histórico</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {despesas.map((item, index) => (
              <TableRow className="text-xs" key={index}>
                <TableCell className="max-w-[300px] truncate">
                  {item.historico}
                </TableCell>
                <TableCell className="text-right text-red-600 font-semibold">
                  {Number(item.valor).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* SALDO FINAL */}
      <div className="flex items-center justify-between text-base font-bold mt-6">
        <span>Saldo Final</span>
        <div className="flex-1 mx-4 border-b border-dotted border-black" />
        <span
          className={
            soma.total - soma.despesas >= 0
              ? "text-green-700"
              : "text-red-700"
          }
        >
          {(soma.total - soma.despesas).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
      </div>
    </div>
    );
}
