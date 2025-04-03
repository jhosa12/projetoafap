import { Button } from "@/components/ui/button"
import { AuthContext } from "@/store/AuthContext"
import { api } from "@/lib/axios/apiClient"
import { Modal, TextInput } from "flowbite-react"
import { useContext, useState } from "react"
import { TbAlertTriangle } from "react-icons/tb"
import { toast } from "sonner"



interface DataProps{

setModal:(open:boolean)=>void,
openModal:boolean

}



export function ModalInativar({openModal,setModal}:DataProps){
  const {dadosassociado,setarDadosAssociado}= useContext(AuthContext)

  //const [motivoDesagrado, setMotivoDesagrado] = useState(false)
  const [descMotivo, setDescMotivo] = useState('')

  const [motivo,setMotivo] = useState<{[key:string]:boolean}>({
      financeiro:false,
      nLocalizado:false,
      desagrado:false
  })





  async function inativarAtivarContrato() {

    const st = dadosassociado?.contrato?.situacao ==='ATIVO' ? 'INATIVO' : 'ATIVO'

    let categoria_inativo = ''
    if (st === 'INATIVO') {
      if (motivo.desagrado) {
        categoria_inativo = 'Desagrado'
      }
      if (motivo.financeiro) {
        categoria_inativo = 'Financeiro'
      }
      if (motivo.nLocalizado) {
        categoria_inativo = 'Nao Localizado'
      }
    }

    if (st === 'INATIVO' && !motivo.desagrado && !motivo.financeiro && !motivo.nLocalizado) {
      toast.warning('Selecione a categoria do motivo')

      return;
    }
    if (st === 'INATIVO' && !descMotivo) {
      toast.warning('Descreva o motivo da Inativação')
      return;
    }

   toast.promise(
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
        loading: 'Realizando Alteração....',
        success:(response)=>{
          setarDadosAssociado({...dadosassociado,contrato:{...dadosassociado?.contrato,...response.data}})
          setModal(false)
          
          return 'Alteração realizada com sucesso'}

      }
    )
   // await carregarDados()
   
   

  }


  return(

    <Modal size="md" show={openModal} onClose={()=>setModal(false)} popup>
       <Modal.Header/>
   <Modal.Body>
  
        <div className="space-y-4 text-center">
          <div className="flex w-full justify-center items-center">
            <TbAlertTriangle color="red" size={40} />
          </div>
          <h3 className="mb-5 text-sm font-normal  ">{`Realmente deseja alterar o contrato Nº ${dadosassociado?.contrato?.id_contrato}`}?</h3>
{
      dadosassociado?.contrato?.situacao==='ATIVO' &&    <>
          <div className="inline-flex gap-8 text-xs font-medium">
            <div className="flex items-center ">
              <input type="checkbox" checked={motivo.financeiro} onClick={() => setMotivo({financeiro:!motivo.financeiro})}  className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2   whitespace-nowrap ">FINANCEIRO</label>
            </div>
            <div className="flex items-center ">
              <input type="checkbox" checked={motivo.nLocalizado} onClick={() => setMotivo({nLocalizado:!motivo.nLocalizado})}  className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2   whitespace-nowrap ">NÃO LOCALIZADO</label>
            </div>
            <div className="flex items-center ">
              <input type="checkbox" checked={motivo.desagrado} onClick={() => setMotivo({desagrado:!motivo.desagrado})}  className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2   whitespace-nowrap ">DESAGRADO</label>
            </div>

          </div>
          <TextInput sizing="sm"  value={descMotivo} onChange={e => setDescMotivo(e.target.value)} placeholder="Informe o motivo da Inativação" autoComplete='off' type="text" required />
          </>}

     





<div className="inline-flex  gap-4">
<Button size={'sm'} variant={'outline'} onClick={() => inativarAtivarContrato()} >

Sim, tenho certeza
</Button>
<Button size={'sm'} variant={'destructive'}  onClick={() => setModal(false)} >Não, cancelar</Button>
</div>
        
        </div>
  
        </Modal.Body>

  </Modal>
  )
}





