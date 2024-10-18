import { AuthContext } from "@/contexts/AuthContext";
import useBaixaMensalidade from "@/hooks/useBaixaMensalidade";
import { MensalidadeProps } from "@/pages/caixa";
import { api } from "@/services/apiClient";
import { Button, Checkbox, Modal, ModalHeader, Select, TextInput } from "flowbite-react";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

interface DataProps{
    mensalidade:Partial<MensalidadeProps>,
    open:boolean,
    setOpen:(opne:boolean)=>void,
    setMensalidade:(fields:Partial<MensalidadeProps>)=>void
    handleChamarFiltro:()=>void
}


type ToastType = 'success' | 'error' | 'info' | 'warn'

export function ModalDadosMensalidade({mensalidade,open,setOpen,setMensalidade,handleChamarFiltro}:DataProps){
   const [desconto,setDesconto] = useState<boolean>()
   const {usuario} = useContext(AuthContext)
   const {error,postData} = useBaixaMensalidade('/mensalidade/baixa')



   async function handleBaixar() {
    // Função para exibir toast e retornar
    const exibirToastERetornar = (mensagem:string, tipo:ToastType = "warn") => {
        toast[tipo](mensagem);
        return;
    };
    // Validações iniciais
    if (!mensalidade?.form_pagto) {
        return exibirToastERetornar('Informe a forma de pagamento!');
    }
    
    if (mensalidade.form_pagto !== 'DINHEIRO' && !mensalidade.banco_dest) {
        return exibirToastERetornar('Informe o banco de destino');
    }
    
    if (mensalidade?.status === 'P') {
        return exibirToastERetornar('Mensalidade com baixa já realizada', 'error');
    }



    if (desconto === true && !mensalidade?.motivo_bonus) {
        return exibirToastERetornar('Informe o motivo do desconto!', 'info');
    }

   
   let mensalidadeProx = mensalidade.associado?.mensalidade[1];
  

 

              await postData ({
       
                id_usuario: usuario?.id,
                id_mensalidade: mensalidade?.id_mensalidade,
                id_mensalidade_global: mensalidade?.id_mensalidade_global,
                data_pgto: new Date(),
                hora_pgto: new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }),
                valor_total: mensalidade?.valor_total,
                motivo_bonus: mensalidade?.motivo_bonus?.toUpperCase(),
                associado: mensalidade?.associado?.nome,
                form_pagto: mensalidade?.form_pagto,
                banco_dest: mensalidade.banco_dest,
                desconto: desconto,
                id_proximaMensalidade: mensalidadeProx?.id_mensalidade_global
                
            }).finally(()=>handleChamarFiltro())

       
   
}







    return (
        <Modal show={open} popup onClose={()=>setOpen(false)}>
            <ModalHeader></ModalHeader>
            <Modal.Body>
                <div>
                    <span className="flex w-full text-gray-500 border-b">Associado</span>
                    <h1 className="font-semibold text-lg">{mensalidade.id_contrato}-{mensalidade?.associado?.nome}</h1>
                    <p className="text-sm">{mensalidade.associado?.endereco}</p>
                    <span className="flex w-full text-gray-500 border-b mt-2">Mensalidade</span>
                    <div className="p-2 mt-2 grid gap-2 grid-flow-row-dense grid-cols-4">

<div className="mb-1 col-span-1 ">
<label  className="block mb-1 text-xs font-medium  text-black">REFERÊNCIA</label>
<TextInput disabled style={{padding:6}} value={mensalidade?.referencia} placeholder="REFERÊNCIA"/>
</div>

<div className="mb-1 col-span-1">
<label  className="block mb-1 text-xs font-medium  text-black">VALOR PAGO</label>
<TextInput onChange={e=>setMensalidade({...mensalidade,valor_total:Number(e.target.value)})} style={{padding:6}} value={mensalidade?.valor_total}  placeholder="VALOR PAGO"/>
</div>

<div className="mb-1 col-span-1">
<label  className="block mb-1 text-xs font-medium  text-black">FORMA PAG.</label>
<Select onChange={e=>setMensalidade({...mensalidade,form_pagto:e.target.value})}  value={mensalidade?.form_pagto}    style={{padding:6}}>
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
<Select onChange={e=>setMensalidade({...mensalidade,banco_dest:e.target.value})} value={mensalidade?.banco_dest}  style={{padding:6}}>
  <option>{''}</option>
  <option value={'BANCO DO BRASIL'}>BANCO DO BRASIL</option>
  <option value={'CORA'}>CORA</option>
  <option value={'PAGBANK'}>PAGBANK</option>
  <option value={'CAIXA'}>CAIXA</option>
  <option value={'TON'}>TON</option>
</Select>
</div>

{((mensalidade?.valor_total ?? 0)<(mensalidade?.valor_principal ?? 0) && mensalidade?.valor_total!==undefined)&& mensalidade.valor_total>0?(
<div className="col-span-4 gap-1 mt-1 inline-flex ">
<div className="flex items-top w-2/12 ">
<Checkbox  onClick={()=>setDesconto(!desconto)}  checked={desconto} />
<label  className="ms-2 text-sm font-medium text-gray-700">Desconto</label>
</div>
<div className="mb-1 w-full">
<label  className="block mb-1 text-xs font-medium  text-black">INFORME O MOTIVO DO DESCONTO</label>
<TextInput onChange={e=>setMensalidade({...mensalidade,motivo_bonus:e.target.value})} value={mensalidade.motivo_bonus}  type="text" style={{padding:6}}/>
</div>
</div> 
):''}


</div>
<Button onClick={handleBaixar} className="ml-auto">Baixar</Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}