"use client"
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { AuthContext} from "@/store/AuthContext";
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import useBaixaMensalidade from "@/hooks/useBaixaMensalidade";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, Checkbox, Modal, Select, TextInput } from "flowbite-react";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { toast } from "sonner";
import { MensalidadeBaixaProps } from "@/types/financeiro";

interface Props{
    handleAtualizar:Function
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    mensalidade:Partial<MensalidadeBaixaProps>
   
}

export function ModalMensalidade({openModal,setOpenModal,mensalidade,handleAtualizar}:Props){

    const {usuario,permissoes,selectEmp,consultores}=useContext(AuthContext)
    const [desconto,setDesconto] = useState(false)
    const {error,postData} = useBaixaMensalidade('/mensalidade/baixa',setOpenModal,handleAtualizar)
    const {register,handleSubmit,watch,control,reset} = useForm<MensalidadeBaixaProps>(
      
    )


    useEffect(()=>{
        reset({...mensalidade,form_pagto:'',valor_total:mensalidade?.valor_principal,data_pgto:new Date()})
    },[mensalidade])



         const handleBaixar:SubmitHandler<MensalidadeBaixaProps> = async(data)=> {
            // Função para exibir toast e retornar
            const novoArray = [...(mensalidade.associado?.mensalidade ?? [])];
            const indexAtual = novoArray.findIndex(item => item.id_mensalidade === mensalidade.id_mensalidade);
           let mensalidadeProx = novoArray[indexAtual + 1];
            const mensalidadeAnt = novoArray[indexAtual - 1];
        
            // Verifica se a mensalidade anterior está em aberto
            if (mensalidadeAnt?.id_mensalidade && mensalidadeAnt.status === 'A') {
                return toast.info('Mensalidade anterior em aberto!');
            }

            

            const {newDate:dataPgto} = removerFusoDate(data.data_pgto);
            const {newDate:data_lanc} = removerFusoDate(new Date());
        
           
        
         try {

             await postData(
                   {
                        id_global:data?.id_global,
                       // id_usuario: usuario?.id ,
                        id_mensalidade_global: data?.id_mensalidade_global,
                        id_mensalidade: data?.id_mensalidade,
                        data_pgto: dataPgto,
                        hora_pgto: new Date().toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }),          
                        valor_total: Number(data.valor_total),
                        motivo_bonus: data.motivo_bonus?.toUpperCase(),
                        associado: mensalidade?.associado?.nome,
                        form_pagto: data?.form_pagto,
                        banco_dest: data.banco_dest,
                        desconto: desconto,
                        id_proximaMensalidade:mensalidadeProx?.id_mensalidade_global,
                        situacao:mensalidade?.contrato?.situacao,
                        status:data.status,
                        pix_por:data.pix_por,
                        id_empresa:selectEmp,
                        valor_metodo:data?.valor_metodo,
                        data_lanc:data_lanc,
                        recebido_por:data.recebido_por
                    
                    },
                 
                );  

           //  handleAtualizar && await handleAtualizar({endDate:new Date(),startDate:new Date(),id_empresa:selectEmp,descricao:''}) 
          
            
         } catch (error) {
            
         }
           
            
        }
    return(

<Modal
        className="absolute  overflow-y-auto"
        content={"base"}
         show={openModal}
         onClose={()=>setOpenModal(false)}
          size={'3xl'}
           popup 
        
         dismissible
          >
            <Modal.Header className="flex text-white items-start justify-between bg-gray-700 rounded-t border-b p-2 border-gray-60">
             <h1 className="text-white">REALIZAR BAIXA</h1>
                </Modal.Header>

        <form onSubmit={handleSubmit(handleBaixar)}>
            <Modal.Body>
              
            <span className="flex w-full text-gray-500 border-b">Associado</span>
                    <h1 className="font-semibold text-lg">{mensalidade.id_contrato}-{mensalidade.associado?.nome}</h1>
                    <p className="text-sm">{mensalidade.associado?.endereco}</p>
                    <span className="flex w-full text-gray-500 border-b mt-2">Mensalidade</span>
          <div className="p-2 mt-2 grid gap-2 grid-flow-row-dense grid-cols-3">

          <div className="mb-1 col-span-1 ">
<label  className="block mb-1 text-xs font-medium  text-black">REFERÊNCIA</label>
<TextInput disabled style={{padding:6}} {...register('referencia')} placeholder="REFERÊNCIA"/>
</div>

<div className="mb-1 col-span-1">
<label  className="block mb-1 text-xs font-medium  text-black">VALOR PAGO</label>
<TextInput style={{padding:6}}  {...register('valor_total')} placeholder="VALOR PAGO"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">RECEBIDO POR</label>
    <Select  {...register('recebido_por')}  style={{padding:6}}>
            <option value={''}>{''}</option>
            {consultores?.map((consultor)=>(<option className="text-[11px]" key={consultor.id_consultor} value={consultor.nome}>{consultor.nome}</option>))}
           
    </Select>
  
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">FORMA PAG.</label>
    <Select  {...register('form_pagto')}  style={{padding:6}}>
            <option value={''}>{''}</option>
            <option value={'DINHEIRO'}>DINHEIRO</option>
            <option value={'PIX'}>PIX</option>
            <option value={'CARTAO'}>CARTÃO</option>
            <option value={'DEPOSITO'}>DEPOSITO</option>
            <option value={'TRANSFERENCIA'}>TRANSFERÊNCIA</option>
            <option value={'BOLETO'}>BOLETO</option>
    </Select>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">BANCO DESTINO</label>
    <Select  {...register('banco_dest')}  style={{padding:6}}>
            <option>{''}</option>
            <option value={'BANCO DO BRASIL'}>BANCO DO BRASIL</option>
            <option value={'CORA'}>CORA</option>
            <option value={'PAGBANK'}>PAGBANK</option>
            <option value={'CAIXA'}>CAIXA</option>
            <option value={'TON'}>TON</option>
    </Select>
</div>
<div className="mb-1 col-span-1">
<label  className="block mb-1 text-xs font-medium  text-black">PAGAMENTO</label>
<Controller
control={control}
name='data_pgto'
render={({field:{value,onChange}})=>(
    <DatePicker className="flex w-full text-sm p-1.5 rounded-lg bg-gray-50 border-gray-300" disabled={!permissoes.includes('ADM1.2.7')} selected={value}  onChange={e=>e && onChange(e)}  dateFormat={'dd/MM/yyyy'} locale={pt} />
)}

/>

</div>

{watch('form_pagto')!=='DINHEIRO' && (watch('form_pagto')!=='') && (
    <div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">VALOR PIX/CARTÃO</label>
    <TextInput style={{padding:6}} {...register('valor_metodo')} placeholder="VALOR"/>

</div>
)}

{watch('form_pagto')==='PIX'&& (

<div className="mb-1 col-span-2">
    <label  className="block mb-1 text-xs font-medium  text-black">PIX POR</label>
    <TextInput style={{padding:6}} {...register('pix_por')} placeholder="PIX POR "/>

</div>
)

}

{watch('form_pagto')==='CARTAO'&& (

<div className="mb-1 col-span-2">
    <label  className="block mb-1 text-xs font-medium  text-black">AUT</label>
    <TextInput style={{padding:6}} {...register('aut')} placeholder="CODIGO DE AUTORIZACÃO (AUT)"/>
</div>
)

}

{((watch('valor_total') ?? 0)<(watch('valor_principal') ?? 0) && watch('valor_total')!==undefined)&& watch('valor_total')>0?(
 <div className="col-span-4 gap-1 mt-1 inline-flex ">
    <div className="flex items-top w-2/12 ">
    <Checkbox  onClick={()=>setDesconto(!desconto)}  checked={desconto} />
    <label  className="ms-2 text-sm font-medium text-gray-700">Desconto</label>
</div>
    <div className="mb-1 w-full">
  <label  className="block mb-1 text-xs font-medium  text-black">INFORME O MOTIVO DO DESCONTO</label>
  <TextInput {...register('motivo_bonus')} disabled={!desconto || mensalidade.status==='P'} type="text" style={{padding:6}}/>
  </div>
 </div> 
):''}
  

</div>
          </Modal.Body>

          <Modal.Footer >
            <div className="ml-auto">
            <Button disabled={!permissoes.includes('ADM1.2.5')||mensalidade.status==='P'}
             color={'success'} 
             type="submit"
             >
            <IoIosArrowDropdownCircle className="mr-2 h-5 w-5"/>
             BAIXAR
             </Button>
         
            </div>
    
        </Modal.Footer>
        </form>



        </Modal>

)
}