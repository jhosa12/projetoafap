import { ConsultaProps, ExamesData, ExamesProps, MedicoProps } from "@/pages/afapSaude";
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react";
import ReactInputMask from "react-input-mask";
import { ChangeEvent, useState } from "react";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface DataProps{
    openModal:boolean,
    setOpenModal:(toogle:boolean)=>void
    medicos:Array<MedicoProps>
    consultas:Array<ConsultaProps>
    consulta:Partial<ConsultaProps> ,
    setConsultas:(array:Array<ConsultaProps>)=>void

}

export function ModalConsulta({openModal,setOpenModal,medicos,consulta,setConsultas,consultas}:DataProps) {

  const {register,setValue,handleSubmit,watch,control} =  useForm<ConsultaProps>({defaultValues:consulta})
   console.log(consulta)

  const handleOnSubmit:SubmitHandler<ConsultaProps> = (data)=>{
    
  data.id_consulta ? handleEditarConsulta(data) :  handleCadastrar(data)
  
  }



const handleMedico =(event:ChangeEvent<HTMLSelectElement>) => {
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

    } catch (error) {
      console.log(error)
    }
  }






 /* const handleTableExames = (index:number)=>{
      const novoArray =[...data.exames]
      novoArray.splice(index,1)
      setData({...data,exames:novoArray})

  }*/



 

    return(
        <Modal show={openModal} size="2xl"  dismissible onClose={() => setOpenModal(false)} >
        <Modal.Header>Administrar Consulta</Modal.Header>
        <Modal.Body>
       
          <form onSubmit={handleSubmit(handleOnSubmit)} className="grid grid-cols-3 gap-2 ">
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

              <div className="w-full">
                  <Label className="text-xs" htmlFor="cpf" value="CPF" />

                  <Controller
                  control={control}
                  name="cpf"
                  render={({ field:{onChange,value} }) => (
                    <ReactInputMask value={value} onChange={e=>onChange(e.target.value)} id="cpf" placeholder="CPF" className="px-2 py-2 text-xs focus:outline-none bg-gray-100 w-full rounded-lg border-[1px] border-gray-300" mask={'999.999.999-99'}/>
                  )}
                  />
              </div>


<div>
             
                <Label className="text-xs" htmlFor="espec" value="Especialidade" />
          
              <Select sizing={'sm'} {...register('id_med')} id='espec' onChange={e=>handleMedico(e)} className="focus:outline-none"   required >
                    <option value={''}></option>
                    {medicos.map((item,index)=>(
                        <option value={item.id_med} key={item.id_med}>{`${item.nome}-(${item.espec})`}</option>
                    ))}
              </Select>
            </div>
            <div className="w-full">
            
                <Label className="text-xs" value="Desconto" />
          
              <Select sizing={'sm'} {...register('tipoDesc')} onChange={e=>handleDesconto(e)} className="focus:outline-none"   required >
                    <option value={''}></option>
                    <option value={'PARTICULAR'}>PARTICULAR</option>
                    
                    <option value={'FUNERARIA'}>FUNERÁRIA</option>
                    <option value={'PLANO'}>PLANO</option>
              </Select>
            </div>

            <div >
            
            <Label className="text-xs" value="Valor Final" />
       
          <TextInput theme={{field:{input:{base:"block w-full border disabled:cursor-not-allowed "}}}} disabled sizing={'sm'} {...register('vl_final')} className="focus:outline-none disabled:text-black"  placeholder="Valor" required />
        </div>

          <div className="col-span-3 op">
          <Button className="ml-auto" type="submit">{consulta?.id_consulta ? 'Atualizar' : 'Cadastrar'}</Button>
          </div>
      
          </form>
          {/*
            data.id_med===1 &&    <div>
          
           
<div className="inline-flex w-full gap-4 p-2">
<div className="w-full">
              <div className="mb-1 block">
                <Label  value="Exame" />
              </div>
              <Select sizing={'sm'}  onChange={e=>handleExame(e)} className="focus:outline-none"   required >
                    <option value={''}></option>
                    {exames.map((item,index)=>(
                        <option value={item.id_exame??''} key={item.nome}>{`${item.nome}-(${item.nome})`}</option>
                    ))}
              </Select>
            </div>

            <button  onClick={()=>{
                if(!dataExame.id_exame|| !data.tipoDesc){
                    return
                }
                let valorDesc:number =0
          
                if(data.tipoDesc==='Funeraria'){
                    valorDesc= dataExame.valorBruto*(dataExame.porcFun/100)
                }
    
               else if(data.tipoDesc==='Plano'){
                    valorDesc= dataExame.valorBruto*(dataExame.porcPlan/100)
               }                 
                setData({...data,exames:[...data.exames,{...dataExame,desconto:valorDesc,valorFinal:dataExame.valorBruto-valorDesc}]})
            }} className="mt-auto"><IoAddCircle color="blue" size={32}/></button>
</div>
           






                    <div className="overflow-x-auto ">
<Table  >
  <Table.Head>
    <Table.HeadCell>Exame</Table.HeadCell>
    <Table.HeadCell>Valor Bruto</Table.HeadCell>
    <Table.HeadCell>Valor Desc.</Table.HeadCell>
    <Table.HeadCell>Valor Final</Table.HeadCell>
    <Table.HeadCell>
      <span className="sr-only">Edit</span>
    </Table.HeadCell>
 
  </Table.Head>
  <Table.Body className="divide-y">
      {data?.exames?.map((item,index)=>(
           <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {item.nome}
      </Table.Cell>
      <Table.Cell>{Number(item.valorBruto).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
      <Table.Cell>{Number(item.desconto).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
      <Table.Cell>{Number(item.valorFinal).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
      <Table.Cell>
     
        <button onClick={()=>handleTableExames(index)} className="font-medium text-gray-500 hover:text-red-600 ">
          <HiOutlineTrash size={20}/>
        </button>
      </Table.Cell>
   
</Table.Row>


      ))}
     
  
   
 

  <Table.Row  className="bg-white dark:border-gray-700 dark:bg-gray-800">
               <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  Total
      </Table.Cell>
    
      <Table.Cell>{}</Table.Cell>
      <Table.Cell>{}</Table.Cell>
      <Table.Cell>{Number(data?.exames?.reduce((acumulador,atual)=>{
          acumulador+=Number(atual.valorFinal)
          return acumulador},0)).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</Table.Cell>
</Table.Row>
 
 
  </Table.Body>
 
</Table>
</div>
   

              </div>
               
           */ }


        </Modal.Body>
      </Modal>

    )
}