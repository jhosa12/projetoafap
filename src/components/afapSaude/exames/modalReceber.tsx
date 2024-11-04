import { Button, Modal, Select, TextInput } from "flowbite-react"
import { HiOutlineExclamationCircle } from "react-icons/hi2"

interface DataProps {
    openModal:boolean
    setOpenModal:Function,
    formPag:string
    setFormPag:(value:string)=>void,
    handleReceberExame:()=>Promise<void>
}


export function ModalReceber({openModal,setOpenModal,formPag,setFormPag,handleReceberExame}:DataProps) {
    return (
        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="m2-5 text-lg whitespace-nowrap font-normal text-gray-500 dark:text-gray-400">
              Realmente confirma o recebimento desse exame?
            </h3>
            <Select value={formPag} onChange={(e) => setFormPag(e.target.value)} sizing="sm" className="mb-2">
                <option value={""}>SELECIONE A FORMA DE PAGAMENTO</option>
                <option value={"DINHEIRO"}>DINHEIRO</option>
                <option value={"CARTAO"}>CARTAO</option>
                <option value={"PIX"}>PIX</option>
                <option value={"TRANSFERENCIA"}>TRANSFERENCIA</option>
            </Select>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleReceberExame}>
                {"Sim, Eu confirmo"}
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