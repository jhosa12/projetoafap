import { ConsultaProps, EventProps, ExamesData, ExamesProps, MedicoProps } from "@/pages/afapSaude";
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react";
import ReactInputMask from "react-input-mask";
import { ChangeEvent, useState } from "react";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { valorInicial } from "../consultas";
import { AiOutlineClockCircle } from "react-icons/ai";
import { ModalBuscaConsulta } from "./modalbuscaConsulta";
import { HiTrash } from "react-icons/hi2";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';

interface DataProps{
    openModal:boolean,
    setOpenModal:(toogle:boolean)=>void
    medicos:Array<MedicoProps>
    consultas:Array<ConsultaProps>
    consulta:Partial<ConsultaProps> ,
    setConsultas:(array:Array<ConsultaProps>)=>void
    setConsulta:(consulta:Partial<ConsultaProps>)=>void
    events: Array<EventProps>

}

export function ModalConsulta({openModal,setOpenModal,medicos,consulta,setConsultas,consultas,setConsulta,events}:DataProps) {
  const [visible,setvisible] = useState(false)
  const {register,setValue,handleSubmit,watch,control,reset} =  useForm<ConsultaProps>({defaultValues:consulta})
  

  const handleOnSubmit:SubmitHandler<ConsultaProps> = (data)=>{
    
  data.id_consulta ? handleEditarConsulta(data) :  handleCadastrar(data)
  
  
  }


  console.log(consulta)


  const selectMed = (e: ChangeEvent<HTMLSelectElement>) => {
     
    if (e.target.value) {
        const evento = events.find(item => item.id_agmed === Number(e.target.value))
        const medico = medicos.find(item => item.id_med === evento?.id_med)

        setValue( 'id_agmed', Number(e.target.value)??null )
 setValue('data_prev', evento?.start??undefined)

       /* if (evento && medico)
         gerarIntervalos({ clientes: evento.clientes, start: evento.start, end: evento.end, time: medico.time })*/

    }
    else {
        setValue( 'id_agmed',null )
        setValue('data_prev', undefined)
    }
}



const handleMedico =(event:ChangeEvent<HTMLSelectElement>) => {
  setValue('id_med',Number(event.target.value))
  const medico =  medicos.find(item=>item.id_med===Number(event.target.value))
 medico ? setValue('espec',`${medico?.nome}-(${medico?.espec})`):setValue('espec','')
  setValue('tipoDesc','')
  setValue('vl_final',null)
  setValue('vl_consulta',null)
  setValue('vl_desc',null)
}

  const handleDesconto = (event:ChangeEvent<HTMLSelectElement>)=>{
    const {value} = event.target
  const medico =  medicos.find(item=>item.id_med===Number(watch('id_med')))
  if(value ==='PARTICULAR'){
    setValue('vl_final',Number(medico?.particular))
    setValue('vl_desc',0)
  }
  if(value ==='FUNERARIA'){
    setValue('vl_final',Number(medico?.funeraria))
    setValue('vl_desc',Number(medico?.particular)-Number(medico?.funeraria))
  }
  if(value ==='PLANO'){
    setValue('vl_final',Number(medico?.plano))
    setValue('vl_desc',Number(medico?.particular)-Number(medico?.plano))
  }
  setValue('vl_consulta',medico?.particular??null)
  }


  const handleEditarConsulta = async (data:ConsultaProps) => {

    if(!data?.id_med){
      toast.info('Selecione um especialista')
    }
    if(!data?.tipoDesc){
      toast.info('Selecione um tipo de desconto')
    }
    try {
   
      const response = await toast.promise(
        api.put('/afapSaude/consultas/Editarcadastro', {
          ...data,
          status: data?.id_agmed !== consulta.id_agmed && data.id_agmed ? 'AGENDADO' : data?.status,
          nome: data?.nome?.toUpperCase(),

         
        }),
        {
          error: 'Erro ao editar dados',
          pending: 'Alterando dados .....',
          success: 'Dados alterados com sucesso!'
        }
      )
      const novoArray = [...consultas]
      const index = novoArray.findIndex(item => item.id_consulta === data?.id_consulta)
      novoArray[index] = { ...response.data }
      setConsultas(novoArray)
      setConsulta(valorInicial)
    } catch (error) {
      toast.warning('Consulte o TI')
    }
  }


  const handleCadastrar = async (data:ConsultaProps) => {
    if(!data.id_med){
      toast.info('Selecione um especialista')
      return
    }
    if(!data.tipoDesc){
      toast.info('Selecione um tipo de desconto')
      return
    }
    try {

      const response = await toast.promise(
        api.post("/afapSaude/consultas/cadastro", {
          ...data,
          data: new Date(),
        }),
        {
          error: 'Erro ao Cadastrar Dados',
          pending: 'Cadastrando Consulta.....',
          success: 'Consulta Cadastrada com sucesso'
        }
      )

      setConsultas([...consultas, response.data])
      setOpenModal(false)

    } catch (error) {
      console.log(error)
    }
  }



  const handleAdicionarProcedimento = () => {
    const medico = medicos?.find(item => item.id_med === Number(watch('id_med')));
    const exame = medico?.exames?.find(item => item.id_exame === Number(watch('id_selected')));


    const tipo = watch('tipoDesc')
    if(!medico){
      toast('Selecione um especialista')
    }

    if (!tipo) {
      toast.info('Selecione um tipo de desconto')
      return
    }

    console.log(exame)
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

 
    const vl_particular =Number(exame.porcPart)

    const desconto = tipo === 'PARTICULAR' ? 0 : tipo === 'FUNERARIA' ?
      (vl_particular-Number(exame.porcFun)) : (vl_particular - Number(exame.porcPlan));


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













 

    return(
        <Modal show={openModal} size="4xl"   onClose={() => setOpenModal(false)} >
        <Modal.Header>
          <div className="inline-flex gap-4 items-center">
          Administrar Consulta  
            {!consulta.id_consulta && <Button onClick={()=>setvisible(!visible)} theme={{color:{light:"border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100"}}}  className="mr-auto " color="light" size="sm"><AiOutlineClockCircle className="mr-1 h-5 w-5"/>Setar por consultas anteriores</Button>}
            </div>
            </Modal.Header>
        <Modal.Body className="flex flex-col gap-4">

          <form onSubmit={handleSubmit(handleOnSubmit)} >
            <div className="grid grid-cols-4 gap-2 ">
            <div className="col-span-2 "> 
                <Label className="text-xs" htmlFor="email" value="Nome Paciente" />
              <TextInput sizing={'sm'} {...register('nome')} className="focus:outline-none" id="email" placeholder="Nome" required />
            </div>

<div className="w-full">
                
               
                  <Label className="text-xs" htmlFor="celular" value="Celular" />

                  <Controller
                control={control}
                name="celular"
                render={({field: {onChange, value}})=>(
                  <ReactInputMask value={value} onChange={e=>onChange(e.target.value)} id="celular" placeholder="Celular" className="px-2 py-2 focus:outline-none text-xs bg-gray-100 w-full rounded-lg border-[1px] border-gray-300" mask={'(99) 9 9999-9999'}/>
                )}
                />
             
              
              </div>
              <div className="w-full">
                  <Label className="text-xs" htmlFor="cpf" value="CPF" />
                  <Controller
                  control={control}
                  name="cpf"
                  render={({ field:{onChange,value} }) => (
                    <ReactInputMask value={value} onChange={e=>onChange(e.target.value)} id="cpf" placeholder="CPF" className="px-2 py-2 text-xs focus:outline-none bg-gray-100 w-full rounded-lg border-[1px] border-gray-300" mask={'999.999.999-99'} required/>
                  )}
                  />
              </div>


              <div className="col-span-2 ">
            
            <Label className="text-xs" htmlFor="email" value="Nome Responsável (se for menor)" />
       
          <TextInput sizing={'sm'} {...register('responsavel')} className="focus:outline-none"  placeholder="Responsável, caso paciente seja menor de idade" />
        </div>


        <div className="w-full">
            
            <Label className="text-xs" value="Parentesco" />
      
          <Select sizing={'sm'} {...register('grau_parentesco')} className="focus:outline-none"  >
          <option selected className="text-gray-200">PARENTESCO</option>
                    <option value={'CONJUGE'}>CONJUGE</option>
                    <option value={'PAI'}>PAI</option>
                    <option value={'MÃE'}>MÃE</option>
                    <option value={'FILHO'}>FILHO(A)</option>,
                    <option value={'IRMÃO(Ã)'}>IRMÃO(Ã)</option>
                    <option value={'PRIMO'}>PRIMO(A)</option>
                    <option   value={'SOBRINHO(A)'}>SOBRINHO(A)</option>
                    <option value={'NORA'}>NORA</option>
                    <option value={'GENRO'}>GENRO</option>
                    <option value={'TIO(A)'}>TIO(A)</option>
                    <option value={'AVÔ(Ó)'}>AVÔ(Ó)</option>
                    <option value={'OUTROS'}>OUTROS</option>
          </Select>
        </div>




              <div >
            
            <Label className="text-xs" value="Peso" />
       
          <TextInput sizing={'sm'} {...register('peso')} className="focus:outline-none" id="email" placeholder="Peso"  />
        </div>


        <div >
            
            <Label className="text-xs" value="Altura" />
       
          <TextInput sizing={'sm'} {...register('altura')} className="focus:outline-none" id="email" placeholder="Altura" />
        </div>

        <div >
            
            <Label className="text-xs" value="Temperatura" />
       
          <TextInput sizing={'sm'} {...register('temperatura')} className="focus:outline-none" id="email" placeholder="Temperatura" />
        </div>
        <div >
            
            <Label className="text-xs" value="Idade" />
       
          <TextInput sizing={'sm'} {...register('idade')} className="focus:outline-none" id="email" placeholder="Idade" />
        </div>


              <div >
            
            <Label className="text-xs" value="Endereço" />
       
          <TextInput sizing={'sm'} {...register('endereco')} className="focus:outline-none" id="email" placeholder="Endereço"  />
        </div>
        <div >
            
            <Label className="text-xs" value="Numero" />
       
          <TextInput sizing={'sm'} {...register('numero')} className="focus:outline-none" id="email" placeholder="Numero"  />
        </div>

        <div >
            
            <Label className="text-xs" value="Bairro" />
       
          <TextInput sizing={'sm'} {...register('bairro')} className="focus:outline-none" id="email" placeholder="Bairro"  />
        </div>

        <div >
            
            <Label className="text-xs" value="Cidade" />
       
          <TextInput sizing={'sm'} {...register('cidade')} className="focus:outline-none" id="email" placeholder="Cidade"  />
        </div>

           


<div>
             
                <Label className="text-xs" htmlFor="espec" value="Especialidade" />
          
              <Select disabled={watch('procedimentos')?.length>0} sizing={'sm'} {...register('id_med')} id='espec' onChange={e=>handleMedico(e)} className="focus:outline-none"   required >
                    <option value={''}></option>
                    {medicos.map((item,index)=>(
                        <option value={item.id_med} key={item.id_med}>{`${item.nome}-(${item.espec})`}</option>
                    ))}
              </Select>
            </div>


            <div className="flex flex-col w-full">
                           
                           <Label className="text-xs" htmlFor="small" value="Consulta/Data" />
                     
                       <Select id="small" value={watch('id_agmed')??''}  onChange={selectMed} sizing="sm" >
                           <option value={''}></option>
                           {events?.map((item, index) => (
                              item.id_med === Number(watch('id_med')) && <option key={item.id_agmed} value={item.id_agmed??''}>{new Date(item.start).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</option>
                           ))}
                       </Select>
                   </div>
                   <div className="flex flex-col w-full">
                      
                      <Label className="text-xs" htmlFor="small" value="Hora Prevista" />

                      <Controller
                      control={control}
                      name='hora_prev'
                      render={({ field:{onChange,value} }) => (
                       <DatePicker
                       selected={value ?new Date(value):null}
                       onChange={(date) =>date && onChange(date)}
                       showTimeSelect
                       showTimeSelectOnly
                       timeIntervals={15}
                       timeCaption="Time"
                       dateFormat="h:mm"
                       timeFormat="HH:mm"
                       className="flex py-2 text-black px-2 w-full rounded-lg border 0  bg-gray-50 text-xs border-gray-300 "
                     />
                          
                      )}
                      
                      />
                

              </div>






              <div className="flex flex-col w-full">
                           <Label className="text-xs" htmlFor="small" value="Buscar na residência ?" />
                       <Select  {...register('buscar')} sizing="sm" >
                           <option selected value={''}></option>
                           <option value={'SIM'}>SIM</option>
                           <option value={'NAO'}>NÃO</option>
                       </Select>
                   </div>



          </div>


          <div className="inline-flex w-full gap-4 mb-1 mt-2">

          <div className="w-1/4">
            
            <Label className="text-xs" value="Desconto" />
      
          <Select disabled={watch('procedimentos')?.length>0} sizing={'sm'} {...register('tipoDesc')} onChange={e=>handleDesconto(e)} className="focus:outline-none"   required >
                <option value={''}></option>
                <option value={'PARTICULAR'}>PARTICULAR</option>
                
                <option value={'FUNERARIA'}>FUNERÁRIA</option>
                <option value={'PLANO'}>PLANO</option>
          </Select>
        </div>
              <div className="w-1/2">

                <Label htmlFor="procedimentos" className="text-xs" value="Procedimentos" />

                <Select {...register('id_selected')} id="procedimentos" sizing={'sm'}  className="focus:outline-none"  >
                  <option value={''}></option>
                    {medicos.find(item=>item.id_med===Number(watch('id_med')))?.exames.map((item,index)=>(
                        <option value={item.id_exame} key={item.id_exame}>{item.nome}</option>
                    ))}
                </Select>
              </div>
              <Button onClick={handleAdicionarProcedimento} type="button" size={'xs'}  className="mt-auto p-1">Adicionar</Button>

            </div>
            <div className="overflow-x-auto ">
              <Table theme={{ body: { cell: { base: "px-6 text-black py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs" } }, head: { cell: { base: "bg-gray-50 px-6 py-1 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg " } } }} >
                <Table.Head>
                  <Table.HeadCell>Procedimento</Table.HeadCell>
                  <Table.HeadCell>Valor Exame</Table.HeadCell>
                  <Table.HeadCell>Desconto</Table.HeadCell>
                  <Table.HeadCell>Valor Final</Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">Edit</span>
                  </Table.HeadCell>

                </Table.Head>
                <Table.Body className="divide-y">
                  {watch('procedimentos')?.map((item, index) => (
                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.nome}
                      </Table.Cell>
                      <Table.Cell>{Number(item.valorExame ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                      <Table.Cell>{Number(item.desconto ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                      <Table.Cell>{Number(item.valorFinal ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                      <Table.Cell>

                        <button type="button" onClick={() =>handleDelProcdimentoTable(item.id_exame)} className="font-medium text-gray-500 hover:text-red-600 ">
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








          <Button className="ml-auto" type="submit">{consulta?.id_consulta ? 'Atualizar' : 'Cadastrar'}</Button>
          </form>

       
         

        </Modal.Body>
      {visible &&  <ModalBuscaConsulta reset={reset} setVisible={()=>setvisible(false)} visible={visible}/>}
      </Modal>

    )
}