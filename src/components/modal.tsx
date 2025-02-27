import { FormEvent, useState, useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Modal } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Select, SelectGroup, SelectItem, SelectContent, SelectTrigger, SelectValue } from "./ui/select";



interface ContratoProps {
    id_contrato: number
}
interface DependentesProps {
    nome: string
}
interface DadosProps {
    id_associado: number,
    id_global: number
    nome: string,
    numero: number,
    bairro: string,
    uf: string
    cidade: string,
    endereco: string,
    contrato: ContratoProps,
    dependentes: Array<DependentesProps>
}


interface Props {
    visible: boolean,
    setVisible: () => void
}
interface FormProps {
    input: string
    criterio: string
}

export function ModalBusca({ setVisible, visible }: Props) {
    const { carregarDados, selectEmp } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [array, setarray] = useState<DadosProps[]>([])
    const { register, handleSubmit, control } = useForm<FormProps>({
        defaultValues: {
            criterio: "Contrato"
        }
    })







    const buscar: SubmitHandler<FormProps> = async (data) => {
        let response: any


        try {

            setLoading(true)
            if (data.criterio === "Contrato") {
                if (isNaN(Number(data.input))) {
                    toast.info("Digite apenas números")
                    return
                }
                response = await api.post('/buscar', {

                    id_contrato: Number(data.input),
                    id_empresa: selectEmp
                })


            }
            else if (data.criterio === "Titular") {
                response = await api.post('/buscar', {
                    nome: data.input.toUpperCase().trim(),
                    id_empresa: selectEmp
                })

            }
            else if (data.criterio === "Dependente") {
                response = await api.post('/buscar', {
                    dependente: data.input.toUpperCase().trim(),
                    id_empresa: selectEmp
                })

            }
            else if (data.criterio === "Endereço") {
                response = await api.post('/buscar', {
                    endereco: data.input.toUpperCase().trim(),
                    id_empresa: selectEmp
                })

            }
            else if (data.criterio === "Bairro") {
                response = await api.post('/buscar', {
                    bairro: data.input.toUpperCase().trim(),
                    id_empresa: selectEmp
                })

            }
            setarray(response?.data ?? [])

        } catch (error) {
            toast.error('ERRO NA REQUISIÇÃO')
        } finally {
            setLoading(false)
        }



    }

    return (
        <Modal size={'2xl'} show={visible} onClose={setVisible}>

            <Modal.Header autoFocus={false} className="flex w-full">

                <form onSubmit={handleSubmit(buscar)} className="flex w-full">
                    <Controller
                        control={control}
                        name="criterio"
                        render={({ field }) =>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className="w-[120px] h-10 rounded-s-md focus:ring-0 focus:outline-none border-none focus:border-transparent rounded-e-none bg-gray-100 text-xs shadow-none"><SelectValue>{field.value}</SelectValue></SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem className="text-[11px]" value="Contrato">Contrato</SelectItem>
                                        <SelectItem className="text-[11px]" value="Titular">Titular</SelectItem>
                                        <SelectItem className="text-[11px]" value="Dependente">Dependente</SelectItem>
                                        <SelectItem className="text-[11px]" value="Endereço">Endereço</SelectItem>
                                        <SelectItem  className="text-[11px]" value="Bairro">Bairro</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        }
                    />


                    <div className="inline-flex  w-[30vw]">
                        <input
                            {...register('input')}
                            // type={criterio === "Contrato" ? "number" : "search"} 
                            className="uppercase focus:outline-none w-full focus:ring-0 border-s-[1px] border-gray-400  px-2.5   text-xs bg-gray-100 placeholder-gray-400 "
                            placeholder="Dados da busca"
                            required
                        />
                        <button
                            type="submit"
                            className=" p-2.5 h-full text-xs font-medium bg-blue-600 hover:bg-blue-700 rounded-e-lg">
                            <HiSearch color='white' className="w-5 h-5" />
                        </button>
                    </div>


                </form>


            </Modal.Header>
            <Modal.Body>


                {loading ? ((<div className="flex flex-col h-full justify-center items-center p-2"><AiOutlineLoading3Quarters color='blue' size={40} className="animate-spin" /></div>)) : (
                    <div className="flex flex-col  mb-1 text-xs ">
                        <p className="text-gray-600 mb-2">Selecione o Contrato:</p>
                        <ul className="overflow-y-auto space-y-2 mb-2">
                            {array.map((item, index) => (
                                <li key={index} onClick={() => { carregarDados(item.id_global), setVisible() }} className="inline-flex items-center justify-between w-full p-2 rounded-lg cursor-pointer border-gray-500   bg-gray-200 hover:bg-gray-300">

                                    <div className="block">
                                        <div className="w-full  font-semibold"><span className="pr-2">{item?.contrato?.id_contrato}</span>{item.nome}<span className="flex flex-col gap-1">{item?.dependentes?.map((i, id) => (<span>DEPENDENTE: {i.nome}</span>))}</span></div>
                                        <div className="w-full  text-gray-600">
                                            <span className="pr-2">{item.endereco}</span>
                                            Nº:<span className="pr-2">{item.numero}</span>
                                            BAIRRO:<span className="pr-2"> {item.bairro}</span>
                                            CIDADE:<span className="pr-2 font-semibold">{item.cidade}/{item.uf}</span>
                                        </div>
                                    </div>
                                    <MdKeyboardArrowRight size={20} className="text-gray-600" />

                                </li>
                            ))}
                        </ul>
                    </div>
                )}


            </Modal.Body>
        </Modal>



    )
}