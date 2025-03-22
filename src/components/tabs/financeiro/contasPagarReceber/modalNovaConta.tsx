import { Button, Modal, ModalHeader, Select, TextInput } from "flowbite-react";
import { ContaProps } from "./contasPagarReceber";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { MdSaveAlt } from "react-icons/md";


interface DataProps{
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    dadosConta:Partial<ContaProps>
    setDadosConta:(dados:Partial<ContaProps>)=>void
    contasReq:()=>Promise<void>
    handleEditarConta:()=>Promise<void>
}



export function ModalNovaConta({openModal,setOpenModal,dadosConta,setDadosConta,contasReq,handleEditarConta}:DataProps){
    



    return(
        <Modal show={openModal} onClose={()=>setOpenModal(false)}>
            <ModalHeader>NOVO LANÇAMENTO</ModalHeader>
            <Modal.Body>

                    <form>

                   


                      <div className="p-2   grid mt-2 w-full gap-4 grid-flow-row-dense grid-cols-4">
                        <div className="  col-span-1 w-full ">
                          <label className="block text-xs font-medium  ">TIPO</label>
                          <Select value={dadosConta.tipo} onChange={e => setDadosConta({ ...dadosConta, tipo: e.target.value })} sizing={'sm'}>
                            <option value={''}></option>
                            <option value={'PAGAR'}>PAGAR</option>
                            <option value={'RECEBER'}>RECEBER</option>
                          </Select>

                        </div>
                        <div className="ml-2 justify-start ">
                          <label className="block w-full  text-xs font-medium  ">DATA PREVISTA</label>
                          <DatePicker selected={dadosConta.dataprev} onChange={e => e && setDadosConta({ ...dadosConta, dataprev: e })} dateFormat={"dd/MM/yyyy"} locale={pt} required className="flex uppercase w-full p-1.5 sm:text-sm  border  rounded-lg bg-gray-50 border-gray-300  " />
                        </div>

                        <div className=" col-span-1 w-full ">
                          <label className="block text-xs font-medium  ">PARCELAS</label>
                          <Select sizing={'sm'} defaultValue={dadosConta.parcela} onChange={e => setDadosConta({ ...dadosConta, parcela: Number(e.target.value) })} >
                            <option value={''}></option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>5</option>
                            <option value={7}>5</option>
                            <option value={8}>8</option>
                            <option value={9}>9</option>
                            <option value={10}>10</option>
                            <option value={11}>11</option>
                            <option value={12}>12</option>
                          </Select>

                        </div>


                        <div className=" col-span-4">
                          <label className="block text-xs font-medium  ">DESCRIÇÃO</label>
                          <TextInput sizing={'sm'} type="text" value={dadosConta.descricao} onChange={e => setDadosConta({ ...dadosConta, descricao: e.target.value })}  />
                        </div>
                        <div className=" col-span-1">
                          <label className="block text-xs font-medium  ">VALOR</label>
                          <TextInput sizing={'sm'} value={dadosConta.valor} onChange={e => { setDadosConta({ ...dadosConta, valor: Number(e.target.value) }) }} type="number" inputMode="decimal"  />
                        </div>
                        <div className=" gap-2 col-span-4  flex flex-row justify-end">
                         {dadosConta.id_conta ? <Button  size={'sm'} onClick={() => handleEditarConta()} color={'warning'}>Editar</Button>: <Button size={'sm'} onClick={() => contasReq()} color={'blue'}><MdSaveAlt className="mr-1" size={22} />SALVAR</Button>}
                        </div>
                      </div>

                    </form>
             

            </Modal.Body>
            

        </Modal>
    )
}