'use client'
import { ProdutosProps } from "@/types/produtos";
import { DataTableGerenciar } from "../_components/data-table-gerenciar";
import { columnsProdutos } from "../_components/produtosConvalescenca/columns-table-produtos";
import useActionsProdConvalescenca from "../_hooks/produtos-convalescenca/useActionsProdConvalescenca";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ModalFormProduto from "../_components/produtosConvalescenca/modal-form-produto";
import { useHandleSalvarProduto } from "../_hooks/produtos-convalescenca/useHandleSalvarProduto";
import { AuthContext } from "@/store/AuthContext";

export default function ProdutosConvalescentes() {

  const { limparDados } = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const {produto, deletarProduto, listarProdutos, setProduto, onSave, listaProdutos } = useActionsProdConvalescenca()

  const handleSalvar = useHandleSalvarProduto({

    onSave,
    limparDados,
    setOpen,
    listarProdutos

  })

  return (
    <div className="px-6 mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold border-b-gray-300 text-gray-900">
          Produtos Convalescença
        </h2>
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
      <DataTableGerenciar
        columns={columnsProdutos({
          onEdit: (produto: ProdutosProps) => {
            setOpen(true)
            setProduto(produto)
          },
          onDelete: (produto: ProdutosProps) => deletarProduto(produto.id_produto)
        })}
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
    </div>
  )
}