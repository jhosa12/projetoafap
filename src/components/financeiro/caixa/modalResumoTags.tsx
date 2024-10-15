import { CaixaProps } from "@/pages/financeiro";
import { ar } from "date-fns/locale";
import { Button, Modal, Table } from "flowbite-react";
import { useCallback, useEffect, useMemo } from "react";
import { Caixa } from "./caixa";

interface DataProps {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    array:Array<CaixaProps>
    tag:string
}


export function ModalResumoTags({openModal,setOpenModal,array,tag}:DataProps) {


 const handleSelecao= useMemo(() => { 
    return array.filter((item: CaixaProps )=> item?.mensalidade?.form_pagto === tag)
    },[tag])

    return (
        <Modal
        className="absolute bg-gray-600 overflow-y-auto"
        content={"base"}
        show={openModal}
        onClose={() => setOpenModal(false)}
        size={'5xl'}
        popup
        dismissible
      >
        <Modal.Header className="flex text-white items-start justify-between bg-gray-800 rounded-t border-b p-2 border-gray-60">
          <h1 className="text-white">RESUMO DE LANÇAMENTOS</h1>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <Table hoverable theme={{head:{cell:{base:"bg-gray-50 px-6 py-1 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg dark:bg-gray-700"}}, body: { cell: { base: " px-6 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs text-black" } } }} >
              <Table.Head>

                <Table.HeadCell>Data</Table.HeadCell>
                <Table.HeadCell>Banco</Table.HeadCell>
                <Table.HeadCell>Documento</Table.HeadCell>
                <Table.HeadCell>Histórico</Table.HeadCell>
                <Table.HeadCell>Valor</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y text-xs text-black font-semibold" theme={{ cell: { base: 'px-4 py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg' } }}>
                {handleSelecao.map((item) =>
                (<Table.Row className="bg-white">

                  <Table.Cell>{new Date(item.datalanc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>
                  <Table.Cell>{item.mensalidade.banco_dest?item?.mensalidade?.banco_dest:item?.mensalidade?.form_pagto}</Table.Cell>
                  <Table.Cell>{item.descricao}</Table.Cell>
                  <Table.Cell>{item.historico}</Table.Cell>

                  <Table.Cell>{Number(item.valor).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}</Table.Cell>

                </Table.Row>)
                )}
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" className="bg-gray-400"  onClick={() => { }}>
           Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    )
}