import Grafico from "@/components/graficos/primeirografico";
import { useContext, useEffect, useState } from "react";
import { GiExpense } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";
import { BiTransferAlt } from "react-icons/bi";
import { FaBalanceScale } from "react-icons/fa";
import { Button, Table, TableHead, TableHeadCell } from "flowbite-react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { api } from "@/services/apiClient";
import { toast } from "react-toastify";
import { IoIosArrowDown } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoIosAddCircle } from "react-icons/io";
import { MdSaveAlt } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdModeEditOutline } from "react-icons/md";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { AuthContext } from "@/contexts/AuthContext";
import { TbAlertTriangle } from "react-icons/tb";
import { FaRepeat } from "react-icons/fa6";

import {Caixa} from "@/components/financeiro/caixa";
import Conferencia from "../../components/financeiro/conferencia/conferencia";
import { PlanodeContas } from "@/components/financeiro/planodeContas";

interface DataProps {
  y: number,
  x: string,
  dt: Date
  z: number,
  c: number,
  cancelamentos: number
}

export interface PlanoContasProps {
  conta: string,
  id_grupo: number,
  descricao: string,
  tipo: string,
  saldo: number,
  perm_lanc: string,
  data: Date,
  hora: Date,
  usuario: string,
  contaf: string,
  check: boolean

  metas: Array<{
    id_meta: number,
    id_conta: string,
    id_grupo: number,
    descricao: string,
    valor: number,
    date: Date,
    grupo: {
      id_grupo: number,
      descricao: string
    }
  }>
}

export interface GruposProps {
  id_grupo: number,
  descricao: string
}

interface LancamentoProps {

  id_grupo: number,
  historico: string,
  valor: number,

}
interface ContratosProps {
  dt_adesao: Date,
  dt_cancelamento: Date
  _count: {
    dt_adesao: number,
    dt_cancelamento: number
  }
}


interface ResponseProps {
  mensalidade: Array<MensalidadeProps>
  contratosGeral: Array<ContratosProps>
}
type MensalidadeProps = {
  data: Date;
  _sum: { valor: number };
  _count: { data: number };
};

interface ContaProps {
  id_conta: number,
  dataprev: Date,
  dataLanc: Date,
  datapag: Date,
  dataReag: Date,
  tipo: string,
  status: string,
  descricao: string,
  valor: number,
  parcela: number,
  id_grupo: number,
  descricao_grupo: string,
  conta: string,
  descricao_conta: string
  tipo_conta: string
}

export interface CcustosProps{
  id_ccustos:number,
  descricao:string,
  image:string,
  check:boolean
}

export interface CaixaProps{
  
    lanc_id: number,
    num_seq: number,
    conta: string,
    ccustos_id: number,
    id_grupo: number,
    ccustos_desc: string,
    descricao: string,
    conta_n: number,
    data: Date,
    notafiscal: string,
    historico: string,
    tipo: string,
    valor: number,
    valorreal: number,
    valordolar: number,
    modo_inc: string,
    datalanc: Date,
    horalanc: Date,
    usuario: string,
    cod_mens: string,
    cod_conta: number,
    mensalidade:{
      banco_dest:string,
      data_pagto:Date,
      form_pagto:string
    }

}


export default function LoginFinaceiro() {
  const { usuario } = useContext(AuthContext)
  const [excluir, setExcluir] = useState<number>(0)

  const [despesas, setDespesas] = useState<number>(0)
  const [receitas, setReceitas] = useState<number>(0)
  const [remessa, setRemessa] = useState<number>(0)
  const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
  const [grupos, setGrupos] = useState<Array<GruposProps>>()
  const [setorSelect, setSetor] = useState<number>(0)
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [endDate, setEndDate] = useState(new Date())
  const [startDateContas, setStartDateContas] = useState(new Date())
  const [endDateContas, setEndDateContas] = useState(new Date())
  const [todoPeriodo, setPeriodo] = useState(true)
  const [menuIndex, setMenuIndex] = useState(1)
 
  const [filtroatee, setFiltroAteE] = useState<number>(0)
  const [lancamentoFiltroMensalidade, setFiltroMensalidade] = useState<Array<DataProps>>([])
  const [lancamentoFiltroAtivos, setFiltroAtivos] = useState<Array<DataProps>>([])
  const [escalaDia, setDia] = useState(false)
  const [escalaMes, setMes] = useState(true)
  const [escalaAno, setAno] = useState(false)
  const [loading, setLoading] = useState(false)
  const [todos, setTodos] = useState(true)
  const [dropPlanos, setDropPlanos] = useState(false)
  const [modalButton, setModal] = useState(false)
  const [dadosConta, setDadosConta] = useState<Partial<ContaProps>>({})
  const [listaContas, setListaContas] = useState<Array<Partial<ContaProps>>>([])
  const [abertoFinalizado, setAbertoFinalizado] = useState<number>(1)
  const [ccustos,setCcustos] = useState<Array<CcustosProps>>([])
  const [caixa,setCaixa] = useState<Array<CaixaProps>>([])


  const [listaPlanoContas, setListaPlanoContas] = useState<Array<PlanoContasProps>>([])




  const reqPlanoConta = async()=>{
    try {
      const planoConta = await api.get('/financeiro/planoContas')


      setListaPlanoContas(planoConta.data)
    } catch (error) {
      
    }
  }


useEffect(()=>{
  reqPlanoConta()
},[])




















  const setarDadosConta = (fields: Partial<ContaProps>) => {
    setDadosConta((prev: Partial<ContaProps>) => {
      if (prev) {
        return { ...prev, ...fields }
      }
      else {
        return { ...fields }
      }
    })
  }


  const reqCcustos =async ()=>{
    try {
      const response = await api.get("/financeiro/caixa/listarCcustos")
      const dados: Array<CcustosProps> = response.data
      const array = dados.map(item=>{return {...item,check:true}})
   
       caixaReq(array,new Date(),new Date())
     setCcustos(array)
    } catch (error) {
      toast.error('Erro na requisição ccustos')
    }
 
   
  }


  const filtroMensalidade = async () => {
    // try{
    setLoading(true)
    const response = await api.post<ResponseProps>("/financeiro/filtroMensalidade", {
      dataInicial: startDate,
      dataFinal: endDate,
      filtroAteE: filtroatee,
      escalaDia,
      escalaMes,
      escalaAno,
    })
    console.log(response.data)
    const { mensalidade, contratosGeral } = response.data

    const timezone = 'America/Distrito_Federal';
    let dataLancamento: string;

    const resultado = mensalidade?.reduce((acumulador, atual) => {
      const dataLanc = new Date(new Date(atual.data).getUTCFullYear(), new Date(atual.data).getUTCMonth(), new Date(atual.data).getUTCDate())

      if (escalaDia) {
        dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'numeric',
          day: "numeric"
        });
      } else if (escalaMes) {
        dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'numeric',

        });
      } else if (escalaAno) {
        dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
          year: 'numeric',

        });
      }

      // const atualDate = dataLancTeste
      // const start = new Date(new Date(startDate).getUTCFullYear(), new Date(startDate).getUTCMonth(), new Date(startDate).getUTCDate())
      // const end = new Date(new Date(endDate).getUTCFullYear(), new Date(endDate).getUTCMonth(), new Date(endDate).getUTCDate())
      const valor = Number(atual._sum.valor)
      //&& dataLancTeste >= start && dataLancTeste <= end




      const itemExistente = acumulador.find((item) => item.x === dataLancamento);

      if (itemExistente) {

        itemExistente.y += Number(valor.toFixed(2));

        itemExistente.z += Number(atual._count.data);



      } else {
        acumulador.push({ x: dataLancamento, y: Number(valor.toFixed(2)), z: Number(atual._count.data), c: 0, dt: atual.data, cancelamentos: 0 });
      }


      return acumulador;
    }, [] as DataProps[]);
    const dataInicial = startDate;
    const dataFinal = endDate;
    let cumulativeSum = 0;
    const newArray = contratosGeral.map(item => {
      cumulativeSum += item._count.dt_adesao - item._count.dt_cancelamento;
    
     

      return { ...item, _count: { ...item._count, dt_adesao: cumulativeSum }, dt_adesao: item.dt_adesao };

    }).filter(item => item.dt_adesao >= dataInicial && item.dt_adesao <= dataFinal)
    // const novoArray = newArray.filter(item=>item.dt_adesao>=dataInicial&& item.dt_adesao<=dataFinal)

   /* const resultadoAtivos = newArray?.reduce((acumulador, atual) => {
      const dataLanc = new Date(atual?.dt_adesao)

      if (escalaDia) {
        dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'numeric',
          day: "numeric"
        });
      } else if (escalaMes) {
        dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'numeric',

        });
      } else if (escalaAno) {
        dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
          year: 'numeric',

        });
      }

      // const atualDate = dataLancTeste
      // const start = new Date(new Date(startDate).getUTCFullYear(), new Date(startDate).getUTCMonth(), new Date(startDate).getUTCDate())
      // const end = new Date(new Date(endDate).getUTCFullYear(), new Date(endDate).getUTCMonth(), new Date(endDate).getUTCDate())

      const itemExistente = acumulador.find((item) => item.x === dataLancamento);

      if (itemExistente) {

        //itemExistente.y += Number(valor.toFixed(2));

        itemExistente.z += 0;
        itemExistente.cancelamentos += atual?._count.dt_cancelamento
        itemExistente.c = atual?._count.dt_adesao

      } else {
        acumulador.push({ x: dataLancamento, y: 0, z: 0, c: atual?._count.dt_adesao, dt: atual?.dt_adesao, cancelamentos: atual?._count.dt_cancelamento });
      }
      return acumulador;
    }, [] as DataProps[]);


    /*   const resultadoFinal = resultado?.reduce((acumulador:Array<DataProps>, atual:DataProps) => {
         
          const mesExistente = acumulador.find(item => moment(item.dt).isSame(atual.dt, 'month'));
      
          if (!mesExistente) {
            const contratosG = response.data.contratosGeral.filter((item:ContratosProps) => {
              const anoContrato = moment(item.dt_adesao).tz(timezone).startOf('month');
              const anoAtual = moment(atual.dt).tz(timezone).startOf('month');
              return anoContrato.isSameOrBefore(anoAtual);
            });
      
            const contratosIN = response.data.contratosGeral.filter((item:ContratosProps) => {
              const anoContrato = moment(item.dt_cancelamento).tz(timezone).startOf('month');
              const anoAtual = moment(atual.dt).tz(timezone).startOf('month');
              return item.dt_cancelamento !== null && anoContrato.isSameOrBefore(anoAtual);
            });
      
            const cancelamentosMes = response.data.contratosGeral.reduce((acumulador:number,atual:ContratosProps) => {
            
              return acumulador+=Number(atual._count.dt_cancelamento)
            });
      
            acumulador.push({ x: atual.x, y: atual.y, z: atual.z, c: contratosG.length - contratosIN.length, dt: atual.dt, cancelamentos: cancelamentosMes.length });
          } else {
         acumulador.push({ x: atual.x, y: atual.y, z: atual.z, c: , dt: atual.dt, cancelamentos: atual.cancelamentos });
        }
      
          return acumulador;
       }, [] as DataProps[])*/


    setFiltroMensalidade(resultado)
  //  setFiltroAtivos(resultadoAtivos)
    setLoading(false)


  }


 

  let formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  /*useEffect(() => {
    /// const diaAtual = new Date()
    // setStartDate(new Date(diaAtual.getFullYear(),diaAtual.getMonth(),1))
    /* try {
       if (setorSelect === 0) {
         setLancamentos(arraygeral)
       }
        if (setorSelect !== 0 ) {
         const novoArray = arraygeral.map(item => {
           return {
             ...item,
             lancamentos: item.lancamentos.filter(dado => dado.id_grupo === setorSelect && new Date(dado.datalanc) >= startDate && new Date(dado.datalanc) <= endDate)
           }
         });
 
         setLancamentos(novoArray)
       }
      
   
 
 
     } catch (error) {
       toast.info('ERRO DE FILTRAGEM')
 
     }
 
 

  }, [setorSelect])*/



  


  async function contasReq() {
    try {
      const response =   await toast.promise(
        api.post('/conta/adicionar', {
          dataLanc: new Date(),
          dataprev: dadosConta.dataprev,
          descricao: dadosConta.descricao,
          tipo: dadosConta.tipo,
          valor: dadosConta.valor,
          parcelas: dadosConta.parcela
  
        }),
        {
          error: 'Erro ao realizar requisição',
          pending: 'Salvando Dados...',
          success: 'Dados salvos com sucesso'
        }
      )
      
    } catch (error) {
      toast.error('Erro')
    }

    

  }
  async function contaDelete() {
  const response =   await toast.promise(
      api.delete('/conta/deletar', {
        data: {
          id_conta: dadosConta.id_conta

        }

      }),
      {
        error: 'Erro ao Deletar',
        pending: 'Deletando Dados...',
        success: 'Dados Deletados com sucesso'
      }
    )
    const index = listaContas.findIndex(item=>item.id_conta===dadosConta.id_conta)
    const novoArray = [...listaContas]
    novoArray.splice(index,1);
    setListaContas(novoArray)

  }
  async function listarContasReq() {
    setLoading(true)
    const response = await api.post('/conta/listarContas', {
      dataInicial: new Date(startDateContas),
      dataFinal: new Date(endDateContas)
    })
    setListaContas(response.data)
    setLoading(false)
  }


  const caixaReq = async (array:Array<CcustosProps>,dataInicio:Date,dataFim:Date)=>{
    const response = await api.post('/financeiro/caixa/lancamentos',{
      array : array.map(item=>{if(item.check)return item.id_ccustos}).filter(item=>item),
      dataInicio,
      dataFim
    })
    setCaixa(response.data)
  }


  useEffect(() => {
    try {
   
   
      listarDados()
      listarContasReq()
        reqCcustos()
    
    } catch (error) {
      toast.error('Erro ao requitar dados!')

    }

  }, [])


  async function listarDados() {
    setLoading(true)
    const response = await api.post('/financeiro/lancamentos', {
      dataInicial: startDate,
      dataFinal: endDate,
      conta: '1.0',
      todoPeriodo: todoPeriodo
    });
    const novoArray = response.data.planosdeContas.map((item: PlanoContasProps) => { return { ...item, check: true } })
    //setArrayGeral(novoArray);
   // setLancamentos(response.data.planosdeContas);
    setGrupos(response.data.grupos)
    // setContratosGeral(response.data.contratosGeral)

   // setSomaConta(response.data.somaPorConta)


    setLoading(false)
  }










  async function lancarMovimentacao() {

    if (dadosConta.status === 'FINALIZADO' && (!dadosConta.descricao || !dadosConta.id_grupo || !dadosConta.conta)) {
      toast.warn('Preencha todos os campos obrigatórios')
      return;
    }

    try {
      const contaAtualizada = await toast.promise(
        api.put('/conta/editar', {
          id_conta: Number(dadosConta.id_conta),
          datapag: dadosConta.status === 'FINALIZADO' ? new Date() : null,
          dataLanc: dadosConta.dataLanc,
          dataReag: dadosConta.dataReag,
          dataprev: dadosConta.dataprev,
          descricao: dadosConta.descricao,
          tipo: dadosConta.tipo,
          status: dadosConta.status,
          valor: dadosConta.valor,
          parcelas: dadosConta.parcela,
        }),
        {
          error:'Erro ao alterar conta',
          pending:'Alterando conta..',
          success:'Conta alterada com sucesso!'
        }
      ) 
      if (contaAtualizada && dadosConta.status === 'FINALIZADO') {
        await toast.promise(
          api.post('/novoLancamento', {
            id_usuario: Number(usuario?.id),
            id_grupo: Number(dadosConta.id_grupo),
            datalanc: new Date(),
            conta: dadosConta.conta,
            conta_n: dadosConta.conta,
            descricao: dadosConta.descricao_conta,
            historico: dadosConta.descricao?.toUpperCase(),
            valor: dadosConta.valor,
            usuario: usuario?.nome.toUpperCase(),
            data: new Date(),
            tipo: dadosConta.tipo_conta,
            cod_conta: dadosConta.id_conta
          }),
          {
            error: 'Erro realizar Lançamento no Caixa',
            pending: 'Realizando Lançamento no Caixa',
            success: 'Lançado com sucesso!'
          }
        )

      }

    } catch (error) {

    }
    await listarContasReq()
  }










  return (
    <>
      <div className="flex text-white">
      


        <div className="flex flex-col  px-4 w-full ">
          <ul className="flex flex-wrap mb-1 text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 "  >
          <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(1)} className={`inline-block p-2 border-blue-600 rounded-t-lg hover:border-b-[1px]  hover:text-gray-300  `}>Caixa</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(2)} className={`inline-block p-2 border-blue-600 rounded-t-lg hover:border-b-[1px]  hover:text-gray-300  `}>Plano de Contas</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(3)} className={`inline-block p-2 border-blue-600  hover:border-b-[1px]  rounded-t-lg   hover:text-gray-300  `}>Gráficos</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(4)} className={`inline-block p-2  rounded-t-lg border-blue-600  hover:border-b-[1px]  hover:text-gray-300  `}>Contas a Pagar/Receber</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(5)} className={`inline-block p-2  rounded-t-lg border-blue-600  hover:border-b-[1px]  hover:text-gray-300  `}>Conferência de Caixa</button>
            </li>

          </ul>


          {menuIndex===5 && <Conferencia />}

          {menuIndex===1 && <Caixa handleFiltro={caixaReq} setCaixa={setCaixa} setCcustos={setCcustos} arrayCaixa={caixa} arrayCcustos={ccustos}/>}

          {menuIndex === 2 && <PlanodeContas listaContas={listaPlanoContas}/>}

          {menuIndex === 3 && <div className="flex flex-col p-2 bg-gray-50  ml-2 w-full overflow-y-auto h-[calc(100vh-120px)]  rounded-lg ">
            <div className="flex w-full text-black border-b-[1px] border-gray-500 px-4 mb-1 py-1 text-xs items-center justify-between rounded-sm  ">
              <label className="flex bg-gray-300 border p-1 rounded-lg border-gray-400" >FILTROS</label>

              <div className="inline-flex  items-center w-full justify-end mr-4 gap-3">

                <DatePicker
                  showMonthDropdown
                  showYearDropdown
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={startDate}
                  onChange={(date) => date && setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="flex py-1 pl-2 text-xs text-black  border rounded-lg  bg-gray-100 border-gray-300    "
                />

                <div className="flex items-center ">
                  <input type="checkbox" checked={filtroatee === 0} onChange={() => filtroatee === 0 ? setFiltroAteE(1) : setFiltroAteE(0)} className="w-3 h-3 text-blue-600  rounded    bg-gray-300 border-gray-400" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-700">ATÉ</label>
                </div>
                <span>/</span>
                <div className="flex items-center ">
                  <input type="checkbox" checked={filtroatee === 1} onChange={() => filtroatee === 1 ? setFiltroAteE(0) : setFiltroAteE(1)} className="w-3 h-3 text-blue-600  rounded    bg-gray-300 border-gray-400" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-700">E</label>
                </div>

                <DatePicker
                  showMonthDropdown
                  showYearDropdown
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={endDate}
                  onChange={(date) => date && setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className=" flex py-1 pl-2 text-xs text-black  border rounded-lg  bg-gray-100 border-gray-300   "
                />

              </div>
              <div className="inline-flex gap-4">
                <span className="flex items-center">ESCALA:</span>
                <div className="flex items-center ">
                  <input type="checkbox" checked={escalaDia} onChange={() => { setDia(true), setMes(false), setAno(false) }} className="w-3 h-3 text-blue-600  rounded    bg-gray-300 border-gray-400" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-700">DIA</label>
                </div>
                <div className="flex items-center ">
                  <input type="checkbox" checked={escalaMes} onChange={() => { setDia(false), setMes(true), setAno(false) }} className="w-3 h-3 text-blue-600  rounded    bg-gray-300 border-gray-400" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-700">MÊS</label>
                </div>
                <div className="flex items-center ">
                  <input type="checkbox" checked={escalaAno} onChange={() => { setDia(false), setMes(false), setAno(true) }} className="w-3 h-3 text-blue-600  rounded    bg-gray-300 border-gray-400" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-700">ANO</label>
                </div>
            <Button size={'sm'} isProcessing={loading} onClick={() => filtroMensalidade()}>BUSCAR<IoSearch size={18} /></Button> 
                 
               

              </div>
            </div>
            <div className="flex flex-row h-full justify-center w-full">
              <div className="flex flex-col h-full justify-center w-1/2">
                {lancamentoFiltroMensalidade?.length > 0 && <Grafico
                  lancamentos={lancamentoFiltroMensalidade}
                  completo={true}
                />}
              </div>
              <div className="flex flex-col h-full justify-center w-1/2">
                {
                  lancamentoFiltroAtivos?.length > 0 && <Grafico
                    lancamentos={lancamentoFiltroAtivos}
                    completo={false}

                  />

                }

              </div>


            </div>

          </div>}

          {menuIndex === 4 && <> <div className="flex flex-col px-2  gap-2 w-full overflow-y-auto h-[calc(100vh-120px)] text-white  rounded-lg ">
            <div className="flex flex-row gap-10 text-sm w-full px-2 justify-between  " id="Area Resumo/Filtro">
              <div className=" inline-flex text-white p-2 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col" >TOTAL A PAGAR <span>{formatter.format(despesas)}</span></h2>
              </div>

              <div className=" inline-flex text-white p-2 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col" >TOTAL A RECEBER <span>{formatter.format(despesas)}</span></h2>
              </div>

              <div className=" inline-flex text-white p-2 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col" >REAGENDADOS<span>{formatter.format(despesas)}</span></h2>
              </div>


            </div>

            <div className="flex  w-full bg-[#2b2e3b] px-4 mb-1 py-1 text-xs items-center justify-between rounded-sm  ">
              <label className="flex bg-gray-700 border p-1 rounded-lg border-gray-600" >FILTROS</label>
              <div className="inline-flex  items-center  gap-3">
                <div className="flex items-center ">
                  <input type="checkbox" checked={abertoFinalizado === 1} onChange={() => { abertoFinalizado === 1 ? setAbertoFinalizado(0) : setAbertoFinalizado(1) }} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-300">ABERTO</label>
                </div>
                <div className="flex items-center ">
                  <input type="checkbox" checked={abertoFinalizado === 2} onChange={() => { abertoFinalizado === 2 ? setAbertoFinalizado(0) : setAbertoFinalizado(2) }} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-300">FINALIZADO</label>
                </div>
                <DatePicker
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={startDateContas}
                  onChange={(date) => date && setStartDateContas(date)}
                  selectsStart
                  startDate={startDateContas}
                  endDate={endDateContas}
                  className="flex py-1 pl-2 text-xs  border rounded-lg   bg-gray-700 border-gray-600  text-white"
                />
                <span>até</span>

                <DatePicker
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={endDateContas}
                  onChange={(date) => date && setEndDateContas(date)}
                  selectsEnd
                  startDate={startDateContas}
                  endDate={endDateContas}
                  minDate={startDateContas}
                  className=" flex py-1 pl-2 text-xs  border rounded-lg  bg-gray-700 border-gray-600  text-white "
                />

              </div>
              {
                !loading ? <button onClick={() => listarContasReq()} className="inline-flex items-center justify-center bg-blue-600 p-1 rounded-lg text-xs gap-1">BUSCAR<IoSearch size={18} /></button> :
                  <button className="inline-flex items-center justify-center bg-blue-600 p-1 rounded-lg text-xs gap-1">BUSCANDO..<AiOutlineLoading3Quarters size={20} className="animate-spin" /></button>
              }
              <button onClick={() => setModal(true)} className="inline-flex p-1 gap-1 items-center bg-green-600 rounded-lg" ><IoIosAddCircle size={20} /> NOVO</button>
            </div>
            {excluir === 1 && (<div id="excluir lancamento" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="flex items-center justify-center p-2 w-full h-full">
                <div className="relative rounded-lg shadow bg-gray-800">
                  <button type="button" onClick={() => setExcluir(0)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                    <button type="button" onClick={() => setExcluir(0)} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                      <IoIosClose size={30} />
                    </button>
                  </button>
                  <div className="p-4 md:p-5 text-center">
                    <div className="flex w-full justify-center items-center">
                      <TbAlertTriangle className='text-gray-400' size={60} />
                    </div>
                    <h3 className="mb-5 text-lg font-normal  text-gray-400">Realmente deseja deletar esse lançamento ?</h3>

                    <button onClick={() => contaDelete()} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none  focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                      Sim, tenho certeza
                    </button>
                    <button onClick={() => setExcluir(0)} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
                  </div>
                </div>
              </div>
            </div>)}



            {/*excluir === 2 && (<div id="Lançar conta no caixa" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="flex items-center justify-center p-2 w-full h-full">
                <div className="relative rounded-lg shadow bg-gray-800">
                  <button type="button" onClick={() => setExcluir(0)} className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                    <button type="button" onClick={() => setExcluir(0)} className="text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                      <IoIosClose size={30} />
                    </button>
                  </button>
                  <div className="p-4 md:p-5 text-center">
                    <div className="flex w-full justify-center items-center">
                      <TbAlertTriangle className='text-gray-400' size={60} />
                    </div>
                    <h3 className="mb-5 text-lg font-normal  text-gray-400">{dadosConta.status==='FINALIZADO'?'SELECIONE OS DETALHES DO LANÇAMENTO':'REALMENTE DESEJA REALIZAR O ESTORNO ?'}</h3>
                   {dadosConta.status ==='FINALIZADO' && <div className="flex flex-col w-full gap-3 mb-2">


                      <select defaultValue={dadosConta.id_grupo} onChange={e => {
                        const item = grupos?.find(item => item.id_grupo === Number(e.target.value))

                        setarDadosConta({ ...dadosConta, id_grupo: Number(item?.id_grupo), descricao_grupo: item?.descricao })
                      }

                      } className="block  pt-1 pb-1.5 w-full pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                        <option value={''}>SETOR</option>
                        {grupos?.map((item, index) => (
                          <option key={index} value={item.id_grupo}>{item.descricao}</option>

                        ))
                        }


                      </select>

                      <select defaultValue={dadosConta.descricao_conta} onChange={e => {
                        const item = arraygeral.find(item => item.conta === e.target.value)
                        setarDadosConta({ ...dadosConta, conta: item?.conta, descricao_conta: item?.descricao, tipo_conta: item?.tipo })
                      }} className="block  pt-1 pb-1.5 w-full pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                        <option value={''}>PLANO DE CONTA</option>
                        {arraygeral?.map((item, index) => (
                          <option key={index} value={item.conta}>{item.descricao}</option>
                        ))}
                      </select>


                    </div>}


                    <button onClick={() => lancarMovimentacao()} data-modal-hide="popup-modal" type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                      {dadosConta.status==='FINALIZADO'?'LANÇAR':'Sim, tenho certeza'}
                    </button>
                    <button onClick={() => setExcluir(0)} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
                  </div>
                </div>
              </div>
            </div>)*/}

            <div className="flex flex-col  px-4 w-full overflow-y-auto max-h-[calc(100vh-210px)] text-white bg-[#2b2e3b] rounded-lg ">
              <ul className="flex flex-col w-full p-2 gap-1 text-sm">
                <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] ">
                  <div className="inline-flex w-full items-center">
                    <div className="flex w-full gap-8  items-center">
                      <span className="flex w-full font-semibold">DESCRIÇÃO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">TIPO</span>
                      <span className="flex w-full text-start whitespace-nowrap">VALOR</span>
                      <span className="flex w-full text-start whitespace-nowrap ">DATA PREVISTA</span>
                      <span className="flex w-full text-start whitespace-nowrap ">REAGENDADO PARA</span>
                      <span className="flex w-full text-start whitespace-nowrap ">DATA PAG.</span>
                      <span className="flex w-full text-start whitespace-nowrap ">STATUS</span>
                      <span className="flex w-full text-start whitespace-nowrap justify-end ">AÇÕES</span>
                    </div>
                  </div>
                </li>
                {
                  listaContas?.map((item, index) => {
                    return (
                      <li className={`flex flex-col w-full p-1 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-700" : "bg-slate-600"} uppercase cursor-pointer`}>
                        <div className="inline-flex w-full items-center">
                          <div className="flex w-full gap-8  items-center">
                            <span className="flex w-full font-semibold">{item.descricao}</span>
                            <span className="inline-flex w-full text-start whitespace-nowrap"><span className={`inline-flex  rounded-lg ${item.tipo == 'PAGAR' ? "bg-red-500" : "bg-green-500"}   p-1`}>{item.tipo}</span></span>
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{formatter.format(Number(item.valor))}</span>
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.dataprev && new Date(new Date(item.dataprev).getUTCFullYear(), new Date(item.dataprev).getUTCMonth(), new Date(item.dataprev).getUTCDate()).toLocaleDateString('pt-BR')}</span>
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.dataReag && new Date(new Date(item.dataReag).getUTCFullYear(), new Date(item.dataReag).getUTCMonth(), new Date(item.dataReag).getUTCDate()).toLocaleDateString('pt-BR')}</span>
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{item.datapag && new Date(new Date(item.datapag).getUTCFullYear(), new Date(item.datapag).getUTCMonth(), new Date(item.datapag).getUTCDate()).toLocaleDateString('pt-BR')}</span>
                            <span className="inline-flex w-full text-start whitespace-nowrap"><span className={`inline-flex  rounded-lg ${item.status == 'ABERTO' ? "bg-yellow-500" : "bg-green-500"}   p-1`}>{item.status}</span></span>
                            <div className="inline-flex w-full text-start justify-end whitespace-nowrap">
                              <button onClick={() => { setDadosConta({ id_conta: item.id_conta }), setExcluir(1) }} className="rounded-lg text-red-600 hover:bg-gray-300 p-1"><MdDelete size={18} /></button>
                              <button className="rounded-lg text-blue-500 hover:bg-gray-300 p-1"><MdModeEditOutline size={18} /></button>
                              {item.status === 'FINALIZADO' ? <button onClick={() => {
                                setarDadosConta({
                                  ...dadosConta,
                                  dataLanc: item.dataLanc,
                                  descricao: item.descricao,
                                  tipo: item.tipo,
                                  status: 'ABERTO',
                                  valor: item.valor,
                                  id_conta: item.id_conta,
                                  dataprev: item.dataprev,
                                  dataReag: item.dataReag
                                });
                                 setExcluir(2)
                              

                              }}
                                className="rounded-lg text-yellow-500 hover:bg-gray-300 p-1">
                                <FaRepeat size={15} />
                              </button> :
                               <button onClick={() => {
                                setarDadosConta({
                                  ...dadosConta,
                                  dataLanc: item.dataLanc,
                                  descricao: item.descricao,
                                  tipo: item.tipo,
                                  status: 'FINALIZADO',
                                  valor: item.valor,
                                  id_conta: item.id_conta,
                                  dataprev: item.dataprev,
                                  dataReag: item.dataReag
                                })
                                setExcluir(2)
                              }}
                                className="rounded-lg text-green-500 hover:bg-gray-300 p-1">
                                <IoCheckmarkDoneCircleSharp size={18} />
                              </button>}
                            </div>

                          </div>
                        </div>

                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>

            {modalButton &&
              <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[100%] max-h-full ">
                <div className="flex items-center justify-center p-2 w-full h-full bg-opacity-20 bg-gray-100 ">
                  <div className="fixed flex flex-col  w-2/4 p-4 rounded-lg  shadow bg-gray-800">
                    <button type="button" onClick={() => setModal(false)} className="absolute cursor-pointer top-0 right-0 text-gray-400 bg-transparent rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" >
                      <IoIosClose size={30} />
                    </button>
                    <form>

                      <label className="flex flex-row justify-start mb-4 border-b-[1px] text-lg border-gray-500 font-semibold mt-2 gap-2 text-white">NOVO LANÇAMENTO</label>


                      <div className="p-2   grid mt-2 w-full gap-2 grid-flow-row-dense grid-cols-4">
                        <div className="mb-1  col-span-1 w-full ">
                          <label className="block  mb-1 text-xs font-medium  text-white">TIPO</label>
                          <select value={dadosConta.tipo} onChange={e => setarDadosConta({ ...dadosConta, tipo: e.target.value })} className="block  pt-1 pb-1.5 w-full pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                            <option value={''}></option>
                            <option value={'PAGAR'}>PAGAR</option>
                            <option value={'RECEBER'}>RECEBER</option>
                          </select>

                        </div>
                        <div className="ml-2 justify-start ">
                          <label className="block w-full mb-1 text-xs font-medium  text-white">DATA PREVISTA</label>
                          <DatePicker selected={dadosConta.dataprev} onChange={e => e && setarDadosConta({ ...dadosConta, dataprev: e })} dateFormat={"dd/MM/yyyy"} locale={pt} required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
                        </div>

                        <div className="mb-1  col-span-1 w-full ">
                          <label className="block  mb-1 text-xs font-medium  text-white">PARCELAS</label>
                          <select defaultValue={dadosConta.parcela} onChange={e => setarDadosConta({ ...dadosConta, parcela: Number(e.target.value) })} className="block w-full pt-1 pb-1.5 pl-2 pr-2  border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
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
                          </select>

                        </div>


                        <div className="mb-1 col-span-4">
                          <label className="block mb-1 text-xs font-medium  text-white">DESCRIÇÃO</label>
                          <input type="text" value={dadosConta.descricao} onChange={e => setarDadosConta({ ...dadosConta, descricao: e.target.value })} className="block w-full  pt-1.5 pb-1.5 pl-2 pr-2  border  rounded-lg  sm:text-xs  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className="mb-1 col-span-1">
                          <label className="block mb-1 text-xs font-medium  text-white">VALOR</label>
                          <input value={dadosConta.valor} onChange={e => { setarDadosConta({ ...dadosConta, valor: Number(e.target.value) }) }} type="number" inputMode="decimal" className="block w-full  pt-1.5 pb-1.5 pl-2 pr-2 border rounded-lg  sm:text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div className=" gap-2 col-span-4  flex flex-row justify-end">


                          <button onClick={() => contasReq()} type="button" className="flex flex-row justify-center  bg-blue-600 rounded-lg p-2 gap-2 text-white"><MdSaveAlt size={22} />SALVAR</button>
                        </div>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
            }


          </>}
         
        </div>
      </div>

    </>

  )
}