"use client"


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
  } from "@/components/ui/select"
  import { Checkbox } from "@/components/ui/checkbox"
  import { Button } from "@/components/ui/button"
  import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { AuthContext} from "@/store/AuthContext";
import { useContext, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker,{registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import useBaixaMensalidade from "@/hooks/useBaixaMensalidade";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { removerFusoDate } from "@/utils/removerFusoDate";
import { toast } from "sonner";
import { MensalidadeBaixaProps } from "@/types/financeiro";
import { DatePickerInput } from "@/components/DatePickerInput"
import { Label } from "@/components/ui/label"

import { Calendar } from "@/components/ui/calendar"
import { BuildingIcon, CalendarIcon, CheckCircleIcon, CreditCardIcon, DollarSignIcon, UserIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface Props{
    handleAtualizar:Function
    openModal:boolean,
    setOpenModal:(open:boolean)=>void
    mensalidade:Partial<MensalidadeBaixaProps>
   
}


const FORMAS_PAGAMENTO = [
    { value: "DINHEIRO", label: "Dinheiro", icon: DollarSignIcon },
    { value: "PIX", label: "PIX", icon: CreditCardIcon },
    { value: "CARTAO", label: "Cartão", icon: CreditCardIcon },
    { value: "DEPOSITO", label: "Depósito", icon: BuildingIcon },
    { value: "TRANSFERENCIA", label: "Transferência", icon: BuildingIcon },
    { value: "BOLETO", label: "Boleto", icon: BuildingIcon },
  ]

  const BANCOS = ["BANCO DO BRASIL", "CORA", "PAGBANK", "CAIXA", "TON"]

export function ModalMensalidade({openModal,setOpenModal,mensalidade,handleAtualizar}:Props){

    const {usuario,permissoes,selectEmp,consultores}=useContext(AuthContext)
    const [desconto,setDesconto] = useState(false)
    const {error,postData} = useBaixaMensalidade('/mensalidade/baixa',setOpenModal,handleAtualizar)
    const {register,handleSubmit,watch,control,reset} = useForm<MensalidadeBaixaProps>(
      
    )


  


    useEffect(()=>{
        reset({...mensalidade,form_pagto:'',valor_total:mensalidade?.valor_principal,data_pgto:new Date()})
    },[mensalidade])

    const formaPagamento = watch("form_pagto")
    const valorTotal = Number(watch("valor_total"))
    const valorPrincipal = Number(watch("valor_principal"))
  
    const isDescontoVisible = valorTotal < valorPrincipal && valorTotal !== undefined && valorTotal > 0
    const isPago = mensalidade.status === "P"
    const canEdit = permissoes.includes("ADM1.2.5") && !isPago

         const handleBaixar:SubmitHandler<MensalidadeBaixaProps> = async(data)=> {
            // Função para exibir toast e retornar
            const novoArray = [...(mensalidade.associado?.mensalidade ?? [])];
            const indexAtual = novoArray.findIndex(item => item.id_mensalidade === mensalidade.id_mensalidade);
           let mensalidadeProx = novoArray[indexAtual + 1];
            const mensalidadeAnt = novoArray[indexAtual - 1];
        
            // Verifica se a mensalidade anterior está em aberto
            if (mensalidadeAnt?.id_mensalidade && mensalidadeAnt.status === 'A') {
                return toast.info('Mensalidade anterior em aberto!');
            }

            

            const {newDate:dataPgto} = removerFusoDate(data.data_pgto);
            const {newDate:data_lanc} = removerFusoDate(new Date());
        
           
        
         try {

             await postData(
                   {
                        id_global:data?.id_global,
                       // id_usuario: usuario?.id ,
                        id_mensalidade_global: data?.id_mensalidade_global,
                        id_mensalidade: data?.id_mensalidade,
                        data_pgto: dataPgto,
                        hora_pgto: new Date().toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        }),          
                        valor_total: Number(data.valor_total),
                        motivo_bonus: data.motivo_bonus?.toUpperCase(),
                        associado: mensalidade?.associado?.nome,
                        form_pagto: data?.form_pagto,
                        banco_dest: data.banco_dest,
                        desconto: desconto,
                        id_proximaMensalidade:mensalidadeProx?.id_mensalidade_global,
                        situacao:mensalidade?.contrato?.situacao,
                        status:data.status,
                        pix_por:data.pix_por,
                        id_empresa:selectEmp,
                        valor_metodo:data?.valor_metodo,
                        data_lanc:data_lanc,
                        recebido_por:data.recebido_por
                    
                    },
                 
                );  

           //  handleAtualizar && await handleAtualizar({endDate:new Date(),startDate:new Date(),id_empresa:selectEmp,descricao:''}) 
          
            
         } catch (error) {
            
         }
           
            
        }
    return(

<Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            Realizar Baixa de Mensalidade
          </DialogTitle>
          {isPago && (
            <Badge variant="secondary" className="w-fit">
              Mensalidade já paga
            </Badge>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(handleBaixar)} className="space-y-6">
          {/* Informações do Associado */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                <UserIcon className="h-5 w-5" />
                Dados do Associado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-sm">
                    Contrato: {mensalidade.id_contrato}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{mensalidade.associado?.nome}</h3>
                <p className="text-sm text-gray-600 mt-1">{mensalidade.associado?.endereco}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dados da Mensalidade */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                <CreditCardIcon className="h-5 w-5" />
                Dados do Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="referencia" className="text-sm font-medium text-gray-700">
                    Referência
                  </Label>
                  <Input
                    id="referencia"
                    disabled
                    {...register("referencia", { required: true })}
                    placeholder="Referência da mensalidade"
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor_total" className="text-sm font-medium text-gray-700">
                    Valor Pago *
                  </Label>
                  <Input
                    required
                    id="valor_total"
                    {...register("valor_total", { required: true })}
                    placeholder="0,00"
                    disabled={!canEdit}
                    className={!canEdit ? "bg-gray-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recebido_por" className="text-sm font-medium text-gray-700">
                    Recebido por 
                  </Label>
                  <Controller
                    control={control}
                    name="recebido_por"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={!canEdit}>
                        <SelectTrigger className={!canEdit ? "bg-gray-50" : ""}>
                          <SelectValue placeholder="Selecione o consultor" />
                        </SelectTrigger>
                        <SelectContent>
                          {consultores?.map((consultor) => (
                            <SelectItem key={consultor.id_consultor} value={consultor.nome}>
                              {consultor.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form_pagto" className="text-sm font-medium text-gray-700">
                    Forma de Pagamento *
                  </Label>
                  <Controller
                    control={control}
                    name="form_pagto"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select required value={field.value} onValueChange={field.onChange} disabled={!canEdit}>
                        <SelectTrigger className={!canEdit ? "bg-gray-50" : ""}>
                          <SelectValue placeholder="Selecione a forma" />
                        </SelectTrigger>
                        <SelectContent>
                          {FORMAS_PAGAMENTO.map((forma) => (
                            <SelectItem key={forma.value} value={forma.value}>
                              <div className="flex items-center gap-2">
                                <forma.icon className="h-4 w-4" />
                                {forma.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="banco_dest" className="text-sm font-medium text-gray-700">
                    Banco Destino
                  </Label>
                  <Controller
                    control={control}
                    name="banco_dest"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={!canEdit}>
                        <SelectTrigger className={!canEdit ? "bg-gray-50" : ""}>
                          <SelectValue placeholder="Selecione o banco" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANCOS.map((banco) => (
                            <SelectItem key={banco} value={banco}>
                              {banco}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_pgto" className="text-sm font-medium text-gray-700">
                    Data do Pagamento *
                  </Label>
                  <Controller
                    control={control}
                    name="data_pgto"
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <DatePickerInput
                        value={value}
                        onChange={onChange}
                        disable={!canEdit}
                        required
                        className="h-9 border border-gray-100"
                      />
                    )}
                  />
                </div>

                {/* Campos condicionais */}
                {formaPagamento && formaPagamento !== "DINHEIRO" && (
                  <div className="space-y-2">
                    <Label htmlFor="valor_metodo" className="text-sm font-medium text-gray-700">
                      Valor {formaPagamento === "PIX" ? "PIX" : "Cartão"}
                    </Label>
                    <Input
                      required
                      id="valor_metodo"
                      {...register("valor_metodo", { required: 'Campo obrigatório' })}
                      placeholder="0,00"
                      disabled={!canEdit}
                      className={!canEdit ? "bg-gray-50" : ""}
                    />
                  </div>
                )}

                {formaPagamento === "PIX" && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="pix_por" className="text-sm font-medium text-gray-700">
                      PIX realizado por
                    </Label>
                    <Input
                      id="pix_por"
                      {...register("pix_por")}
                      placeholder="Nome de quem realizou o PIX"
                      disabled={!canEdit}
                      className={!canEdit ? "bg-gray-50" : ""}
                    />
                  </div>
                )}

                {formaPagamento === "CARTAO" && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="aut" className="text-sm font-medium text-gray-700">
                      Código de Autorização
                    </Label>
                    <Input
                      id="aut"
                      {...register("aut")}
                      placeholder="Código de autorização do cartão"
                      disabled={!canEdit}
                      className={!canEdit ? "bg-gray-50" : ""}
                    />
                  </div>
                )}
              </div>

              {/* Seção de Desconto */}
              {isDescontoVisible && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="desconto"
                        checked={desconto}
                        onCheckedChange={(checked) => setDesconto(!!checked)}
                        disabled={!canEdit}
                      />
                      <Label htmlFor="desconto" className="text-sm font-medium text-gray-700 cursor-pointer">
                        Aplicar desconto
                      </Label>
                    </div>

                    {desconto && (
                      <div className="space-y-2">
                        <Label htmlFor="motivo_bonus" className="text-sm font-medium text-gray-700">
                          Motivo do desconto *
                        </Label>
                        <Input
                          id="motivo_bonus"
                          {...register("motivo_bonus")}
                          placeholder="Descreva o motivo do desconto aplicado"
                          disabled={!desconto || !canEdit}
                          className={!desconto || !canEdit ? "bg-gray-50" : ""}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!canEdit} className="min-w-[120px]">
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              Confirmar Baixa
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

)
}