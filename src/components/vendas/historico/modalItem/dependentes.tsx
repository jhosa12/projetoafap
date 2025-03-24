import { Button, ButtonGroup, Label, Modal, Table, TextInput } from "flowbite-react";
import { UseFormLeadProps } from "./modalItem";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { MdClose } from "react-icons/md";
import { DependentesProps } from "@/types/associado";






export function TabDependentes({ control, register, setValue, trigger, watch }: UseFormLeadProps) {
    const [open, onClose] = useState(false)
    const [novo, setNovo] = useState(false)

    const { register: registerDependente, setValue: setValueDependente, handleSubmit, control: controlDependente } = useForm<DependentesProps>()

    const handleOnSubmit: SubmitHandler<DependentesProps> = async (data) => {
        novo ? handleAdicionarDependente(data) : handleEditarDependente(data)
    }

    const handleEditarDependente = (data: DependentesProps) => {



    }
    const handleAdicionarDependente = (data: DependentesProps) => {

        setValue('dependentes', (watch('dependentes') ?? []).concat(data))

    }
    const handleDeleteDependente = (index: number) => {
        setValue('dependentes', watch('dependentes').filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col w-full">
            <ButtonGroup className="pb-2 ml-auto">
                <Button color="light" type="button" size="xs" onClick={() => { setNovo(true); onClose(true) }} >NOVO</Button>

                <Button color="light" type="button" size="xs" onClick={() => { setNovo(false); onClose(true) }} >EDITAR</Button>
            </ButtonGroup>
            <div>
                <Table theme={{ root: { shadow: 'none' }, body: { cell: { base: "px-4 py-1 text-black text-xs uppercase" } } }}>
                    <Table.Head theme={{ cell: { base: "px-4 py-1  text-xs uppercase" } }}>
                        <Table.HeadCell>Nome</Table.HeadCell>
                        <Table.HeadCell>Parentesco</Table.HeadCell>
                        <Table.HeadCell>Data de Nascimento</Table.HeadCell>
                        <Table.HeadCell>celular</Table.HeadCell>
                        <Table.HeadCell>Ações</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {watch('dependentes')?.map((item, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{item?.nome}</Table.Cell>
                                <Table.Cell>{item?.grau_parentesco}</Table.Cell>
                                <Table.Cell>{item?.data_nasc && new Date(item?.data_nasc).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Table.Cell>
                                <Table.Cell>{item?.celular
                                }</Table.Cell>

                                <Table.Cell className="hover:text-red-600">
                                    <button type="button" onClick={() => handleDeleteDependente(index)}>
                                        <MdClose size={13} />
                                    </button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            <Modal popup show={open} onClose={() => onClose(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="grid grid-cols-3 gap-2" >
                        <div className="col-span-2">
                            <Label className="text-xs" value="Nome" />
                            <TextInput sizing="sm" {...registerDependente('nome')} />
                        </div>
                        <div className="">
                            <Label className="text-xs" value="Data de Nascimento" />
                            <Controller
                                control={controlDependente}
                                name="data_nasc"
                                render={({ field: { onChange, value } }) => (
                                    <DatePicker selected={value} onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex  w-full text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                                )}
                            />
                        </div>

                        <div className="">
                            <Label className="text-xs" value="Celular" />
                            <TextInput sizing="sm" {...registerDependente('celular')} />
                        </div>
                        <div className="">
                            <Label className="text-xs" value="Parentesco" />
                            <TextInput sizing="sm" {...registerDependente('grau_parentesco')} />
                        </div>
                        <div className="">
                            <Label className="text-xs" value="Carencia" />
                            <Controller
                                control={controlDependente}
                                name="carencia"
                                render={({ field: { onChange, value } }) => (
                                    <DatePicker selected={value} onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex  w-full text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                                )}
                            />
                        </div>
                        <div className="">
                            <Label className="text-xs" value="Adesão" />
                            <Controller
                                control={controlDependente}
                                name="data_adesao"
                                render={({ field: { onChange, value } }) => (
                                    <DatePicker selected={value} required onChange={e => { e && onChange(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex  w-full text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                                )}
                            />
                        </div>

                        <div className="col-span-3 flex justify-end">
                            <Button type="button" onClick={handleSubmit(handleOnSubmit)}>{novo ? 'Adicionar' : 'Editar'}</Button>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>




        </div>
    )
}