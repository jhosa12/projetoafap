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
import { PlanodeContas } from "@/components/financeiro/planodeContas/planodeContas";
import { ContasPagarReceber } from "@/components/financeiro/contasPagarReceber/contasPagarReceber";

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

  const [grupos, setGrupos] = useState<Array<GruposProps>>()
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


  const [dadosConta, setDadosConta] = useState<Partial<ContaProps>>({})
  const [listaContas, setListaContas] = useState<Array<Partial<ContaProps>>>([])

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
    const novoArray = response?.data?.planosdeContas?.map((item: PlanoContasProps) => { return { ...item, check: true } })
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

          {menuIndex===4 && <ContasPagarReceber planodeContas={listaPlanoContas} />}

          {menuIndex===1 && <Caixa handleFiltro={caixaReq} setCaixa={setCaixa} setCcustos={setCcustos} arrayCaixa={caixa} arrayCcustos={ccustos}/>}

          {menuIndex === 2 && <PlanodeContas setListaContas={setListaPlanoContas} listaContas={listaPlanoContas}/>}

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

         
         
        </div>
      </div>

    </>

  )
}