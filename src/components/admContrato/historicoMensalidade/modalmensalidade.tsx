
import { MdSaveAlt } from "react-icons/md";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { GiReturnArrow } from "react-icons/gi";
import { AuthContext} from "@/contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, ModalBody, ModalHeader, TextInput,Select,Checkbox, Button } from "flowbite-react";
import { MensalidadeProps } from "@/types/financeiro";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import useBaixaMensalidade from "@/hooks/useBaixaMensalidade";

type ToastType = 'success' | 'error' | 'info' | 'warn'

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
;
    
    
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
        
            if (dadosassociado?.contrato?.situacao === 'INATIVO') {
                return exibirToastERetornar('Contrato inativo, impossível realizar baixa!', 'info');
            }
        
            if (desconto === true && !mensalidade?.motivo_bonus) {
                return exibirToastERetornar('Informe o motivo do desconto!', 'info');
            }
        
           
        
            const novoArray = [...(dadosassociado?.mensalidade ?? [])];
            const indexAtual = novoArray.findIndex(item => item.id_mensalidade === mensalidade.id_mensalidade);
           let mensalidadeProx = novoArray[indexAtual + 1];
            const mensalidadeAnt = novoArray[indexAtual - 1];
        
            // Verifica se a mensalidade anterior está em aberto
            if (mensalidadeAnt?.id_mensalidade && mensalidadeAnt.status === 'A') {
                return exibirToastERetornar('Mensalidade anterior em aberto!', 'info');
            }
        
        
           
        
         
           
               postData(
                   {
                        id_usuario: usuario?.id ,
                        id_mensalidade_global: mensalidade?.id_mensalidade_global,
                        id_mensalidade: mensalidade?.id_mensalidade,
                        data_pgto: new Date(),
                        hora_pgto: new Date().toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }),          
                        valor_total: mensalidade?.valor_total,
                        motivo_bonus: mensalidade?.motivo_bonus?.toUpperCase(),
                        associado: dadosassociado?.nome,
                        form_pagto: mensalidade?.form_pagto,
                        banco_dest: mensalidade.banco_dest,
                        desconto: desconto,
                        id_proximaMensalidade:mensalidadeProx?.id_mensalidade_global
                       
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
            <ModalBody>
              
 
          <div className="p-2 mt-2 grid gap-2 grid-flow-row-dense grid-cols-3">

          <div className="mb-1 col-span-1 ">
<label  className="block mb-1 text-xs font-medium  text-black">REFERÊNCIA</label>
<TextInput disabled style={{padding:6}} value={mensalidade?.referencia} onChange={e=>setMensalidade({...(mensalidade || {}),referencia:e.target.value})} placeholder="REFERÊNCIA"/>
</div>

<div className="mb-1 col-span-1">
<label  className="block mb-1 text-xs font-medium  text-black">VALOR PAGO</label>
<TextInput style={{padding:6}} value={mensalidade?.valor_total} onChange={e=>setMensalidade({...mensalidade,valor_total:Number(e.target.value)})} placeholder="VALOR PAGO"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">RECEBIDO POR</label>
    <TextInput style={{padding:6}} value={''} onChange={e=>{}} placeholder="RECEBIDO POR "/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">FORMA PAG.</label>
    <Select  value={mensalidade?.form_pagto}  onChange={(e) =>setMensalidade( { ...mensalidade, form_pagto: e.target.value})}  style={{padding:6}}>
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
    <Select  value={mensalidade?.banco_dest}  onChange={(e) =>setMensalidade({ ...mensalidade, banco_dest: e.target.value})}  style={{padding:6}}>
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
<DatePicker className="flex w-full text-sm p-1.5 rounded-lg bg-gray-50 border-gray-300" disabled={!permissoes.includes('ADM1.2.7')} selected={mensalidade?.data_pgto}  onChange={e=>e && setMensalidade({...mensalidade,data_pgto:new Date(e)})}  dateFormat={'dd/MM/yyyy'} locale={pt} />
</div>
{((mensalidade?.valor_total ?? 0)<(mensalidade?.valor_principal ?? 0) && mensalidade?.valor_total!==undefined)&& mensalidade.valor_total>0?(
 <div className="col-span-4 gap-1 mt-1 inline-flex ">
    <div className="flex items-top w-2/12 ">
    <Checkbox  onClick={()=>setDesconto(!desconto)}  checked={desconto} />
    <label  className="ms-2 text-sm font-medium text-gray-700">Desconto</label>
</div>
    <div className="mb-1 w-full">
  <label  className="block mb-1 text-xs font-medium  text-black">INFORME O MOTIVO DO DESCONTO</label>
  <TextInput value={mensalidade.motivo_bonus} onChange={e=>setMensalidade({...(mensalidade || {}),motivo_bonus:e.target.value})} disabled={!desconto || mensalidade.status==='P'} type="text" style={{padding:6}}/>
  </div>
 </div> 
):''}
  

</div>
          </ModalBody>

          <Modal.Footer>
            <div className="ml-auto">
            <Button disabled={!permissoes.includes('ADM1.2.5')||mensalidade.status==='P'}
             color={'success'} 
             onClick={()=>{
                handleBaixar()
             
                }} >
            <IoIosArrowDropdownCircle className="mr-2 h-5 w-5"/>
             BAIXAR
             </Button>
         
            </div>
    
        </Modal.Footer>




        </Modal>

)
}