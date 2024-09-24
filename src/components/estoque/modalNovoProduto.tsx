import { AuthContext, EmpresaProps } from "@/contexts/AuthContext";
import { ConvProps, ProdutosProps } from "@/pages/estoque";
import { api } from "@/services/apiClient";
import { Button, Label, Modal, ModalHeader, Select, TextInput } from "flowbite-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";





interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    produtos:Array<ProdutosProps>
    setEstoque:(fields:Array<ConvProps>)=>void
    estoque:Array<ConvProps>
    empresas:Array<EmpresaProps>
}

interface FormDataProps{
  id_usuario:number,
  cod_prod:string,
  descricao:string,
  id_empresa:string,
  id_produto:number,
  quantidade:number,
  alerta:number
}

export function ModalNovoProduto({openModal,setOpenModal,produtos,setEstoque,estoque,empresas}:DataProps){

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

    
    setEstoque([...estoque,response.data as ConvProps]);
     
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
          <Label htmlFor="empresa" value="Empresa" />
        </div>
        <Select className="font-semibold" onChange={e=>setForm({...form,id_empresa:e.target.value})} sizing={'sm'} id="empresa"  required >
            <option value={''}></option>
           {empresas.map(item=>(
            <option className="font-semibold" key={item.id} value={item.id}>{item.nome}</option>
           ))}
        </Select>
      </div>
                <div>
        <div className=" block">
          <Label htmlFor="produto" value="Produto" />
        </div>
        <Select className="font-semibold" onChange={e=>{
          const prod = produtos?.find(at =>at.id_produto===Number(e.target.value))

          setForm({...form,descricao:prod?.descricao,id_produto:prod?.id_produto})
        }} sizing={'sm'} id="produto"  required >
            <option value={''}></option>
           {produtos.map(item=>(
            <option className="font-semibold" value={item.id_produto} key={item.id_produto}>{item.descricao}</option>
           ))}
        </Select>
      </div>


      <div>
        <div className=" block">
          <Label htmlFor="cod_produto" value="Código do Produto" />
        </div>
        <TextInput className="font-semibold" value={form?.cod_prod} onChange={e=>setForm({...form,cod_prod:e.target.value})} sizing={'sm'} id="cod_produto"  required />
      
      </div>

      
      <div>
        <div className=" block">
          <Label htmlFor="quantidade" value="Quantidade" />
        </div>
        <TextInput className="font-semibold" type="number" onChange={e=>setForm({...form,quantidade:Number(e.target.value)})} sizing={'sm'} id="quantidade"  required />
      
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