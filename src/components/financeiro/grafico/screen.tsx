import GraficoMensalidade from "@/components/graficos/graficoMensalidades"
import { EmpresaProps } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { Button, Checkbox, Dropdown, Label } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { IoSearch } from "react-icons/io5";
import { Item } from "@/components/dadosTitular";

interface ContratosProps {
    dt_adesao: Date,
    dt_cancelamento: Date
    _count: {
      dt_adesao: number,
      dt_cancelamento: number
    }
  }

interface EscalaProps{
    dia:boolean,
    mes:boolean,
    ano:boolean
}
  
interface EmpresaSelectProps {
    id: string;
    nome: string;
    check: boolean;
  }

  type MensalidadeProps = {
    data: Date;
    id_empresa:string,
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


  interface ResponseProps {
    mensalidade: Array<MensalidadeProps>;
    contratosGeral: Array<ContratosProps>;
  }

  interface Organizacao1{
    empresa:string,
    data:Array<MensalidadeProps>
  }
  interface Organizacao2{
    name:string,
    data:Array<DataProps>
  }

export  function GraficoScreen({empresas }:
    {
     
      empresas:Array<EmpresaProps>
    
    }){
        const [loading, setLoading] = useState(false);
        const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
        const [endDate, setEndDate] = useState(new Date());
        const [filtroAteE, setFiltroAteE] = useState<number>(0);
        const [lancamentoFiltroMensalidade, setFiltroMensalidade] = useState<DataProps[]>([]);
        const [selectEmpresa, setSelectEmpresa] = useState<Partial<EmpresaSelectProps>[]>(empresas);
        const [escala,setEscala] = useState<EscalaProps>({mes:true,dia:false,ano:false})
        const [arrayGraf,setArrayGrafico] = useState<Array<Organizacao2>>([])




        const inadimplencia =useCallback(async()=>{
                try {

                    const response = await api.get('/financeiro/filtroInadimplentes')

                    console.log(response.data)
                    
                } catch (error) {
                    console.log(error)
                }
        },[])

        useEffect(()=>{
            inadimplencia()
        },[])


        const filtroMensalidade = useCallback(async () => {
            setArrayGrafico([])
            setLoading(true)
            try {
                const response = await api.post<ResponseProps>("/financeiro/filtroMensalidade", {
                    dataInicial: startDate,
                    dataFinal: endDate,
                    filtroAteE: filtroAteE,
                    empresas:selectEmpresa.map(item=>{if(item.check){
                      return item.id
                    }}).filter(item=>item!==undefined),
                    escalaDia:escala.dia,
                    escalaMes:escala.mes,
                    escalaAno:escala.ano,
                  })

                  const { mensalidade, contratosGeral } = response.data
        
                  CriarArrayGeral(mensalidade)   
                
            } catch (error) {
                console.log(error)
            }
       
       
       
           
            setLoading(false)
        
        
          },[startDate,endDate,filtroAteE,escala]
        )



        const CriarArrayGeral=(mensalidades:Array<MensalidadeProps>)=>{
            const novo = mensalidades?.reduce((acc,at)=>{
                const itemExistente = acc.find(exists=>exists.empresa===at.id_empresa)

                if(itemExistente){
                    itemExistente.data.push(at)
                }
                else {
                    acc.push({data:[{...at}],empresa:at.id_empresa})
                }

                return acc

            }, [] as Organizacao1[] )
           arrayGrafico(novo)
        }


        const arrayGrafico= (array:Array<Organizacao1>)=>{
            let dataLancamento: string;
          const novo =   array?.reduce((acc,at)=>{

            const data = at.data.reduce((acumulador,atual)=>{
                const dataLanc = new Date(atual.data)
        
                if (escala.dia) {
                  dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
                  timeZone:'UTC',
                    year: 'numeric',
                    month: 'numeric',
                    day: "numeric"
                  });
                } else if (escala.mes) {
                  dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
                 timeZone:'UTC',
                    year: 'numeric',
                    month: 'numeric',
          
                  });
                } else if (escala.ano) {
                  dataLancamento = dataLanc.toLocaleDateString('pt-BR', {
                   timeZone:'UTC',
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
                  acumulador.push({ x: dataLancamento, y: Number(valor.toFixed(2)), z: Number(atual._count.data)});
                }
          
          
                return acumulador;
  

            },[] as DataProps[])

            acc.push({data:data,name:at.empresa})

                return acc
            }, [] as Array<Organizacao2>).map(item=>{
                const empresa = empresas.find(it=>it.id===item.name)

        
                return empresa?.nome ? {name:empresa.nome,data:item.data}:undefined
            }).filter((item):item is Organizacao2=>item!==undefined)


            setArrayGrafico(novo)
           

        }
        
        




          const handleEmpresa = (index: number) => {
            const novo = [...selectEmpresa];
            novo[index].check = !novo[index].check;
            setSelectEmpresa(novo);
          };


    return( <div className="flex flex-col p-2 bg-gray-50   w-full overflow-y-auto h-[calc(100vh-120px)]  rounded-lg ">
        <div className="flex w-full text-black font-semibold border-b-[1px] border-gray-500 px-4 mb-1 py-1 text-xs items-center justify-between rounded-sm  ">
          <label className="flex bg-gray-300 border p-1 rounded-lg border-gray-400" >FILTROS</label>

          <div className="inline-flex  font-semibold items-center w-full justify-end mr-4 gap-3">

          <Dropdown label="" dismissOnClick={false} renderTrigger={() => <span className="inline-flex items-center gap-2 border-2 bg-gray-100 p-2 rounded-lg">{`SELECIONAR EMPRESA(S)`}<IoIosArrowDown/></span>}>
{selectEmpresa.map((item,index)=>(
<Dropdown.Item  key={index}>    <div className="flex items-center gap-2">
<Checkbox onChange={()=>handleEmpresa(index)} checked={!!item.check}/>
<Label>{item.nome}</Label>
</div></Dropdown.Item>
)) }

</Dropdown>

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
              className="flex py-2 font-semibold pl-2 text-xs text-black  border rounded-lg  bg-gray-100 border-gray-300    "
            />
<div className="flex items-center gap-2">
<Checkbox onChange={() => filtroAteE === 0 ? setFiltroAteE(1) : setFiltroAteE(0)} checked={filtroAteE === 0}/>
<Label>ATÉ</Label>
</div>
          
            <span>/</span>

            <div className="flex items-center gap-2">
<Checkbox onChange={() => filtroAteE === 1 ? setFiltroAteE(0) : setFiltroAteE(1)}  checked={filtroAteE === 1}/>
<Label>E</Label>
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
              className=" flex font-semibold py-2 pl-2 text-xs text-black  border rounded-lg  bg-gray-100 border-gray-300   "
            />

          </div>
          <div className="inline-flex gap-4">
            <span className="flex items-center">ESCALA:</span>
            <div className="flex items-center ">
              <input type="checkbox" checked={escala.dia} onChange={() => {setEscala({dia:true,mes:false,ano:false})}} className="w-3 h-3 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2  text-xs whitespace-nowrap text-gray-700">DIA</label>
            </div>
            <div className="flex items-center ">
              <input type="checkbox" checked={escala.mes} onChange={() => {setEscala({dia:false,mes:true,ano:false})}} className="w-3 h-3 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2  text-xs whitespace-nowrap text-gray-700">MÊS</label>
            </div>
            <div className="flex items-center ">
              <input type="checkbox" checked={escala.ano} onChange={() => {setEscala({dia:false,mes:false,ano:true})}} className="w-3 h-3 text-blue-600  rounded    bg-gray-300 border-gray-400" />
              <label className="ms-2  text-xs whitespace-nowrap text-gray-700">ANO</label>
            </div>
        <Button size={'sm'} isProcessing={loading} onClick={() => filtroMensalidade()}>BUSCAR<IoSearch size={18} /></Button> 
             
           

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