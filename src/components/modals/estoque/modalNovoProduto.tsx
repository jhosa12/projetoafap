

import { FormProps } from "@/app/dashboard/estoque/page";
import { api } from "@/lib/axios/apiClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";






interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    reqDadosEstoq:(dados:FormProps)=>Promise<void>
    reqProdutos:()=>Promise<void>
    permissoes:Array<string>
}

interface FormDataProps{
 // id_usuario:number,
  cod_prod:string,
  descricao:string,
  grupo:string,
 // id_empresa:string,
 // id_produto:number,
  alerta:number

}

export function ModalNovoProduto({openModal,setOpenModal,reqProdutos,reqDadosEstoq,permissoes}:DataProps){



 const [form,setForm] = useState<Partial<FormDataProps>>()

const novoProduto= async()=>{
  if(!form?.descricao){
    toast.warning('Preencha o campo Descrição')
    return
  }
  if(!form?.grupo){
    toast.warning('Preencha o campo Categoria')
    return
  }
  if(!form.cod_prod){
    toast.warning('Preencha o campo Codigo')
    return
  }
 toast.promise(
      api.post("/estoque/novoProduto",form),

      {
       error:'Erro ao adicionar produto',
        loading:'Adicionando novo produto',

        success:async()=>{

           
   await reqDadosEstoq({descricao:'',grupo:'',id_produto:null,id_empresa:undefined})
   await reqProdutos()
  //  setEstoque([...estoque,response.data as EstoqueProps]);
  setForm({alerta:0,descricao:'',grupo:'',cod_prod:''})

          
          return 'Produto adicionado com sucesso!'}

      }

    )
 
     
  
}
    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Administrar Produto</DialogTitle>
                </DialogHeader>
                <form className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="produto">Produto</Label>
                        <Input className="font-semibold" onChange={e=>setForm({...form,descricao:e.target.value.toUpperCase()})} id="produto" value={form?.descricao ?? ''} required />
                    </div>
                    <div>
                        <Label htmlFor="cod_produto">Código do Produto</Label>
                        <Input className="font-semibold" value={form?.cod_prod ?? ''} onChange={e=>setForm({...form,cod_prod:e.target.value})} id="cod_produto" required />
                    </div>
                    <div>
                        <Label htmlFor="categoria">Categoria</Label>
                        <Select onValueChange={(v) => setForm({ ...form, grupo: v })}>
                            <SelectTrigger id="categoria" className="font-semibold">
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cs">CONSUMO</SelectItem>
                                <SelectItem value="cv">CONVALESCENTE</SelectItem>
                                <SelectItem value="fn">FUNEBRE</SelectItem>
                                <SelectItem value="ot">ÓTICA</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="alerta">Alertar em</Label>
                        <Input className="font-semibold" type="number" onChange={e=>setForm({...form,alerta:Number(e.target.value)})} id="alerta" required />
                    </div>
                </form>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => setOpenModal(false)}>Cancelar</Button>
                    <Button disabled={!permissoes.includes('EST1.1')} onClick={novoProduto}>Salvar</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}