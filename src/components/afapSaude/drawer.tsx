import { MdEvent } from "react-icons/md";
import { DropDown } from "./dropDown";
import { Alert, Drawer } from "flowbite-react";
import DatePicker from "react-datepicker";
import pt from 'date-fns/locale/pt-BR';
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";
import 'react-datepicker/dist/react-datepicker.css';
import { EventProps, MedicoProps } from "@/pages/afapSaude";
import ReactInputMask from "react-input-mask";
import { AuthContext } from "@/contexts/AuthContext";

interface DrawerProps {
  isOpen: boolean,
  toggleDrawer: () => void
  arrayMedicos: Array<MedicoProps>
  setarDataEvent: (fields: Partial<EventProps>) => void
  dataEvent: Partial<EventProps>
  setArrayEvent: (array: Array<EventProps>) => void
  events: Array<EventProps>,
  deletarEvento: () => Promise<void>
}


export function ModalDrawer({ events, setArrayEvent, isOpen, toggleDrawer, arrayMedicos, setarDataEvent, dataEvent, deletarEvento }: DrawerProps) {

  const { usuario } = useContext(AuthContext)





  const novoEvento = async () => {
    if (!dataEvent.status || !dataEvent.id_med || !dataEvent.title || !dataEvent.tipoAg) {
      toast.info('Preencha todos os campos obrigatorios!')
      return;
    }
    console.log(dataEvent)
    try {

      if (dataEvent.tipoAg === 'md') {
        const evento = await toast.promise(
          api.post("/agenda/novoEvento", {

            id_med: Number(dataEvent.id_med),
            data: new Date(),
            id_usuario: Number(usuario?.id),
            start: dataEvent.start,
            end: dataEvent.end,
            title: dataEvent.title,
            status: dataEvent.status,
            obs: dataEvent.obs,
            tipoAg: dataEvent.tipoAg

          }),
          {
            error: 'Erro na requisição',
            pending: 'Gerando Evento..',
            success: 'Evento Gerado com sucesso'
          }

        )

        const novo = [...events]
        evento && novo.push(evento.data)
        const ed = novo.map(item => { return { ...item, start: item.start ? new Date(item.start) : new Date(), end: item.end ? new Date(item.end) : new Date() } })
        setArrayEvent(ed)
        toggleDrawer()

      } else if (dataEvent.tipoAg === 'ct') {
        const evento = await toast.promise(
          api.post("/agenda/novoEvento", {
            id_agmed: Number(dataEvent.id_agmed),
            id_med: Number(dataEvent.id_med),
            data: new Date(),
            id_usuario: Number(usuario?.id),
            nome: dataEvent.nome,
            endereco: dataEvent.endereco,
            celular: dataEvent.celular,
            start: dataEvent.start,
            end: dataEvent.end,
            title: dataEvent.title,
            status: dataEvent.status,
            obs: dataEvent.obs,
            tipoAg: dataEvent.tipoAg

          }),
          {
            error: 'Erro na requisição',
            pending: 'Gerando Evento..',
            success: 'Evento Gerado com sucesso'
          }

        )
        const index = events.findIndex(item => item.id_agmed === dataEvent.id_agmed)
        const novo = [...events]
        novo[index].clientes?.push(evento.data)

        // const ed = novo.map(item =>{return {...item,start:item.start ? new Date(item.start):new Date(),end:item.end?new Date(item.end):new Date()}})
        setArrayEvent(novo)
        toggleDrawer()

      }

      /*  */
    } catch (error) {
      toast.error('Erro ao gerar evento')
    }
  }

  const editarEvento = async () => {
    if (!dataEvent.status || !dataEvent.id_med || !dataEvent.start || !dataEvent.end) {
      toast.info('Preencha todos os campos obrigatorios!')
      return;
    }
    try {
      const evento = await toast.promise(
        api.put("/agenda/editarEvento", {
          id_agcli: Number(dataEvent.id_agcli),
          id_agmed: Number(dataEvent.id_agmed),
          id_med: Number(dataEvent.id_med),
          nome: dataEvent.nome,
          start: dataEvent.start,
          end: dataEvent.end,
          title: dataEvent.title,
          status: dataEvent.status,
          obs: dataEvent.obs,
          tipoAg: dataEvent.tipoAg,
          celular: dataEvent.celular,
          endereco: dataEvent.endereco

        }),
        {
          error: 'Erro na requisição',
          pending: 'Gerando Evento..',
          success: 'Evento Gerado com sucesso'
        }

      )



      const novo = [...events]
      const index = novo.findIndex(item => item.id_agmed === dataEvent.id_agmed)

      if (dataEvent.tipoAg === 'md') {
        novo[index] = { ...evento.data }
        const ed = novo.map(item => { return { ...item, start: item.start ? new Date(item.start) : new Date(), end: item.end ? new Date(item.end) : new Date() } })
        setArrayEvent(ed)
      }
      else if (dataEvent.tipoAg === 'ct' && index !== undefined) {

        const indexct = novo[index].clientes?.findIndex(item => item.id_agcli === dataEvent.id_agcli)
        if (indexct !== undefined && indexct !== -1 && novo[index].clientes) {
          novo[index].clientes![Number(indexct)] = { ...evento.data };
        }

      }


      toggleDrawer()
    } catch (error) {
      toast.error('Erro ao gerar evento')
    }
  }


  return (


    <Drawer className="bg-gray-800 w-[40vw] px-8" open={isOpen} position="right" onClose={toggleDrawer}>

      {  /*    <div id="drawer-label" className="inline-flex items-center justify-between mb-4 text-base font-semibold  text-gray-400">
          <div className="inline-flex items-center">
          <MdEvent size={40}/>
          NOVO EVENTO
          </div>
          <button onClick={deletarEvento} className="p-1 hover:bg-gray-600 rounded-lg"><MdDelete size={23}/></button>
        </div>*/}

      <Drawer.Header title="NOVO EVENTO" titleIcon={() => <MdEvent size={40} />} />

      <Drawer.Items className="flex flex-col gap-5">

        {/* <form className="w-full mx-auto">
  <label  className="block mb-2 text-sm font-medium  text-white">TIPO DE AGENDAMENTO</label>
  <select value={dataEvent.tipoAg} onChange={e=>setarDataEvent({...dataEvent,tipoAg:e.target.value})} className=" border  text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white ">
    <option selected value={''}>{''}</option>
    <option value="md">MÉDICO</option>
    <option value="ct">CLIENTE</option>
    <option value='tp'>PRÉ AGENDAMENTO</option>
  </select>
</form>*/}
        {dataEvent.tipoAg !== 'md' && <div className="flex flex-col gap-4">
          <div >
            <label className="block mb-1 text-sm font-medium text-white">NOME</label>
            <input value={dataEvent.nome} onChange={e => setarDataEvent({ ...dataEvent, nome: e.target.value.toUpperCase() })} className="block p-2.5 w-full text-sm rounded-lg border 0  bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="NOME"></input>
          </div>
          <div className="inline-flex gap-4">
            <div className="w-full" >
              <label className="block mb-1 text-sm font-medium text-white">CELULAR</label>
              <ReactInputMask mask={'(99) 9 9999-9999'} value={dataEvent.celular} onChange={e => setarDataEvent({ ...dataEvent, celular: e.target.value })} className="block p-2.5 w-full text-sm rounded-lg border 0  bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="CELULAR"></ReactInputMask>
            </div>
            <div className="w-full">
              <label className="block mb-1 text-sm font-medium text-white">ENDEREÇO</label>
              <input value={dataEvent.endereco} onChange={e => setarDataEvent({ ...dataEvent, endereco: e.target.value.toUpperCase() })} className="block p-2.5 w-full text-sm rounded-lg border 0  bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="ENDEREÇO"></input>
            </div>
          </div>
        </div>}
        <DropDown setarDataEvent={setarDataEvent} dataEvent={dataEvent} array={arrayMedicos} />

        <form className="w-full mx-auto">
          <label className="block mb-2 text-sm font-medium  text-white">STATUS</label>
          <select value={dataEvent.status} onChange={e => setarDataEvent({ ...dataEvent, status: e.target.value })} className=" border  text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white ">
            <option selected>SELECIONE O STATUS</option>
            <option value="AB">ABERTO</option>
            <option value="C">CANCELADO</option>
            <option value="AD">ADIADO</option>
          </select>
        </form>


        <div className="inline-flex w-full justify-between gap-4">
          <div className="flex flex-col w-1/2">
            <label className="block mb-1 text-sm font-medium  text-white">DATA INICIAL</label>
            <DatePicker
              className="flex-shrink-0 w-full justify-between z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center  border  rounded-lg focus:ring-4  bg-gray-700 hover:bg-gray-600  text-white border-gray-600"
              selected={dataEvent.start}
              onChange={(e) => e && setarDataEvent({ ...dataEvent, start: e })}
              timeFormat="p"
              dateFormat="Pp"
              showTimeSelect
              locale={pt}

            />
          </div>

          <div className="flex flex-col w-1/2">
            <label className="block mb-1 text-sm font-medium  text-white">DATA FINAL</label>
            <DatePicker
              className="flex-shrink-0 w-full justify-between z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center border rounded-lg bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
              selected={dataEvent.end}
              onChange={(e) => e && setarDataEvent({ ...dataEvent, end: e })}

              timeFormat="p"
              dateFormat="Pp"

              showTimeSelect
              locale={pt}

            />
          </div>

        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-white">OBSERVAÇÃO</label>
          <textarea value={dataEvent.obs} onChange={e => setarDataEvent({ ...dataEvent, obs: e.target.value.toUpperCase() })} rows={4} className="block p-2.5 w-full text-sm rounded-lg border 0  bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="Write your thoughts here..."></textarea>
        </div>


        {dataEvent.id_agcli && dataEvent.id_agmed ? <div className="inline-flex w-full h-full justify-center items-end  gap-4">    <button onClick={deletarEvento} className="flex w-1/2 h-fit px-4 py-2 text-sm font-medium text-center  rounded-lg bg-red-600   hover:text-white hover:bg-red-700">Deletar</button> <button onClick={() => editarEvento()} className="flex w-1/2 h-fit items-center px-4 py-2 text-sm font-medium text-center text-white  rounded-lg   bg-yellow-500 hover:bg-yellow-600">Editar Evento<svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg></button> </div> : <div className="inline-flex w-full h-full justify-center items-end  gap-4">

          <button onClick={toggleDrawer} className="flex w-1/2 h-fit px-4 py-2 text-sm font-medium text-center  border rounded-lg bg-gray-800 text-gray-400 border-gray-600 hover:text-white hover:bg-gray-700">Cancelar</button><button onClick={() => novoEvento()} className="flex w-1/2 h-fit items-center px-4 py-2 text-sm font-medium text-center text-white  rounded-lg   bg-blue-600 hover:bg-blue-700  ">Salvar Evento<svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg></button> </div>}


      </Drawer.Items>
    </Drawer>

  )
}