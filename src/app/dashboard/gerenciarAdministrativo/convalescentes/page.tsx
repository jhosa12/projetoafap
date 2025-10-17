'use client'
import { ProdutosProps } from "@/types/produtos";

import { columnsProdutos } from "../_components/produtosConvalescenca/columns-table-produtos";
import useActionsProdConvalescenca from "../_hooks/produtos-convalescenca/useActionsProdConvalescenca";
import { useContext, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ModalFormProduto from "../_components/produtosConvalescenca/modal-form-produto";
import { useHandleSalvarProduto } from "../_hooks/produtos-convalescenca/useHandleSalvarProduto";
import { AuthContext } from "@/store/AuthContext";
import { DataTable } from "@/components/ui/data-table";
import { useHandleExcluirProdutoConv } from "../_hooks/produtos-convalescenca/useHandleExcluirProdutoConv";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";


export default function ProdutosConvalescentes() {

  const { limparDados } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const [openConfirmarExclusao, setOpenConfirmarExclusao] = useState(false)
  const [excluirProduto, setExcluirProduto] = useState<Partial<ProdutosProps | null>>(null)
  const { produto, deletarProduto, listarProdutos, setProduto, onSave, listaProdutos } = useActionsProdConvalescenca()

  const handleSalvar = useHandleSalvarProduto({

    onSave,
    limparDados,
    setOpen,
    listarProdutos

  })

  const { confirmarExclusao } = useHandleExcluirProdutoConv({
    deletarProduto,
    listarProdutos
  })


  const colunasConv = useMemo(() => {

    return columnsProdutos({
      onEdit: (produto: ProdutosProps) => {
        setOpen(true)
        setProduto(produto)
      },
      onDelete: (produto: any) => {

        setOpenConfirmarExclusao(true)
        setExcluirProduto(produto)
      }
    })

  }, [])

  return (
    <div className="flex flex-col w-full h-screen lg:p-6 gap-2">
      <div className="flex-shrink-0 flex flex-col lg:flex-row w-full items-start lg:items-center justify-between gap-4 p-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Produtos Convalescença
        </h3>
        <Button
          onClick={() => {
            setProduto(null);
            setOpen(true);
          }}
          size="sm"
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>
      <DataTable
        columns={colunasConv}
        data={listaProdutos}
      />

      <ModalFormProduto
        isFormOpen={open}
        selectedProduto={produto}
        setIsFormOpen={() => {
          limparDados()
          setOpen(false)
        }}
        setSelectedProduto={setProduto}
        onSave={handleSalvar}
      />

      {openConfirmarExclusao &&
        <ModalConfirmar
          openModal={openConfirmarExclusao}
          setOpenModal={() => setOpenConfirmarExclusao(false)}
          handleConfirmar={async () => {
            await confirmarExclusao(excluirProduto)
            setExcluirProduto(null)
          }}
          pergunta="Deseja mesmo excluir este produto?"
        />
      }
    </div>
  )
}