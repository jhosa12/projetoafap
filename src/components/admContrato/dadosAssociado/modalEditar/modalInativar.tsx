import { AuthContext } from "@/contexts/AuthContext"
import { api } from "@/services/apiClient"
import { Button, Modal, TextInput } from "flowbite-react"
import { useContext, useState } from "react"
import { TbAlertTriangle } from "react-icons/tb"
import { toast } from "react-toastify"



interface DataProps{

setModal:(open:boolean)=>void,
openModal:boolean

}



export function ModalInativar({openModal,setModal}:DataProps){
  const {dadosassociado,setarDadosAssociado}= useContext(AuthContext)
  const [motivoFinanceiro, setMotivoFinanceiro] = useState(false)
  const [motivoNaoLocalizado, setNaoLocalizado] = useState(false)
  const [motivoDesagrado, setMotivoDesagrado] = useState(false)
  const [descMotivo, setDescMotivo] = useState('')




  async function inativarAtivarContrato() {

    const st = dadosassociado?.contrato?.situacao ==='ATIVO' ? 'INATIVO' : 'ATIVO'

    let categoria_inativo = ''
    if (st === 'INATIVO') {
      if (motivoDesagrado) {
        categoria_inativo = 'Desagrado'
      }
      if (motivoFinanceiro) {
        categoria_inativo = 'Financeiro'
      }
      if (motivoNaoLocalizado) {
        categoria_inativo = 'Nao Localizado'
      }
    }

    if (st === 'INATIVO' && !motivoDesagrado && !motivoFinanceiro && !motivoNaoLocalizado) {
      toast.warning('Selecione a categoria do motivo')

      return;
    }
    if (st === 'INATIVO' && !descMotivo) {
      toast.warning('Descreva o motivo da Inativação')
      return;
    }

    const response = await toast.promise(
      api.put('/contrato/inativar',
        {
          id_contrato:dadosassociado?.contrato?.id_contrato,
          id_contrato_global: dadosassociado?.contrato?.id_contrato_global,
          motivo_inativo: st === 'INATIVO' ? descMotivo : undefined,
          categoria_inativo: st === 'INATIVO' ? categoria_inativo : undefined,
          dt_cancelamento: st === 'INATIVO' ? new Date() : undefined,
          situacao: st
        }
      ),
      {
        error: 'Erro ao Inativar/Ativar Contrato',
        pending: 'Realizando Alteração....',
        success: 'Alteração realizada com sucesso'

      }
    )
   // await carregarDados()
   
    setarDadosAssociado({...dadosassociado,contrato:{...dadosassociado?.contrato,...response.data}})
    setModal(false)

  }


  return(

    <Modal show={openModal} onClose={()=>setModal(false)} popup>

       <Modal.Header/>
   <Modal.Body>
  
        <div className="space-y-4 text-center">
          <div className="flex w-full justify-center items-center">
            <TbAlertTriangle className='text-gray-400' size={60} />
          </div>
          <h3 className="mb-5 text-lg font-normal  ">{`Realmente deseja alterar o contrato Nº ${dadosassociado?.contrato?.id_contrato}`}?</h3>
{
      dadosassociado?.contrato?.situacao==='ATIVO' &&    <>
          <div className="inline-flex gap-8">
            <div className="flex items-center ">
              <input type="checkbox" checked={motivoFinanceiro} onClick={() => setMotivoFinanceiro(!motivoFinanceiro)}  className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2 text-sm font-medium whitespace-nowrap ">FINANCEIRO</label>
            </div>
            <div className="flex items-center ">
              <input type="checkbox" checked={motivoNaoLocalizado} onClick={() => setNaoLocalizado(!motivoNaoLocalizado)}  className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2 text-sm font-medium whitespace-nowrap ">NÃO LOCALIZADO</label>
            </div>
            <div className="flex items-center ">
              <input type="checkbox" checked={motivoDesagrado} onClick={() => setMotivoDesagrado(!motivoDesagrado)}  className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2 text-sm font-medium whitespace-nowrap ">DESAGRADO</label>
            </div>

          </div>
          <TextInput  value={descMotivo} onChange={e => setDescMotivo(e.target.value)} placeholder="Informe o motivo da Inativação" autoComplete='off' type="text" required />
          </>}

     





<div className="inline-flex  gap-4">
<Button  color={'warning'} onClick={() => inativarAtivarContrato()} >

Sim, tenho certeza
</Button>
<Button color={'light'} onClick={() => {  }} >Não, cancelar</Button>
</div>
        
        </div>
  
        </Modal.Body>

  </Modal>
  )
}





