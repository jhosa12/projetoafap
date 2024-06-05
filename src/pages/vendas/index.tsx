
import { AuthContext } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import fototeste from '../../../public/fototeste.jpeg'
import { api } from '@/services/apiClient';
import { GoGoal } from "react-icons/go";
import { GiStairsGoal } from "react-icons/gi";
import { FaHandshake } from "react-icons/fa";
import { GiRotaryPhone } from "react-icons/gi";
import { FaPercentage } from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { IoIosClose } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import { toast } from 'react-toastify';
import { Item } from '@/components/dadosTitular';
interface VendasProps {
    consultor: string,
    _sum: { valor_mensalidade: number },
    _count: { dt_adesao: number },
    situacao: string
}
interface MetasProps {
    id_meta: number,
    id_grupo: number,
    id_conta: string,
    valor: number,
    descricao: string,
    date: Date,
    dateFimMeta: Date,
    descricao_grupo: string
}
interface SetorProps {
    id_grupo: number,
    descricao: string
}
interface ConsultoresProps {
    funcao: string,
    nome: string,
    id_consultor: number

}
interface ResponseProps {
    grupos: Array<VendasProps>,
    metas: Array<MetasProps>
    setores: Array<SetorProps>
    consultores: Array<ConsultoresProps>
}
let formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

export default function Vendas() {
    const { usuario } = useContext(AuthContext)
    const [dados, setDados] = useState<Array<VendasProps>>([])
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    const [endDate, setEndDate] = useState(new Date())
    const [somaVendas, setSomaVendas] = useState<number>(0)
    const [aba, setAba] = useState(1)
    const [arrayMetas, setMetas] = useState<Array<MetasProps>>([])
    const [arraySetores, setSetores] = useState<Array<SetorProps>>([])
    const [modalMetas, setModalMetas] = useState<boolean>(false)
    const [dadosMetas, setDadosMetas] = useState<Partial<MetasProps>>({})
    const [consultores, setConsultores] = useState<Array<ConsultoresProps>>()
    const [meta, setMeta] = useState<number>()

    const setarDadosMetas = (fields: Partial<MetasProps>) => {
        setDadosMetas((prev: Partial<MetasProps>) => {
            if (prev) {
                return { ...prev, ...fields }
            }
            else {
                return { ...fields }
            }

        })
    }

    async function dadosVendas() {
        try {
            const response = await api.post('/vendas/filtro',
                {
                    dataInicio: startDate,
                    dataFim: endDate
                }
            )

            const { grupos, metas, setores, consultores }: ResponseProps = response.data;
            const consultoresArray = consultores.reduce((acumulador, item) => {
                const itemExistente = acumulador.find(it => it.nome === item.nome)
                if (!itemExistente) {
                    acumulador.push(item)
                }
                return acumulador
            }, [] as ConsultoresProps[])
            const metaAtual = metas.reduce((acumulador, item) => {
                if (new Date(item.date) >= new Date(startDate) && new Date(item.dateFimMeta) <= new Date(endDate)) {
                    return acumulador += Number(item.valor)
                }
                return acumulador

            }, 0)
            setMeta(metaAtual)
            console.log(consultoresArray)
            console.log(metaAtual)
            setConsultores(consultoresArray)
            setDados(grupos)
            setMetas(metas)
            setSetores(setores)
        } catch (error) {

        }

    }
    useEffect(() => {
        dadosVendas()
    }, [])


    async function novaMeta() {
        try {
            await toast.promise(
                api.post('/vendas/novaMeta', {
                    id_grupo: dadosMetas.id_grupo,
                    date: dadosMetas.date,
                    dateFimMeta: dadosMetas.dateFimMeta,
                    valor: dadosMetas.valor,
                    descricao: `META SETOR ${dadosMetas.descricao_grupo}`
                }),
                {
                    error: 'Erro ao salvar dados',
                    pending: 'Salvando Dados....',
                    success: 'Dados Savos com Sucesso'
                }
            )
        } catch (error) {
            toast.error('Erro')

        }

        dadosVendas()

    }


    return (
        <>
            { /*
          <div  className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
       
          <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-30 bg-gray-300 ">
              
  <div className="w-8/12 relative max-w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <ul className=" text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400 rtl:divide-x-reverse" id="fullWidthTab" data-tabs-toggle="#fullWidthTabContent" role="tablist">
          <li className="w-full">
              <button onClick={()=>setAba(1)}  type="button"  aria-selected="true" className="inline-block w-full p-4 rounded-ss-lg bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600">TITULAR</button>
          </li>
          <li className="w-full">
              <button onClick={()=>setAba(2)} type="button" aria-controls="about" aria-selected="false" className="inline-block w-full p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600">CONTRATO/PLANO</button>
          </li>
          <li className="w-full">
              <button onClick={()=>setAba(3)}   data-tabs-target="#faq" type="button" role="tab" aria-controls="faq" aria-selected="false" className="inline-block w-full p-4 rounded-se-lg bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600">DEPENDENTES</button>
          </li>
      </ul>
      <button onClick={()=>{}} className="absolute top-0 right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto  hover:bg-gray-600 hover:text-white"><IoIosClose size={30}/></button>
     
  </div>
  
              </div>
              </div>
        */}
            <div className="flex flex-col w-full text-white p-2">
                <div className='inline-flex w-full mb-1'>
                    <h1 className="font-semibold text-lg">ACOMPANHAMENTO DE VENDAS</h1>
                    <div id='FILTER' className='inline-flex ml-auto gap-2'>

                        <DatePicker

                            dateFormat={"dd/MM/yyyy"}
                            locale={pt}
                            selected={startDate}
                            onChange={(date) => date && setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            className="flex py-1 pl-2 text-xs  border rounded-sm   bg-gray-700 border-gray-600  text-white"
                        />
                        <span> até </span>

                        <DatePicker

                            dateFormat={"dd/MM/yyyy"}
                            locale={pt}
                            selected={endDate}
                            onChange={(date) => date && setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            className=" flex py-1 pl-2 text-xs  border rounded-sm  bg-gray-700 border-gray-600  text-white "
                        />
                        <button onClick={() => dadosVendas()} className='text-xs bg-green-700 rounded-lg p-1'> Buscar</button>

                    </div>
                    <button onClick={() => setModalMetas(true)} className='bg-gray-600 p-1 rounded-lg text-sm ml-auto'>NOVA META</button>
                </div>


                <div className="inline-flex w-full justify-between bg-gray-800 h-16 px-6 rounded-lg">
                    <div className='inline-flex items-center gap-1'>
                        <GoGoal size={30} />
                        <div className='flex flex-col '>
                            <span className='leading-none text-xs'>META</span>
                            <span className='leading-none'>{formatter.format(meta && consultores ? meta * consultores?.length : 0)}</span>

                        </div>
                    </div>
                    <div className='inline-flex items-center gap-1'>
                        <FaPercentage size={30} />
                        <div className='flex flex-col '>
                            <span className='leading-none text-xs'>PERCENTUAL</span>
                            <span className='leading-none'>{((dados?.reduce((acumulador, atual) => acumulador += Number(atual._sum.valor_mensalidade), 0) * 100) / (meta && consultores ? meta * consultores?.length : 0)).toFixed(2)}%</span>

                        </div>
                    </div>

                    <div className='inline-flex items-center gap-1'>
                        <GiStairsGoal size={30} />
                        <div className='flex flex-col '>
                            <span className='leading-none text-xs'>PRODUZIDO</span>
                            <span className='leading-none'>{formatter.format(dados?.reduce((acumulador, atual) => acumulador += Number(atual._sum.valor_mensalidade), 0))}/{dados?.reduce((acumulador, atual) => acumulador += Number(atual._count.dt_adesao), 0)}</span>

                        </div>
                    </div>
                    <div className='inline-flex items-center gap-1'>
                        <FaHandshake size={30} />
                        <div className='flex flex-col '>
                            <span className='leading-none text-xs'>PROSPECÇÕES</span>
                            <span className='leading-none'>0</span>

                        </div>
                    </div>
                    <div className='inline-flex items-center gap-1'>
                        <GiRotaryPhone size={30} />
                        <div className='flex flex-col '>
                            <span className='leading-none text-xs'>LEADS</span>
                            <span className='leading-none'>0</span>

                        </div>
                    </div>
                </div>
                <div className="flex w-full mt-1 gap-2 ">
                    <div className="flex flex-grow w-5/12  items-end justify-center lg:h-[calc(100vh-180px)]">{/*DIV DO TOP3*/}

                        <div className="flex flex-col w-1/3 h-full items-center justify-end gap-2 ">
                            <div className=" rounded-full overflow-hidden border-[2px] border-blue-600">
                                <img className="w-[74px] h-[74px] rounded-full" src="/fototeste.jpeg" alt="Rounded avatar"></img>
                            </div><div className="flex flex-col items-center justify-center rounded-t-lg h-2/3  w-full  bg-blue-600">
                                <span className='text-xl font-semibold'>2º</span>
                                <span>{dados[1]?.consultor}</span>
                                <span>Prod.: R$ {dados[1]?._sum.valor_mensalidade}</span>
                                <span>Quant.: R$ {dados[1]?._count.dt_adesao}</span>
                                <span>TKM.: R$ {(dados[1]?._sum.valor_mensalidade / dados[1]?._count.dt_adesao).toFixed(2)}</span>

                            </div>
                        </div>
                        <div className="flex flex-col w-1/3 h-full  items-center justify-end gap-2">
                            <div className=" rounded-full overflow-hidden border-[2px] border-yellow-600 ">
                                <img className="w-[74px] h-[74px] rounded-full" src="/fototeste.jpeg" alt="Rounded avatar"></img>
                            </div>
                            <div className="flex flex-col items-center justify-center  h-4/5 w-full rounded-t-lg   bg-yellow-600 ">
                                <span className='text-xl  font-semibold' >1º</span>
                                <span>{dados[0]?.consultor}</span>
                                <span>Prod.:  {dados[0]?._sum.valor_mensalidade}</span>
                                <span>Quant.: {dados[0]?._count.dt_adesao}</span>
                                <span>TKM.:R$ {(dados[0]?._sum.valor_mensalidade / dados[0]?._count.dt_adesao).toFixed(2)}</span>

                            </div>
                        </div>
                        <div className="flex flex-col w-1/3 h-full justify-end  items-center gap-2">
                            <div className=" rounded-full overflow-hidden border-[2px] border-teal-600">
                                <img className="w-[74px] h-[74px] rounded-full" src="/fototeste.jpeg" alt="Rounded avatar"></img>
                            </div>
                            <div className="flex flex-col items-center justify-center rounded-t-lg  h-1/2 w-full   bg-teal-600  ">
                                <span className='text-xl  font-semibold'>3º</span>
                                <span>{dados[2]?.consultor}</span>
                                <span>Prod.:  {dados[2]?._sum.valor_mensalidade}</span>
                                <span>Quant.:  {dados[2]?._count.dt_adesao}</span>
                                <span>TKM.: R$  {(dados[2]?._sum.valor_mensalidade / dados[2]?._count.dt_adesao).toFixed(2)}</span>
                            </div></div>

                    </div>
                    <div className="flex flex-col w-2/3 bg-gray-800 rounded-lg overflow-y-auto max-h-[calc(100vh-180px)]  ">
                        <ul className=' flex flex-col pt-4  '>
                            <li className='flex flex-col w-full  text-base px-4'>
                                <div className="flex w-full px-2 gap-8  items-center">
                                    <span className="flex w-2/12 text-start whitespace-nowrap ">#</span>
                                    <span className="flex w-full text-start whitespace-nowrap ">CONSULTOR</span>
                                    <span className="flex w-full text-start whitespace-nowrap">PROD.</span>
                                    <span className="flex w-full text-start whitespace-nowrap ">QUANT</span>
                                    <span className="flex w-full text-start whitespace-nowrap ">META</span>
                                    <span className="flex w-full text-start whitespace-nowrap ">PERCENTUAL</span>
                                </div>
                            </li>
                            {dados?.map((item, index) => {
                                return (
                                    <li className='flex flex-col w-full py-2  text-base px-4 '>
                                        <div className="flex w-full gap-8 px-2 items-center py-1.5 rounded-lg bg-slate-600">
                                            <span className="flex w-2/12 text-start whitespace-nowrap ">{index + 1}</span>
                                            <span className="flex w-full text-start gap-2 whitespace-nowrap ">
                                                <img className="w-[26px] h-[26px] rounded-full" src="/fototeste.jpeg" alt="Rounded avatar"></img>
                                                {item.consultor}

                                            </span>
                                            <span className="flex w-full text-start whitespace-nowrap">R$ {item._sum.valor_mensalidade}</span>
                                            <span className="flex w-full text-start whitespace-nowrap ">{item._count.dt_adesao}</span>
                                            <span className="flex w-full text-start whitespace-nowrap ">{meta}</span>
                                            <div className='flex flex-col w-full leading-none'>
                                                <div className="flex justify-between mb-1 leading-none">

                                                    <span className="text-sm font-medium text-blue-700 dark:text-white leading-none">{meta &&((item._sum.valor_mensalidade*100)/meta).toFixed(2)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                    <div style={{ width:`${(meta &&((item._sum.valor_mensalidade*100)/meta).toFixed(2))}%` }} className="bg-blue-600 h-2.5 rounded-full" ></div>
                                                </div>

                                            </div>

                                        </div>
                                    </li>
                                )

                            })}

                        </ul>
                    </div>
                </div>
                {modalMetas && <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
                    <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
                        <div className="fixed flex flex-col  w-2/4 p-4 rounded-lg  shadow bg-gray-800">
                            <button type="button" onClick={() => setModalMetas(!modalMetas)} className="absolute cursor-pointer top-0 right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                                <IoIosClose size={30} />
                            </button>


                            <label className="flex flex-row justify-start mb-4 border-b-[1px] text-lg border-gray-500 font-semibold mt-2 gap-2 text-white">METAS</label>
                            <div className='flex flex-row gap-2 items-end ml-auto'>
                                <div className="mb-1 ">
                                    <label className="block w-full mb-1 text-xs font-medium  text-white">DATA FIM</label>

                                    <select value={dadosMetas.id_grupo} onChange={e => {
                                        const item = arraySetores.find(item => item.id_grupo === Number(e.target.value))
                                        setarDadosMetas({ ...dadosMetas, id_grupo: item?.id_grupo, descricao_grupo: item?.descricao })

                                    }} className="flex pt-1 pb-1 pl-2 pr-2  border rounded-lg  text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                                        <option value={0}>SETOR (TODOS)</option>

                                        {arraySetores?.map((item, index) => (
                                            <option className="text-xs" key={index} value={item.id_grupo}>
                                                {item.descricao}
                                            </option>

                                        ))}
                                    </select>
                                </div>

                                <div className="mb-1 ">
                                    <label className="block w-full mb-1 text-xs font-medium  text-white">DATA INICIO</label>
                                    <DatePicker selected={dadosMetas.date} onChange={e => { e && setarDadosMetas({ ...dadosMetas, date: e }) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="block uppercase  w-full pb-1 pt-1 pr-2 pl-2 text-xs  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                                </div>
                                <div className="mb-1 ">
                                    <label className="block w-full mb-1 text-xs font-medium  text-white">DATA FIM</label>
                                    <DatePicker selected={dadosMetas.dateFimMeta} onChange={e => { e && setarDadosMetas({ ...dadosMetas, dateFimMeta: e }) }} dateFormat={"dd/MM/yyyy"} locale={pt} required className="block uppercase  w-full pb-1 pt-1 pr-2 pl-2 text-xs  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                                </div>

                                <div className="mb-1 ">
                                    <label className="block mb-1 text-xs font-medium  text-white">VALOR</label>
                                    <input type="text" value={dadosMetas.valor} onChange={e => setarDadosMetas({ ...dadosMetas, valor: Number(e.target.value) })} className="block w-full  pt-1 pb-1 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <button onClick={() => novaMeta()} className='flex   pb-1.5'><IoAddCircle size={23} /></button>

                            </div>

                            <div className="flex-col overflow-auto w-full justify-center items-center max-h-[350px] bg-gray-800 rounded-lg mb-4 pl-2 pr-2">
                                <table
                                    className="flex-col w-full p-2 overflow-y-auto overflow-x-auto  text-xs text-center rtl:text-center border-collapse  rounded-lg text-gray-400">
                                    <thead className=" text-xs uppercase bg-gray-700 text-gray-400">
                                        <tr >

                                            <th scope="col" className=" px-2 py-1">
                                                DESCRIÇÃO
                                            </th>
                                            <th scope="col" className=" px-2 py-1">
                                                DATA INICIO
                                            </th>
                                            <th scope="col" className="px-4 py-1">
                                                DATA FIM.
                                            </th>
                                            <th scope="col" className="px-2 py-1">
                                                VALOR
                                            </th>
                                            <th scope="col" className="px-2 py-1">
                                                AÇÕES
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody  >
                                        {arrayMetas.map((item, index) => (
                                            <tr key={index}
                                                className={` border-b "bg-gray-800"} border-gray-700 `}>
                                                <td className="px-2 py-1">
                                                    {item.descricao}
                                                </td>
                                                <td className={`px-2 py-1 `}>
                                                    {new Date(item.date || '').toLocaleDateString()}

                                                </td>

                                                <td className="px-5 py-1">
                                                    {new Date(item.dateFimMeta || '').toLocaleDateString()}
                                                </td>
                                                <td className="px-3 py-1">
                                                    {`R$${item.valor}`}
                                                </td>
                                                <td className={`px-4 py-1 font-bold text-red-600`}>
                                                    {item.id_grupo}
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>
                            </div>

                        </div>
                    </div>
                </div>


                }
            </div>
        </>
    )
}