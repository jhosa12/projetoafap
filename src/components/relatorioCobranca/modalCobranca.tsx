import { MetasProps, SetorProps } from "@/pages/vendas"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { HiFilter } from "react-icons/hi"
import { Button, Dropdown, Label, Modal, Select } from "flowbite-react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { CobradorProps } from "@/pages/admcontrato/cobranca";

interface DataProps {
    show: boolean,
    setFiltro: (open: boolean) => void,
    startDate: Date,
    setStartDate: (start: Date) => void
    endDate: Date,
    setEndDate: (end: Date) => void
    loading: boolean,
    listarCobranca: () => Promise<void>
    handleChangeStatus: (e: React.ChangeEvent<HTMLSelectElement>) => void
    selectCobrador:Array<CobradorProps>
    todos:boolean,
    setTodos:(td:boolean)=>void
    arrayBairros:Array<Partial<{ bairro: string, check: boolean }>>
    handleOptionChange:(index:number)=>void
    empresa:string,
    setEmpresa:(emp:string)=>void

}

export function ModalFiltroCobranca({ endDate, loading, setEndDate, setFiltro, setStartDate, show, startDate, handleChangeStatus, listarCobranca,selectCobrador,setTodos,todos,arrayBairros,handleOptionChange,empresa,setEmpresa }: DataProps) {
 const [dropCobrador,setDropCobrador] =useState<boolean>(false)
 const [dropBairros, setDropBairros] = useState<boolean>(false);
    return (
        <Modal dismissible size={'lg'} show={show} onClose={() => setFiltro(false)}>
            <Modal.Header >
                <div className='inline-flex items-center'>
                    <HiFilter color='gray' size={30} />
                    Filtro
                </div>

            </Modal.Header>
            <Modal.Body>
                <div className='space-y-2'>


<div className="inline-flex gap-4 w-full">
                <div className="w-full">
                        <div className="mb-1 block">
                            <Label htmlFor="email1" value="Empresa" />
                        </div>

                        <Select sizing={'sm'} value={empresa} onChange={e => setEmpresa(e.target.value)}>
                            <option value={''}>{""}</option>
                            <option value={'AFAP CEDRO'} selected>AFAP CEDRO</option>
                            <option value={'AFAP LAVRAS'} selected>AFAP LAVRAS</option>
                            <option value={'AFAP VIVA MAIS'} selected>AFAP VIVA MAIS</option>
                            <option value={'OTICA FREITAS'} selected>OTICA FREITAS</option>
                        </Select>
                    </div>
                    <div className="w-full">
                        <div className="mb-1 block">
                            <Label htmlFor="email1" value="Status" />
                        </div>

                        <Select sizing={'sm'} defaultValue={''} onChange={e => handleChangeStatus(e)}>
                            <option value={['A', 'R']} selected>ABERTO/REAGENDADO</option>
                            <option value={['A']} selected>ABERTO</option>
                            <option value={['R']} selected>REAGENDADO</option>
                        </Select>
                    </div>

                    </div>




                    <div className="inline-flex gap-4 w-full">
                    <div className="w-full">
            <div className="mb-1 block">
                            <Label htmlFor="email1" value="Bairros" />
                        </div>
<div >
              <button onClick={() => setDropBairros(!dropBairros)}
                className="flex w-full h-full justify-between items-center py-2 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-50 border-gray-300 placeholder-gray-400 text-gray-500 ">

                {todos ? 'TODOS' : 'PERSONALIZADO'}
                <IoIosArrowDown size={16} />


              </button>

              {dropBairros && <ul className="flex flex-col w-full absolute  top-50 z-50 left-0 max-h-64 overflow-y-auto  bg-gray-50 p-1 rounded-lg  border-[1px] border-gray-300">
                <li className="flex items-center px-2 py-1">
                  <input onChange={() => setTodos(!todos)} type="checkbox" checked={todos} />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-500">TODOS</label>
                </li>
                {arrayBairros.map((item, index) => {
                  return (
                    <li key={index} className="flex items-center px-2 py-1">
                      <input onChange={() => handleOptionChange(index)} type="checkbox" checked={item.check} />
                      <label className="ms-2  text-xs whitespace-nowrap text-gray-500">{item?.bairro?.toUpperCase()}</label>
                    </li>
                  )
                })}
              </ul>}

              </div>

            </div>

                    <div className="w-full">
                        <div className="mb-1 block">
                            <Label htmlFor="email1" value="Cobrador" />
                        </div>

                      
<div className="relative">
              <button onClick={() => setDropCobrador(!dropCobrador)}
                className="flex w-full h-full justify-between items-center py-2 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-50 border-gray-300 placeholder-gray-400 text-gray-500 ">

                COBRADOR
                <IoIosArrowDown size={16} />


              </button>
              {dropCobrador && <ul className="flex flex-col w-full absolute  top-10 z-10 left-0 max-h-64 overflow-y-auto  bg-gray-50 p-1 rounded-lg  border-[1px] border-gray-300">
                <li className="flex items-center px-2 py-1">
                  <input onChange={() => { }} type="checkbox" checked />
                  <label className="ms-2  text-xs whitespace-nowrap  text-gray-500">TODOS</label>
                </li>
                {selectCobrador.map((item, index) => {
                  return (
                    <li key={item.id_consultor} className="flex items-center px-2 py-1">
                      <input onChange={() => { }} type="checkbox" checked value={item?.id_consultor} />
                      <label className="ms-2  text-xs whitespace-nowrap  text-gray-500">{item?.nome.toUpperCase()}</label>
                    </li>
                  )
                })}
              </ul>}



              </div>
                    </div>

                    </div>
                    
       

                    <div className='inline-flex gap-2 w-full justify-between'>
                        <div  >
                            <div className="mb-1 block">
                                <Label value="Data inicio" />
                            </div>
                            <DatePicker selected={startDate} onChange={e => { e && setStartDate(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase   text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                        </div>
                        <div >
                            <div className="mb-1 block">
                                <Label value="Data Fim" />
                            </div>
                            <DatePicker selected={endDate} onChange={e => { e && setEndDate(e) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex w-full uppercase  text-xs   border  rounded-lg   bg-gray-50 border-gray-300 placeholder-gray-400  " />
                        </div>
                    </div>

                    <Button isProcessing={loading} className='cursor-pointer' as={'span'} onClick={() => listarCobranca()} size={'xs'}>Aplicar Filtro</Button>


                </div>
            </Modal.Body>
        </Modal>

    )

}