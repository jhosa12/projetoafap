import { VeiculoProps } from "@/types/veiculo"
import { Modal, TextInput,Label, Button } from "flowbite-react"
import { SubmitHandler, useForm } from "react-hook-form"

type DataProps = {
    openModal:boolean
    onClose:()=>void,
    veiculo:VeiculoProps|null,
    handleNovoVeiculo:(data:VeiculoProps)=>Promise<void>
}


export function ModalVeiculo({onClose,openModal,veiculo, handleNovoVeiculo}:DataProps){
    const {register,watch,setValue,handleSubmit} = useForm<VeiculoProps>()


    const handleOnSubmit:SubmitHandler<VeiculoProps> = (data)=>{
            handleNovoVeiculo(data)
    }


    return(
        <Modal show={openModal} size="md" onClose={onClose} >
            <Modal.Header>VEÍCULO</Modal.Header>
            <Modal.Body>
                <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(handleOnSubmit)}>

                    <div>
                    <Label className="text-xs" value="MODELO" />
                    <TextInput sizing="sm" {...register('modelo')} placeholder="MODELO"/>
                    </div>

                    <div>
                    <Label className="text-xs" value="MARCA" />
                    <TextInput sizing="sm" {...register('marca')} placeholder="MARCA"/>
                    </div>
                    <div>
                    <Label className="text-xs" value="ANO" />
                    <TextInput sizing="sm" {...register('ano')} placeholder="ANO"/>
                    </div>

                    <div>
                    <Label className="text-xs" value="COR" />
                    <TextInput sizing="sm" {...register('cor')} placeholder="COR"/>
                    </div>

                    <div>
                    <Label className="text-xs" value="PLACA" />
                    <TextInput sizing="sm" {...register('placa')} placeholder="PLACA"/>
                    </div>  
                    <div>
                    <Label className="text-xs" value="CHASSI" />
                    <TextInput sizing="sm" {...register('chassi')} placeholder="CHASSI"/>
                    </div>  



                    <Button color="failure">Excluir</Button>

                    <Button color="blue">Adicionar</Button>
                    
                    
                   

                </form>

            </Modal.Body>
        </Modal>

    )
}