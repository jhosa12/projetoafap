import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogPortal, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "@/store/AuthContext";
import { api } from "@/lib/axios/apiClient";
import { CcustosProps } from "@/pages/dashboard/financeiro";
import { toast } from "sonner";
import { Combobox } from "../ui/combobox";
import { DatePickerInput } from "../DatePickerInput";
import pt from "date-fns/locale/pt-BR";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { BiCalendarMinus } from "react-icons/bi";
import { Button } from "../ui/button";
import { ajustarData } from "@/utils/ajusteData";
import { LancamentosProps } from "@/types/caixa";
registerLocale("pt", pt);
import RelatorioSintetico from "@/Documents/caixa/RelatorioMovimentacao";
import { SomaProps } from "../tabs/financeiro/caixa/caixa";
import { EmpresaProps } from "@/types/empresa";
import { useReactToPrint } from "react-to-print";
import { pageStyle } from "@/utils/pageStyle";
import { Portal } from "@radix-ui/react-dialog";

interface FilterCaixaProps{
    caixa:string
    start:Date,
    end:Date
}


interface ModalPropsRelatorios{
    id_empresa:string
    infoEmpresa:EmpresaProps|null
}





export default function ModalSelectCaixa({id_empresa,infoEmpresa}:ModalPropsRelatorios) {
    const [open, setOpen] = useState(false)
     const currentPage = useRef<HTMLDivElement|null>(null);
     const [ccustos,setCcustos] = useState<Array<CcustosProps>>([])
    const {control,handleSubmit,watch} = useForm<FilterCaixaProps>({
        defaultValues:{
            start:new Date(),
            end:new Date()
        }
    })
    const [data,setData] = useState<Array<LancamentosProps>>([])


    
  useEffect(() => {
    if (data.length > 0) {
      ImprimirRelatorio();
    }
  }, [data]);

  const ImprimirRelatorio = useReactToPrint({
    pageStyle: pageStyle,
    content: () => currentPage.current,
    onAfterPrint: () => {},
    onBeforeGetContent: () => {
      setData([]);
      setOpen(false);
    },
    //  removeAfterPrint:false
  });

     const handleReqCcustos = async () =>{
    try {

      const response = await api.get('/financeiro/caixa/listarCcustos')

      setCcustos(response.data)
      
    }catch(error){
      toast.error('Erro ao carregar plano de contas.');
    }
  }

   const listarLancamentos: SubmitHandler<FilterCaixaProps> = useCallback(
      async (data) => {
        if (data.start > data.end) {
          toast.info("Data final deve ser maior que a data inicial");
          return;
        }
  
        const { dataIni, dataFim } = ajustarData(data.start, data.end);
        try {
        //  setLoading(true);
          const response = await api.post("/relatorioCaixa", {
            id_empresa,
            startDate: dataIni,
            endDate: dataFim,
            ccusto: data.caixa,
            // id_user:usuario?.id
          });
  
          console.log(response.data)
  
          setData(response.data);
          // setLancamentos(lista)
          // setPlanos(plano_de_contas)
          // setGrupos(grupos)
          // setFechado(fechamento)
        } catch (err) {
          console.log(err);
        }
  
        ///setLoading(false);
      },
      []
    );


     const handleGerirRelatorio = useCallback(() => {
        return data.reduce(
          (acumulador, atual) => {
            const valor = Number(atual.valor);
    
            if (atual.tipo === "RECEITA")
              switch (atual?.mensalidade?.form_pagto) {
                case "PIX":
                  acumulador.pix += valor;
                  break;
                case "BOLETO":
                  acumulador.boleto += valor;
                  break;
                case "CARTAO":
                case "CARTÃO CREDITO":
                case "CARTÃO DEBITO":
                  acumulador.cartao += valor;
                  break;
                case "DINHEIRO":
                case "":
                  acumulador.dinheiro += valor;
                  break;
                default:
                  break; // Adicione uma ação padrão se necessário
              }
    
            if (atual.tipo === "DESPESA") {
              acumulador.despesas += valor;
            }
            if (atual.tipo === "RECEITA") {
              acumulador.total += valor;
            }
    
            return acumulador;
          },
          {
            pix: 0,
            boleto: 0,
            cartao: 0,
            dinheiro: 0,
            deposito: 0,
            total: 0,
            transferencia: 0,
            despesas: 0,
          } as SomaProps
        );
      }, [data]);






  useEffect(()=>{
    handleReqCcustos()
  },[])




    return(

 
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="text-sm px-2">Relatório</DialogTrigger>
            <DialogContent>
               <DialogHeader>
          <DialogTitle>Relatório de Caixa</DialogTitle>
          <DialogDescription>
            Selecione o caixa
          </DialogDescription>
        </DialogHeader>

                <form onSubmit={handleSubmit(listarLancamentos)} className="space-y-4">

                    <Controller
                        name="caixa"
                        control={control}
                        render={({field:{onChange,value}})=>(
                            <Combobox
                            placeholder="Selecione o Caixa"
                            items={ccustos?.map(item=>{return {label:item.descricao,value:item.descricao}})??[]}
                            onChange={onChange}
                            value={value}
                           />
                        )}/>

                        <div className="flex items-center gap-2">
                                  <div>
                                    <Controller
                                      control={control}
                                      name="start"
                                      render={({ field: { onChange, value } }) => (
                                        <DatePickerInput
                                          value={value}
                                          onChange={(e) => e && onChange(e)}
                                          dateFormat={"dd/MM/yyyy"}
                                          locale={pt}
                                          required
                                         
                                        />
                                      )}
                                    />
                                  </div>
                    
                                  <BiCalendarMinus size={25} />
                    
                                  <div>
                                    <Controller
                                      control={control}
                                      name="end"
                                      render={({ field: { onChange, value } }) => (
                                        <DatePickerInput
                                          value={value}
                                          onChange={(e) => e && onChange(e)}
                                          dateFormat={"dd/MM/yyyy"}
                                          locale={pt}
                                          required
                                         
                                        />
                                      )}
                                    />
                                  </div>
                                </div>

                   


                                       <DialogFooter>
                    <Button type="submit" >Buscar</Button>
                </DialogFooter>

                </form>
               
            </DialogContent>
            <div style={{ display: "none" }}>
       
     
       <RelatorioSintetico
         infoEmpresa={infoEmpresa}
         tipoRelatorio={'ANALITICO'}
         soma={handleGerirRelatorio() ?? ({} as SomaProps)}
         usuario={watch("caixa")}
         startDate={watch("start")}
         endDate={watch("end")}
         array={data ?? []}
         ref={currentPage}
       />
     
   </div>

        </Dialog>
       
    )
}