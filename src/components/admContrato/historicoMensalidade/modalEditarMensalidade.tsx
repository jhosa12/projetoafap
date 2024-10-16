

import { GiReturnArrow } from "react-icons/gi";
import { AuthContext} from "@/contexts/AuthContext";
import { useContext} from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, ModalBody, ModalHeader, TextInput, Button } from "flowbite-react";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { MensalidadeProps } from "@/types/financeiro";




interface rops{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    mensalidade:Partial<MensalidadeProps>,
    setMensalidade:(mensalidade:Partial<MensalidadeProps>)=>void
}

export function ModalEditarMensalidade({openModal,setOpenModal,mensalidade,setMensalidade}:rops){
    const {usuario,dadosassociado,permissoes,setarDadosAssociado}=useContext(AuthContext)
  
    
       
    const handleEstorno= async() =>{
        const novoArray= [...(dadosassociado?.mensalidade||[])]
        const index = novoArray.findIndex(item=>item.id_mensalidade===mensalidade.id_mensalidade)
        const mensalidadeProxima = novoArray[index+1]


        if(mensalidadeProxima && mensalidadeProxima.status==='P'){
            toast.warn('Impossivel estornar, a próxima mensalidade se encontra paga!')
            return
        }
        try {
            const response = await  toast.promise(
                api.put('/mensalidade/estorno',{
                    id_mensalidade:mensalidade.id_mensalidade,
                    id_mensalidade_global:mensalidade.id_mensalidade_global
                })  ,

                {error:'Erro na tentativa de estorno, consulte o TI',
                    pending:'Realizando estorno.....',
                    success:'Estorno efetuado com sucesso!'
                }
               
            )
               
                novoArray[index] = response.data
                setarDadosAssociado({mensalidade:novoArray})
                setOpenModal(false)
            
          
        } catch (error) {
            console.log(error)
        }
    }  




    return(

<Modal
        className="absolute bg-transparent overflow-y-auto"
        content={"base"}
         show={openModal}
         onClose={()=>setOpenModal(false)}
          size={'4xl'}
           popup 
        
         dismissible
          >
            <ModalHeader className="flex text-white items-start justify-between bg-gray-700 rounded-t border-b p-2 border-gray-60">
             <h1 className="text-white">Editar Dados</h1>
                </ModalHeader>
            <ModalBody>
                <div className="grid grid-cols-4 px-2 mt-4 border-b-[1px] border-gray-500 max-h-[68vh] overflow-y-auto gap-2">
                <div className="mb-1 col-span-1 ">
<label  className="block mb-1 text-xs font-medium  text-black">REFERÊNCIA</label>
<TextInput disabled style={{padding:6}} value={mensalidade?.referencia} onChange={e=>setMensalidade({...(mensalidade || {}),referencia:e.target.value})} placeholder="REFERÊNCIA"/>
</div>

<div className="flex flex-col w-full mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">VENCIMENTO</label>
    <DatePicker className="flex w-full p-1.5 text-sm rounded-lg bg-gray-50 border-gray-300" disabled={!permissoes.includes('ADM1.2.8')}  onChange={e=>e && setMensalidade({...mensalidade,vencimento:e})} value={mensalidade?.vencimento && new Date(mensalidade?.vencimento).toLocaleDateString('pt-BR',{timeZone:'UTC'})} locale={pt} />
</div>
<div className="flex flex-col w-full mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">COBRANÇA</label>
    <DatePicker  disabled={!permissoes.includes('ADM1.2.9')} className="flex w-full text-sm p-1.5 rounded-lg bg-gray-50 border-gray-300" onChange={e=>e && setMensalidade({...mensalidade,cobranca:e})} value={mensalidade?.cobranca && new Date(mensalidade?.cobranca).toLocaleDateString('pt-BR',{timeZone:'UTC'})} locale={pt}/>
</div>

<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">VALOR</label>
    <TextInput  style={{padding:6}} value={mensalidade?.valor_principal} onChange={e=>setMensalidade({...mensalidade ,valor_principal:Number(e.target.value)})} placeholder="VALOR PRINCIPAL"/>
</div>

<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">STATUS</label>
    <TextInput theme={{field:{input:{base:'block w-full border disabled:cursor-not-allowed disabled:opacity-50 font-bold'}}}} disabled style={{padding:6}} value={mensalidade?.status} onChange={e=>setMensalidade({...(mensalidade || {}),status:e.target.value})}  placeholder="STATUS"/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">BAIXADA POR</label>
    <TextInput  disabled style={{padding:6}} value={mensalidade?.usuario} onChange={e=>setMensalidade({...(mensalidade || {}),usuario:e.target.value})} placeholder="BAIXADA POR "/>
</div>
<div className="mb-1 col-span-1">
    <label  className="block mb-1 text-xs font-medium  text-black">AGENDADA POR</label>
    <TextInput disabled style={{padding:6}} value={''} onChange={e=>{}} placeholder="AGENDADA POR"/>
</div>

        
</div>
          </ModalBody>

          <Modal.Footer>
          <div className={`inline-flex w-full ${mensalidade.status==="P"?"justify-between":"justify-end"}`}>
         {mensalidade.status==='P' && <Button disabled={!permissoes.includes('ADM1.2.6')} color={'failure'} type="button" onClick={()=>handleEstorno()} ><GiReturnArrow className="mr-2 h-5 w-5"/> ESTORNAR</Button>}
          <Button disabled={!permissoes.includes('ADM1.2.6')||mensalidade.status==='P'} color={'success'} type="button" onClick={()=>{}} ><GiReturnArrow className="mr-2 h-5 w-5"/>Gravar Alterações</Button>
          </div>
          
       
         
    
        </Modal.Footer>




        </Modal>

)
}