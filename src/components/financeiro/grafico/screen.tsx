import GraficoMensalidade from "@/components/graficos/graficoMensalidades"
import { EmpresaProps } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { Button, Checkbox, Dropdown, Label, Popover, TextInput } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { IoSearch } from "react-icons/io5";
import { Item } from "@/components/dadosTitular";
import { BiCaretDown } from "react-icons/bi";
import { HiFilter } from "react-icons/hi";
import usePost from "@/hooks/usePost";

interface ContratosProps {
  dt_adesao: Date,
  dt_cancelamento: Date
  _count: {
    dt_adesao: number,
    dt_cancelamento: number
  }
}

interface EscalaProps {
  dia: boolean,
  mes: boolean,
  ano: boolean
}

interface EmpresaSelectProps {
  id: string;
  nome: string;
  check: boolean;
}


interface AtivosProps {
  id_empresa: string,
  _count: { id_contrato_global: number }
}


interface InadimplenciaProps {
  id_empresa: string,
  _count: { id_mensalidade_global: number }
}

type MensalidadeProps = {
  data: Date;
  id_empresa: string,
  _sum: { valor: number };
  _count: { data: number };
};

interface DataProps {
  y: number;
  x: string;
  // dt: Date|undefined;
  z: number;
  // c: number;
  // cancelamentos: number;
}

interface ApiProps {
  dataInicial: Date,
  dataFinal: Date,
  filtroAteE: number,
  empresas: Array<string> | undefined,
  escalaDia: boolean,
  escalaMes: boolean,
  escalaAno: boolean,
}


interface ResponseProps {
  mensalidade: Array<MensalidadeProps>;
  contratosGeral: Array<ContratosProps>;
}

interface Organizacao1 {
  empresa: string,
  data: Array<MensalidadeProps>
}
interface Organizacao2 {
  name: string,
  data: Array<DataProps>
}

export function GraficoScreen({ empresas }:
  {

    empresas: Array<EmpresaProps>

  }) {
  // const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() - 8, 1));
  const [endDate, setEndDate] = useState(new Date());
  const [filtroAteE, setFiltroAteE] = useState<number>(0);
  const [lancamentoFiltroMensalidade, setFiltroMensalidade] = useState<DataProps[]>([]);
  const [selectEmpresa, setSelectEmpresa] = useState<Partial<EmpresaSelectProps>[]>(empresas);
  const [escala, setEscala] = useState<EscalaProps>({ mes: true, dia: false, ano: false })
  const [arrayGraf, setArrayGrafico] = useState<Array<Organizacao2>>([])
  const { data, error, loading, postData } = usePost<ResponseProps, ApiProps>('/financeiro/filtroMensalidade')

  const [open, setOpen] = useState<boolean>(false)



  const inadimplencia = useCallback(async () => {
    try {

      const response = await api.get('/financeiro/filtroInadimplentes')

      const { ativos, inadFiltro }: { ativos: Array<AtivosProps>, inadFiltro: Array<InadimplenciaProps> } = response.data

      // console.log(inadFiltro)

      tratarInad({ array: inadFiltro, ativos })

    } catch (error) {
      console.log(error)
    }
  }, [])



  const tratarInad = ({ array, ativos }: { array: Array<InadimplenciaProps>, ativos: Array<AtivosProps> }) => {


    const data = array.reduce((acc, at) => {

      const itemExistente = acc.find(item => item.name === at.id_empresa)
      if (itemExistente) {
        itemExistente.quant += 1
      } else {
        acc.push({ name: at.id_empresa, quant: 1 })
      }

      return acc
    }, [] as Array<{ name: string, quant: number }>).map(item => {
      const name = empresas.find(it => item.name === it.id)
      const quantAtivos = ativos.find(it => item.name === it.id_empresa)

      const porc = quantAtivos?._count.id_contrato_global ? (item.quant / quantAtivos?._count.id_contrato_global) * 100 : 0

      return name ? { name: name?.nome, data: [{ x: '', y: porc, z: item.quant }] } : undefined
    }).filter(item => item !== undefined)

    setArrayGrafico(data)
  }


  const filtroMensalidade = useCallback(async () => {
    setArrayGrafico([])
    
    try {
     await postData({
        dataInicial: startDate, dataFinal: endDate, filtroAteE, empresas: selectEmpresa.map(item => {
          if (item.check) {
            return item.id
          }
        }).filter(item => item !== undefined), escalaDia: escala.dia, escalaMes: escala.mes, escalaAno: escala.ano
      })

      data?.mensalidade && CriarArrayGeral(data?.mensalidade)

    } catch (error) {
      console.log(error)
    }




    


  }, [startDate, endDate, filtroAteE, escala]
  )



  const CriarArrayGeral = (mensalidades: Array<MensalidadeProps>) => {
    const novo = mensalidades?.reduce((acc, at) => {
      const itemExistente = acc.find(exists => exists.empresa === at.id_empresa)

      if (itemExistente) {
        itemExistente.data.push(at)
      }
      else {
        acc.push({ data: [{ ...at }], empresa: at.id_empresa })
      }

      return acc

    }, [] as Organizacao1[])
    arrayGrafico(novo)
  }


  const arrayGrafico = (array: Array<Organizacao1>) => {
    let dataLancamento: string;
    const novo = array?.reduce((acc, at) => {

      const data = at.data.reduce((acumulador, atual) => {
        const dataLanc = new Date(atual.data)

        if (escala.dia) {
          dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'numeric',
            day: "numeric"
          });
        } else if (escala.mes) {
          dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'numeric',

          });
        } else if (escala.ano) {
          dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
            timeZone: 'UTC',
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
          acumulador.push({ x: dataLancamento, y: Number(valor.toFixed(2)), z: Number(atual._count.data) });
        }


        return acumulador;


      }, [] as DataProps[])

      acc.push({ data: data, name: at.empresa })

      return acc
    }, [] as Array<Organizacao2>).map(item => {
      const empresa = empresas.find(it => it.id === item.name)


      return empresa?.nome ? { name: empresa.nome, data: item.data } : undefined
    }).filter((item): item is Organizacao2 => item !== undefined)


    setArrayGrafico(novo)


  }






  const handleEmpresa = (index: number) => {
    const novo = [...selectEmpresa];
    novo[index].check = !novo[index].check;
    setSelectEmpresa(novo);
  };


  return (<div className="flex flex-col p-2 bg-gray-50   w-full overflow-y-auto h-[calc(100vh-120px)]  rounded-lg ">
    <div className="flex w-full text-black font-semibold border-b-[1px] border-gray-500 px-4 mb-1 py-1 text-xs items-center justify-between rounded-sm  ">



      <div className="inline-flex w-full gap-4 justify-end">


        <Popover
          theme={{ content: 'flex w-full z-10 overflow-hidden rounded-[7px]' }}
          aria-labelledby="area-popover"
          open={open}
          onOpenChange={setOpen}
          content={
            <div className="flex w-96 flex-col gap-4 p-2 text-sm ">

              <h2 id="area-popover" className="text-base text-gray-500">Filtro</h2>
              <Dropdown label="" dismissOnClick={false} renderTrigger={() => <span className="inline-flex w-full items-center justify-between gap-2 border-2 bg-gray-100 p-2 rounded-lg ">{`SELECIONAR EMPRESA(S)`}<IoIosArrowDown /></span>}>
                {selectEmpresa.map((item, index) => (
                  <Dropdown.Item key={index}>    <div className="flex items-center gap-2">
                    <Checkbox onChange={() => handleEmpresa(index)} checked={!!item.check} />
                    <Label>{item.nome}</Label>
                  </div></Dropdown.Item>
                ))}

              </Dropdown>
              <div className=" flex w-full justify-between">

                <div className="flex w-4/12">
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
                    className="flex w-full py-2 font-semibold pl-2 text-black  border rounded-lg  bg-gray-100 border-gray-300    "
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox onChange={() => filtroAteE === 0 ? setFiltroAteE(1) : setFiltroAteE(0)} checked={filtroAteE === 0} />
                  <Label>ATÉ</Label>
                </div>



                <div className="flex items-center gap-2">
                  <Checkbox onChange={() => filtroAteE === 1 ? setFiltroAteE(0) : setFiltroAteE(1)} checked={filtroAteE === 1} />
                  <Label>E</Label>
                </div>

                <div className="flex w-4/12">
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
                    className=" flex w-full font-semibold py-2 pl-2 text-black  border rounded-lg  bg-gray-100 border-gray-300   "
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex items-center">ESCALA:</span>
                <div className="flex items-center ">
                  <input type="checkbox" checked={escala.dia} onChange={() => { setEscala({ dia: true, mes: false, ano: false }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
                  <label className="ms-2   whitespace-nowrap text-gray-700">DIA</label>
                </div>
                <div className="flex items-center ">
                  <input type="checkbox" checked={escala.mes} onChange={() => { setEscala({ dia: false, mes: true, ano: false }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
                  <label className="ms-2   whitespace-nowrap text-gray-700">MÊS</label>
                </div>
                <div className="flex items-center ">
                  <input type="checkbox" checked={escala.ano} onChange={() => { setEscala({ dia: false, mes: false, ano: true }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
                  <label className="ms-2   whitespace-nowrap text-gray-700">ANO</label>
                </div>
              </div>





              <Button color="success" isProcessing={loading} onClick={() => filtroMensalidade()}>
                Aplicar Filtro
              </Button>

            </div>
          }
        >
          <Button color={'light'} theme={{ color: { light: 'border border-gray-300 bg-white text-gray-900  enabled:hover:bg-gray-100' } }} size={'sm'}>
            <HiFilter className="mr-2 w-4 h-4" />   Filtrar
          </Button>
        </Popover>




      </div>
    </div>

    <div className="flex flex-col h-full justify-center w-11/12">
      {arrayGraf?.length > 0 && <GraficoMensalidade
        dados={arrayGraf}
      //completo={true}
      />}
    </div>





  </div>)
}