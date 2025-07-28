import { MdSaveAlt } from "react-icons/md";
import { RiAddCircleFill } from "react-icons/ri";
import { AuthContext} from "@/store/AuthContext";
import { useContext, useEffect } from "react";
import { api } from "@/lib/axios/apiClient";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DependentesProps } from "@/types/associado";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Save, PlusCircle } from "lucide-react";
import { DatePickerInput } from "@/components/DatePickerInput";

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
    const {register,handleSubmit,control,reset} = useForm<DependentesProps>({
      defaultValues:data
    })


    useEffect(()=>{
    
        reset(data)
     
    },[data])
      


    const handleApiFunction:SubmitHandler<DependentesProps> = async(dadosForm)=>{
      if (data.excluido) {
        // Se o dependente está excluído, você resgata ele.
       // await resgatarDep();
      } else if (data.id_dependente) {
        // Se já existe um dependente (tem ID), então você atualiza.
        await atualizarDependente(dadosForm);
      } else {
        // Se é um novo dependente, você adiciona.
        await addDependente(dadosForm);
      }

    }

 async function addDependente(dados:DependentesProps){
  try {


toast.promise(
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
    loading:'Cadastrando Dependente...',
    success:'Adicionado com Sucesso!',
    error:async(error)=>{
      return error?.response?.data.error??'Erro ao adicionar dependente'
    }
  }
)

   /* const response = await toast.promise(
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
  )*/
  dadosassociado?.id_global &&  await carregarDados(dadosassociado?.id_global)

  setModal(false)
    
  } catch (error:any) {
    toast.error(error?.response?.data.error??'Erro ao salvar dados')
  }
    
   
 }

 async function atualizarDependente(dados:DependentesProps){

  toast.promise(
    api.put('/atualizarDependente',{
      id_dependente_global:data.id_dependente_global,
        id_dependente:data.id_dependente,
        nome:dados.nome.toUpperCase(),
        data_nasc:dados.data_nasc,
        grau_parentesco:dados.grau_parentesco,
        data_adesao:dados.data_adesao,
        carencia:dados.carencia,
        sexo:dados.sexo
    }),
    {
        error:async(error)=>{

          return error?.response?.data.error??'Erro ao atualizar dependente'
          
        },
        loading:'Atualizando Dependente....',
        success:async(res)=>{
            dadosassociado?.id_global &&  await carregarDados(dadosassociado?.id_global)
            setModal(false)
            return 'Atualizado com Sucesso!'
        }
    }
  )


   /* const response = await toast.promise(
        api.put('/atualizarDependente',{
          id_dependente_global:data.id_dependente_global,
            id_dependente:data.id_dependente,
            nome:dados.nome.toUpperCase(),
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
    )*/
   // dadosassociado?.id_global &&  await carregarDados(dadosassociado?.id_global)
 }

 /*async function resgatarDep(){

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
   }*/
    return (
        <Dialog open={openModal} onOpenChange={setModal}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        {data.id_dependente ? 'Editar Dependente' : 'Adicionar Dependente'}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(handleApiFunction)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome</Label>
                            <Input
                                id="nome"
                                {...register('nome')}
                                placeholder="Nome completo"
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="data_nasc">Data de Nascimento</Label>
                            <Controller
                                control={control}
                                name="data_nasc"
                                render={({ field }) => (
                                  <DatePickerInput
                                  value={field.value}
                                  onChange={field.onChange}
                                  className ='h-9'
                                  required
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Sexo</Label>
                            <Controller
                                control={control}
                                name="sexo"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o sexo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MASCULINO">Masculino</SelectItem>
                                            <SelectItem value="FEMININO">Feminino</SelectItem>
                                            <SelectItem value="OUTRO">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Grau de Parentesco</Label>
                            <Controller
                                control={control}
                                name="grau_parentesco"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o parentesco" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CONJUGE">Cônjuge</SelectItem>
                                            <SelectItem value="PAI">Pai</SelectItem>
                                            <SelectItem value="MÃE">Mãe</SelectItem>
                                            <SelectItem value="FILHO">Filho(a)</SelectItem>
                                            <SelectItem value="IRMÃO(Ã)">Irmão(ã)</SelectItem>
                                            <SelectItem value="PRIMO">Primo(a)</SelectItem>
                                            <SelectItem value="SOBRINHO(A)">Sobrinho(a)</SelectItem>
                                            <SelectItem value="NORA">Nora</SelectItem>
                                            <SelectItem value="GENRO">Genro</SelectItem>
                                            <SelectItem value="TIO(A)">Tio(a)</SelectItem>
                                            <SelectItem value="AVÔ(Ó)">Avô(ó)</SelectItem>
                                            <SelectItem value="OUTROS">Outros</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2 flex flex-col">
                            <Label>Data de Adesão</Label>
                            <Controller
                                control={control}
                                name="data_adesao"
                                render={({ field }) => (
                                  <DatePickerInput
                                  value={field.value}
                                  onChange={field.onChange}
                                  className ='h-9'
                                  required
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2 flex flex-col">
                            <Label>Carência</Label>
                            <Controller
                                control={control}
                                name="carencia"
                                render={({ field }) => (
                                  <DatePickerInput
                                  value={field.value}
                                  onChange={field.onChange}
                                  className ='h-9'
                                    />
                                   
                                )}
                            />
                        </div>

                        {data.exclusao_motivo && (
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="exclusao_motivo">Motivo da Exclusão</Label>
                                <Input
                                    id="exclusao_motivo"
                                    {...register('exclusao_motivo')}
                                    disabled={data.excluido}
                                    placeholder="Motivo da exclusão"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setModal(false)}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" className="gap-2">
                            {data.id_dependente ? (
                                <>
                                    <Save className="h-4 w-4" />
                                    Salvar Alterações
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="h-4 w-4" />
                                    Adicionar Dependente
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}