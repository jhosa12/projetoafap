


import { api } from "@/lib/axios/apiClient";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";




interface DataProps{
    openModal:boolean
    setOpenModal:(open:boolean)=>void
    id_user:string
}
export function ModalPassword({openModal,setOpenModal,id_user}:DataProps) {
    const [novaSenha,setNova] = useState<string>('')
    const [senhaAtual,setAtual] = useState<string>('')
    const [repSenha,setRep] = useState<string>('')



    const handleNewPassword =async()=>{
        if(novaSenha!==repSenha){
            toast.info('Senhas não coincidem')
            return
        }
  
            toast.promise(
                api.put('/user/newPassword',{
                    id_user,
                    senhaAtual,
                    novaSenha
                }),
                {error:'Erro ao alterar senha',
                    loading:'Realizando alteração',
                    success:'Alteração realizada com sucesso'
                }
            )
       
    }
 

  return (

    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="senha-atual">Senha atual</Label>
            <Input id="senha-atual" value={senhaAtual} onChange={e=>setAtual(e.target.value)} type="password" placeholder="senha atual" required />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="nova-senha">Nova senha</Label>
            <Input id="nova-senha" value={novaSenha} onChange={e=>setNova(e.target.value)} type="password" required />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="rep-senha">Repita a nova senha</Label>
            <Input id="rep-senha" value={repSenha} onChange={e=>setRep(e.target.value)} type="password" required />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleNewPassword}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
