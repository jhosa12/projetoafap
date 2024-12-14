
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { AuthContext} from "@/contexts/AuthContext";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, ModalBody, ModalHeader, TextInput,Select,Checkbox, Button } from "flowbite-react";
import { MensalidadeProps } from "@/types/financeiro";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import useBaixaMensalidade from "@/hooks/useBaixaMensalidade";
import { Controller, SubmitHandler, useForm } from "react-hook-form";



interface rops{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    mensalidade:Partial<MensalidadeProps>,
    setMensalidade:(mensalidade:Partial<MensalidadeProps>)=>void
}

export function ModalMensalidade({openModal,setOpenModal,mensalidade,setMensalidade}:rops){
    const {usuario,dadosassociado,permissoes,setarDadosAssociado}=useContext(AuthContext)
    const [desconto,setDesconto] = useState(false)
    const {error,postData} = useBaixaMensalidade('/mensalidade/baixa')
    const {watch,register,control,reset,setValue,handleSubmit} = useForm<MensalidadeProps>(
        {
            defaultValues:mensalidade
        }
    )
;
    
    
         const handleBaixar:SubmitHandler<MensalidadeProps> = async(data)=> {
            // Função para exibir toast e retornar
         
        
           
        
            const novoArray = [...(dadosassociado?.mensalidade ?? [])];
            const indexAtual = novoArray.findIndex(item => item.id_mensalidade === mensalidade.id_mensalidade);
           let mensalidadeProx = novoArray[indexAtual + 1];
            const mensalidadeAnt = novoArray[indexAtual - 1];
        
            // Verifica se a mensalidade anterior está em aberto
            if (mensalidadeAnt?.id_mensalidade && mensalidadeAnt.status === 'A') {
                return toast.info('Mensalidade anterior em aberto!');
            }

            const dataPgto = new Date(data.data_pgto);
            dataPgto.setTime(dataPgto.getTime() - dataPgto.getTimezoneOffset() * 60 * 1000);
        
           
        
         
           
               postData(
                   {
                        id_global:dadosassociado?.id_global,
                        id_usuario: usuario?.id ,
                        id_mensalidade_global: mensalidade?.id_mensalidade_global,
                        id_mensalidade: mensalidade?.id_mensalidade,
                        data_pgto: dataPgto,
                        hora_pgto: new Date().toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }),          
                        valor_total: data.valor_total,
                        motivo_bonus: data.motivo_bonus?.toUpperCase(),
                        associado: dadosassociado?.nome,
                        form_pagto: data?.form_pagto,
                        banco_dest: data.banco_dest,
                        desconto: desconto,
                        id_proximaMensalidade:mensalidadeProx?.id_mensalidade_global,
                        situacao:dadosassociado?.contrato?.situacao,
                        status:data.status,
                        pix_por:data.pix_por
                    },
                 
                );
        
              
        
             
           
        
            
               
       
          
        }
        








    return(

<Modal
        className="absolute bg-transparent overflow-y-auto"
        content={"base"}
         show={openModal}
         onClose={()=>setOpenModal(false)}
          size={'3xl'}
           popup 
        
         dismissible
          >
            <ModalHeader className="flex text-white items-start justify-between bg-gray-700 rounded-t border-b p-2 border-gray-60">
             <h1 className="text-white">REALIZAR BAIXA</h1>
                </ModalHeader>

        <form onSubmit={handleSubmit(handleBaixar)}>
            <ModalBody>
              
 
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
    <TextInput style={{padding:6}} value={''} onChange={e=>{}} placeholder="RECEBIDO POR "/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">FORMA PAG.</label>
    <Select  {...register('form_pagto')}  style={{padding:6}}>
            <option>{''}</option>
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



{watch('form_pagto')==='PIX'&& (

<div className="mb-1 col-span-2">
    <label  className="block mb-1 text-xs font-medium  text-black">PIX POR</label>
    <TextInput style={{padding:6}} {...register('pix_por')} placeholder="PIX POR "/>

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
          </ModalBody>

          <Modal.Footer>
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