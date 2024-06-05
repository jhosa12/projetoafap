import Grafico from "@/components/graficos/primeirografico";
import { useContext, useEffect, useState } from "react";
import { GiExpense } from "react-icons/gi";
import { GiReceiveMoney } from "react-icons/gi";
import { BiTransferAlt } from "react-icons/bi";
import { FaBalanceScale } from "react-icons/fa";
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

interface DataProps {
  y: number,
  x: string,
  dt: Date
  z: number,
  c: number,
  cancelamentos: number
}

interface PlanoContasProps {

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
interface GruposProps {
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

interface SomaValorConta {
  _sum: { valor: number },
  conta: string,
  tipo: string
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



export default function LoginFinaceiro() {
  const { usuario } = useContext(AuthContext)
  const [excluir, setExcluir] = useState<number>(0)
  const [lancar, setLancar] = useState<boolean>()
  const [listaLancamentos, setLancamentos] = useState<Array<PlanoContasProps>>([])
  const [subListaLanc, setSubLista] = useState<Array<LancamentoProps>>()
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
  const [arraygeral, setArrayGeral] = useState<Array<PlanoContasProps>>([])
  const [filtroatee, setFiltroAteE] = useState<number>(0)
  const [lancamentoFiltroMensalidade, setFiltroMensalidade] = useState<Array<DataProps>>([])
  const [lancamentoFiltroAtivos, setFiltroAtivos] = useState<Array<DataProps>>([])
  const [escalaDia, setDia] = useState(false)
  const [escalaMes, setMes] = useState(true)
  const [escalaAno, setAno] = useState(false)
  const [somaPorConta, setSomaConta] = useState<Array<SomaValorConta>>([])
  const [loading, setLoading] = useState(false)
  const [todos, setTodos] = useState(true)
  const [dropPlanos, setDropPlanos] = useState(false)
  const [modalButton, setModal] = useState(false)
  const [dadosConta, setDadosConta] = useState<Partial<ContaProps>>({})
  const [listaContas, setListaContas] = useState<Array<Partial<ContaProps>>>([])
  const [abertoFinalizado, setAbertoFinalizado] = useState<number>(1)

  const toogleAberto = (index: number) => {
    setAbertos((prev: { [key: number]: boolean }) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[Number(key)] = false;
        return acc;
      }, {} as { [key: number]: boolean }),
      [index]: !prev[index]
    }));
  };

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
    const dataInicial = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
    const dataFinal = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate());
    let cumulativeSum = 0;
    const newArray = contratosGeral.map(item => {
      cumulativeSum += item._count.dt_adesao - item._count.dt_cancelamento;
      const data = new Date(item.dt_adesao)
      const novaDate = new Date(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate())

      return { ...item, _count: { ...item._count, dt_adesao: cumulativeSum }, dt_adesao: novaDate };

    }).filter(item => item.dt_adesao >= dataInicial && item.dt_adesao <= dataFinal)
    // const novoArray = newArray.filter(item=>item.dt_adesao>=dataInicial&& item.dt_adesao<=dataFinal)

    const resultadoAtivos = newArray?.reduce((acumulador, atual) => {
      const dataLanc = new Date(new Date(atual?.dt_adesao).getUTCFullYear(), new Date(atual?.dt_adesao).getUTCMonth(), new Date(atual?.dt_adesao).getUTCDate())

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
    setFiltroAtivos(resultadoAtivos)
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

  let formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  useEffect(() => {
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
 
 */

  }, [setorSelect])


  async function contasReq() {
    await toast.promise(
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
    listarContasReq()

  }
  async function contaDelete() {
    await toast.promise(
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
    listarContasReq()

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


  useEffect(() => {
    try {
      listarDados()
      listarContasReq()



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
    setArrayGeral(novoArray);
    setLancamentos(response.data.planosdeContas);
    setGrupos(response.data.grupos)
    // setContratosGeral(response.data.contratosGeral)

    setSomaConta(response.data.somaPorConta)


    setLoading(false)
  }




  useEffect(() => {
    // const novoArray = arraygeral.flatMap(item => item.lancamentos)
    //  const arrayMensal = novoArray.filter(item => item.conta === '1.01.002')
    //   setArrayGrafico(arrayMensal)

    if (!todos) {
      const lancamentosFiltrados = arraygeral.filter((item) => item.check);
      setLancamentos(lancamentosFiltrados)

    }
    else {
      setLancamentos(arraygeral)
    }





  }, [arraygeral])

  useEffect(() => {
    if (!todos) {
      const novoArray = arraygeral.map(item => { return { ...item, check: false } })
      setArrayGeral(novoArray)

    }
    else {
      const novoArray = arraygeral.map(item => { return { ...item, check: true } })
      setArrayGeral(novoArray)


    }

  }, [todos])



  async function lancarMovimentacao() {

    if (!dadosConta.descricao || !dadosConta.id_grupo || !dadosConta.conta) {
      toast.warn('Preencha todos os campos obrigatórios')
      return;
    }

try {
  const contaAtualizada = await api.put('/conta/editar',{
    id_conta:Number(dadosConta.id_conta),
    datapag:dadosConta.status==='FINALIZADO'?new Date():null,
    dataLanc:dadosConta.dataLanc,
    dataReag:dadosConta.dataReag,
    dataprev:dadosConta.dataprev,
    descricao:dadosConta.descricao,
    tipo:dadosConta.tipo,
    status:dadosConta.status,
    valor:dadosConta.valor,
    parcelas:dadosConta.parcela,
  })
  if(contaAtualizada){
    await toast.promise(
      api.post('/novoLancamento', {
        id_usuario: Number(usuario?.id),
        id_grupo: Number(dadosConta.id_grupo),
        datalanc: new Date(),
        conta: dadosConta.conta,
        conta_n: dadosConta.conta,
        descricao: dadosConta.descricao_conta,
        historico: dadosConta.descricao.toUpperCase(),
        valor: dadosConta.valor,
        usuario: usuario?.nome.toUpperCase(),
        data: new Date(),
        tipo: dadosConta.tipo_conta
      }),
      {
        error: 'Erro realizar Lançamento',
        pending: 'Realizando Lançamento',
        success: 'Lançado com sucesso!'
      }
    )

  }
 
} catch (error) {
  
}
    await listarContasReq()
  }





  useEffect(() => {
    const receitasMap = listaLancamentos.reduce((acumulador, atual) => {
      const itemexistente = somaPorConta.find(item => item.conta === atual?.conta && item.tipo === 'RECEITA')
      if (itemexistente) {
        return acumulador + Number(itemexistente._sum.valor)

      }
      else {
        return acumulador
      }


    }, 0)

    setReceitas(receitasMap)


    const despesasMap = listaLancamentos.reduce((acumulador, atual) => {
      const itemexistente = somaPorConta.find(item => item.conta === atual?.conta && item.tipo === 'DESPESA')
      if (itemexistente) {
        return acumulador + Number(itemexistente._sum.valor)

      }
      else {
        return acumulador
      }


    }, 0)

    setDespesas(despesasMap)





    //  const calcDespesas = listaLancamentos?.reduce((acumuladorP, atualP) => {
    //  const total = atualP?.lancamentos?.reduce((acumulador, atual) => {
    //   if (atual?.tipo === 'DESPESA') {
    //    return Number(acumulador) + Number(atual?.valor)
    //   }
    //    else { return acumulador }
    //   }, 0)
    //  return acumuladorP + total
    //   }, 0)
    //  setDespesas(calcDespesas)
    /*  const calcReceitas = listaLancamentos?.reduce((acumuladorP, atualP) => {
        const total = atualP?.lancamentos.reduce((acumulador, atual) => {
          if (atual?.tipo === 'RECEITA') {
            return Number(acumulador) + Number(atual?.valor)
          }
          else { return acumulador }
        }, 0)
        return acumuladorP + total
  
      }, 0)
  
      setReceitas(calcReceitas)*/
  }, [listaLancamentos])


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


  return (
    <>
      <div className="flex text-white">
        {/*<div className="flex flex-col text-white p-6 pt-4 rounded-sm bg-[#2b2e3b] h-full">
        <h1>Filtros</h1>
        
<button  onClick={()=>setDropEmpresa(!dropEmpresa)} className=" text-white whitespace-nowrap  font-medium rounded-lg text-sm px-5 py-2.5 mb-1 text-center inline-flex items-center bg-[#343747] hover:bg-blue-700 focus:ring-blue-800" type="button">Selecione a Empresa<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
</svg>
</button>



{dropEmpresa && <div  className="z-10  w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
    <ul className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownCheckboxButton">
      <li>
        <div className="flex items-center">
          <input id="checkbox-item-1" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
          <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">AFAP CEDRO</label>
        </div>
      </li>
      <li>
        <div className="flex items-center">
            <input  id="checkbox-item-2" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
            <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">AFAP LAVRAS</label>
          </div>
      </li>
      <li>
        <div className="flex items-center">
          <input  type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
          <label  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">VIVA MAIS</label>
        </div>
      </li>
    </ul>
</div>}

<DatePicker dateFormat={"dd/MM/yyyy"} placeholderText="Data Inicio"  onChange={()=>{}} locale={"pt"} required className="block mb-2 mt-1 uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>  
<DatePicker dateFormat={"dd/MM/yyyy"} placeholderText="Data Fim"  onChange={()=>{}} locale={"pt"} required className="block mb-2 uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white "/>  
     
<button  onClick={()=>setDropEmpresa(!dropEmpresa)} className=" text-white whitespace-nowrap  font-medium rounded-lg text-sm px-5 py-2.5 mb-1 text-center inline-flex items-center bg-[#343747] hover:bg-blue-700 focus:ring-blue-800" type="button">Plano de Contas<svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
</svg>
</button>
   
    </div>*/}


        <div className="flex flex-col  px-4 w-full ">
          <ul className="flex flex-wrap mb-1 text-sm font-medium text-center  border-b  rounded-t-lg  border-gray-700 text-gray-400 "  >
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(1)} className={`inline-block p-2 border-blue-600 rounded-t-lg hover:border-b-[1px]  hover:text-gray-300  `}>Plano de Contas</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(2)} className={`inline-block p-2 border-blue-600  hover:border-b-[1px]  rounded-t-lg   hover:text-gray-300  `}>Gráficos</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(3)} className={`inline-block p-2  rounded-t-lg border-blue-600  hover:border-b-[1px]  hover:text-gray-300  `}>Contas a Pagar/Receber</button>
            </li>
            <li className="me-2">
              <button type="button" onClick={() => setMenuIndex(4)} className={`inline-block p-2  rounded-t-lg border-blue-600  hover:border-b-[1px]  hover:text-gray-300  `}>Convalescencia</button>
            </li>

          </ul>

          {menuIndex === 1 && <div>
            <div className="flex flex-row w-full text-xs justify-between  mb-1">
              <div className=" inline-flex text-white p-2 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col" >DESPESAS <span>{formatter.format(despesas)}</span></h2>
              </div>
              <div className=" inline-flex text-white p-2 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">
                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiReceiveMoney size={25} /></div>
                <h2 className="flex flex-col" >RECEITAS <span>{formatter.format(receitas)}</span></h2>
              </div>
              <div className=" inline-flex text-white p-2 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">

                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><BiTransferAlt size={25} /></div>
                <h2 className="flex flex-col" >REMESSA + RECEITA <span>R$ {remessa}</span></h2>
              </div>
              <div className=" inline-flex text-white p-2 gap-4 bg-[#2b2e3b] rounded-lg min-w-[180px]">

                <div className="flex items-center h-full rounded-lg bg-[#2a355a] text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaBalanceScale size={25} /></div>
                <h2 className={`flex flex-col`} >SALDO <span className={`font-semibold  ${(receitas - despesas) < 0 ? "text-red-600" : "text-white"}`}>{formatter.format(receitas - despesas)}</span></h2>
              </div>

            </div>


            <div className="flex  w-full bg-[#2b2e3b] px-4 mb-1 py-1 text-xs items-center justify-between rounded-sm  ">
              <label className="flex bg-gray-700 border p-1 rounded-lg border-gray-600" >FILTROS</label>


              <select value={setorSelect} onChange={e => {
                setSetor(Number(e.target.value))
              }} className="flex pt-1 pb-1 pl-2 pr-2  border rounded-lg  text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                <option value={0}>SETOR (TODOS)</option>

                {grupos?.map((item, index) => (
                  <option className="text-xs text-white" key={index} value={item.id_grupo}>
                    {item.descricao}
                  </option>

                ))}
              </select>
              <div className="flex h-full relative w-1/4">
                <div onClick={() => setDropPlanos(!dropPlanos)}
                  className="flex w-full h-full justify-between items-center py-1.5 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">

                  {todos ? 'TODOS' : 'PERSONALIZADO'}
                  <IoIosArrowDown />


                </div>

                {dropPlanos && <ul className="absolute  top-7 -left-1 max-h-64 overflow-y-auto  bg-gray-600 p-1 rounded-lg">
                  <li className="flex items-center px-2 py-1">
                    <input onChange={() => setTodos(!todos)} type="checkbox" checked={todos} />
                    <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">TODOS</label>
                  </li>
                  {arraygeral.map((item, index) => {
                    return (
                      <li className="flex items-center px-2 py-1">
                        <input onChange={() => handleOptionChange(item?.conta)} type="checkbox" checked={item?.check} value={item?.conta} />
                        <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">{item?.descricao.toUpperCase()}</label>
                      </li>
                    )
                  })}
                </ul>}



              </div>



              <div className="inline-flex  items-center  gap-3">
                <div className="flex items-center ">
                  <input type="checkbox" checked={todoPeriodo} onChange={() => setPeriodo(!todoPeriodo)} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">TODO PERÍODO</label>
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
                  className="flex py-1 pl-2 text-xs  border rounded-lg   bg-gray-700 border-gray-600  text-white"
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
                  className=" flex py-1 pl-2 text-xs  border rounded-lg  bg-gray-700 border-gray-600  text-white "
                />

              </div>
              {!loading ? <button onClick={() => listarDados()} className="inline-flex items-center justify-center bg-blue-600 p-1 rounded-lg text-xs gap-1">BUSCAR<IoSearch size={18} /></button> :
                <button className="inline-flex items-center justify-center bg-blue-600 p-1 rounded-lg text-xs gap-1">BUSCANDO..<AiOutlineLoading3Quarters size={20} className="animate-spin" /></button>
              }
            </div>
            <div className="flex flex-col  px-4 w-full overflow-y-auto max-h-[calc(100vh-210px)] text-white bg-[#2b2e3b] rounded-lg ">
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
                  listaLancamentos?.map((nome, index) => {
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
                      <li onClick={() => { handleListaLanc(nome.conta, index), toogleAberto(index) }} className={`flex flex-col w-full p-1 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-700" : "bg-slate-600"} uppercase cursor-pointer`}>
                        <div className="inline-flex w-full items-center"><span className="flex w-full font-semibold">{nome?.descricao}</span>
                          <div className="flex w-full gap-8  items-center">
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">{somaPorConta.map((item, ind) => {
                              if (item.conta == nome?.conta && item.tipo !== null) {
                                return formatter.format(Number(item._sum.valor))
                              }
                            })}</span>
                            <span className="flex w-full text-start whitespace-nowrap font-semibold">R$ {nome?.metas[0]?.valor ?? 0}</span>
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


          </div>}

          {menuIndex === 2 && <div className="flex flex-col p-2 bg-[#2b2e3b]  ml-2 w-full overflow-y-auto h-[calc(100vh-120px)] text-white  rounded-lg ">
            <div className="flex w-full border-b-[1px] border-gray-500 px-4 mb-1 py-1 text-xs items-center justify-between rounded-sm  ">
              <label className="flex bg-gray-700 border p-1 rounded-lg border-gray-600" >FILTROS</label>

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
                  className="flex py-1 pl-2 text-xs  border rounded-lg   bg-gray-700 border-gray-600  text-white"
                />

                <div className="flex items-center ">
                  <input type="checkbox" checked={filtroatee === 0} onChange={() => filtroatee === 0 ? setFiltroAteE(1) : setFiltroAteE(0)} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">ATÉ</label>
                </div>
                <span>/</span>
                <div className="flex items-center ">
                  <input type="checkbox" checked={filtroatee === 1} onChange={() => filtroatee === 1 ? setFiltroAteE(0) : setFiltroAteE(1)} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">E</label>
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
                  className=" flex py-1 pl-2 text-xs  border rounded-lg  bg-gray-700 border-gray-600  text-white "
                />

              </div>
              <div className="inline-flex gap-4">
                <span className="flex items-center">ESCALA:</span>
                <div className="flex items-center ">
                  <input type="checkbox" checked={escalaDia} onChange={() => { setDia(true), setMes(false), setAno(false) }} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">DIA</label>
                </div>
                <div className="flex items-center ">
                  <input type="checkbox" checked={escalaMes} onChange={() => { setDia(false), setMes(true), setAno(false) }} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">MÊS</label>
                </div>
                <div className="flex items-center ">
                  <input type="checkbox" checked={escalaAno} onChange={() => { setDia(false), setMes(false), setAno(true) }} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">ANO</label>
                </div>
                {!loading ? <button onClick={() => filtroMensalidade()} className="inline-flex items-center justify-center bg-blue-600 p-1 rounded-lg text-xs gap-1">BUSCAR<IoSearch size={18} /></button> :
                  <button className="inline-flex items-center justify-center bg-blue-600 p-1 rounded-lg text-xs gap-1">BUSCANDO..<AiOutlineLoading3Quarters size={20} className="animate-spin" /></button>
                }

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

          {menuIndex === 3 && <> <div className="flex flex-col px-2  gap-2 w-full overflow-y-auto h-[calc(100vh-120px)] text-white  rounded-lg ">
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
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">ABERTO</label>
                </div>
                <div className="flex items-center ">
                  <input type="checkbox" checked={abertoFinalizado === 2} onChange={() => { abertoFinalizado === 2 ? setAbertoFinalizado(0) : setAbertoFinalizado(2) }} className="w-3 h-3 text-blue-600  rounded    bg-gray-700 border-gray-600" />
                  <label className="ms-2  text-xs whitespace-nowrap text-gray-900 dark:text-gray-300">FINALIZADO</label>
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



            {excluir === 2 && (<div id="Lançar conta no caixa" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
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
                    <h3 className="mb-5 text-lg font-normal  text-gray-400">Selecione os detalhes do lancamento</h3>
                    <div className="flex flex-col w-full gap-3 mb-2">


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


                    </div>


                    <button onClick={() => lancarMovimentacao()} data-modal-hide="popup-modal" type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                      LANÇAR
                    </button>
                    <button onClick={() => setExcluir(0)} type="button" className=" focus:ring-4 focus:outline-none  rounded-lg border  text-sm font-medium px-5 py-2.5  focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600">Não, cancelar</button>
                  </div>
                </div>
              </div>
            </div>)}

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
                             {item.status==='FINALIZADO'? <button onClick={() => {
                                setarDadosConta({
                                  ...dadosConta,
                                  dataLanc: item.dataLanc,
                                  descricao: item.descricao,
                                  tipo: item.tipo,
                                  status: 'ABERTO',
                                  valor: item.valor,
                                  id_conta:item.id_conta,
                                  dataprev:item.dataprev,
                                  dataReag:item.dataReag
                                })
                                setExcluir(2)
                              }}
                                className="rounded-lg text-yellow-500 hover:bg-gray-300 p-1">
                                <FaRepeat size={16} />
                              </button>:<button onClick={() => {
                                setarDadosConta({
                                  ...dadosConta,
                                  dataLanc: item.dataLanc,
                                  descricao: item.descricao,
                                  tipo: item.tipo,
                                  status: 'FINALIZADO',
                                  valor: item.valor,
                                  id_conta:item.id_conta,
                                  dataprev:item.dataprev,
                                  dataReag:item.dataReag
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
                          <DatePicker selected={dadosConta.dataprev} onChange={e => e && setarDadosConta({ ...dadosConta, dataprev: e })} dateFormat={"dd/MM/yyyy"} locale={pt} required className="block uppercase w-full pb-1 pt-1 pr-2 pl-2 sm:text-sm  border  rounded-lg bg-gray-50  dark:bg-gray-700 border-gray-600 placeholder-gray-400 text-white " />
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