
import { useCallback, useState } from "react"
import { BiTransferAlt } from "react-icons/bi"
import { FaBalanceScale } from "react-icons/fa"
import { GiExpense, GiReceiveMoney } from "react-icons/gi"
import { IoIosArrowDown } from "react-icons/io"
import { IoSearch } from "react-icons/io5"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { api } from "@/lib/axios/apiClient"
import { Button, Card, Checkbox, Dropdown, Label, Select } from "flowbite-react"
import { FiAlertTriangle } from "react-icons/fi";
import { SubmitHandler, useForm } from "react-hook-form"
import { EmpresaProps } from "@/types/empresa"
import { ajustarData } from "@/utils/ajusteData"
import { LancamentosProps } from "@/app/dashboard/caixa/_types/types"
import { GruposProps, PlanoContasProps } from "../../../page"




interface SomaValorConta {
  _sum: { valor: number },
  conta: string,
  tipo: string,
  _count:{conta:number}
}

interface MetaProps{
  conta:string,
  metas:Array<{valor:number}>
}

interface DataProps{
  listaContas:Array<PlanoContasProps>
  setListaContas:(array:Array<PlanoContasProps>)=>void
  empresas:Array<EmpresaProps>
}

interface TotalProps{
  despesa:number,
  receita:number,
}

interface FiltroFormProps{
  setor:number,
  id_empresa:string,
  startDate:Date,
  endDate:Date
}



export function PlanodeContas({listaContas,setListaContas,empresas}:DataProps){
  const [subListaLanc, setSubLista] = useState<Array<LancamentosProps>>()
    const [setorSelect, setSetor] = useState<number>(0)
    const [gruposSelect, setGruposSelect] = useState<Array<GruposProps>>()
    const [resumoConta, setResumoConta] = useState<Array<SomaValorConta>>([])
    const [loading,setLoading] = useState(false)
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
    const [metas,setMetas] = useState<Array<MetaProps>>([])
    const [total,setTotal] = useState<TotalProps>({despesa:0,receita:0})

const {watch,setValue,handleSubmit,register} = useForm<FiltroFormProps>({
  defaultValues:{
    startDate:new Date(),
    endDate:new Date(),
    
  }
})
    




  const handleFiltrar:SubmitHandler<FiltroFormProps> =useCallback(async(data)=>{

    const {dataIni,dataFim} = ajustarData(data.startDate,data.endDate)

      try {
        const response = await api.post("/financeiro/resumoLancamentos",{
          startDate:dataIni,
          endDate:dataFim,
          id_empresa:data.id_empresa,
          setor:data.setor,
          contas:listaContas.filter(item=>item.check).map(item=>item.conta),
          grupos:[]
        })
        setResumoConta(response.data.somaPorConta)
        setMetas(response.data.metas)
      const resultado = response?.data?.somaPorConta?.reduce((acc:TotalProps,at:SomaValorConta)=>{

          if(at.tipo==='DESPESA'){
            acc.despesa+=Number(at._sum.valor)
          }

          if(at.tipo==='RECEITA'){
            acc.receita+=Number(at._sum.valor)
          }
      
      
          return acc
        },{despesa:0,receita:0} as TotalProps) 

        setTotal(resultado)
      } catch (error) {
        
      }
  },[listaContas,watch('startDate'),watch('endDate'),watch('id_empresa'),watch('setor')])


    const toogleAberto = (index: number) => {
      setAbertos((prev: { [key: number]: boolean }) => ({
        ...Object.keys(prev).reduce((acc, key) => {
          acc[Number(key)] = false;
          return acc;
        }, {} as { [key: number]: boolean }),
        [index]: !prev[index]
      }));
    };


    const togglePlanoContas = (index: number)=> {
      setListaContas(
        listaContas.map((item,i)=> i===index ? {...item,check:!item.check}:item)
      )
    }
   
    
   const  handleListaLanc= useCallback(
   async (conta: string, index: number)=> {
      setSubLista([])
      if (!abertos[index]) {
        try {
          const response = await api.post('/financeiro/listaLancamentos', {
            id_empresa: watch('id_empresa'),
            startDate: watch('startDate'),
            endDate: watch('endDate'),
            conta: conta
          })
          setSubLista(response.data??[])
        
        } catch (error) {
          console.log(error)
        }
  
      }
      return true
  
    },[abertos]
   )
    
    

    return(
        <div className="bg-white rounded-lg h-[calc(100vh-112px)] ">
            <div className="flex flex-row w-full text-xs text-black justify-between font-semibold p-2 mb-1">
              <Card theme={{root:{children:"inline-flex h-full p-2 gap-2"}}} >
                <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiExpense size={25} /></div>
                <h2 className="flex flex-col" >DESPESAS <span>{Number(total.despesa).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></h2>
              </Card>
              <Card theme={{root:{children:"inline-flex h-full p-2 gap-2"}}}>
                <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><GiReceiveMoney size={25} /></div>
                <h2 className="flex flex-col" >RECEITAS <span>{Number(total.receita).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></h2>
              </Card>
              <Card theme={{root:{children:"inline-flex h-full p-2 gap-2"}}}>

                <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><BiTransferAlt size={25} /></div>
                <h2 className="flex flex-col" >REMESSA + RECEITA <span>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></h2>
              </Card>
              <Card theme={{root:{children:"inline-flex h-full p-2 gap-2"}}}>

                <div className="flex items-center h-full rounded-lg  text-[#2a4fd7] p-1 border-[1px] border-[#2a4fd7]"><FaBalanceScale size={25} /></div>
                <h2 className={`flex flex-col`} >SALDO <span className={`font-semibold  ${(0) < 0 ? "text-red-600" : ""}`}>{Number().toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></h2>
              </Card>

            </div>


            <form onSubmit={handleSubmit(handleFiltrar)} className="flex text-black font-semibold w-full bg-white px-4 mb-1 py-1 text-xs items-center justify-between rounded-sm  ">

              
              <label className="flex bg-gray-200 border p-1 rounded-lg border-gray-300" >FILTROS</label>




              <Select sizing={'sm'} value={setorSelect} onChange={e => {
                setSetor(Number(e.target.value))
              }}>
                <option value={0}>SETOR (TODOS)</option>

                {gruposSelect?.map((item, index) => (
                  <option className="text-xs " key={index} value={item.id_grupo}>
                    {item.descricao}
                  </option>

                ))}
              </Select>



              
              <Select sizing={'sm'} {...register("id_empresa")}>
                <option value={''}>EMPRESAS</option>

                {empresas?.map((item, index) => (
                  <option className="text-xs " key={item.id} value={item.id}>
                    {item.nome}
                  </option>

                ))}
              </Select>



                   <Dropdown dismissOnClick={false} placement="bottom" label="Bairros" renderTrigger={() => (
                
                                <button type="button"
                                  className="flex  h-full justify-between items-center py-2 pl-2 pr-2 uppercase border rounded-lg  text-xs bg-gray-50 border-gray-300 placeholder-gray-400  ">
                
                                 PLANO DE CONTAS
                                  <IoIosArrowDown className="text-gray-500" size={14} />
                                </button>
                
                              )}>
                                <ul className="max-h-64 overflow-y-auto  px-2"> {/* Limite de altura com rolagem */}
                
                           
                                  {listaContas?.map((item, index) => (
                
                                    <li key={index}  className="flex  items-center gap-4 p-2">
                                      <Checkbox onChange={() => togglePlanoContas(index)} checked={item.check} id={`bairro-${index}`} />
                                      <Label className="hover:cursor-pointer" htmlFor={`bairro-${index}`}>{item.descricao}</Label>
                                    </li>
                
                                  ))}
                                </ul>
                
                
                
                              </Dropdown>




             


              <div className="inline-flex  items-center text-black gap-3">
             
                <DatePicker
                 
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={watch('startDate')}
                  onChange={(date) => date && setValue('startDate',date)}
                  className="flex py-2 pl-2 text-xs  border rounded-lg  bg-gray-50 border-gray-300  "
                />
                <span>até</span>

                <DatePicker
                  
                  dateFormat={"dd/MM/yyyy"}
                  locale={pt}
                  selected={watch('endDate')}
                  onChange={(date) => date && setValue('endDate',date)}
                  selectsEnd
                
                  className=" flex py-2 pl-2 text-xs  border rounded-lg  bg-gray-50 border-gray-300   "
                />

              </div>
             <Button color={'blue'} size={'xs'} isProcessing={loading} type="submit">BUSCAR<IoSearch size={18} /></Button> 
            </form>
            <div className="flex flex-col text-black px-4 w-full overflow-y-auto max-h-[calc(100vh-240px)]  bg-white rounded-lg ">
              <ul className="flex flex-col w-full p-2 gap-1 text-sm">
                <li className="flex flex-col w-full  text-xs pl-4 border-b-[1px] font-semibold">
                  <div className="inline-flex w-full items-center"><span className="flex w-full ">DESCRIÇÃO</span>
                    <div className="flex w-full gap-8  items-center">
                      <span className="flex w-full text-start whitespace-nowrap ">CONSUMO</span>
                      <span className="flex w-full text-start whitespace-nowrap ">META</span>
                      <span className="flex w-full text-start whitespace-nowrap ">PORCENTAGEM</span>
                      <span className="flex w-full text-start whitespace-nowrap ">EQV. DE DESPESAS</span>
                      <span className="flex w-full justify-end  "></span>
                    </div>
                  </div>
                </li>
                {
                  resumoConta?.map((conta, index) => {
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
                      <li onClick={() => { handleListaLanc(conta.conta, index), toogleAberto(index) }} className={`font-semibold flex flex-col w-full p-1.5 text-xs pl-4 rounded-lg ${index % 2 === 0 ? "bg-slate-300" : "bg-slate-200"} uppercase cursor-pointer`}>
                        <div className="inline-flex w-full items-center">
                          <span className="flex w-full ">{listaContas?.map((item, ind) => {
                              if (item.conta == conta?.conta && item.tipo !== null) {
                                return item.descricao
                              }
                            })}</span>
                          <div className="flex w-full gap-8  items-center">
                            <span className="flex w-full text-start whitespace-nowrap">{Number(conta._sum.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span>
                           {/* <span className="flex w-full text-start whitespace-nowrap font-semibold">R$ {nome?.metas[0]?.valor ?? 0}</span>*/}
                            <span className="flex w-full text-start whitespace-nowrap">{
                                metas.map(item=>{
                                  if(item.conta===conta.conta){
                                    return CalcularMeta({consumo:conta._sum.valor,metas:item.metas}).meta
                                  }
                                })
                              
                              
                              }{/*!Number.isNaN(porc) ? porc + '%' : '0%'*/}</span>
                                   <span className="flex w-full text-start items-center whitespace-nowrap gap-2">{Number(
                                metas.map(item=>{
                                  if(item.conta===conta.conta){
                                    return CalcularMeta({consumo:conta._sum.valor,metas:item.metas}).porc
                                  }
                                })
                              
                              
                              )}% <FiAlertTriangle color="red"/></span>
                            <span className="flex w-full text-start whitespace-nowrap"><span className="rounded-lg   p-1">{conta._sum.valor>0 && total.despesa>0 && conta.tipo==='DESPESA'?`${((conta._sum.valor * 100)/total.despesa).toFixed(2)}%`:0}</span></span>
                            <span className="flex w-full justify-end  "><IoIosArrowDown /></span>
                          </div>
                        </div>
                        {abertos[index] && <ul className="flex flex-col w-full gap-1  ml-6 ">
                          {subListaLanc?.map((lancamento, index) => {
                            return (
                              <li className="flex text-xs gap-2 "><span>{lancamento.historico}</span> Valor: {Number(lancamento.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} </li>
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


const CalcularMeta = ({metas,consumo}:{metas:Array<{valor:number}>,consumo:number})=>{


 const meta = metas.reduce((acc,at)=>{
                                  acc+=Number(at.valor)

                                  return acc 
                                },0)
                             
                               
                           
                            
                            
                            //


                            let porc:number =0

     if(meta>0 && consumo >0){
      porc = (consumo*100)/meta

     }     
     
     

     return {meta:meta.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}),porc}


}

