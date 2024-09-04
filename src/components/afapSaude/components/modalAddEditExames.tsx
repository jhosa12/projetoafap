import { ExamesProps } from "@/pages/afapSaude"
import { Button, Label, Modal, TextInput } from "flowbite-react"



interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    data:ExamesProps,
    setData:(list:ExamesProps)=>void
    handleAdicionarExame:()=>Promise<void>
    handleEditarExame:()=>Promise<void>
}


export function ModalEditExames({openModal,setOpenModal,data,setData,handleAdicionarExame,handleEditarExame}:DataProps){

    return(
        <Modal  dismissible show={openModal} size={'lg'} onClose={() => setOpenModal(false)}>
        <Modal.Header>Administrar Exame</Modal.Header>
        <Modal.Body>
          <div className="space-y-4 p-4">
          <div>
              <div className="block">
                <Label  htmlFor="exame" value="Exame" />
              </div>
              <TextInput value={data.nome} onChange={e=>setData({...data,nome:e.target.value})} id="exame"  placeholder="Nome Exame" required />
            </div>

            <div>
              <div  className="block">
                <Label htmlFor="valor" value="Valor Bruto" />
              </div>
              <TextInput value={data.valorBruto} onChange={e=>setData({...data,valorBruto:Number(e.target.value)})}  inputMode="numeric" id="valor"  placeholder="Valor" required />
            </div>

            <div className="inline-flex gap-2">
            <div>
              <div  className="block">
                <Label htmlFor="particular" value="Particular(%)" />
              </div>
              <TextInput value={data.porcPart} onChange={e=>setData({...data,porcPart:Number(e.target.value)})}  inputMode="numeric" id="particular"  placeholder="Desconto" required />
            </div>
            <div>
              <div className="block">
                <Label htmlFor="funeraria" value="Funerária(%)" />
              </div>
              <TextInput value={data.porcFun} onChange={e=>setData({...data,porcFun:Number(e.target.value)})} inputMode="numeric" id="funeraria"  placeholder="Desconto" required />
            </div>
            <div>
              <div className="block">
                <Label htmlFor="plano" value="Plano(%)" />
              </div>
              <TextInput value={data.porcPlan} onChange={e=>setData({...data,porcPlan:Number(e.target.value)})} inputMode="numeric" id="plano"  placeholder="Desconto" required />
            </div>

            </div>
           
          </div>
        </Modal.Body>
        <Modal.Footer>
          {data.id_exame?<Button color={'warning'} onClick={handleEditarExame}>Editar</Button>:<Button onClick={handleAdicionarExame}>Salvar</Button>}
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
  
    )
}