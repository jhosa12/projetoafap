import { GruposProps, PlanoContasProps } from "@/pages/financeiro"
import { useEffect, useState } from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { BiTransferAlt } from "react-icons/bi"
import { FaBalanceScale } from "react-icons/fa"
import { GiExpense, GiReceiveMoney } from "react-icons/gi"
import { IoIosArrowDown } from "react-icons/io"
import { IoSearch } from "react-icons/io5"
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { api } from "@/services/apiClient"
import { LancamentosProps } from "@/pages/caixa"



interface SomaValorConta {
  _sum: { valor: number },
  conta: string,
  tipo: string
}


interface DataProps{
  listaContas:Array<PlanoContasProps>
}





export function PlanodeContas({listaContas}:DataProps){
  const [subListaLanc, setSubLista] = useState<Array<LancamentosProps>>()
    const [startDate,setStartDate] = useState(new Date())
    const [endDate,setEndDate] = useState(new Date())
    const [setorSelect, setSetor] = useState<number>(0)
    const [grupos, setGrupos] = useState<Array<GruposProps>>()
    const [somaPorConta, setSomaConta] = useState<Array<SomaValorConta>>([])
   
    const [dropPlanos, setDropPlanos] = useState(false)
    const [todos, setTodos] = useState(true)
    const [arraygeral, setArrayGeral] = useState<Array<PlanoContasProps>>([])
    const [todoPeriodo, setPeriodo] = useState(true)
    const [loading,setLoading] = useState(false)
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});











    const toogleAberto = (index: number) => {
      setAbertos((prev: { [key: number]: boolean }) => ({
        ...Object.keys(prev).reduce((acc, key) => {
          acc[Number(key)] = false;
          return acc;
        }, {} as { [key: number]: boolean }),
        [index]: !prev[index]
      }));
    };







    useEffect(() => {
      if (!todos) {
        const novoArray = listaContas.map(item => { return { ...item, check: false } })
        setArrayGeral(novoArray)
  
      }
      else {
        const novoArray = listaContas.map(item => { return { ...item, check: true } })
        setArrayGeral(novoArray)
  
  
      }
  
    }, [todos])




      function handleOptionChange(conta: string) {
        const novoLancamentos = arraygeral.map((item) => {
          if (item.conta === conta) {
            return { ...item, check: !item.check }; // Alternando o valor de check
          }
          return item;
        });
        setArrayGeral(novoLancamentos)
        // Filtrando apenas os itens com check verdadeiro
    
    
      }


      async function listarLancamentos() {
        setLoading(true)
        const response = await api.post('/financeiro/lancamentos', {
          dataInicial: startDate,
          dataFinal: endDate,
          conta: '1.0',
          todoPeriodo: todoPeriodo
        });
        const novoArray = response.data.planosdeContas.map((item: PlanoContasProps) => { return { ...item, check: true } })
        setArrayGeral(novoArray);
       
        setGrupos(response.data.grupos)
        // setContratosGeral(response.data.contratosGeral)
    
        setSomaConta(response.data.somaPorConta)
    
    
        setLoading(false)
      }
    
      async function handleListaLanc(conta: string, index: number) {
        setSubLista([])
        if (!abertos[index]) {
          try {
            const response = await api.post('/financeiro/listaLancamentos', {
              todoPeriodo: todoPeriodo,
              startDate: startDate,
              endDate: endDate,
              conta: conta
            })
            setSubLista(response.data)
    
          } catch (error) {
            console.log(error)
          }
    
        }
        return true
    
      }
    
    



    return(
        <div>
            <div className="flex flex-row w-full text-xs text-black justify-between  mb-1">
              <div className=" inline-flex  p-2 gap-4 bg-white rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col" >DESPESAS <span>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></h2>
              </div>
              <div className=" inline-flex  p-2 gap-4 bg-white rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiReceiveMoney size={25} /></div>
                <h2 className="flex flex-col" >RECEITAS <span>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></h2>
              </div>
              <div className=" inline-flex  p-2 gap-4 bg-white rounded-lg min-w-[180px]">

                <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><BiTransferAlt size={25} /></div>
                <h2 className="flex flex-col" >REMESSA + RECEITA <span>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></h2>
              </div>
              <div className=" inline-flex  p-2 gap-4 bg-white rounded-lg min-w-[180px]">

                <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaBalanceScale size={25} /></div>
                <h2 className={`flex flex-col`} >SALDO <span className={`font-semibold  ${(0) < 0 ? "text-red-600" : ""}`}>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></h2>
              </div>

            </div>


            <div className="flex  w-full bg-white px-4 mb-1 py-1 text-xs items-center justify-between rounded-sm  ">
              <label className="flex bg-gray-700 border p-1 rounded-lg border-gray-600" >FILTROS</label>


              <select value={setorSelect} onChange={e => {
                setSetor(Number(e.target.value))
              }} className="flex pt-1 pb-1 pl-2 pr-2  border rounded-lg  text-xs bg-gray-700 border-gray-600 placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500">
                <option value={0}>SETOR (TODOS)</option>

                {grupos?.map((item, index) => (
                  <option className="text-xs " key={index} value={item.id_grupo}>
                    {item.descricao}
                  </option>

                ))}
              </select>
              <div className="flex h-full relative w-1/4">
                <div onClick={() => setDropPlanos(!dropPlanos)}
                  className="flex w-full h-full justify-between items-center py-1.5 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-700 border-gray-600 placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500">

                  {todos ? 'TODOS' : 'PERSONALIZADO'}
                  <IoIosArrowDown />


                </div>

                {dropPlanos && <ul className="absolute  top-7 -left-1 max-h-64 overflow-y-auto  bg-gray-600 p-1 rounded-lg">
                  <li className="flex items-center px-2 py-1">
                    <input onChange={() => setTodos(!todos)} type="checkbox" checked={todos} />
                    <label className="ms-2  text-xs whitespace-nowrap  text-gray-300">TODOS</label>
                  </li>
                  {listaContas.map((item, index) => {
                    return (
                      <li className="flex items-center px-2 py-1">
                        <input onChange={() => handleOptionChange(item?.conta)} type="checkbox" checked={item?.check} value={item?.conta} />
                        <label className="ms-2  text-xs whitespace-nowrap text-gray-300">{item?.descricao.toUpperCase()}</label>
                      </li>
                    )
                  })}
                </ul>}



              </div>



              <div className="inline-flex  items-center  gap-3">
                <div className="flex items-center ">
                  <input type="checkbox" checked={todoPeriodo} onChange={() => setPeriodo(!todoPeriodo)} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                  <label className="ms-2  text-xs whitespace-nowrap  text-gray-600">TODO PERÍODO</label>
                </div>
                <DatePicker
                  disabled={todoPeriodo}
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={startDate}
                  onChange={(date) => date && setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="flex py-1 pl-2 text-xs  border rounded-lg   bg-gray-700 border-gray-600  "
                />
                <span>até</span>

                <DatePicker
                  disabled={todoPeriodo}
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={endDate}
                  onChange={(date) => date && setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className=" flex py-1 pl-2 text-xs  border rounded-lg  bg-gray-700 border-gray-600   "
                />

              </div>
              {!loading ? <button onClick={() => listarLancamentos()} className="inline-flex items-center justify-center bg-blue-600 p-1 rounded-lg text-xs gap-1">BUSCAR<IoSearch size={18} /></button> :
                <button className="inline-flex items-center justify-center bg-blue-600 p-1 rounded-lg text-xs gap-1">BUSCANDO..<AiOutlineLoading3Quarters size={20} className="animate-spin" /></button>
              }
            </div>
            <div className="flex flex-col text-black px-4 w-full overflow-y-auto max-h-[calc(100vh-210px)]  bg-white rounded-lg ">
              <ul className="flex flex-col w-full p-2 gap-1 text-sm">
                <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
                  <div className="inline-flex w-full items-center"><span className="flex w-full font-semibold">DESCRIÇÃO</span>
                    <div className="flex w-full gap-8  items-center">
                      <span className="flex w-full text-start whitespace-nowrap ">CONSUMO</span>
                      <span className="flex w-full text-start whitespace-nowrap">LIM. DE GASTOS</span>
                      <span className="flex w-full text-start whitespace-nowrap ">META</span>
                      <span className="flex w-full text-start whitespace-nowrap ">EQV. DE DESPESAS</span>
                      <span className="flex w-full justify-end  "></span>
                    </div>
                  </div>
                </li>
                {
                  listaContas?.map((nome, index) => {
                    //   const soma = nome?.lancamentos?.reduce((total, item) => {
                    //   if (item.conta === nome.conta) {
                    //     return total + Number(item.valor)
                    //   }
                    //   else {
                    //     return total
                    //   }
                    //   }, 0)
                    // let porc;
                    //  if (soma === 0 || nome?.metas[0]?.valor === 0 || soma === null || nome?.metas[0]?.valor === null || isNaN(Number(nome?.metas[0]?.valor))) {
                    //    porc = 0;
                    //  } else {
                    //    porc = (soma * 100) / Number(nome?.metas[0].valor);
                    //  }

                    return (
                      <li onClick={() => { handleListaLanc(nome.conta, index), toogleAberto(index) }} className={`flex flex-col w-full p-1.5 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-300" : "bg-slate-200"} uppercase cursor-pointer`}>
                        <div className="inline-flex w-full items-center"><span className="flex w-full font-semibold">{nome?.descricao}</span>
                          <div className="flex w-full gap-8  items-center">
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{somaPorConta.map((item, ind) => {
                              if (item.conta == nome?.conta && item.tipo !== null) {
                                return Number(item._sum.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
                              }
                            })}</span>
                           {/* <span className="flex w-full text-start whitespace-nowrap font-semibold">R$ {nome?.metas[0]?.valor ?? 0}</span>*/}
                            <span className="flex w-full text-start whitespace-nowrap"><span className="rounded-lg bg-red-500  p-1">{/*!Number.isNaN(porc) ? porc + '%' : '0%'*/}</span></span>
                            <span className="flex w-full text-start whitespace-nowrap"><span className="rounded-lg bg-blue-500  p-1">{/*!Number.isNaN(porc) ? porc + '%' : '0%'*/}</span></span>
                            <span className="flex w-full justify-end  "><IoIosArrowDown /></span>
                          </div>
                        </div>
                        {abertos[index] && <ul className="flex flex-col w-full gap-1  ml-6 ">
                          {subListaLanc?.map((lancamento, index) => {
                            return (
                              <li className="flex text-xs gap-2 "><span>{lancamento.historico}</span> Valor: R$ {lancamento.valor} / {subListaLanc.length}</li>
                            )
                          })

                          }
                        </ul>}
                      </li>
                    )
                  })
                }
              </ul>
            </div>


          </div>
    )
}