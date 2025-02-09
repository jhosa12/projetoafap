import { IoIosClose } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import { TfiReload } from "react-icons/tfi";
import { AuthContext} from "@/contexts/AuthContext";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { DependentesProps } from "@/types/associado";

registerLocale('pt', pt)



interface FormDataProps{
  
  nome:string
  data_nasc:Date
  grau_parentesco:string
  data_adesao:Date
  carencia:Date
  sexo:string,
  exclusao_motivo:string
}


interface DataProps{
    openModal:boolean,
    setModal:(open:boolean)=>void
    data:Partial<DependentesProps>
}




export function ModalDependentes({openModal,setModal,data}:DataProps){
    const {usuario,dadosassociado,carregarDados}=useContext(AuthContext)
    const {setValue,register,watch,handleSubmit,reset} = useForm<DependentesProps>({
      defaultValues:data
    })


    const handleApiFunction:SubmitHandler<DependentesProps> = async(dadosForm)=>{
      if (data.excluido) {
        // Se o dependente está excluído, você resgata ele.
        await resgatarDep();
      } else if (data.id_dependente) {
        // Se já existe um dependente (tem ID), então você atualiza.
        await atualizarDependente(dadosForm);
      } else {
        // Se é um novo dependente, você adiciona.
        await addDependente(dadosForm);
      }

    }

 async function addDependente(dados:DependentesProps){
    const response = await toast.promise(
        api.post('/novoDependente',{
          id_global:dadosassociado?.id_global,
          id_contrato_global:dadosassociado?.contrato?.id_contrato_global,
            id_contrato:dadosassociado?.contrato?.id_contrato,
            id_associado:dadosassociado?.id_associado,
            nome:dados.nome.toUpperCase(),
            data_nasc:dados.data_nasc,
            grau_parentesco:dados.grau_parentesco,
            data_adesao:dados.data_adesao,
            cad_usu:usuario?.nome,
            cad_dh:new Date(),
            carencia:dados.carencia,
            sexo:dados.sexo
        }),
        {
            error:'Erro ao adicionar dependente',
            pending:'Cadastrando Dependente',
            success:'Adicionado com Sucesso!'
        }
    )
    dadosassociado?.id_global &&  await carregarDados(dadosassociado?.id_global)
   
 }

 async function atualizarDependente(dados:DependentesProps){
    const response = await toast.promise(
        api.put('/atualizarDependente',{
          id_dependente_global:data.id_dependente_global,
            id_dependente:data.id_dependente,
            nome:dados.nome,
            data_nasc:dados.data_nasc,
            grau_parentesco:dados.grau_parentesco,
            data_adesao:dados.data_adesao,
            carencia:dados.carencia,
            sexo:dados.sexo
        }),
        {
            error:'Erro ao atualizar dependente',
            pending:'Atualizando Dependente',
            success:'Atualizado com Sucesso!'
        }
    )
    dadosassociado?.id_global &&  await carregarDados(dadosassociado?.id_global)
 }

 async function resgatarDep(){

    if(!data.id_dependente){
     toast.info("Selecione um dependente!")
     return;
    }
 
     try{
         await toast.promise(
             api.put('/excluirDependente',{
                 id_dependente:Number(data.id_dependente),
                 excluido:false,
             }),
             {
                 pending: `Efetuando`,
                 success: `Dependente Resgatado`,
                 error: `Erro ao Resgatar`
             }
         )
         
      dadosassociado?.id_global &&  await carregarDados(dadosassociado?.id_global)
       
     }catch(err){
         console.log(err)
     }
   }
    return(

<Modal show={openModal} onClose={()=>setModal(false)} popup>
<Modal.Header>Administrar Dependente</Modal.Header>
    <Modal.Body>
        <form className="  grid gap-2 grid-cols-4 font-semibold" onSubmit={handleSubmit(handleApiFunction)}>
        <div className="col-span-2" >
  <div className=" block">
    <Label className="text-xs"  value="Nome" />
  </div>
  <TextInput className="font-semibold" value={watch('nome')?.toUpperCase()} sizing={'sm'} {...register('nome')} type="text" placeholder="Nome" required />
</div>
<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="Nascimento" />
  </div>
 <DatePicker selected={watch('data_nasc')} onChange={e=>e && setValue('data_nasc',e)}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
</div>



<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="Parentesco" />
  </div>
  <Select sizing={'sm'} {...register('grau_parentesco')}>
  <option selected className="text-gray-200">PARENTESCO</option>
                    <option value={'CONJUGE'}>CONJUGE</option>
                    <option value={'PAI'}>PAI</option>
                    <option value={'MÃE'}>MÃE</option>
                    <option value={'FILHO'}>FILHO(A)</option>,
                    <option value={'IRMÃO(Ã)'}>IRMÃO(Ã)</option>
                    <option value={'PRIMO'}>PRIMO(A)</option>
                    <option   value={'SOBRINHO(A)'}>SOBRINHO(A)</option>
                    <option value={'NORA'}>NORA</option>
                    <option value={'GENRO'}>GENRO</option>
                    <option value={'TIO(A)'}>TIO(A)</option>
                    <option value={'AVÔ(Ó)'}>AVÔ(Ó)</option>
                    <option value={'OUTROS'}>OUTROS</option>
            </Select >
</div>

<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="Adesão" />
  </div>
 <DatePicker selected={watch('data_adesao')} onChange={e=>e && setValue('data_adesao',e)}   dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
</div>

<div className="col-span-1" >
  <div className=" block">
    <Label className="text-xs"  value="Carência" />
  </div>
 <DatePicker  selected={watch('carencia')} onChange={e=>e && setValue('carencia',e)}    dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
</div>



{data.exclusao_motivo && (
     <div className="col-span-2" >
     <div className=" block">
       <Label className="text-xs"  value="Motivo exclusão" />
     </div>
     <TextInput disabled={data.excluido}   sizing={'sm'} {...register('exclusao_motivo')}  type="text" placeholder="Motivo" required />
   </div>
 )}

<div className=" gap-2 col-span-4  flex flex-row justify-end">
<Button size={'sm'} type="submit">
    {data.excluido ? (
      <>
        <TfiReload size={20} /> Resgatar
      </>
    ) : data.id_dependente ? (
      <>
        <MdSaveAlt size={22} /> Salvar
      </>
    ) : (
      <>
        <RiAddCircleFill size={22} /> Adicionar
      </>
    )}
  </Button>
</div>
  
</form>
</Modal.Body>
</Modal>
)
}