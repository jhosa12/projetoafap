import { ProdutosProps } from "@/pages/estoque";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useState } from "react";


interface DataProps {   
   setOpenModal: (open: boolean) => void
    produtos:Array<ProdutosProps>
    handleAdd:({ id_produto, quantidade,produto }: { id_produto: number, quantidade: number,produto:string })=>void
  
}


export function ModalManual({produtos,handleAdd,setOpenModal}:DataProps) {
    const [id_produto, setId_produto] = useState(0)
    const [quantidade, setQuantidade] = useState(0)
    return (
        <Modal
        show    
        size="md"   
          onClose={() => setOpenModal(false)}
         
        >
            <Modal.Header>
                Adicionar Produto
            </Modal.Header>
            <Modal.Body>
                <div className="w-full space-y-2">
                    <div>
                    <div className="mb-0 block">
                        <Label htmlFor="nome" value="Nome do Produto" />
                    </div>
                 <Select onChange={e=>setId_produto(Number(e.target.value))}>
                     <option value={''}>Selecione</option>
                     {produtos.map((item)=><option key={item.id_produto} value={item.id_produto}>{item.descricao}</option>)}
                 </Select>
                 

                    </div>


                    <div>
                    <div className="mb-0 block">
                        <Label htmlFor="nome" value="Quantidade" />
                    </div>
                <TextInput id="quantidade" value={quantidade} onChange={e=>setQuantidade(Number(e.target.value))}  placeholder="Quantidade" required />
                 

                    </div>
                   

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                    Cancelar
                </Button>
                <Button onClick={() => handleAdd({id_produto,quantidade,produto:produtos.find(item=>item.id_produto===id_produto)?.descricao??''})}>
                    Adicionar
                </Button>
            </Modal.Footer> 
        </Modal>
    )
}