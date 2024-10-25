import { Button, Modal } from "flowbite-react"
import { HiOutlineExclamationCircle } from "react-icons/hi2"
import { DadosInputs } from "../preAgendamento"
import { toast } from "react-toastify"
import { api } from "@/services/apiClient"
import { ClientProps } from "@/pages/afapSaude"

interface DataProps{
    openModal:boolean
    setOpenModal:(open:boolean)=>void,
    cliente:Partial<DadosInputs>
    arrayPre:Array<ClientProps>
    setPre:(array:Array<ClientProps>)=>void
}

export function ModalStatusAgendamento({openModal,setOpenModal,cliente,arrayPre,setPre}:DataProps) {


    const editarEvento = async () => {
      console.log(cliente.status)
        try {
    
            const evento = await toast.promise(
             
                api.put("/agenda/preAgendamento/editar", {
                    id_agcli: cliente?.id_agcli,
                    id_agmed:cliente.status === 'AGUARDANDO DATA' ? null : cliente?.id_agmed,
                    
                    data_prev: cliente.status === 'AGUARDANDO DATA' ? null : cliente?.data_prev,
                    status: cliente?.status
                }),
                {
                    error: 'Erro na requisição',
                    pending: 'Alterando status..',
                    success: 'Status alterado com sucesso'
                }

            )
            let novo: Array<ClientProps> = [...arrayPre]
            const index = arrayPre.findIndex(item => item.id_agcli === cliente?.id_agcli)
                    novo[index] = { ...evento.data }
              
                setPre(novo)

              setOpenModal(false)

        } catch (error) {
            toast.error('Erro ao gerar evento')
        }
    }

    return (
        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Realmente deseja alterar o status?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={editarEvento}>
                {"Sim, tenho certeza"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                Não, cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    )

}