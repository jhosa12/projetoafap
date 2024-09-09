import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import { TfiReload } from "react-icons/tfi";
import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import DatePicker,{registerLocale, setDefaultLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";

registerLocale('pt', pt)


interface DataProps{
    openModal:boolean,
    setModal:(open:boolean)=>void
}




export function ModalDependentes({openModal,setModal}:DataProps){
    const {closeModa,data,usuario,dadosassociado,carregarDados}=useContext(AuthContext)

 async function addDependente(){
    const response = await toast.promise(
        api.post('/novoDependente',{
            id_contrato:dadosassociado?.contrato?.id_contrato,
            id_associado:dadosassociado?.id_associado,
            nome:data.dependente?.nome,
            data_nasc:data.dependente?.data_nasc,
            grau_parentesco:data.dependente?.grau_parentesco,
            data_adesao:data.dependente?.data_adesao,
            cad_usu:usuario?.nome,
            cad_dh:new Date(),
            carencia:data.dependente?.carencia,
            sexo:data.dependente?.sexo
        }),
        {
            error:'Erro ao adicionar dependente',
            pending:'Cadastrando Dependente',
            success:'Adicionado com Sucesso!'
        }
    )
   await carregarDados()
   
 }

 async function atualizarDependente(){
    const response = await toast.promise(
        api.put('/atualizarDependente',{
            id_dependente:data.dependente?.id_dependente,
            nome:data.dependente?.nome,
            data_nasc:data.dependente?.data_nasc,
            grau_parentesco:data.dependente?.grau_parentesco,
            data_adesao:data.dependente?.data_adesao,
            carencia:data.dependente?.carencia
        }),
        {
            error:'Erro ao atualizar dependente',
            pending:'Atualizando Dependente',
            success:'Atualizado com Sucesso!'
        }
    )
   await carregarDados()
 }

 async function resgatarDep(){

    if(!data.dependente?.id_dependente){
     toast.info("Selecione um dependente!")
     return;
    }
 
     try{
         await toast.promise(
             api.put('/excluirDependente',{
                 id_dependente:Number(data.dependente?.id_dependente),
                 excluido:false,
             }),
             {
                 pending: `Efetuando`,
                 success: `Dependente Resgatado`,
                 error: `Erro ao Resgatar`
             }
         )
         
        await carregarDados()
       
     }catch(err){
         console.log(err)
     }
   }
    return(

<Modal show={openModal} onClose={()=>setModal(false)} popup>
<Modal.Header>Administrar Dependente</Modal.Header>
    <Modal.Body>
        <form>
        <div className="  grid gap-2 grid-cols-4">


        <div className="col-span-2" >
  <div className=" block">
    <Label  value="Nome" />
  </div>
  <TextInput  sizing={'sm'}value={data.dependente?.nome} onChange={e=>closeModa({dependente:{...(data.dependente || {}),nome:e.target.value.toUpperCase()}})}type="text" placeholder="Nome" required />
</div>
<div className="col-span-1" >
  <div className=" block">
    <Label  value="Nascimento" />
  </div>
 <DatePicker selected={data.dependente?.data_nasc} onChange={e=>e && closeModa({dependente:{...(data.dependente || {}),data_nasc:e}})}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
</div>



<div className="col-span-1" >
  <div className=" block">
    <Label  value="Parentesco" />
  </div>
  <Select sizing={'sm'} defaultValue={data.dependente?.grau_parentesco} onChange={e=>closeModa({dependente:{...(data.dependente || {}),grau_parentesco:e.target.value}})}>
  <option selected className="text-gray-200">PARENTESCO</option>
                    <option>CONJUGE</option>
                    <option>PAI</option>
                    <option>MÃE</option>
                    <option>FILHO(A)</option>,
                    <option>IRMÃO(Ã)</option>
                    <option>PRIMO(A)</option>
                    <option>SOBRINHA(A)</option>
                    <option>NORA</option>
                    <option>GENRO</option>
                    <option>TIO(A)</option>
                    <option>AVÔ(Ó)</option>
                    <option>OUTROS</option>
            </Select >
</div>

<div className="col-span-1" >
  <div className=" block">
    <Label  value="Adesão" />
  </div>
 <DatePicker selected={data.dependente?.data_adesao} onChange={e=>e && closeModa({dependente:{...(data.dependente || {}),data_adesao:e}})}   dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
</div>

<div className="col-span-1" >
  <div className=" block">
    <Label  value="Carência" />
  </div>
 <DatePicker  selected={data.dependente?.carencia} onChange={e=>e && closeModa({dependente:{...(data.dependente || {}),carencia:e}})}    dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
</div>



{data.dependente?.exclusao_motivo && (
     <div className="col-span-2" >
     <div className=" block">
       <Label  value="Motivo exclusão" />
     </div>
     <TextInput disabled={data.dependente?.excluido}   sizing={'sm'} value={data.dependente?.exclusao_motivo} onChange={e=>closeModa({dependente:{...(data.dependente || {}),exclusao_motivo:e.target.value.toUpperCase()}})}  type="text" placeholder="Motivo" required />
   </div>
 )}

<div className=" gap-2 col-span-4  flex flex-row justify-end">
{data.dependente?.saveAdd && !data.dependente.excluido?(<Button onClick={()=>atualizarDependente()} ><MdSaveAlt size={22}/>Salvar</Button>):data.dependente?.excluido?(
<Button onClick={()=>resgatarDep()} ><TfiReload size={20}/>Resgatar</Button>):
(<Button onClick={()=>addDependente()}><RiAddCircleFill size={22}/>Adicionar</Button>)
}
</div>
    </div>
</form>
</Modal.Body>
</Modal>
)
}