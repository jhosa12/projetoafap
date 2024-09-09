import { AuthContext } from "@/contexts/AuthContext"
import { Button, Modal, TextInput } from "flowbite-react"
import { useContext } from "react"
import { TbAlertTriangle } from "react-icons/tb"



interface DataProps{
motivoFinanceiro:boolean,
motivoNaoLocalizado:boolean,
motivoDesagrado:boolean,
setMotivoFinanceiro:(mt:boolean)=>void,
setNaoLocalizado:(mt:boolean)=>void,
setMotivoDesagrado:(mt:boolean)=>void
inativarAtivarContrato:(st:string)=>Promise<void>
setModal:(open:boolean)=>void,
openModal:boolean

}



export function ModalInativar({motivoDesagrado,motivoFinanceiro,motivoNaoLocalizado,inativarAtivarContrato,setMotivoDesagrado,setMotivoFinanceiro,setNaoLocalizado,openModal,setModal}:DataProps){
  const {data,closeModa}= useContext(AuthContext)


  return(

    <Modal show={openModal} onClose={()=>setModal(false)} popup>

       <Modal.Header/>
   <Modal.Body>
  
        <div className="space-y-4 text-center">
          <div className="flex w-full justify-center items-center">
            <TbAlertTriangle className='text-gray-400' size={60} />
          </div>
          <h3 className="mb-5 text-lg font-normal  ">{`Realmente deseja inativar o contrato Nº ${data.contrato?.id_contrato}`}?</h3>

          <div className="inline-flex gap-8">
            <div className="flex items-center ">
              <input type="checkbox" checked={motivoFinanceiro} onClick={() => { setMotivoFinanceiro(!motivoFinanceiro), closeModa({ contrato: { ...data.contrato, categoria_inativo: 'FINANCEIRO' } }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2 text-sm font-medium whitespace-nowrap ">FINANCEIRO</label>
            </div>
            <div className="flex items-center ">
              <input type="checkbox" checked={motivoNaoLocalizado} onClick={() => { setNaoLocalizado(!motivoNaoLocalizado), closeModa({ contrato: { ...data.contrato, categoria_inativo: 'NÃO LOCALIZADO' } }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2 text-sm font-medium whitespace-nowrap ">NÃO LOCALIZADO</label>
            </div>
            <div className="flex items-center ">
              <input type="checkbox" checked={motivoDesagrado} onClick={() => { setMotivoDesagrado(!motivoDesagrado), closeModa({ contrato: { ...data.contrato, categoria_inativo: 'DESAGRADO' } }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2 text-sm font-medium whitespace-nowrap ">DESAGRADO</label>
            </div>

          </div>



          <TextInput  value={data.contrato?.motivo_inativo} onChange={e => closeModa({ ...data, contrato: { ...data.contrato, motivo_inativo: e.target.value } })} placeholder="Informe o motivo da Inativação" autoComplete='off' type="text" required />


<div className="inline-flex  gap-4">
<Button disabled={!motivoDesagrado && !motivoFinanceiro && !motivoNaoLocalizado} color={'warning'} onClick={() => inativarAtivarContrato('INATIVO')} >

Sim, tenho certeza
</Button>
<Button color={'light'} onClick={() => {  }} >Não, cancelar</Button>
</div>
        
        </div>
  
        </Modal.Body>

  </Modal>
  )
}





