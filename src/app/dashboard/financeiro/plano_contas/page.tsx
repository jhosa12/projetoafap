"use client"
import { Dispatch, SetStateAction, useCallback, useContext, useMemo, useState } from "react"
import { ArrowDown, ArrowUp, Search, AlertTriangle, Scale, ArrowRightLeft, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import pt from 'date-fns/locale/pt-BR'
import { api } from "@/lib/axios/apiClient"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { EmpresaProps } from "@/types/empresa"
import { ajustarData } from "@/utils/ajusteData"
import { LancamentosProps } from "@/app/dashboard/caixa/_types/types"
import { GruposProps, PlanoContasProps } from "../_types/types"
import { useAuth } from "@/store/AuthContext"
import { endOfMonth, startOfMonth } from "date-fns"
import { MultiSelects } from "@/components/ui/multiSelect"
import { DatePickerInput } from "@/components/DatePickerInput"



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


interface TotalProps{
  despesa:number,
  receita:number,
}

interface FiltroFormProps{
  setor:number,
  startDate:Date,
  endDate:Date,
  contas:Array<string>
}



export default function PlanodeContas(){
  const [subListaLanc, setSubLista] = useState<Array<LancamentosProps>>()
    const [setorSelect, setSetor] = useState<number>(0)
    const [gruposSelect, setGruposSelect] = useState<Array<GruposProps>>()
    const [resumoConta, setResumoConta] = useState<Array<SomaValorConta>>([])
    const [loading,setLoading] = useState(false)
    const [abertos, setAbertos] = useState<{ [key: number]: boolean }>({});
    const [metas,setMetas] = useState<Array<MetaProps>>([])
   
    const {empresas,actions_plano_contas,infoEmpresa} = useAuth()
    

const {watch,setValue,handleSubmit,control} = useForm<FiltroFormProps>({
  defaultValues:{
    startDate:startOfMonth(new Date()),
    endDate:endOfMonth(new Date()),
  }
})
    




  const handleFiltrar:SubmitHandler<FiltroFormProps> =useCallback(async(data)=>{

    const {dataIni,dataFim} = ajustarData(data.startDate,data.endDate)

      try {
        const response = await api.post("/financeiro/resumoLancamentos",{
          startDate:dataIni,
          endDate:dataFim,
          id_empresa:infoEmpresa?.id,
          setor:data.setor,
          contas:data.contas,
          grupos:[]
        })
        setResumoConta(response.data.somaPorConta)
        setMetas(response.data.metas)
     

       
      } catch (error) {
        
      }
  },[actions_plano_contas.array_plano_contas,watch('startDate'),watch('endDate'),infoEmpresa?.id,watch('setor')])


    const toogleAberto = (index: number) => {
      setAbertos((prev: { [key: number]: boolean }) => ({
        ...Object.keys(prev).reduce((acc, key) => {
          acc[Number(key)] = false;
          return acc;
        }, {} as { [key: number]: boolean }),
        [index]: !prev[index]
      }));
    };


    // const togglePlanoContas = (index: number)=> {
    //   setListaContas(
    //     actions_plano_contas?.array_plano_contas?.map((item,i)=> i===index ? {...item,check:!item.check}:item)
    //   )
    // }
   
    
   const  handleListaLanc= useCallback(
   async (conta: string, index: number)=> {
      setSubLista([])
      if (!abertos[index]) {
        try {
          const response = await api.post('/financeiro/listaLancamentos', {
            id_empresa: infoEmpresa?.id,
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


   const total = resumoConta.reduce((acc:TotalProps,at:SomaValorConta)=>{

    if(at.tipo==='DESPESA'){
      acc.despesa+=Number(at._sum.valor)
    }

    if(at.tipo==='RECEITA'){
      acc.receita+=Number(at._sum.valor)
    }


    return acc
  },{despesa:0,receita:0} as TotalProps) 
    
    

    return(
        <div className="bg-background rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">DESPESAS</CardTitle>
                  <ArrowDown className="h-4 w-4 text-muted-foreground text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(total.despesa).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">RECEITAS</CardTitle>
                  <ArrowUp className="h-4 w-4 text-muted-foreground text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(total.receita).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">REMESSA + RECEITA</CardTitle>
                  <ArrowRightLeft className="h-4 w-4 text-muted-foreground text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 0,00</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SALDO</CardTitle>
                  <Scale className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={cn(
                    "text-2xl font-bold",
                    (0) < 0 ? "text-destructive" : "text-green-600"
                  )}>
                    R$ {total.receita-total.despesa}
                  </div>
                </CardContent>
              </Card>
            </div>


            <form onSubmit={handleSubmit(handleFiltrar)} className="flex w-full items-center gap-2 mb-4 p-4 bg-card rounded-lg border">
              <Label className="bg-muted px-3 py-2 rounded-md text-sm font-medium">FILTROS</Label>

              <Select value={setorSelect.toString()} onValueChange={(value) => setSetor(Number(value))}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="SETOR (TODOS)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">SETOR (TODOS)</SelectItem>
                  {gruposSelect?.map((item) => (
                    <SelectItem key={item.id_grupo} value={item.id_grupo.toString()}>
                      {item.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* <Select {...register("id_empresa")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="EMPRESAS" />
                </SelectTrigger>
                <SelectContent>
                  
                  {empresas?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

                <Controller
                control={control}
                name="contas"
                render={({field:{onChange,value}})=>
                  <MultiSelects
                  maxDisplayItems={2}
                placeholder="PLANO DE CONTAS"
                onChange={onChange}
                selected={value}
                options={actions_plano_contas.array_plano_contas?.map(item=>{return{value:item.conta,label:item.descricao}})??[]}
                className="flex w-full min-h-9 min-w-[200px]"
              />
                }
                
                />
                
          

              <div className="flex items-center gap-2">
                <Controller
                control={control}
                name="startDate"
                render={
                  ({field:{onChange,value}})=>
                    <DatePickerInput
                 
                  value={value}
                  onChange={onChange}
                  className="h-9"
                />
                }
                />
              
                <span>até</span>
                <Controller
                control={control}
                name="endDate"
                render={
                  ({field:{onChange,value}})=>
                    <DatePickerInput
                 
                  value={value}
                  onChange={onChange}
                  className="h-9"
                />
                }
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </>
                )}
              </Button>
            </form>
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold border-b">
                <div className="col-span-4">DESCRIÇÃO</div>
                <div>CONSUMO</div>
                <div>META</div>
                <div>PORCENTAGEM</div>
                <div>EQV. DE DESPESAS</div>
                <div></div>
              </div>
              
              <ScrollArea className="h-[calc(100vh-350px)]">
                {useMemo(() => resumoConta, [resumoConta])?.map((conta, index) => (
                  <div key={index} className="border-b">
                    <div 
                      onClick={() => { 
                        handleListaLanc(conta.conta, index); 
                        toogleAberto(index); 
                      }} 
                      className={cn(
                        "grid grid-cols-12 gap-4 p-4 text-xs items-center hover:bg-muted/50 cursor-pointer",
                        index % 2 === 0 ? "bg-muted/30" : "bg-card"
                      )}
                    >
                      <div className="col-span-4">
                        <span className="text-xs font-medium text-ellipsis overflow-hidden line-clamp-1">
                          {actions_plano_contas.array_plano_contas?.find(item => item.conta === conta.conta)?.descricao}
                        </span>
                      </div>
                      <div>{Number(conta._sum.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</div>
                      <div>
                        {metas.find(item => item.conta === conta.conta)?.metas[0]?.valor.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}) || 'R$ 0,00'}
                      </div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const metaItem = metas.find(item => item.conta === conta.conta);
                          if (metaItem) {
                            const { porc } = CalcularMeta({ consumo: conta._sum.valor, metas: metaItem.metas });
                            return (
                              <>
                                {porc}%
                                {porc > 100 && <AlertTriangle className="h-4 w-4 text-destructive" />}
                              </>
                            );
                          }
                          return '0%';
                        })()}
                      </div>
                      <div>
                        {conta._sum.valor > 0 && total.despesa > 0 && conta.tipo === 'DESPESA' 
                          ? `${((conta._sum.valor * 100) / total.despesa).toFixed(2)}%` 
                          : '0%'}
                      </div>
                      <div className="flex justify-end">
                        {abertos[index] ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                      </div>
                    </div>
                    
                    {abertos[index] && subListaLanc && subListaLanc.length > 0 && (
                      <div className="bg-muted/20 p-4">
                        <div className="space-y-2">
                          {subListaLanc.map((lancamento, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground">
                              <span>{lancamento.historico}</span>
                              <span className="ml-2 font-medium">
                                {Number(lancamento.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ), [resumoConta])}
              </ScrollArea>
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

