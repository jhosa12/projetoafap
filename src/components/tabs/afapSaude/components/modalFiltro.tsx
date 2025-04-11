
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { Label, Modal,  Spinner, } from "flowbite-react";
import { Button } from "@/components/ui/button";
import { Control, Controller, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import { ConsultoresProps } from "@/types/consultores";
import { FiltroConsultaProps, MedicoProps, statusConsultaArray } from "@/types/afapSaude";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
registerLocale('pt-br', pt)

interface DataProps {
  show: boolean,
  setFiltro: (open: boolean) => void,
  buscarConsultas: ({ startDate, endDate, id_med,status,buscar,nome,id_consultor }: { startDate: Date | undefined, endDate: Date | undefined, id_med?: number, status: string | undefined, buscar?: string, nome?: string, id_consultor?: number }) => Promise<void>,
  loading: boolean,
  medicos: Array<MedicoProps>
  consultores: Array<Partial<ConsultoresProps>>
  register:UseFormRegister<FiltroConsultaProps>
  control:Control<FiltroConsultaProps,any>
  handle:UseFormHandleSubmit<FiltroConsultaProps,undefined>
}



export function ModalFiltroConsultas({ loading, setFiltro, show, buscarConsultas, medicos, consultores,control,register,handle }: DataProps) {



  const handleOnSubmit: SubmitHandler<FiltroConsultaProps> = (data: FiltroConsultaProps) => {

    buscarConsultas({ ...data })
  }
  return (
    <Modal popup size={'md'} show={show} onClose={() => setFiltro(false)}>
      <Modal.Header />
      {/* <Modal.Header >
                    <div className='inline-flex items-center'>
                    <HiFilter color='gray' size={30}/>
                    Filtro
                    </div>
                   
                    </Modal.Header>*/}
      <Modal.Body>
        <form onSubmit={handle(handleOnSubmit)} className='space-y-2 flex flex-col w-full'>
          <div >
            <div className=" block">
              <Label className="text-xs" value="Especialista" />
            </div>
            <Controller
              name="medico"
              defaultValue={''}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Combobox
                items={medicos.map(item => ({ value: item.nome, label: `${item.nome}-${item.espec}` }))}
                onChange={onChange}
                value={value??null}
                placeholder="Selecione o especialista"
                
                />
              
              )}
            />

           {/* <Select {...register('id_med')} sizing={'sm'}>
              <option value={''}>Selecione</option>
              {medicos.map((item, index) => (<option key={index} value={item.id_med}>{item.nome}-{item.espec}</option>))}
            </Select>*/}
          </div>



          <div >

            <Label className="text-xs" value="Nome Cliente" />

            <Input  {...register('nome')} type="text" placeholder="Nome" />
          </div>




          <div className="inline-flex w-full gap-2" >
            <div className="flex flex-col w-full" >
              <div className="block">
                <Label className="text-xs" value="Consultor" />
              </div>
              <Controller
              name="id_consultor"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={e=>onChange(Number(e))} value={String(value)}>
                  <SelectTrigger >
                    <SelectValue placeholder="Selecione o especialista" />
                  </SelectTrigger>
                  <SelectContent>
                 { consultores.filter(item => item.funcao == 'PROMOTOR(A) DE VENDAS').map((item, index)=> (
                    <SelectItem className="text-xs" key={index} value={String(item.id_consultor)}>{item.nome}</SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              )}
            />
              
            </div>

            <div className="flex flex-col w-full" >
              <div className="block">
                <Label className="text-xs" value="Externo" />
              </div>

              <Controller
              name="externo"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={e=>onChange(Number(e))} value={String(value)}>
                  <SelectTrigger >
                    <SelectValue placeholder="Selecione o consultor" />
                  </SelectTrigger>
                  <SelectContent>
                <SelectItem className="text-xs" value='ÓTICA DOS TRABALHADORES CEDRENSE'>ÓTICA DOS TRABALHADORES CEDRENSE</SelectItem>
                <SelectItem className="text-xs" value='ÓTICA POPULAR'>ÓTICA POPULAR</SelectItem>
                <SelectItem className="text-xs" value='LUZ ÓPTICA'>LUZ ÓPTICA</SelectItem>
                <SelectItem className="text-xs" value='CENTRO SUL'>CENTRO SUL</SelectItem>
                </SelectContent>
                </Select>
              )}
            />


           
            </div>
          </div>
          <div className="inline-flex w-full gap-2" >

            <div className="flex flex-col w-full" >
              <div className="block">
                <Label className="text-xs" value="Status" />
              </div>

              <Controller
              name="status"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={e=>onChange(Number(e))} value={String(value)}>
                  <SelectTrigger >
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                  {statusConsultaArray.map((item, index) => (
                    <SelectItem className="text-xs" key={index} value={item}>{item}</SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              )}
            />

         
            </div>





            <div className="flex flex-col w-full" >
              <div className="block">
                <Label className="text-xs" value="Buscar ?" />
              </div>
              <Controller
              name="buscar"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select onValueChange={e=>onChange(Number(e))} value={String(value)}>
                  <SelectTrigger >
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                 <SelectContent>
                 <SelectItem className="text-xs" value={'SIM'}>SIM</SelectItem>
                 <SelectItem className="text-xs" value={'NAO'}>NÃO</SelectItem>
                 </SelectContent>
               
                </Select>
              )}
            />
          
            </div>

          </div>

          <div className='inline-flex gap-2'>
            <div >
              <div className="block">
                <Label className="text-xs" value="Data inicio" />
              </div>

              <Controller
                name="startDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker selected={value} onChange={onChange} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex w-full  text-xs   border  rounded-lg   bg-gray-50 border-gray-300   " />
                )}
              />

            </div>
            <div  >
              <div className=" block">
                <Label className="text-xs" value="Data Fim" />
              </div>

              <Controller
                name="endDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker selected={value} onChange={onChange} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex w-full  text-xs   border  rounded-lg   bg-gray-50 border-gray-300   " />
                )}
              />
            </div>
          </div>



          <Button  className='ml-auto' type="submit" size={'sm'}>{loading && <Spinner color="gray" />}Aplicar Filtro</Button>

        </form>
      </Modal.Body>
    </Modal>

  )

}