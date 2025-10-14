
import { Button, Modal, Table } from "flowbite-react";
import { useMemo, useState } from "react";
import { SomaProps } from "./caixa";
import { CaixaProps } from "../../../_types/ccustos";


interface DataProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  array: Array<CaixaProps> | null
  tag: string

}


export function ModalResumoTags({ openModal, setOpenModal, array, tag }: DataProps) {

  const [selectBanco, setSelectBanco] = useState<string>('TODOS')


  const handleSelecao = useMemo(() => {



    if (selectBanco === 'TODOS') {
      return tag === 'DINHEIRO' ? array?.filter((item: CaixaProps) => item.tipo === 'RECEITA' && (item.forma_pagamento === 'DINHEIRO' || item.forma_pagamento === null)) : array?.filter((item: CaixaProps) => item?.forma_pagamento === tag)
    } else {
      return tag === 'DINHEIRO' ? array?.filter((item: CaixaProps) => item.tipo === 'RECEITA' && (item.forma_pagamento === 'DINHEIRO' || item.forma_pagamento === null)) : array?.filter((item: CaixaProps) => item?.forma_pagamento === tag && item.banco === selectBanco)
    }
  }, [tag, selectBanco, array])
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
      <Modal.Header className="bg-gray-700 p-2" theme={{ title: "inline-flex w-full justify-between text-xl font-medium items-center" }} >
        <h1 className="text-white text-sm">RESUMO DE LANÇAMENTOS</h1>
        <select value={selectBanco} onChange={(e) => setSelectBanco(e.target.value)} className="bg-gray-700 cursor-pointer text-white border-none text-xs focus:outline-none focus:ring-0">
          <option>TODOS</option>
          <option>CORA</option>
          <option>BB</option>
          <option>PAGBANK</option>
          <option>CAIXA</option>
        </select>
      </Modal.Header>
      <Modal.Body>
        <div className="">
          <Table hoverable theme={{ root: { shadow: 'none' }, body: { cell: { base: "px-3 py-1 text-black font-medium text-[10px]" } }, head: { cell: { base: "px-3 py-1" } } }} >
            <Table.Head>

              <Table.HeadCell>Data</Table.HeadCell>
              <Table.HeadCell>Banco</Table.HeadCell>
              <Table.HeadCell>Documento</Table.HeadCell>
              <Table.HeadCell>Histórico</Table.HeadCell>
              <Table.HeadCell>Valor</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y" >
              {handleSelecao?.map((item, index) =>
              (<Table.Row key={index} className="bg-white">

                <Table.Cell>{new Date(item.datalanc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>
                <Table.Cell>{item.banco}</Table.Cell>
                <Table.Cell>{item.notafiscal ? item.notafiscal : item.descricao}</Table.Cell>
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

    </Modal>
  )
}