import { useContext, useEffect, useState } from "react"
import InputMask from 'react-input-mask'
import { IoIosClose } from "react-icons/io";
import { TbAlertTriangle } from "react-icons/tb";
import { AuthContext } from "@/contexts/AuthContext";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { toast } from "react-toastify";
import { api } from "@/services/apiClient";


export function ModalEditarDados({ openEdit }: { openEdit: number }) {
  const { usuario, closeModa, data, dadosassociado, carregarDados } = useContext(AuthContext)
  const [mountedComponente, setMounted] = useState(true)
  const [aba, setAba] = useState(1)
  const [situacao, setSituaçao] = useState(false)
  const [motivoFinanceiro, setMotivoFinanceiro] = useState(false)
  const [motivoNaoLocalizado, setNaoLocalizado] = useState(false)
  const [motivoDesagrado, setMotivoDesagrado] = useState(false)






  useEffect(() => {
    mountedComponente && setAba(openEdit)

    if (data.contrato?.situacao === "INATIVO" && !mountedComponente) {
      setSituaçao(true)
    }

    if (data.contrato?.situacao === "ATIVO" && !mountedComponente) {
      inativarAtivarContrato('ATIVO')
    }

    setMounted(false)

  }, [data.contrato?.situacao])


  async function inativarAtivarContrato(st: string) {

    if (st === 'INATIVO' && !motivoDesagrado && !motivoFinanceiro && !motivoNaoLocalizado) {
      toast.warning('Selecione a categoria do motivo')

      return;
    }
    if (st === 'INATIVO' && !data.contrato?.motivo_inativo) {
      toast.warning('Descreva o motivo da Inattivação')
      return;
    }

    const response = await toast.promise(
      api.put('/contrato/inativar',
        {
          id_contrato: dadosassociado?.contrato?.id_contrato,
          motivo_inativo: st === 'INATIVO' ? data.contrato?.motivo_inativo : undefined,
          categoria_inativo: st === 'INATIVO' ? data.contrato?.categoria_inativo : undefined,
          dt_cancelamento: st === 'INATIVO' ? new Date() : undefined,
          situacao: st
        }
      ),
      {
        error: 'Erro ao Inativar/Ativar Contrato',
        pending: 'Realizando Inativação',
        success: 'Contrato Inativado com sucesso'

      }
    )
   // await carregarDados()
    setSituaçao(false)
    closeModa({...data,contrato:{...data.contrato,...response.data}})

  }
  useEffect(() => {
    closeModa({
      closeEditarAssociado: true,
      name: dadosassociado?.nome,
      nasc: new Date(dadosassociado?.data_nasc ?? ''),
      bairro: dadosassociado?.bairro,
      celular1: dadosassociado?.celular1,
      celular2: dadosassociado?.celular2,
      telefone: dadosassociado?.telefone,
      cidade: dadosassociado?.cidade,
      cep: dadosassociado?.cep,
      cpf: dadosassociado?.cpf,
      endereco: dadosassociado?.endereco,
      email: dadosassociado?.email,
      id_associado: dadosassociado?.id_associado,
      contrato: {
        id_contrato: dadosassociado?.contrato?.id_contrato,
        cobrador: dadosassociado?.contrato?.cobrador,
        consultor: dadosassociado?.contrato?.consultor,
        data_vencimento: dadosassociado?.contrato?.data_vencimento,
        dt_adesao: dadosassociado?.contrato?.dt_adesao,
        dt_carencia: dadosassociado?.contrato?.dt_carencia,
        id_plano: dadosassociado?.contrato?.id_plano,
        origem: dadosassociado?.contrato?.origem,
        plano: dadosassociado?.contrato?.plano,
        situacao: dadosassociado?.contrato?.situacao,
        supervisor: dadosassociado?.contrato?.supervisor,
        valor_mensalidade: dadosassociado?.contrato?.valor_mensalidade
      },

      numero: dadosassociado?.numero,
      profissao: dadosassociado?.profissao,
      rg: dadosassociado?.rg,
      referencia: dadosassociado?.guia_rua,
      uf: dadosassociado?.uf
    })
  }, [])



  return (
    <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">

      <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-30 bg-gray-300 ">

        <div className="w-8/12 relative max-w-full  border rounded-lg shadow bg-gray-800 border-gray-700">
          <ul className=" text-sm font-medium text-center divide-x rounded-lg sm:flex divide-gray-600 text-gray-400 rtl:divide-x-reverse" id="fullWidthTab" data-tabs-toggle="#fullWidthTabContent" role="tablist">
            <li className="w-full">
              <button onClick={() => setAba(1)} type="button" aria-selected="true" className="inline-block w-full p-4 rounded-ss-lg focus:outline-none bg-gray-700 hover:bg-gray-600">TITULAR</button>
            </li>
            <li className="w-full">
              <button onClick={() => setAba(2)} type="button" aria-controls="about" aria-selected="false" className="inline-block w-full p-4 focus:outline-none bg-gray-700 hover:bg-gray-600">CONTRATO/PLANO</button>
            </li>
            <li className="w-full">
              <button onClick={() => setAba(3)} data-tabs-target="#faq" type="button" role="tab" aria-controls="faq" aria-selected="false" className="inline-block w-full p-4 rounded-se-lg focus:outline-none bg-gray-700 hover:bg-gray-600">DEPENDENTES</button>
            </li>
          </ul>
          <button onClick={() => closeModa({ ...data,closeEditarAssociado: false})} className="absolute top-0 right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto  hover:bg-gray-600 hover:text-white"><IoIosClose size={30} /></button>
          <div className="border-t border-gray-600">
            <div className={`${aba === 1 ? "" : "hidden"} max-h-[calc(100vh-150px)]  p-2 rounded-lg bg-gray-800`}>
              <div className="grid max-w-screen-xl grid-cols-4 gap-2 p-2 mx-auto text-white  pt-3 pb-3">
                <div className="col-span-2">
                  <label className="block mb-1 text-xs font-medium  text-white">NOME</label>
                  <input autoComplete='off' defaultValue={data.name} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">NASCIMENTO</label>
                  <input defaultValue={data.nasc && new Date(data.nasc).toLocaleDateString('pt-BR',{timeZone:'UTC'})} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2  border  rounded-lg sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">SEXO</label>
                  <select defaultValue={data.sexo} className="block w-full pb-1 pt-1 pr-2 pl-2  text-xs border rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option selected></option>
                    <option value="M">MASCULINO</option>
                    <option value="F">FEMININO</option>
                  </select >
                </div>

                <div className="col-span-2">
                  <label className="block mb-1 text-xs font-medium  text-white">ENDEREÇO</label>
                  <input defaultValue={data.endereco} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">CEP</label>
                  <InputMask defaultValue={data.cep} mask={'99999-9999'} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">NUMERO</label>
                  <input defaultValue={data.numero} autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs  border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 text-xs font-medium  text-white">BAIRRO</label>
                  <input defaultValue={data.bairro} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 text-xs font-medium  text-white">PONTO REF</label>
                  <input defaultValue={data.referencia} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">UF</label>
                  <select defaultValue={data.uf} onChange={(e) => closeModa({ uf: e.target.value })} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option selected></option>
                    <option>AC</option>
                    <option>AL</option>
                    <option>AM</option>
                    <option>AP</option>
                    <option>BA</option>
                    <option>CE</option>
                    <option>DF</option>
                    <option>ES</option>
                    <option>GO</option>
                    <option>MA</option>
                    <option>MG</option>
                    <option>MS</option>
                    <option>MT</option>
                    <option>DF</option>
                    <option>PA</option>
                    <option>PB</option>
                    <option>PE</option>
                    <option>PI</option>
                    <option>PR</option>
                    <option>RJ</option>
                    <option>RN</option>
                    <option>RO</option>
                    <option>RR</option>
                    <option>RS</option>
                    <option>SC</option>
                    <option>SE</option>
                    <option>SP</option>
                    <option>TO</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">CIDADE</label>
                  <select defaultValue={data.cidade} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs  text-xs  border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                    <option selected></option>
                    {data.cidades?.map((item, index) => {
                      return (
                        item.uf === data.uf ? (<option>{item.cidade}</option>) : ''
                      )
                    })}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">RG</label>
                  <input defaultValue={data.rg} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">CPF</label>
                  <InputMask defaultValue={data.cpf} mask={'999.999.999-99'} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">NATURALIDADE</label>
                  <input defaultValue={data.naturalidade} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>

                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">CELULAR1</label>
                  <InputMask defaultValue={data.celular1} mask={'(99) 9 9999-9999'} type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">CELULAR2</label>
                  <InputMask defaultValue={data.celular2} mask={'(99) 9 9999-9999'} type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-1">
                  <label className="block mb-1 text-xs font-medium  text-white">TELEFONE</label>
                  <InputMask defaultValue={data.telefone} mask={'(99) 9 9999-9999'} type="text" className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 text-xs font-medium  text-white">EMAIL</label>
                  <input defaultValue={data.email} autoComplete="off" type="text" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-xs border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                </div>
              </div>
            </div>
          </div>
          <div className={`${aba === 2 ? "" : "hidden"} p-4  rounded-lg md:p-8 bg-gray-800`}>
            <div className="inline-flex gap-2 mb-2">
              <span className=" text-sm text-white font-medium">SITUAÇÃO:</span>
              <label className="relative inline-flex w-[120px] justify-center  items-center  cursor-pointer">
                <input checked={data.contrato?.situacao === 'ATIVO' ? true : false} onChange={()=>{
                   data.contrato?.situacao==='ATIVO'?setSituaçao(true):inativarAtivarContrato('ATIVO')
                  }} type="checkbox" value="2" className="sr-only peer" />
                <div className="absolute right-20 w-9 h-5 rounded-full peer bg-red-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.9px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-green-600"></div>
                <span className={`ms-6 text-sm font-medium  ${data.contrato?.situacao === 'ATIVO' ? "text-green-500" : "text-red-500"}`}>{data.contrato?.situacao}</span>
              </label>
            </div>
            {situacao ? (<div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="flex items-center justify-center p-2 w-full h-full">
                <div className="relative rounded-lg border-solid border-[1px] border-red-500 shadow bg-gray-800">
                  <button type="button" onClick={() => { setSituaçao(!situacao), closeModa({ contrato: { ...(data.contrato), situacao: dadosassociado?.contrato?.situacao } }) }} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                    <button type="button" onClick={() => closeModa({ closeModalPlano: false })} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                      <IoIosClose size={30} />
                    </button>
                  </button>
                  <div className="p-4 md:p-5 text-center">
                    <div className="flex w-full justify-center items-center">
                      <TbAlertTriangle className='text-gray-400' size={60} />
                    </div>
                    <h3 className="mb-5 text-lg font-normal  text-gray-400">{`Realmente deseja inativar o contrato Nº ${data.contrato?.id_contrato}`}?</h3>

                    <div className="inline-flex gap-8">
                      <div className="flex items-center ">
                        <input type="checkbox" checked={motivoFinanceiro} onClick={() => { setMotivoFinanceiro(!motivoFinanceiro), closeModa({ contrato: { ...data.contrato, categoria_inativo: 'FINANCEIRO' } }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                        <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">FINANCEIRO</label>
                      </div>
                      <div className="flex items-center ">
                        <input type="checkbox" checked={motivoNaoLocalizado} onClick={() => { setNaoLocalizado(!motivoNaoLocalizado), closeModa({ contrato: { ...data.contrato, categoria_inativo: 'NÃO LOCALIZADO' } }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                        <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">NÃO LOCALIZADO</label>
                      </div>
                      <div className="flex items-center ">
                        <input type="checkbox" checked={motivoDesagrado} onClick={() => { setMotivoDesagrado(!motivoDesagrado), closeModa({ contrato: { ...data.contrato, categoria_inativo: 'DESAGRADO' } }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                        <label className="ms-2 text-sm font-medium whitespace-nowrap text-gray-300">DESAGRADO</label>
                      </div>

                    </div>



                    <input disabled={!motivoDesagrado && !motivoFinanceiro && !motivoNaoLocalizado} value={data.contrato?.motivo_inativo} onChange={e => closeModa({ ...data, contrato: { ...data.contrato, motivo_inativo: e.target.value } })} placeholder="Informe o motivo da Inativação" autoComplete='off' type="text" required className="block uppercase w-full mb-2 pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />



                    <button onClick={() => inativarAtivarContrato('INATIVO')} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none  focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">

                      Sim, tenho certeza
                    </button>
                    <button onClick={() => { setSituaçao(!situacao) }} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
                  </div>
                </div>
              </div>
            </div>) : ''}
            <div className="grid gap-2 grid-flow-c-dense pl-2 pr-2 w-full  md:grid-cols-4" >

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium  text-white">CONTRATO</label>
                <input value={data.contrato?.id_contrato} onChange={e => closeModa({ contrato: { ...data.contrato, id_contrato: Number(e.target.value) } })} autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium  text-white">ORIGEM</label>
                <select value={data.origem} onChange={e => closeModa({ origem: e.target.value })} className="block w-full  pb-1 pt-1 pr-2 pl-2 sm:text-sm  border rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                  <option selected></option>
                  <option >PLANO NOVO</option>
                  <option >TRANSFERÊNCIA</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium  text-white">PLANO</label>

                <select
                  defaultValue={data.contrato?.plano}
                  disabled={!usuario?.permissoes?.some(item => item.nome === 'ALTERAR CATEGORIA' && item.val)}
                  className="block w-full p-1.5 pb-1 pt-1 pr-2 pl-2 sm:text-sm  border rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const selectedPlano = data.planos?.find(item => item.descricao === e.target.value);
                    closeModa({
                      contrato: {
                        ...(data.contrato || {}),
                        id_plano: Number(selectedPlano?.id_plano),
                        plano: e.target.options[e.target.selectedIndex].text ? e.target.options[e.target.selectedIndex].text : data.contrato?.plano,

                      }
                    });

                  }}>
                  <option value=" "></option>
                  {data.planos?.map((item) => {
                    return (
                      <option
                        selected={item.descricao === data.contrato?.plano ? true : false}
                        value={item.descricao} key={item.id_plano} >{item.descricao}</option>
                    )
                  })}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium  text-white">VALOR</label>
                <input value={data.contrato?.valor_mensalidade} onChange={e => closeModa({ contrato: { ...data.contrato, valor_mensalidade: Number(e.target.value) } })} autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium text-white">COBRADOR</label>
                <select value={data.contrato?.cobrador} onChange={e => closeModa({ contrato: { ...data.contrato, cobrador: e.target.value } })} className="block w-full   pb-1 pt-1 pr-2 pl-2 sm:text-sm  border rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                  <option selected></option>
                  <option >JACKSON</option>
                  <option >SAMUEL</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium  text-white">CONSULTOR</label>
                <select value={data.contrato?.consultor} onChange={e => closeModa({ contrato: { ...data.contrato, consultor: e.target.value } })} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                  <option selected></option>
                  <option >MATEUS</option>
                  <option >JOÃO</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium  text-white">SUPERVISOR</label>
                <select value={data.contrato?.supervisor} onChange={e => closeModa({ contrato: { ...data.contrato, supervisor: e.target.value } })} className="block w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white  ">
                  <option selected></option>
                  <option >MATEUS</option>
                  <option >JOÃO</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium  text-white">NP</label>
                <input value={data.contrato?.n_parcelas} onChange={e => closeModa({ contrato: { ...data.contrato, n_parcelas: Number(e.target.value) } })} autoComplete="off" type="number" required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium  text-white">VENCIMENTO INICIAL</label>
                <DatePicker disabled={!usuario?.permissoes?.some(item => item.nome === 'ALTERAR VENCIMENTO' && item.val)} dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={data.contrato?.data_vencimento} onChange={(e) => e && closeModa({ contrato: { ...data.contrato, data_vencimento: e } })} required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium  text-white">DATA DE ADESÃO</label>
                <DatePicker disabled={!usuario?.permissoes?.some(item => item.nome === 'ALTERAR ADESÃO' && item.val)} dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={data.contrato?.dt_adesao} onChange={e => e && closeModa({ contrato: { ...data.contrato, dt_adesao: e } })} required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg   bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
              </div>
              <div className="col-span-1">
                <label className="block mb-1 text-sm font-medium  text-white">FIM DA CARÊNCIA</label>
                <DatePicker disabled={!usuario?.permissoes?.some(item => item.nome === 'ALTERAR CARÊNCIA' && item.val)} dateFormat={"dd/MM/yyyy"} locale={"pt"} selected={data.contrato?.dt_carencia} onChange={e => e && closeModa({ contrato: { ...data.contrato, dt_carencia: e } })} required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg  bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
              </div>

            </div>
          </div>
          <div className={`${aba === 3 ? "" : "hidden"} p-2  rounded-lg bg-gray-800`} >
            <div >
              <h2>
                <button type="button" className="flex items-center justify-between w-full py-5 font-medium text-left rtl:text-right  border-b  border-gray-700 text-gray-400" data-accordion-target="#accordion-flush-body-1" aria-expanded="true" aria-controls="accordion-flush-body-1">
                  <span>What is Flowbite?</span>
                  <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                  </svg>
                </button>
              </h2>
              <div id="accordion-flush-body-1" className="hidden" aria-labelledby="accordion-flush-heading-1">
                <div className="py-5 border-b  border-gray-700">
                  <p className="mb-2  text-gray-400">Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons, dropdowns, modals, navbars, and more.</p>
                  <p className=" text-gray-400">Check out this guide to learn how to <a href="/docs/getting-started/introduction/" className="hover:underline">get started</a> and start developing websites even faster with components on top of Tailwind CSS.</p>
                </div>
              </div>
              <h2 id="accordion-flush-heading-2">
                <button type="button" className="flex items-center justify-between w-full py-5 font-medium text-left rtl:text-right border-b  border-gray-700 text-gray-400" data-accordion-target="#accordion-flush-body-2" aria-expanded="false" aria-controls="accordion-flush-body-2">
                  <span>Is there a Figma file available?</span>
                  <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                  </svg>
                </button>
              </h2>
              <div id="accordion-flush-body-2" className="hidden" aria-labelledby="accordion-flush-heading-2">
                <div className="py-5 border-b  border-gray-700">
                  <p className="mb-2  text-gray-400">Flowbite is first conceptualized and designed using the Figma software so everything you see in the library has a design equivalent in our Figma file.</p>
                  <p className=" text-gray-400">Check out the <a href="https://flowbite.com/figma/" className=" text-blue-500 hover:underline">Figma design system</a> based on the utility classes from Tailwind CSS and components from Flowbite.</p>
                </div>
              </div>
              <h2 id="accordion-flush-heading-3">
                <button type="button" className="flex items-center justify-between w-full py-5 font-medium text-left rtl:text-right border-b border-gray-700 text-gray-400" data-accordion-target="#accordion-flush-body-3" aria-expanded="false" aria-controls="accordion-flush-body-3">
                  <span>What are the differences between Flowbite and Tailwind UI?</span>
                  <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                  </svg>
                </button>
              </h2>
              <div id="accordion-flush-body-3" className="hidden" aria-labelledby="accordion-flush-heading-3">
                <div className="py-5 border-b  border-gray-700">
                  <p className="mb-2  text-gray-400">The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone components, whereas Tailwind UI offers sections of pages.</p>
                  <p className="mb-2 text-gray-400">However, we actually recommend using both Flowbite, Flowbite Pro, and even Tailwind UI as there is no technical reason stopping you from using the best of two worlds.</p>
                  <p className="mb-2 text-gray-400">Learn more about these technologies:</p>
                  <ul className="ps-5  list-disc text-gray-400">
                    <li><a href="https://flowbite.com/pro/" className=" text-blue-500 hover:underline">Flowbite Pro</a></li>
                    <li><a href="https://tailwindui.com/" rel="nofollow" className=" text-blue-500 hover:underline">Tailwind UI</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="inline-flex w-full justify-end p-2">
            <button type='button' className="flex flex-row justify-center items-center bg-blue-600 rounded-lg p-2 text-white font-medium">SALVAR</button>
          </div>
        </div>
      </div>

    </div>

  )
}