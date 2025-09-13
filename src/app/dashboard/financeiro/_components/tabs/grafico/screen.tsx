
import { api } from "@/lib/axios/apiClient";
import {  Checkbox, Dropdown, Label, Modal, Spinner } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import useApi from "@/hooks/useApiPost";
import { EmpresaProps } from "@/types/empresa";
import { Button } from "@/components/ui/button";
import { ajustarData } from "@/utils/ajusteData";
import { Control, Controller, SubmitHandler, useForm, UseFormHandleSubmit, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ModalLoading } from "@/components/modalLoading";
import GraficoMensalidade from "@/app/dashboard/analyze/_components/graficoMensalidades";




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
  dataInicial: string|undefined,
  dataFinal: string|undefined,
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

interface FiltroProps{
  startDate:string|undefined,
  endDate:string|undefined,
  filtroAteE:number,
  selectEmpresa:Partial<EmpresaSelectProps>[]
  escala:EscalaProps,
}

export function GraficoScreen({ empresas }:
  {

    empresas: Array<EmpresaProps>

  }) {

  const [lancamentoFiltroMensalidade, setFiltroMensalidade] = useState<DataProps[]>([]);
  const [arrayGraf, setArrayGrafico] = useState<Array<Organizacao2>>([])
  const { data,  loading, postData } = useApi<ResponseProps, ApiProps>('/financeiro/filtroMensalidade')
  const {register,setValue,handleSubmit,watch,control} = useForm<FiltroProps>({
    defaultValues:{
      selectEmpresa:empresas,
      startDate:new Date(new Date().setDate(1)).toISOString(),
      endDate:new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).toISOString(),
      escala:{dia:false,mes:true,ano:false},

    }
  })

  const [open, setOpen] = useState<boolean>(false)


  
useEffect(()=>{
  filtroMensalidade({startDate:watch('startDate'),endDate:watch('endDate'),selectEmpresa:watch('selectEmpresa'),filtroAteE:watch('filtroAteE'),escala:watch('escala')})
},[])







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



  const tratarInad = useCallback(({ array, ativos }: { array: Array<InadimplenciaProps>, ativos: Array<AtivosProps> }) => {


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
    }).filter((item): item is { name: string; data: { x: string; y: number; z: number; }[] } => item !== undefined)

   data && setArrayGrafico(data)
  },[])


  const filtroMensalidade:SubmitHandler<FiltroProps> =useCallback(async (data) => {
   // console.log(data)
    setOpen(false)
    if(!data.startDate || !data.endDate) return
    const {dataIni,dataFim} = ajustarData(new Date(data.startDate),new Date(data.endDate))
    
    try {
     await postData({
        dataInicial: dataIni, dataFinal: dataFim, filtroAteE:data.filtroAteE, empresas: data.selectEmpresa?.map(item => {
          if (item.check) {
            return item.id
          }
        }).filter((item): item is string => item !== undefined), escalaDia:data.escala.dia, escalaMes: data.escala.mes, escalaAno: data.escala.ano
      })

    

    } catch (error) {
      console.log(error)
    }

  },[])

  useEffect(()=>{
    if(data?.mensalidade){
      CriarArrayGeral(data?.mensalidade)
    }
  },[data?.mensalidade])
  



  const CriarArrayGeral =useCallback((mensalidades: Array<MensalidadeProps>) => {
    const novo = mensalidades?.reduce((acc, at) => {
      const itemExistente = acc?.find(exists => exists.empresa === at.id_empresa)

      if (itemExistente) {
        itemExistente.data.push(at)
      }
      else {
        acc.push({ data: [{ ...at }], empresa: at.id_empresa })
      }

      return acc

    }, [] as Organizacao1[])

    //console.log(novo)

    arrayGrafico(novo)
  },[])


  const arrayGrafico = useCallback((array: Array<Organizacao1>) => {
    let dataLancamento: string;
    
    // Criar um Set para armazenar todas as datas únicas
    const todasAsDatas = new Set<string>();
  
    // Processar os dados e popular o Set com todas as datas
    const novo = array?.reduce((acc, at) => {
      const data = at.data.reduce((acumulador, atual) => {
        const dataLanc = new Date(atual.data);
  
        if (watch('escala.dia')) {
          dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'numeric',
            day: "numeric",
          });
        } else if (watch('escala.mes')) {
          dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
            timeZone: 'UTC',
            year: 'numeric',
            month: 'numeric',
          });
        } else if (watch('escala.ano')) {
          dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
            timeZone: 'UTC',
            year: 'numeric',
          });
        }
  
        todasAsDatas.add(dataLancamento); // Adiciona a data ao conjunto único de datas
  
        const valor = Number(atual._sum.valor);
        const itemExistente = acumulador.find((item) => item.x === dataLancamento);
  
        if (itemExistente) {
          itemExistente.y += Number(valor.toFixed(2));
          itemExistente.z += Number(atual._count.data);
        } else {
          acumulador.push({ x: dataLancamento, y: Number(valor.toFixed(2)), z: Number(atual._count.data) });
        }
  
        return acumulador;
      }, [] as DataProps[]);
  
      acc.push({ data: data, name: empresas.find((empresa) => empresa.id === at.empresa)?.nome ?? '' });
  
      return acc;
    }, [] as Array<Organizacao2>);
  
    // Converter o Set em um array ordenado de datas
  /*  const datasOrdenadas = Array.from(todasAsDatas).sort((a, b) => {
      const [diaA, mesA, anoA] = a.split('/').map(Number);
      const [diaB, mesB, anoB] = b.split('/').map(Number);
      return new Date(anoA, mesA - 1, diaA).getTime() - new Date(anoB, mesB - 1, diaB).getTime();
    });*/

   
  
    // Garantir que cada empresa tenha um ponto para cada data
    const dadosCompletos = novo?.map((empresa) => {
      const dadosPreenchidos = Array.from(todasAsDatas).map((data) => {
        const existente = empresa.data.find((d) => d.x === data);
        return existente || { x: data, y: 0, z: 0 }; // Se não houver dado para a data, colocar 0
      });
  
      return { name: empresa.name, data: dadosPreenchidos };
    });
  
    setArrayGrafico(dadosCompletos);
    //console.log(dadosCompletos);
  },[])
  









  return (<>
  {loading?<ModalLoading show={loading}/>:
    <div className="flex flex-col  py-2 px-4  text-black w-full">
<ModalFiltroGraf handleSubmit={handleSubmit} loading={loading} control={control} register={register} setValue={setValue} watch={watch} handleOnSubmit={filtroMensalidade} onClose={()=>setOpen(false)} show={open} />
        <Button onClick={()=>setOpen(true)} variant={'outline'} size={'sm'} className="ml-auto" type="button">Filtrar</Button>

  
       
     {Array.isArray(arrayGraf) && arrayGraf?.length > 0 && <GraficoMensalidade
        dados={arrayGraf}
      //completo={true}
      />}
  

  </div>}
  </>
  
  )
}



interface ModalProps {
 show:boolean,
 onClose:()=>void
 loading?:boolean
 setValue:UseFormSetValue<FiltroProps>
 watch:UseFormWatch<FiltroProps>
 register:UseFormRegister<FiltroProps>
 handleSubmit:UseFormHandleSubmit<FiltroProps>
 handleOnSubmit:SubmitHandler<FiltroProps>
 control:Control<FiltroProps,any>
}

export const ModalFiltroGraf = ({onClose,show,handleSubmit,register,setValue,loading,control,handleOnSubmit,watch}:ModalProps) =>{


  const handleEmpresa = (index: number) => {
    const empresas = watch('selectEmpresa')
    const novo = [...empresas];
    novo[index].check = !novo[index].check;
    setValue('selectEmpresa', novo);
  };
  
  return (
    <Modal size="md" show={show} onClose={onClose} popup>
      <Modal.Header/>
      <Modal.Body>
      
    <form onSubmit={handleSubmit(handleOnSubmit)} className="flex  flex-col gap-8 p-2 text-xs ">

      <Dropdown label="" dismissOnClick={false} renderTrigger={() => <span className="inline-flex  items-center justify-between gap-2 border-[1px] border-gray-300 bg-gray-100 p-2 rounded-lg ">{`SELECIONE`}<IoIosArrowDown /></span>}>
        {watch('selectEmpresa')?.map((item, index) => (
          <Dropdown.Item key={index}>    <div className="flex items-center gap-2">
            <Checkbox onChange={() => handleEmpresa(index)} checked={!!item.check} />
            <Label>{item.nome}</Label>
          </div></Dropdown.Item>
        ))}

      </Dropdown>
      <div className=" flex w-full justify-between gap-4">

        <Controller
        control={control}
          name="startDate"
          render={({field:{onChange,value}})=>
          (  <DatePicker
          showMonthDropdown
          showYearDropdown
          dateFormat={"dd/MM/yyyy"}
          locale={pt}
          selected={value?new Date(value):new Date()}
          onChange={(date) => date && onChange(date)}
          className="flex w-full py-2 text-xs pl-2 text-black  border rounded-lg  bg-gray-100 border-gray-300    "
        />)}/>
        
        <div className="flex items-center gap-2 text-xs">
          <Checkbox onChange={() => watch('filtroAteE') === 0 ? setValue('filtroAteE',1) : setValue('filtroAteE',0)} checked={watch('filtroAteE') === 0} />
          <Label className="text-xs">ATÉ</Label>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Checkbox onChange={() => watch('filtroAteE') === 1 ? setValue('filtroAteE',0) : setValue('filtroAteE',1)} checked={watch('filtroAteE') === 1} />
          <Label className="text-xs">E</Label>
        </div>

        <Controller
        control={control}
          name="endDate"
          render={({field:{onChange,value}})=>
          (  <DatePicker
          showMonthDropdown
          showYearDropdown
          dateFormat={"dd/MM/yyyy"}
          locale={pt}
          selected={value?new Date(value):new Date()}
          onChange={(date) => date && onChange(date)}
          className="flex w-full py-2 text-xs pl-2 text-black  border rounded-lg  bg-gray-100 border-gray-300    "
        />)
          
          }
        
        />
      </div>

      <div className="flex gap-4">
        <span className="flex items-center">ESCALA:</span>
        <div className="flex items-center ">
          <input type="checkbox" checked={watch('escala.dia')} onChange={() => { setValue('escala',{ dia: true, mes: false, ano: false }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
          <label className="ms-2   whitespace-nowrap text-gray-700">DIA</label>
        </div>
        <div className="flex items-center ">
          <input type="checkbox" checked={watch('escala.mes')} onChange={() => { setValue('escala',{ dia: false, mes: true, ano: false }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
          <label className="ms-2   whitespace-nowrap text-gray-700">MÊS</label>
        </div>
        <div className="flex items-center ">
          <input type="checkbox" checked={watch('escala.ano')} onChange={() => { setValue('escala',{ dia: false, mes: false, ano: true }) }} className="w-4 h-4 text-blue-600  rounded    bg-gray-300 border-gray-400" />
          <label className="ms-2   whitespace-nowrap text-gray-700">ANO</label>
        </div>
      </div>





      <Button type="submit" size={'default'} >
       { loading ? <Spinner />  :"Aplicar Filtro"}
      </Button>

    </form>
  
      </Modal.Body>
    </Modal>
  )
}








export function agruparMensalidadesPorMes(mensalidades: MensalidadeProps[]) {
  const dadosPorMes: Record<string, { valorTotal: number; quantidade: number }> = {};

  mensalidades.forEach(({ data, _sum, _count }) => {
    const dt = new Date(data);
    const mesAno = `${dt.getMonth() + 1}-${dt.getFullYear()}`; // Ex: "5-2025"

    if (!dadosPorMes[mesAno]) {
      dadosPorMes[mesAno] = { valorTotal: 0, quantidade: 0 };
    }

    dadosPorMes[mesAno].valorTotal +=Number( _sum.valor);
    dadosPorMes[mesAno].quantidade +=Number( _count.data);
  });

  // Transformar em array para o gráfico
  return Object.entries(dadosPorMes).map(([mesAno, { valorTotal, quantidade }]) => {
    const [mes, ano] = mesAno.split('-');
    return {
      mesAno: `${Number(mes).toString().padStart(2, '0')}/${ano}`,
      valorTotal,
      quantidade,
    };
  });
}
