import { ExamesProps } from "@/pages/afapSaude"
import { Button, Label, Modal, Textarea, TextInput } from "flowbite-react"



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
          <div className=" grid grid-cols-2 gap-2">
          <div className="col-span-2">
           
                <Label className="text-xs"  htmlFor="exame" value="Exame" />
            
              <TextInput sizing={'sm'} value={data.nome} onChange={e=>setData({...data,nome:e.target.value})} id="exame"  placeholder="Nome Exame" required />
            </div>

            <div className="col-span-2"> 
           <Label className="text-xs"  htmlFor="exame" value="Orientações sobre a realização do exame" />
         <Textarea rows={3} className="text-xs" value={data.obs} onChange={e=>setData({...data,obs:e.target.value})} id="exame"  placeholder="Descreva todas as orientações que devem ser dadas ao cliente antes da realização do exame" required />
       </div>

            <div>
              
                <Label className="text-xs" htmlFor="valor" value="Valor Bruto(R$)" />
             
              <TextInput sizing={'sm'}  value={data.valorBruto} onChange={e=>setData({...data,valorBruto:Number(e.target.value)})}  inputMode="numeric" id="valor"  placeholder="Valor" required />
            </div>

          
            <div>
             
                <Label className="text-xs" htmlFor="particular" value="Particular(%)" />
             
              <TextInput sizing={'sm'} value={data.porcPart} onChange={e=>setData({...data,porcPart:Number(e.target.value)})}  inputMode="numeric" id="particular"  placeholder="Desconto" required />
            </div>
            <div>
             
                <Label className="text-xs" htmlFor="funeraria" value="Funerária(%)" />
             
              <TextInput sizing={'sm'} value={data.porcFun} onChange={e=>setData({...data,porcFun:Number(e.target.value)})} inputMode="numeric" id="funeraria"  placeholder="Desconto" required />
            </div>
            <div>
              
                <Label className="text-xs" htmlFor="plano" value="Plano(%)" />
             
              <TextInput sizing={'sm'} value={data.porcPlan} onChange={e=>setData({...data,porcPlan:Number(e.target.value)})} inputMode="numeric" id="plano"  placeholder="Desconto" required />
            </div>

            <div className="col-span-2">
            <span className="italic text-xs text-red-700">
              Observação: O valor particular é calculado pelo valor bruto. O valor da funerária e do plano são calculados pelo valor particular.
            </span>
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