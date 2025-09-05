


import { api } from "@/lib/axios/apiClient";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { toast } from "sonner";




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

    
      <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
           
            <div>
              <div className="mb-0 block">
                <Label  value="Senha Atual" />
              </div>
              <TextInput value={senhaAtual} onChange={e=>setAtual(e.target.value)} type="password"  placeholder="senha atual" required />
            </div>
            <div>
              <div className="mb-0 block">
                <Label  value="Nova Senha" />
              </div>
              <TextInput value={novaSenha} onChange={e=>setNova(e.target.value)}  type="password" required />
            </div>
            <div>
              <div className="mb-0 block">
                <Label  value="Repita a nova senha" />
              </div>
              <TextInput value={repSenha} onChange={e=>setRep(e.target.value)} type="password" required />
            </div>
            
            <div className="w-full">
              <Button onClick={handleNewPassword}>Salvar</Button>
            </div>
          
          </div>
        </Modal.Body>
      </Modal>
    
  );
}
