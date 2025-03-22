import { LancamentosProps } from "@/pages/dashboard/caixa"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Label } from "flowbite-react"
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { GruposProps } from "@/pages/dashboard/financeiro";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {  formasDePagamento } from "@/utils/bancosFormasPag";
import { MdClose } from "react-icons/md";
import { roboto_Mono } from "@/fonts/fonts";
import { toast } from "sonner";
import { ajustarData } from "@/utils/ajusteData";
import { api } from "@/lib/axios/apiClient";
import { useCallback, useContext, useEffect } from "react";
import { AuthContext } from "@/store/AuthContext";
import { removerFusoDate } from "@/utils/removerFusoDate";



interface PlanosProps{
    conta:string,
    descricao:string,
    tipo:string,
    perm_lanc:string,
}
interface ModalProps{
    handleFiltro:()=>void,
    planos:Array<PlanosProps>
    id_empresa:string
    grupo:Array<GruposProps>
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    mov:Partial<LancamentosProps>
    bancos:Array<{banco:string,agencia:string,conta:string}>
   // setMov:(fields:Partial<LancamentosProps>)=>void
 
    //setLancamentos:(array:Array<LancamentosProps>)=>void,
  //  listarLancamentos:()=>Promise<void>,
  


}

 export const ModalLancamento = ({grupo,handleFiltro,planos,id_empresa,openModal,setOpenModal,mov,bancos}:ModalProps) => {
        const {usuario} = useContext(AuthContext)
     const {register,setValue,handleSubmit,watch,control} = useForm<LancamentosProps>(
            {
                defaultValues:{...mov,data:mov.data??new Date()}
            }
        )

        const lancamentoForma = watch("lancamentoForma")
        const valorRestante = watch("valor_restante")??0;
        const valorForma = watch("valorForma")??''
useEffect(()=>{
  console.log(mov)
},[mov])


  const handleSubmitForm:SubmitHandler<LancamentosProps> = (data)=>{

    if(mov.lanc_id){
      editarMovimentacao(data)
    }else{
      lancarMovimentacao(data)
    }

  }
    


  const removerPagamento = useCallback(
    (index: number) => {
     // if (!lancamentoForma?.[formaPagamento]) return;
  
      // Clonamos o objeto e removemos o pagamento específico dentro do array
      const novasFormas = [...lancamentoForma ];
     const apagado= novasFormas.splice(index, 1);
  
      // Se não houver mais pagamentos nessa forma, removemos a chave do objeto
  
  
      // Ajustamos o valor restante
     // const valorRemovido = formas_pagamento[formaPagamento][index]?.valor || 0;
      setValue("lancamentoForma", novasFormas);
      setValue("valor_restante", valorRestante + apagado[0].valor);
    },
    [lancamentoForma, valorRestante]
  );
  











   const editarMovimentacao =useCallback( async(data:LancamentosProps)=>{
    const{dataIni:dt_lanc} = ajustarData(data.datalanc)
       
    try {
     toast.promise(
        await api.put('/atualizarLancamento',{
        lanc_id:mov.lanc_id,
        num_seq:mov.num_seq,
        conta:data.conta,
        descricao:data.descricao,
        historico:data.historico,
        valor:data.valor,
        usuario:usuario?.nome,
        datalanc:dt_lanc,
        tipo:data.tipo,
        empresa:id_empresa
        }),
        
    )
    handleFiltro()
    setOpenModal(false)
    } catch (error) {
      toast.warning('Consulte o TI')
      
    }
      
    
   },[mov,id_empresa,usuario])

    const lancarMovimentacao=useCallback(async(data:LancamentosProps)=>{ 
      const valorString = data.valor?.toString()??'';
      const valorConvertido = parseFloat(valorString?.replace(',', '.'));
     
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
            toast.error('Preencha todos os campos obrigatórios')
            return;
      }
      
      if(!data.conta){
        toast.error('Preencha todos os campos obrigatórios')
        return;
  }

  if(valorRestante>0){
    toast.error("Erro",{description:"Ainda há valores a serem utilizados!"})
    return
  }
        try {

        const response =   toast.promise(
            await api.post('/novoLancamento',{
            id_usuario:usuario?.id,
            id_grupo:data.id_grupo?Number(data.id_grupo):undefined,
            datalanc:dt_real,
            lancamentoForma:data.lancamentoForma,
            conta:data.conta,
            conta_n:data.conta_n,
            descricao:data.descricao,
            historico:data?.historico?.toUpperCase(),
            valor:valorConvertido,
            usuario:usuario?.nome.toUpperCase(),
            data:dt_lanc, 
            tipo:data.tipo,
            empresa:id_empresa
            }),
            {
                loading: 'Lançando...',
                success: (data) => {
                  return `Lancamento realizado com sucesso!`;
                },
                error: (error) => {
                  return error.message;
                }
            }
        )
        
        handleFiltro()
        setOpenModal(false)
     //   listarLancamentos()
         // setLancamentos([...arrayLanc,response.data])
        } catch (error) {

          console.log(error)
          
        }
  //  handleFiltro()
        
     },[usuario,id_empresa,valorRestante]

)






        const adicionarPagamento:SubmitHandler<LancamentosProps> = useCallback((data) => {
           // const  valor = watch("valorForma")??"0";
           // const formaPagamento = watch("forma_pagamento")
        const valorNumerico = parseFloat(String(data.valorForma));
           // const banco = watch("banco")??""
          //  const observacao = watch("observacao")
  
        
            if (!data.forma_pagamento || isNaN(valorNumerico) || valorNumerico <= 0) {
              toast("Erro", { description: "Preencha um valor válido e escolha uma forma de pagamento." });
              return;
            }
        
          if (valorNumerico > valorRestante) {
              toast.error("Erro", { description: "O valor excede o restante do lancamento!" });
              return;
            }

            const array = [...(lancamentoForma ?? [])];
        
            setValue("lancamentoForma",[...array, { forma: data.forma_pagamento, valor: valorNumerico, banco: data.banco, observacao: data.observacao }]);
        
            //reset({
           //  valor: '',
            //  dispensa: false,
            //  formaPagamento: "",
            //  valorRestante: data.valorRestante - valorNumerico,
            //  banco: "",
            //  observacao: "",
             // valorPago: data.valorPago
           // })
           
             setValue("valor_restante",valorRestante - valorNumerico);
             setValue("valorForma","");
             setValue("forma_pagamento","");
             setValue("banco","")
             setValue("observacao","")
            //  setValor("");
            //  setFormaPagamento("");
            //  setBanco("")
            // setObservacao("")
          },[valorRestante,lancamentoForma])


    return (
        <Dialog  open={openModal} onOpenChange={setOpenModal}>
            
            <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>LANÇAMENTO</DialogTitle>  
                </DialogHeader>
            <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col text-[10px] gap-4" > 

<div className="inline-flex gap-4 w-full text-black ">



<div  >
        <div className=" block">
          <Label className="text-[12px]"  value="Setor" />
        </div>
        <Controller
        control={control}
        name ="id_grupo"
        render={({ field }) => (
          <Select value={field.value?.toString()} onValueChange={field.onChange} >
                  <SelectTrigger className=" h-7">
                    <SelectValue placeholder="Setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {grupo?.map((item) => (
                      <SelectItem key={item.id_grupo} value={(item.id_grupo.toString())}>{item.descricao}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
        )}
        />
  
      </div> 
  
<div >
        <div className=" block">
          <Label className="text-[12px]"  value="Data" />
        </div>
        <Controller
        control={control}
        name="data"
        render={({ field:{onChange,value} }) => (
          <DatePicker  onChange={e=>e && onChange(e)}  selected={value}  dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-[120px] uppercase  px-2 h-7  text-sm   border  rounded-md shadow-sm  border-gray-200  placeholder-gray-400  " />
        )}

        />
      
      </div>



    




</div>

        <div className="   grid  gap-2 grid-flow-row-dense grid-cols-4 text-black">
        <div className=" col-span-1 " >
        <div className=" block">
          <Label className="text-[12px]"  value="Conta" />
        </div>
        <Input className="h-7" disabled  required type="text" {...register('conta')}     />
      </div> 
   


      <div className=" col-span-2" >
        <div className=" block">
          <Label className="text-[12px]"  value="Descrição" />
        </div>
<Controller
        control={control}
        name="conta"
        render={({ field }) => (
            <Select value={field.value} onValueChange={e=>{
                const tipo = planos.find((item)=>item.conta===e)
       
                if(tipo){ setValue('descricao',tipo.descricao)
                   setValue('tipo',tipo.tipo)
                   setValue('conta',e)}
            }}  >
            <SelectTrigger  className="w-full h-7">
              <SelectValue placeholder="Descrição" />
            </SelectTrigger>
            <SelectContent>
              {planos?.map((item) => (
                <SelectItem className="text-[11px]" key={item.conta} value={(item.conta)}>{item.descricao}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
/>
      
      </div> 

      <div className="col-span-1 " >
        <div className=" block">
          <Label className="text-[12px]"  value="Tipo" />
        </div>
        <Input className="h-7" disabled  required type="text" value={watch('tipo')}     />
      </div> 


      <div className="col-span-3 " >
        <div className=" block">
          <Label className="text-[12px]"  value="Histórico" />
        </div>
        <Input className="h-7"  required type="text"  {...register('historico')}    />
      </div> 


      <div className="col-span-1 " >
        <div className=" block">
          <Label className="text-[12px]"  value="Valor" />
        </div>
        <Input {...register('valor')} disabled={!!lancamentoForma} className="h-7"  required   onChange={(e) => {setValue("valor",parseFloat(e.target.value)),setValue("valor_restante",parseFloat(e.target.value))}}   />
      </div> 



    </div>
    <p className="text-[13px]">Valor Restante: <strong className={valorRestante === 0 ? "text-green-600" : "text-red-600"}>{Number(valorRestante).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>
    <div className="flex gap-2 ">

<Controller
  name="forma_pagamento"
  control={control}
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange} >
      <SelectTrigger className="w-[120px] h-7">
        <SelectValue placeholder="Forma" />
      </SelectTrigger>
      <SelectContent>
        {formasDePagamento?.map((forma) => (
          <SelectItem className="text-[11px]" key={forma} value={forma}>{forma}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
/>

<Controller
  name="banco"
  control={control}
  render={({ field }) => (
    <Select value={field.value} onValueChange={field.onChange} >
      <SelectTrigger className="w-[120px] h-7">
        <SelectValue placeholder="Banco" />
      </SelectTrigger>
      <SelectContent>
        {bancos?.map((banco,index) => (
          <SelectItem className="text-[11px]"  key={index} value={banco.banco}>{banco.banco}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
/>
<Input type="number" placeholder="Valor" {...register("valorForma")} className="w-[120px] h-7" />

<Input className="h-7" {...register("observacao")} placeholder="Observações sobre o pagamento" />


<Button className="h-7" type="button" onClick={handleSubmit(adicionarPagamento)} size="sm" disabled={!watch("forma_pagamento") || !valorForma}>+</Button>
</div>


<div className="space-y-2">
            <h4 className="font-medium text-[13px]">Pagamentos Adicionados:</h4>
            {lancamentoForma ? (
              <ul className={`${roboto_Mono.className}  border p-2 rounded divide-y space-y-2 bg-gray-100 text-[13px]`}>
                {lancamentoForma?.map((item,index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.forma}: R$ {item.valor} {item.banco} {item.observacao}</span>
                    <MdClose onClick={() => removerPagamento(index)} className="text-red-600 cursor-pointer" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-500">Nenhum pagamento adicionado.</p>
            )}
          </div>

    <Button className="ml-auto"  variant={'outline'} size={'sm'}   type="submit" >
  {'CADASTRAR'}
</Button>

</form>
            </DialogContent>
        </Dialog>
    )
}