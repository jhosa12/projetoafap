import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useContext, useEffect, useRef, useState } from "react";
import { RiAlertLine } from "react-icons/ri";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FiltroEstoque } from "./modal-filtro-estoque";
import { TbTransferVertical } from "react-icons/tb";
import useApi from "@/hooks/useApiPost";
import { EmpresaProps } from "@/types/empresa";
import { HiPrinter } from "react-icons/hi2";
import { useReactToPrint } from "react-to-print";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { AuthContext } from "@/store/AuthContext";
import { pageStyle } from "@/utils/pageStyle";
import { RelatorioEstoque } from "@/Documents/estoque/RelatorioEstoque";
import { ModalMov } from "@/components/modals/estoque/modalMovimentacao";
import { ModalNovoProduto } from "@/components/modals/estoque/modalNovoProduto";
import { FormProps, ProdutosProps } from "../page";
import { EstoqueProps } from "../types/estoque";

interface DataProps {
  empresas: Array<EmpresaProps>
  selectProdutos: Array<ProdutosProps>,
  reqProdutos: () => Promise<void>,
  permissoes: Array<string>
}

export function Estoque({ empresas, selectProdutos, reqProdutos, permissoes }: DataProps) {
  const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
  const [mov, setMov] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { data, loading, postData } = useApi<Array<EstoqueProps>, FormProps>('/estoque/listar')
  const componentRef = useRef<HTMLDivElement>(null);
  const { usuario, infoEmpresa } = useContext(AuthContext)
  const handleFiltroEstoque = async () => {
    await postData({ grupo: '', descricao: '', id_produto: null, id_empresa: infoEmpresa?.id })
    //console.log(data)
  }

  useEffect(() => {
    handleFiltroEstoque()
  }, [infoEmpresa?.id])

  const handleImpressao = useReactToPrint({
    pageStyle: pageStyle,
    documentTitle: 'MOVIMENTAÇÃO DE ESTOQUE',
    contentRef: componentRef,
  })

  const toogleAberto = (index: number) => {
    setAbertos((prev: { [key: number]: boolean }) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[Number(key)] = false;
        return acc;
      }, {} as { [key: number]: boolean }),
      [index]: !prev[index]
    }));
  };

  return (
    <div className="flex-col w-full px-2    ">
      <div style={{ display: 'none' }}>
        <RelatorioEstoque usuario={usuario?.nome ?? ''} ref={componentRef} dados={data ?? []} />
      </div>

      {mov && <ModalMov permissoes={permissoes} setModalNovo={setOpenModal} reqDadosEstoq={postData} empresas={empresas} produtos={selectProdutos ?? []} setOpenModal={setMov} />}
      {openModal && <ModalNovoProduto reqProdutos={reqProdutos} reqDadosEstoq={postData} permissoes={permissoes} openModal={openModal} setOpenModal={setOpenModal} />}

      <div className="inline-flex w-full justify-end items-end gap-4 text-black">
        <FiltroEstoque id_empresa={infoEmpresa?.id} produtos={selectProdutos ?? []} loading={loading} filtroEstoque={postData} />
        <Button variant={'outline'} onClick={() => setMov(true)} size={'sm'}><TbTransferVertical /> Movimentar</Button>
        <Button variant={'outline'} onClick={() => setOpenModal(true)} size={'sm'}><MdOutlinePlaylistAdd />Novo Produto</Button>
        <Button variant={'outline'} onClick={handleImpressao} size={'sm'}><HiPrinter />Imprimir</Button>
      </div>

      {loading ?
        <div className="flex items-center justify-center h-[calc(100vh-170px)]">
          <Spinner />
        </div>
        :
        <div className=" overflow-y-auto mt-2 px-2 max-h-[calc(100vh-170px)] bg-white  rounded-lg ">
          <Table className="text-[12px] text-black">
            <TableHeader>
              <TableRow>
                <TableHead className="px-3 py-1 border-b">EMPRESA</TableHead>
                <TableHead className="px-3 py-1 border-b">DESCRIÇÃO</TableHead>
                <TableHead className="px-3 py-1 border-b">QUANTIDADE</TableHead>
                <TableHead className="px-3 py-1 border-b">CODIGO PRODUTO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {data?.map((item, index) => (
                <TableRow className="bg-white cursor-pointer" key={index} onClick={() => toogleAberto(index)}>
                  <TableCell className="px-3 py-1">{item?.empresa}</TableCell>
                  <TableCell className="px-3 py-1">{item?.produtos?.descricao}</TableCell>
                  <TableCell className="px-3 py-1 inline-flex items-center gap-2">
                    {item?.quantidade} {item?.quantidade === 0 && <RiAlertLine size={18} color="red" />}
                  </TableCell>
                  <TableCell className="px-3 py-1">{item?.produtos?.cod_prod}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>}
    </div>
  )
}