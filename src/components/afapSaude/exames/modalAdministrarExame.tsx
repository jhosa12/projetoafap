
import { ConsultaProps, ExamesData, ExamesProps, MedicoProps } from "@/pages/afapSaude";
import { Button, Label, Modal, Select, Table, TextInput } from "flowbite-react";
import ReactInputMask from "react-input-mask";
import { ChangeEvent, useState } from "react";
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ExameRealizadoProps } from "./exames";
import { IoAddCircle, IoAddCircleOutline } from "react-icons/io5";
import { HiOutlineTrash, HiTrash } from "react-icons/hi2";


interface DataProps {
  openModal: boolean,
  setOpenModal: () => void,
  registro: ExameRealizadoProps,
  arraySelectExames: ExamesProps[],
  handleNovoExame: (data: ExameRealizadoProps) => Promise<void>,
  handleEditarExame: (data: ExameRealizadoProps) => Promise<void>,
}
export function ModalAdministrarExame({ openModal, setOpenModal, registro, arraySelectExames, handleNovoExame,handleEditarExame }: DataProps) {

  const { register, setValue, handleSubmit, watch, control } = useForm<ExameRealizadoProps>({
    defaultValues: {...registro}
  })




  const handleDelExameTable = (id_exame: number) => {
    setValue('exames', watch('exames').filter(item => item.id_exame !== id_exame))
  }


  const handleAdicionarExame = () => {
    const exame = arraySelectExames.find(item => item.id_exame === Number(watch('id_selected')));


    const tipo = watch('tipoDesc')

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
    const examesAtuais = watch('exames') || [];

    // Verificar se o exame já existe na lista para evitar duplicados
    const exameJaExiste = examesAtuais.some((item: ExamesData) => item.id_exame === exame.id_exame); // Supondo que 

    if (exameJaExiste) {
      toast.info('Exame ja existe na lista');
      return;
    }

    // Adicionar o novo exame à lista e atualizar o campo `exames`



    const vl_particular =Number(exame.porcPart)

    const desconto = tipo === 'PARTICULAR' ? 0 : tipo === 'FUNERARIA' ?
      (vl_particular * (Number(exame.porcFun) / 100)) : (vl_particular * (Number(exame.porcPlan) / 100))


    setValue('exames', [...examesAtuais, {
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


  const handleOnSubmit: SubmitHandler<ExameRealizadoProps> = (data) => {
    
     registro.id_exame ? handleEditarExame(data) :  handleNovoExame(data)

  }


  const handleDesconto = (event: ChangeEvent<HTMLSelectElement>) => {


  }


  /* const handleTableExames = (index:number)=>{
       const novoArray =[...data.exames]
       novoArray.splice(index,1)
       setData({...data,exames:novoArray})
 
   }*/





  return (
    <Modal show={openModal} size="4xl" dismissible onClose={() => setOpenModal()} >
      <Modal.Header>Administrar Exame</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <div className="grid grid-cols-4 gap-2 ">
            <div className="col-span-2 ">
              <Label className="text-xs" htmlFor="nome" value="Nome Paciente" />
              <TextInput sizing={'sm'} {...register('nome')} className="focus:outline-none" id="nome" placeholder="Nome" required />
            </div>


            <div className="w-full">


              <Label className="text-xs" htmlFor="celular" value="Celular" />

              <Controller
                control={control}
                name="celular"
                render={({ field: { onChange, value } }) => (
                  <ReactInputMask value={value} onChange={e => onChange(e.target.value)} id="celular" placeholder="Celular" className="px-2 py-2 focus:outline-none text-xs bg-gray-100 w-full rounded-lg border-[1px] border-gray-300" mask={'(99) 9 9999-9999'} />
                )}
              />


            </div>

            <div className="w-full">
              <Label className="text-xs" htmlFor="cpf" value="CPF" />

              <Controller
                control={control}
                name="cpf"
                render={({ field: { onChange, value } }) => (
                  <ReactInputMask value={value} onChange={e => onChange(e.target.value)} id="cpf" placeholder="CPF" className="px-2 py-2 text-xs focus:outline-none bg-gray-100 w-full rounded-lg border-[1px] border-gray-300" mask={'999.999.999-99'} />
                )}
              />
            </div>



            <div className="col-span-3 ">

<Label className="text-xs" htmlFor="endereco" value="Endereço Completo" />

<TextInput id="endereco" required={watch('coleta') === 'DOMICILIO'} sizing={'sm'} {...register('endereco')} className="focus:outline-none" placeholder="Endereço" />
</div>


<div className="col-span-1 ">

<Label  className="text-xs" htmlFor="coleta" value="Coleta" />
<Select sizing={'sm'} {...register('coleta')}  id="coleta"  className="focus:outline-none" required >
                <option value={''}></option>
                <option value={'CLINICA'}>CLÍNICA</option>
                <option value={'DOMICILIO'}>DOMICÍLIO</option>
              </Select>
</div>


            <div className="col-span-2 ">

              <Label className="text-xs" htmlFor="responsavel" value="Nome Responsável (se for menor)" />

              <TextInput id="responsavel" sizing={'sm'} {...register('nome_responsavel')} className="focus:outline-none" placeholder="Responsável, caso paciente seja menor de idade" />
            </div>


            <div className="w-full">

              <Label className="text-xs" htmlFor="parentesco" value="Parentesco" />

              <Select id="parentesco" sizing={'sm'} {...register('parentesco')} className="focus:outline-none"  >
                <option selected className="text-gray-200">PARENTESCO</option>
                <option value={'CONJUGE'}>CONJUGE</option>
                <option value={'PAI'}>PAI</option>
                <option value={'MÃE'}>MÃE</option>
                <option value={'FILHO'}>FILHO(A)</option>,
                <option value={'IRMÃO(Ã)'}>IRMÃO(Ã)</option>
                <option value={'PRIMO'}>PRIMO(A)</option>
                <option value={'SOBRINHO(A)'}>SOBRINHO(A)</option>
                <option value={'NORA'}>NORA</option>
                <option value={'GENRO'}>GENRO</option>
                <option value={'TIO(A)'}>TIO(A)</option>
                <option value={'AVÔ(Ó)'}>AVÔ(Ó)</option>
                <option value={'OUTROS'}>OUTROS</option>
              </Select>
            </div>




            <div className="w-full">

              <Label htmlFor="desconto" className="text-xs" value="Desconto" />

              <Select id="desconto" sizing={'sm'} {...register('tipoDesc')} onChange={e => handleDesconto(e)} className="focus:outline-none" required >
                <option value={''}></option>
                <option value={'PARTICULAR'}>PARTICULAR</option>
                <option value={'FUNERARIA'}>FUNERÁRIA</option>
                <option value={'PLANO DESCONTO'}>PLANO DESCONTO</option>
              </Select>
            </div>


 
          </div>
          <div>


   



            <div className="inline-flex w-full gap-4 mb-1">
              <div className="w-full">

                <Label htmlFor="exame" className="text-xs" value="Exame" />

                <Select id="exame" sizing={'sm'} {...register('id_selected')} className="focus:outline-none" required ={!registro.id_exame} >
                  <option value={''}></option>
                  {arraySelectExames?.map((item, index) => (
                    <option value={item.id_exame} key={index}>{`${item.nome}`}</option>
                  ))}
                </Select>
              </div>
              <Button type="button" size={'xs'} onClick={handleAdicionarExame} className="mt-auto p-1">Adicionar</Button>

            </div>
            <div className="overflow-x-auto ">
              <Table theme={{ body: { cell: { base: "px-6 text-black py-2 group-first/body:group-first/row:first:rounded-tl-lg group-first/body:group-first/row:last:rounded-tr-lg group-last/body:group-last/row:first:rounded-bl-lg group-last/body:group-last/row:last:rounded-br-lg text-xs" } }, head: { cell: { base: "bg-gray-50 px-6 py-1 group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg " } } }} >
                <Table.Head>
                  <Table.HeadCell>Exame</Table.HeadCell>
                  <Table.HeadCell>Valor Exame</Table.HeadCell>
                  <Table.HeadCell>Desconto</Table.HeadCell>
                  <Table.HeadCell>Valor Final</Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">Edit</span>
                  </Table.HeadCell>

                </Table.Head>
                <Table.Body className="divide-y">
                  {watch('exames')?.map((item, index) => (
                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {item.nome}
                      </Table.Cell>
                      <Table.Cell>{Number(item.valorExame ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                      <Table.Cell>{Number(item.desconto ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                      <Table.Cell>{Number(item.valorFinal ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                      <Table.Cell>

                        <button type="button" onClick={() => handleDelExameTable(item.id_exame)} className="font-medium text-gray-500 hover:text-red-600 ">
                          <HiTrash size={16} />
                        </button>
                      </Table.Cell>

                    </Table.Row>


                  ))}

                  <Table.Row className="font-semibold" >
                    <Table.Cell >
                      TOTAL
                    </Table.Cell>

                    <Table.Cell>{Number(watch('exames')?.reduce((acumulador, atual) => {
                      acumulador += Number(atual.valorExame)
                      return acumulador
                    }, 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                    <Table.Cell>{Number(watch('exames')?.reduce((acumulador, atual) => {
                      acumulador += Number(atual.desconto)
                      return acumulador
                    }, 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} </Table.Cell>
                    <Table.Cell >{Number(watch('exames')?.reduce((acumulador, atual) => {
                      acumulador += Number(atual.valorFinal)
                      return acumulador
                    }, 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Table.Cell>
                  </Table.Row>


                </Table.Body>

              </Table>
            </div>
            <Button className="ml-auto" type="submit">{registro?.id_exame ? 'Atualizar' : 'Cadastrar'}</Button>

          </div>

        </form>
      </Modal.Body>
    </Modal>

  )
}