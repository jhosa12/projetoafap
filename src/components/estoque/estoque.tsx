import { EstoqueProps, FormProps, ProdutosProps } from "@/pages/dashboard/estoque"
import { Spinner, Table } from "flowbite-react"
import { useContext, useEffect, useRef, useState } from "react";
import { ModalMov } from "../modals/estoque/modalMovimentacao";
import { ModalNovoProduto } from "../modals/estoque/modalNovoProduto";
import { RiAlertLine } from "react-icons/ri";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { FiltroEstoque } from "./PopoverFiltro";
import { TbTransferVertical } from "react-icons/tb";
import useApi from "@/hooks/useApiPost";
import { EmpresaProps } from "@/types/empresa";
import { HiPrinter } from "react-icons/hi2";
import { useReactToPrint } from "react-to-print";
import {RelatorioEstoque} from "../../documents/estoque/RelatorioEstoque";
import pageStyle from "@/utils/pageStyle";
import { Button } from "../ui/button";
import { AuthContext } from "@/store/AuthContext";



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
  const componentRef = useRef<RelatorioEstoque>(null);
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

    content: () => componentRef.current,


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

      {mov && <ModalMov permissoes={permissoes} setModalNovo={setOpenModal} reqDadosEstoq={postData} id_usuario={usuario?.id ?? ''} usuario={usuario?.nome ?? ''} empresas={empresas} produtos={selectProdutos ?? []} setOpenModal={setMov} />}
      {openModal && <ModalNovoProduto reqProdutos={reqProdutos} reqDadosEstoq={postData} permissoes={permissoes} openModal={openModal} setOpenModal={setOpenModal} />}

      <div className="inline-flex w-full justify-end items-end gap-4 text-black">

        <FiltroEstoque id_empresa={infoEmpresa?.id} produtos={selectProdutos ?? []} loading={loading} filtroEstoque={postData} />
        <Button variant={'outline'} onClick={() => setMov(true)} size={'sm'}><TbTransferVertical /> Movimentar</Button>

        <Button variant={'outline'} onClick={() => setOpenModal(true)} size={'sm'}><MdOutlinePlaylistAdd />Novo Produto</Button>

        <Button variant={'outline'} onClick={handleImpressao} size={'sm'}><HiPrinter />Imprimir</Button>
      </div>

      {loading ?

        <div className="flex items-center justify-center h-[calc(100vh-170px)]">
          <Spinner size="xl" />
        </div>
        :



        <div className=" overflow-y-auto mt-2 px-2 max-h-[calc(100vh-170px)] bg-white  rounded-lg ">
          <Table hoverable theme={{ root: { shadow: 'none' }, body: { cell: { base: " px-3 py-1 text-[11px] text-black" } }, head: { cell: { base: "px-3 py-1 text-[12px] text-black border-b-[1px] border-black" } } }}  >
            <Table.Head >
              <Table.HeadCell >
                EMPRESA
              </Table.HeadCell>
              <Table.HeadCell >
                DESCRIÇÃO
              </Table.HeadCell>
              <Table.HeadCell >
                QUANTIDADE
              </Table.HeadCell>
              <Table.HeadCell >
                CODIGO PRODUTO
              </Table.HeadCell>



            </Table.Head>
            <Table.Body className="divide-y">
              {data?.map((item, index) => (

                <>
                  <Table.Row className="bg-white cursor-pointer " key={index} onClick={() => toogleAberto(index)} >

                    <Table.Cell>
                      {item?.empresa}
                    </Table.Cell>
                    <Table.Cell >
                      {item?.produtos?.descricao}
                    </Table.Cell>


                    <Table.Cell className="text-black   inline-flex items-center gap-2">
                      {item?.quantidade} {item?.quantidade === 0 && <RiAlertLine size={18} color="red" />}
                    </Table.Cell>
                    <Table.Cell className="text-black  ">
                      {item?.produtos?.cod_prod}
                    </Table.Cell>


                  </Table.Row>

                </>
              ))}



            </Table.Body>

          </Table>



        </div>}

    </div>
  )
}