import { AuthContext, EmpresaProps } from "@/contexts/AuthContext";
import { EstoqueProps, FormProps, ProdutosProps } from "@/pages/estoque";
import { api } from "@/services/apiClient";
import { Button, Label, Modal, ModalHeader, Select, TextInput } from "flowbite-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";





interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    empresas:Array<EmpresaProps>
    reqDadosEstoq:(dados:FormProps)=>Promise<void>
    reqProdutos:()=>Promise<void>
}

interface FormDataProps{
  id_usuario:number,
  cod_prod:string,
  descricao:string,
  grupo:string,
 // id_empresa:string,
 // id_produto:number,
  alerta:number
}

export function ModalNovoProduto({openModal,setOpenModal,empresas,reqProdutos}:DataProps){

 const [form,setForm] = useState<Partial<FormDataProps>>()

const novoProduto= async()=>{
  try {
    const response = await toast.promise(
      api.post("/estoque/novoProduto",form),

      {
       error:'Erro ao adicionar produto',
        pending:'Adicionando novo produto',
        success:'Produto adicionado com sucesso!'

      }

    )
    console.log(response.data)

    reqProdutos()
  //  setEstoque([...estoque,response.data as EstoqueProps]);
     
  } catch (error:any) {
    toast.warning(error.response.data.error)
  }
}
    return (
        <Modal show={openModal} onClose={()=>setOpenModal(false)} >
            <ModalHeader>Administrar Produto</ModalHeader>
            <Modal.Body>
                <form className="grid grid-cols-2 gap-4">
        
                <div>
        <div className=" block">
          <Label htmlFor="produto" value="Produto" />
        </div>
        <TextInput className="font-semibold" onChange={e=>setForm({...form,descricao:e.target.value.toUpperCase()})} sizing={'sm'} id="produto" value={form?.descricao}  required />
      </div>


      <div>
        <div className=" block">
          <Label htmlFor="cod_produto" value="Código do Produto" />
        </div>
        <TextInput className="font-semibold" value={form?.cod_prod} onChange={e=>setForm({...form,cod_prod:e.target.value})} sizing={'sm'} id="cod_produto"  required />
      
      </div>
      <div>
        <div className=" block">
          <Label htmlFor="categoria" value="Categoria" />
        </div>

        <Select id="categoria" onChange={e => setForm({ ...form, grupo: e.target.value })} className="font-semibold" sizing={'sm'}>
                        <option value={''}>{''}</option>
                        <option value={'cs'} className="font-semibold">CONSUMO</option>
                        <option value={'cv'} className="font-semibold">CONVALESCENTE</option>
                        <option value={'fn'}  className="font-semibold">FUNEBRE</option>
                        <option  value={'ot'} className="font-semibold">ÓTICA</option>

                    </Select>
       
      </div>
     
      
     
      <div>
        <div className=" block">
          <Label htmlFor="alerta" value="Alertar em " />
        </div>
        <TextInput className="font-semibold" type="number" onChange={e=>setForm({...form,alerta:Number(e.target.value)})} sizing={'sm'} id="alerta"  required />
      
      </div>
                </form>

            </Modal.Body>
            <Modal.Footer>
              <Button onClick={novoProduto}>Salvar</Button>
            </Modal.Footer>
        </Modal>
    )
}