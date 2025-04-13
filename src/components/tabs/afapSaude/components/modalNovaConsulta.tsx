
import { Label, Modal, Table
} from "flowbite-react";
import ReactInputMask from "react-input-mask";
import { ChangeEvent, useState } from "react";
import { api } from "@/lib/axios/apiClient";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valorInicial } from "../consultas";
import { AiOutlineClockCircle } from "react-icons/ai";
import { ModalBuscaConsulta } from "./modalbuscaConsulta";
import { HiTrash } from "react-icons/hi2";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { ajustarData } from "@/utils/ajusteData";
import { Button } from "@/components/ui/button";
import { ConsultaProps, EventProps, ExamesData, MedicoProps } from "@/types/afapSaude";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";



interface DataProps {
  openModal: boolean,
  setOpenModal: (toogle: boolean) => void
  medicos: Array<MedicoProps>
  consultas: Array<ConsultaProps>
  consulta: Partial<ConsultaProps>,
  buscarConsultas: ({ startDate, endDate, id_med }: { startDate: Date | undefined, endDate: Date | undefined, id_med?: number, status: string | undefined, buscar?: string }) => Promise<void>
  setConsultas: (array: Array<ConsultaProps>) => void
  setConsulta: (consulta: Partial<ConsultaProps>) => void
  events: Array<EventProps>
 // usuario?: string
 // id_usuario?: string

}

export function ModalConsulta({ openModal, setOpenModal, medicos, consulta, buscarConsultas, consultas, setConsulta, events, setConsultas }: DataProps) {
  const [visible, setvisible] = useState(false)
  const { register, setValue, handleSubmit, watch, control, reset } = useForm<ConsultaProps>({ defaultValues: consulta })


  const handleOnSubmit: SubmitHandler<ConsultaProps> = (data) => {

    data.id_consulta ? handleEditarConsulta(data) : handleCadastrar(data)


  }


  //console.log(consulta)


  const selectMed = (e: string) => {

    if (e) {
      const evento = events.find(item => item.id_agmed === Number(e))
      const medico = medicos.find(item => item.id_med === evento?.id_med)

      setValue('id_agmed', Number(e) ?? null)
      setValue('data_prev', evento?.start ?? undefined)

      /* if (evento && medico)
        gerarIntervalos({ clientes: evento.clientes, start: evento.start, end: evento.end, time: medico.time })*/

    }
    else {
      setValue('id_agmed', null)
      setValue('data_prev', undefined)
    }
  }



  const handleMedico = (event: string) => {
    setValue('id_med', Number(event))
    const medico = medicos.find(item => item.id_med === Number(event))
    medico ? setValue('espec', `${medico?.nome}-(${medico?.espec})`) : setValue('espec', '')
    setValue('tipoDesc', '')
    setValue('vl_final', null)
    setValue('vl_consulta', null)
    setValue('vl_desc', null)
  }

  const handleDesconto = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    const medico = medicos.find(item => item.id_med === Number(watch('id_med')))
    if (value === 'PARTICULAR') {
      setValue('vl_final', Number(medico?.particular))
      setValue('vl_desc', 0)
    }
    if (value === 'FUNERARIA') {
      setValue('vl_final', Number(medico?.funeraria))
      setValue('vl_desc', Number(medico?.particular) - Number(medico?.funeraria))
    }
    if (value === 'PLANO') {
      setValue('vl_final', Number(medico?.plano))
      setValue('vl_desc', Number(medico?.particular) - Number(medico?.plano))
    }
    setValue('vl_consulta', medico?.particular ?? null)
  }


  const handleEditarConsulta = async (data: ConsultaProps) => {

    // if(!data?.id_med){
    //  toast.info('Selecione um especialista')

    //  }
    //  if(!data?.tipoDesc){
    //    toast.info('Selecione um tipo de desconto')
    //  }


    let dataInit = undefined
    if (data?.id_agmed && data?.id_agmed !== consulta.id_agmed) {
      const { dataIni, dataFim } = ajustarData(data.data_prev, undefined)
      dataInit = dataIni
    }

  toast.promise(
        api.put('/afapSaude/consultas/Editarcadastro', {
          ...data,
          data_prev: data?.id_agmed ? dataInit : null,
          status: !data.id_agmed ? "AGUARDANDO DATA" : data?.id_agmed !== consulta.id_agmed && data.id_agmed ? 'AGENDADO' : data?.status,
          nome: data?.nome?.toUpperCase(),


        }),
        {
          error: 'Erro ao editar dados',
          loading: 'Alterando dados .....',
          success:(response)=> {
            const novo = [...consultas]
            const index = consultas.findIndex(item => item.id_consulta === data?.id_consulta)
            if (index !== -1) {
              novo[index] = { ...novo[index], ...response.data }; // Mantém a referência original, apenas atualiza os valores
            }
      
            const consultasOrdenadas = [...novo].sort((a, b) => {
              const dataA = a.hora_prev ? new Date(a.hora_prev).getTime() : Infinity; // Se for null, vai para o final
              const dataB = b.hora_prev ? new Date(b.hora_prev).getTime() : Infinity;
      
              return dataA - dataB;
            });
      
            setConsultas(consultasOrdenadas)
            //buscarConsultas({startDate:new Date(),endDate:new Date(),id_med:undefined,status:undefined,buscar:undefined})
            setConsulta(valorInicial)
            setOpenModal(false)
            
            return 'Dados alterados com sucesso!'}
        }
      )

    
  
  }


  const handleCadastrar = async (data: ConsultaProps) => {
    if (!data.id_med) {
      toast.info('Selecione um especialista')
      return
    }
    if (!data.tipoDesc) {
      toast.info('Selecione um tipo de desconto')
      return
    }

    //const { dataIni, dataFim } = ajustarData(data.data_prev, data.data_prev)
    const {newDate} = removerFusoDate(data.data_prev)
    const {newDate:nasc} =removerFusoDate(data.nascimento)
    
    
    toast.promise(

        api.post("/afapSaude/consultas/cadastro", {
          ...data,
          data: new Date(),
          nascimento: nasc,
          data_prev: newDate,
        //  user: usuario,
          numero: data.numero ? Number(data.numero) : undefined,
         // id_usuario: id_usuario
        }),
        {
          error: 'Erro ao Cadastrar Dados',
          loading: 'Cadastrando Consulta.....',
          success:()=> {
             buscarConsultas({ startDate: data.data_prev, endDate: data.data_prev, id_med: data.id_med??undefined, status: undefined, buscar: undefined })
      setOpenModal(false)
            
            
            return 'Consulta Cadastrada com sucesso'}
        }
      )



      // setConsultas([...consultas, response.data])
    
  }


  const handleAdicionarProcedimento = () => {
    const medico = medicos?.find(item => item.id_med === Number(watch('id_med')));
    const exame = medico?.exames?.find(item => item.id_exame === Number(watch('id_selected')));


    const tipo = watch('tipoDesc')
    if (!medico) {
      toast('Selecione um especialista')
    }

    if (!tipo) {
      toast.info('Selecione um tipo de desconto')
      return
    }

    //console.log(exame)
    if (!exame) {
      toast.info('Selecione um exame')
      return;
    }



    // Obter a lista atual de exames, garantindo que seja um array
    const procedimentosAtuais = watch('procedimentos') || [];

    // Verificar se o exame já existe na lista para evitar duplicados
    const exameJaExiste = procedimentosAtuais.some((item: ExamesData) => item.id_exame === exame.id_exame);

    if (exameJaExiste) {
      toast.info('Exame ja existe na lista');
      return;
    }


    const vl_particular = Number(exame.porcPart)

    const desconto = tipo === 'PARTICULAR' ? 0 : tipo === 'FUNERARIA' ?
      (vl_particular - Number(exame.porcFun)) : (vl_particular - Number(exame.porcPlan));


    setValue('procedimentos', [...procedimentosAtuais, {
      data: new Date(),
      id_exame: exame.id_exame,
      nome: exame.nome,
      desconto: desconto,
      valorExame: vl_particular,
      valorFinal: vl_particular - desconto,
      obs: exame.obs,

    }]);
    console.log("Exame adicionado:", exame);
  };




  const handleDelProcdimentoTable = (id_exame: number) => {
    setValue('procedimentos', watch('procedimentos').filter(item => item.id_exame !== id_exame))
  }

  return (
    <Modal theme={{content: {
    base: "relative h-full w-full p-4 md:h-auto",
    inner: "relative flex max-h-[94dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700"
  },}} show={openModal} size="5xl" popup onClose={() => setOpenModal(false)} >
      <Modal.Header>
        <div className="inline-flex gap-4 ml-3 items-center text-sm">
          ADMINISTRAR CONSULTA
          {!consulta.id_consulta && <Button onClick={() => setvisible(!visible)} variant={'outline'} className="mr-auto " size="sm"><AiOutlineClockCircle className="mr-1 h-5 w-5" />Setar por consultas anteriores</Button>}
        </div>
      </Modal.Header>
      <Modal.Body>

        <form className="flex flex-col w-full" onSubmit={handleSubmit(handleOnSubmit)} >
          <div className="grid grid-cols-5 gap-2 ">
            <div className="col-span-2 ">
              <Label className="text-xs" htmlFor="nome" value="Nome Paciente" />
              <Input  {...register('nome')} className="h-7" id="nome" placeholder="Nome" required />
            </div>

            <div >
              <div className="block">
                <Label className="text-xs" value="Nascimento" />
              </div>

              <Controller
                name="nascimento"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker selected={value} onChange={onChange} dateFormat={"dd/MM/yyyy"} locale={pt} className="flex w-full  text-sm h-7 border border-gray-300 shadow-sm rounded-md " />
                )}
              />

            </div>

            <div className="w-full">


              <Label className="text-xs" htmlFor="celular" value="Celular" />

              <Controller
                control={control}
                name="celular"
                render={({ field: { onChange, value } }) => (
                  <ReactInputMask value={value} onChange={e => onChange(e.target.value)} id="celular" placeholder="Celular" className="px-2 py-2 focus:outline-none  w-full text-sm h-7 border border-gray-300 shadow-sm rounded-md " mask={'(99) 9 9999-9999'} />
                )}
              />


            </div>
            <div className="w-full">
              <Label className="text-xs" htmlFor="cpf" value="CPF" />
              <Controller
                control={control}
                name="cpf"
                render={({ field: { onChange, value } }) => (
                  <ReactInputMask value={value} onChange={e => onChange(e.target.value)} id="cpf" placeholder="CPF" className="px-2 py-2 focus:outline-none  w-full text-sm h-7 border border-gray-300 shadow-sm rounded-md " mask={'999.999.999-99'} />
                )}
              />
            </div>

            <div >
              <Label className="text-xs" htmlFor="identidade" value="Identidade" />
              <Input  {...register('identidade')} className="focus:outline-none h-7" id="identidade" placeholder="Identidade"/>
            </div>


            <div className="col-span-2 ">

              <Label className="text-xs" htmlFor="email" value="Nome Responsável (se for menor)" />

              <Input  {...register('responsavel')} className="focus:outline-none h-7" placeholder="Responsável, caso paciente seja menor de idade" />
            </div>


            <div >

              <Label className="text-xs" value="Parentesco" />
                <Controller
                control={control}
                name="grau_parentesco"
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}  >
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="Parentesco" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="text-xs" value={'CONJUGE'}>CONJUGE</SelectItem>
                          <SelectItem className="text-xs" value={'PAI'}>PAI</SelectItem>
                          <SelectItem className="text-xs" value={'MÂE'}>MÂE</SelectItem>
                          <SelectItem className="text-xs" value={'FILHO'}>FILHO(A)</SelectItem>
                          <SelectItem className="text-xs" value={'IRMÂO(Ã)'}>IRMÂO(Ã)</SelectItem>
                          <SelectItem className="text-xs" value={'PRIMO'}>PRIMO(A)</SelectItem>
                          <SelectItem className="text-xs" value={'SOBRINHO(A)'}>SOBRINHO(A)</SelectItem>
                          <SelectItem className="text-xs" value={'NORA'}>NORA</SelectItem>
                          <SelectItem className="text-xs" value={'GENRO'}>GENRO</SelectItem>
                          <SelectItem className="text-xs" value={'TIO(A)'}>TIO(A)</SelectItem>
                          <SelectItem className="text-xs" value={'AVÔ(Ó)'}>AVÔ(Ó)</SelectItem>
                          <SelectItem className="text-xs" value={'OUTRO'}>OUTRO</SelectItem>
                     </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                )}
                />
            </div>


            <div >

<Label className="text-xs" id="peso" value="Peso" />

<Input  {...register('peso')} className="focus:outline-none h-7" id="peso" placeholder="Peso" />
</div>


<div >

<Label className="text-xs" value="Altura" />

<Input  {...register('altura')} className="focus:outline-none h-7" id="email" placeholder="Altura" />
</div>

<div >

<Label className="text-xs" value="Temperatura" />

<Input {...register('temperatura')} className="focus:outline-none h-7" id="email" placeholder="Temperatura" />
</div>




          
          
            <div className="col-span-2" >

              <Label className="text-xs" value="Endereço" />

              <Input {...register('endereco')} className="focus:outline-none h-7" id="email" placeholder="Endereço" />
            </div>
            <div >

              <Label className="text-xs" value="Numero" />

              <Input {...register('numero')} className="focus:outline-none h-7" id="email" placeholder="Numero" />
            </div>

            <div >

              <Label className="text-xs" value="Bairro" />

              <Input {...register('bairro')} className="focus:outline-none h-7" id="email" placeholder="Bairro" />
            </div>

            <div >

              <Label className="text-xs" value="Cidade" />

              <Input {...register('cidade')} className="focus:outline-none h-7" id="email" placeholder="Cidade" />
            </div>

            <div className="col-span-2" >

              <Label className="text-xs" value="Complemento" />

              <Input {...register('complemento')} className="focus:outline-none h-7" placeholder="Complemento" />
            </div>




            <div  >

              <Label className="text-xs" htmlFor="espec" value="Especialista" />

<Controller
control={control}
name="id_med"
render={({ field: { onChange, value } }) => (
  <Select disabled={watch('procedimentos')?.length > 0} value={String(value)} onValueChange={handleMedico}  >
    <SelectTrigger className="h-7">
      <SelectValue placeholder="Especialista" />
      <SelectContent className="max-h-[250px]">
        <SelectGroup>
          
          {medicos.map((item, index) => (
            <SelectItem className="text-[11px]" value={String(item.id_med)} key={item.id_med}>{`${item.nome}`}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectTrigger>
  </Select>
)}

/>
              <Select>
                
              </Select>
            </div>


            <div  >

              <Label className="text-xs" htmlFor="small" value="Consulta/Data" />

              <Controller
                control={control}
                name='id_agmed'
                render={({ field: { onChange, value } }) => (
                  <Select value={String(value)} onValueChange={selectMed}>
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="Consulta/Data" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          
                             {events?.map((item, index) => (
                              item.id_med === Number(watch('id_med')) &&
                               <SelectItem className="text-xs" key={item.id_agmed} value={String(item.id_agmed)}>{new Date(item.start).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                               </SelectItem>
                            ))}
                          

                        </SelectGroup>
                        </SelectContent>
                  </Select>
                )}
/>
             {/* <Select id="small" value={watch('id_agmed') ?? ''} onChange={selectMed} sizing="sm" >
                <option value={''}></option>
                {events?.map((item, index) => (
                  item.id_med === Number(watch('id_med')) && <option key={item.id_agmed} value={item.id_agmed ?? ''}>{new Date(item.start).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</option>
                ))}
              </Select>*/}
            </div>
            <div >

              <Label className="text-xs" htmlFor="small" value="Hora Prevista" />

              <Controller
                control={control}
                name='hora_prev'
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    selected={value ? new Date(value) : null}
                    onChange={(date) => date && onChange(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                   className="flex w-full  text-sm h-7 border border-gray-300 shadow-sm rounded-md"
                  />

                )}

              />


            </div>






            <div >
              <Label className="text-xs" htmlFor="small" value="Buscar na residência ?" />

<Controller
control={control}
name="buscar"
render={({ field: { onChange, value } }) => (
  <Select value={value} onValueChange={e => onChange(e)}  >
    <SelectTrigger className="h-7">
      <SelectValue placeholder="" />
      <SelectContent>
        <SelectGroup>
          
          <SelectItem className="text-xs" value={'SIM'}>SIM</SelectItem>
          <SelectItem className="text-xs" value={'NAO'}>NÃO</SelectItem>
        </SelectGroup>
      </SelectContent>
    </SelectTrigger>
  </Select>
)}
/>

            </div>


            <div >
              <Label className="text-xs" htmlFor="small" value="Retorno ?" />

              <Controller
              control={control}
              name="retorno"
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={e => onChange(e)}  >
                <SelectTrigger className="h-7">
                  <SelectValue placeholder="" />
                  <SelectContent>
                    <SelectGroup>
                      
                      <SelectItem className="text-xs" value={'SIM'}>SIM</SelectItem>
                      <SelectItem className="text-xs" value={'NAO'}>NÃO</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              )}
              />
             {/* <Select  {...register('retorno')} sizing="sm" >
                <option selected value={''}></option>
                <option value={'SIM'}>SIM</option>
                <option value={'NAO'}>NÃO</option>
              </Select>*/}
            </div>
            <div >


              <Label className="text-xs" value="Demanda Externa" />
              <Controller
              control={control}
              name="externo"
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={e => onChange(e)}  >
                <SelectTrigger className="h-7">
                  <SelectValue placeholder="" />
                  <SelectContent>
                    <SelectGroup>   
                      <SelectItem className="text-xs" value='ÓTICA DOS TRABALHADORES CEDRENSE'>ÓTICA DOS TRABALHADORES CEDRENSE</SelectItem>
                      <SelectItem className="text-xs" value='ÓTICA POPULAR'>ÓTICA POPULAR</SelectItem>
                      <SelectItem className="text-xs" value='LUZ ÓPTICA'>LUZ ÓPTICA</SelectItem>
                      <SelectItem className="text-xs" value='CENTRO SUL'>CENTRO SUL</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              )}
              />
         
            </div>


          </div>


          <div className="inline-flex gap-4 mb-1 mt-2">

            <div className="w-1/4">

              <Label className="text-xs" value="Desconto" />
              <Controller
                control={control}
                name="tipoDesc"
                render={({ field: { onChange, value } }) => (
                  <Select disabled={watch('procedimentos')?.length > 0} value={value} onValueChange={e => onChange(e)}  >
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="Desconto" />
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem className="text-xs" value={'PARTICULAR'}>PARTICULAR</SelectItem>
                          <SelectItem className="text-xs" value={'FUNERARIA'}>FUNERÁRIA</SelectItem>
                          <SelectItem className="text-xs" value={'PLANO'}>PLANO</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                )}
              />

            {/*  <Select disabled={watch('procedimentos')?.length > 0} sizing={'sm'} {...register('tipoDesc')} onChange={e => handleDesconto(e)} className="focus:outline-none">
                <option value={''}></option>
                <option value={'PARTICULAR'}>PARTICULAR</option>

                <option value={'FUNERARIA'}>FUNERÁRIA</option>
                <option value={'PLANO'}>PLANO</option>
              </Select>*/}
            </div>
            <div className="w-1/2">

              <Label htmlFor="procedimentos" className="text-xs" value="Procedimentos" />
              <Controller
              control={control}
              name="id_selected"
              render={({ field: { onChange, value } }) => (
                <Select value={String(value)} onValueChange={e => onChange(e)}  >
                <SelectTrigger className="h-7">
                  <SelectValue placeholder="Procedimentos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      
                      {medicos?.find(item => item.id_med === Number(watch('id_med')))?.exames.map((item, index) => (
                        <SelectItem className="text-xs" value={String(item.id_exame)} key={item.id_exame}>{item.nome}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                  </Select>
              )}
              />

             {/* <Select  {...register('id_selected')} id="procedimentos" sizing={'sm'} className="focus:outline-none"  >
                <option value={''}></option>
                {medicos.find(item => item.id_med === Number(watch('id_med')))?.exames.map((item, index) => (
                  <option value={item.id_exame} key={item.id_exame}>{item.nome}</option>
                ))}
              </Select>*/}
            </div>
            <Button onClick={handleAdicionarProcedimento} type="button" size={'sm'} className="mt-auto">Adicionar</Button>

          </div>
          <div className="overflow-x-auto ">
            <Table theme={{ root: { shadow: 'none' }, body: { cell: { base: "px-3 text-black py-0 text-[10px] font-medium" } }, head: { cell: { base: "px-3 text-black py-0 text-[11px] bg-gray-200" } } }}  >
              <Table.Head>
                <Table.HeadCell>Procedimento</Table.HeadCell>
                <Table.HeadCell>Valor Procedimento</Table.HeadCell>
                <Table.HeadCell>Desconto</Table.HeadCell>
                <Table.HeadCell>Valor Final</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>

              </Table.Head>
              <Table.Body className="divide-y">
                {Array.isArray(watch('procedimentos')) && watch('procedimentos')?.map((item, index) => (
                  <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {item.nome}
                    </Table.Cell>
                    <Table.Cell>{Number(item.valorExame ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                    <Table.Cell>{Number(item.desconto ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                    <Table.Cell>{Number(item.valorFinal ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                    <Table.Cell>

                      <button type="button" onClick={() => handleDelProcdimentoTable(item.id_exame)} className="font-medium text-gray-500 hover:text-red-600 ">
                        <HiTrash size={16} />
                      </button>
                    </Table.Cell>

                  </Table.Row>


                ))}

                <Table.Row >
                  <Table.Cell className="whitespace-nowrap  font-semibold ">
                    Total
                  </Table.Cell>

                  <Table.Cell>{ }</Table.Cell>
                  <Table.Cell>{ }</Table.Cell>
                  <Table.Cell className="font-semibold">{Number(watch('procedimentos')?.reduce((acumulador, atual) => {
                    acumulador += Number(atual.valorFinal)
                    return acumulador
                  }, 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                </Table.Row>


              </Table.Body>

            </Table>
          </div>








          <Button variant={'secondary'} className="ml-auto" type="submit">{consulta?.id_consulta ? 'Atualizar' : 'Cadastrar'}</Button>
        </form>




      </Modal.Body>
      {visible && <ModalBuscaConsulta reset={reset} setVisible={() => setvisible(false)} visible={visible} />}
    </Modal>

  )
}