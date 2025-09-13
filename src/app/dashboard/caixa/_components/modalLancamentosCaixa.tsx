
import { AuthContext } from "@/store/AuthContext";
import { useContext, useEffect} from "react";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { api } from "@/lib/axios/apiClient";
import {  Modal, TextInput } from "flowbite-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import { DatePickerInput } from "@/components/DatePickerInput";
import { Combobox } from "@/components/ui/combobox";
import { normalizarValor } from "@/utils/normalizarValor";
import { LancamentosProps } from "@/app/dashboard/caixa/_types/types";


interface ModalProps{
    handleFiltro:()=>void,
    planos:Array<PlanosProps>
    id_empresa:string
    grupo:Array<GruposProps>
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    mov:Partial<LancamentosProps>
   // setMov:(fields:Partial<LancamentosProps>)=>void
  //  arrayLanc:Array<LancamentosProps>,
    //setLancamentos:(array:Array<LancamentosProps>)=>void,
  //  listarLancamentos:()=>Promise<void>,
  


}
interface PlanosProps{
    conta:string,
    descricao:string,
    tipo:string,
    perm_lanc:string,
}
interface GruposProps{
    id_grupo:number|null,
    descricao:string
}
export function ModalLancamentosCaixa({id_empresa,planos,grupo,openModal,setOpenModal,mov,handleFiltro}:ModalProps){
    const {usuario}=useContext(AuthContext)
    const {register,setValue,handleSubmit,watch,control} = useForm<LancamentosProps>(
      {
        defaultValues:{...mov,datalanc:mov.datalanc??new Date()}
      }
    )

    const conta = watch('conta')

    


    useEffect(()=>{


      if(conta){
        const find = planos.find(item=>item.conta===conta)
        setValue('descricao',find?.descricao??'')
        setValue('tipo',find?.tipo??'')
        setValue('conta',find?.conta??'')
        
      }else{
        setValue('descricao','')
        setValue('tipo','')
        setValue('conta','')
      }


    },[conta])



    useEffect(()=>{
   setValue('conta',mov.conta??'')
    setValue('descricao',mov.descricao??'')
    
  setValue('valor',mov.valor??null)
      setValue('historico',mov?.historico??'')
   setValue('data',mov.data??new Date())
   setValue('tipo',mov.tipo??'')
    
    
    },[mov.lanc_id])


  const handleSubmitForm:SubmitHandler<LancamentosProps> = (data)=>{

    if(mov.lanc_id){
      editarMovimentacao(data)
    }else{
      lancarMovimentacao(data)
    }

  }
    



   async function editarMovimentacao(data:LancamentosProps){
      let dt_lanc =undefined
    if(data.data!==mov.data){
      const{newDate} =removerFusoDate(new Date(data.data))
      dt_lanc = newDate
    }
   // const valorString = data.valor?.toString()??'';
    //const valorConvertido = parseFloat(valorString?.replace(',', '.'));
    const valorConvertido =  normalizarValor(data.valor?.toString()??'');
   
    const valorConvertidoFinal = isNaN(valorConvertido) ? 0 : valorConvertido;
  
      toast.promise(
        api.put('/atualizarLancamento',{
        lanc_id:mov.lanc_id,
        num_seq:mov.num_seq,
        conta:data.conta,
        descricao:data.descricao,
        historico:data.historico,
        valor:valorConvertidoFinal,
        usuario:usuario?.nome,
        data:dt_lanc,
        tipo:data.tipo,
        empresa:id_empresa
        }),
        {loading:'Atualizando.....',
        error:'Erro ao atualizar',
        success:()=>{
          handleFiltro()
          setOpenModal(false)
          return 'Atualizado com sucesso!'}
    }
    )
 
 
      
    
   }

     async function lancarMovimentacao(data:LancamentosProps){ 
     // const valorString = data.valor?.toString()??'';
      //const valorConvertido = parseFloat(valorString?.replace(',', '.'));
      const valorConvertido = normalizarValor(data.valor?.toString()??'');
      
      const valorConvertidoFinal = isNaN(valorConvertido) ? 0 : valorConvertido;
      const {newDate:dt_lanc} = removerFusoDate(new Date(data.data))
      const{newDate:dt_real} = removerFusoDate(new Date())

      if(!id_empresa){
        toast.info('Selecione a empresa')
        return;
      }
     // if(!data?.id_grupo){
     //   toast.info('Selecione o setor')
      //  return;
    //  }

       if(!data.descricao||!data.historico){
            toast.warning('Preencha todos os campos obrigatórios')
            return;
      }
      
      if(!data.conta){
        toast.warning('Preencha todos os campos obrigatórios')
        return;
  }

       

        toast.promise(
            api.post('/novoLancamento',{
           // id_usuario:usuario?.id,
            id_grupo:data.id_grupo?Number(data.id_grupo):undefined,
            datalanc:dt_real,
            conta:data.conta,
            conta_n:data.conta_n,
            descricao:data.descricao,
            historico:data?.historico?.toUpperCase(),
            valor:valorConvertidoFinal,
            usuario:usuario?.nome.toUpperCase(),
            data:dt_lanc, 
            tipo:data.tipo,
            empresa:id_empresa
            }),
            {
                error:'Erro realizar Lançamento',
                loading:'Realizando Lançamento',
                success:()=>{
                  handleFiltro()
                  setOpenModal(false)
                    return 'Lançado com sucesso!'}
            }
        )
        
    
     //   listarLancamentos()
         // setLancamentos([...arrayLanc,response.data])
     
  //  handleFiltro()
        
     }

    return(
   
  <Dialog  open={openModal} onOpenChange={setOpenModal}>
  <DialogContent  className="max-w-3xl">
    <DialogHeader>
      <DialogTitle>LANÇAMENTO</DialogTitle>
      <DialogDescription>Realizar Lançamento</DialogDescription>
    </DialogHeader>
    <form className="text-[10px]" onSubmit={handleSubmit(handleSubmitForm)}>
      <div className="inline-flex gap-4 w-full text-black">
            <div>
          <Label className="text-[12px]">Setor</Label>
          <Select
            onValueChange={(val) => setValue("id_grupo", Number(val))}
            value={watch("id_grupo")?.toString() || ""}
          >
            <SelectTrigger className=" text-xs">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
           
              {grupo?.map((item, index) => (
                <SelectItem key={index} value={item?.id_grupo?.toString()??'YY'}>
                  {item.descricao.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label className="text-[12px]">Data</Label>
          <Controller
            control={control}
            name="data"
          
            render={({ field: { onChange, value } }) => (
              <DatePickerInput
                onChange={onChange}
                value={value}
                dateFormat={"dd/MM/yyyy"}
                locale={pt}
                required
                className="h-9"
               
              />
            )}
          />
        </div>

    
      </div>

      <div className="p-2 grid mt-2 gap-2 grid-flow-row-dense grid-cols-4 text-black">
        <div className="col-span-1">
          <Label className="text-[12px]">Conta</Label>
          <Input disabled required className=" text-xs " {...register("conta")} />
        </div>

        <div className="col-span-2">
          <Label className="text-[12px]">Descrição</Label>

          <Controller
            control={control}
            name="conta"
            render={({ field: { onChange, value } }) => (
               <Combobox
                 
                 value={value}
                 onChange={onChange}
                 items={planos.filter((item) => item.perm_lanc === "S").map((item) => ({ label: item.descricao, value: item.conta }))}
                className=""
               />

            )}
          />
      
        </div>

        <div className="col-span-1">
          <Label className="text-[12px]">Tipo</Label>
          <Input
            disabled
            required
            className=" text-xs"
            value={watch("tipo")}
          />
        </div>

        <div className="col-span-3">
          <Label className="text-[12px]">Histórico</Label>
          <Input
            required
            className=" text-xs"
            {...register("historico")}
          />
        </div>

        <div className="col-span-1">
          <Label className="text-[12px]">Valor</Label>
          <Input
            type="text"
            inputMode="decimal"
            required
            className=" text-xs"
            {...register("valor")}
          />
        </div>

        <div className="gap-2 col-span-4 mt-2 flex flex-row justify-end">
          <Button type="submit" variant="outline" size="sm">
            {mov.lanc_id ? "Alterar" : "Cadastrar"}
          </Button>
        </div>
      </div>
    </form>
  </DialogContent>
</Dialog>
)
}