import { AuthContext } from "@/store/AuthContext"
import { api } from "@/lib/axios/apiClient"
import { Button, Modal, Select } from "flowbite-react"
import { useContext } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { HiOutlineExclamationCircle } from "react-icons/hi2"
import { toast } from "sonner"
import useActionsAssociado from "@/app/dashboard/admcontrato/_hooks/associado/useActionsAssociado"



interface DataProps {
  openModal: boolean
  setOpenModal: Function


}

interface PlanoProps {
  id_plano: number
  descricao: string
  valor: number
}



export function ModalAlterarPlano({ openModal, setOpenModal }: DataProps) {

  const { setValue, handleSubmit } = useForm<PlanoProps>({})
  const { planos } = useContext(AuthContext)

  const hookProps = {

    setOpenModal: setOpenModal,

  }
  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const plano = planos?.find(item => item.id_plano === parseInt(e.target.value))

    if (plano) {
      setValue('id_plano', plano?.id_plano)
      setValue('descricao', plano?.descricao)
      setValue('valor', plano?.valor)

    }
  }

  const { handleAlterarPlano } = useActionsAssociado(hookProps)

  return <Modal size={'lg'} show={openModal} popup dismissible onClose={() => setOpenModal(false)}>

    <Modal.Header />
    <Modal.Body>
      <form onSubmit={handleSubmit(handleAlterarPlano)} className="text-center">
        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
        <div className="mb-5 flex flex-col justify-center items-center w-full">
          <h3 className="mb-1 text-sm font-normal text-gray-800 dark:text-gray-400">
            Selecione a nova categoria !
          </h3>
          <Select sizing={'sm'} required className="w-1/2"
            onChange={handleChangeSelect}
          >
            <option selected value={''}></option>
            {planos?.map((item) => (
              <option key={item.id_plano} value={item.id_plano}>{item.descricao} - {Number(item.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</option>
            ))
            }

          </Select>
          <span className="text-red-600 text-sm">Ao confirmar a alteração todas as mensalidades terão os valores reajustados!</span>
        </div>
        <div className="flex justify-center gap-4">
          <Button size={'sm'} color="failure" type="submit">
            {"Entendi, quero proseguir"}
          </Button>
          <Button size={'sm'} color="gray" onClick={() => setOpenModal(false)}>
            Não, cancelar
          </Button>
        </div>
      </form>
    </Modal.Body>

  </Modal>
}