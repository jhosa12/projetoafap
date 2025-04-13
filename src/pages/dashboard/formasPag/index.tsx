"use client";

import { use, useContext, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner"
import { roboto_Mono } from "@/fonts/fonts";
import { MdClose } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useBaixaMensalidade from "@/hooks/useBaixaMensalidade";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { AuthContext } from "@/store/AuthContext";
import { bancos, formasDePagamento } from "@/utils/bancosFormasPag";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { MensalidadeBaixaProps } from "@/types/financeiro";


export interface Pagamento {
  valor: number;
  forma: string;
  banco?: string;
  observacao?: string;
}



interface FormProps {
  valor: string;
  dispensa: boolean,
  motivo: string,
  formaPagamento: string,
  valorPago: string,
  banco: string,
  observacao: string,
  valorRestante: number
}


interface Props {
  handleAtualizar: Function
  openModal: boolean,
  setOpenModal: (open: boolean) => void
  mensalidade: Partial<MensalidadeBaixaProps>

}

export default function ModalBaixaMensalidade({ handleAtualizar, mensalidade, openModal, setOpenModal }: Props) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const { permissoes, usuario, infoEmpresa } = useContext(AuthContext)
  const { postData } = useBaixaMensalidade('/mensalidade/baixa', setOpenModal, handleAtualizar)
  const [dataPag, setDataPag] = useState(new Date())
  const { setValue, register, reset, watch, control, handleSubmit } = useForm<FormProps>({
    defaultValues: {
      valorPago: mensalidade?.valor_principal?.toString(),
      valorRestante: mensalidade?.valor_principal
    }
  })


  const dispensa = watch('dispensa');
  const valorRestante = watch("valorRestante");
  const valorPago = watch("valorPago");


  const handleBaixar = async () => {
    // Função para exibir toast e retornar
    const novoArray = [...(mensalidade.associado?.mensalidade ?? [])];
    const indexAtual = novoArray.findIndex(item => item.id_mensalidade === mensalidade.id_mensalidade);
    let mensalidadeProx = novoArray[indexAtual + 1];
    const mensalidadeAnt = novoArray[indexAtual - 1];

    // Verifica se a mensalidade anterior está em aberto
    if (mensalidadeAnt?.id_mensalidade && mensalidadeAnt.status === 'A') {
      return toast.info('Mensalidade anterior em aberto!');
    }


      const {newDate:dataPgto} = removerFusoDate(dataPag);
                const {newDate:data_lanc} = removerFusoDate(new Date());

    try {

      await postData(
        {
          id_global: mensalidade?.id_global,
         // id_usuario: usuario?.id,
          id_mensalidade_global: mensalidade?.id_mensalidade_global,
          id_mensalidade: mensalidade?.id_mensalidade,
          data_pgto: dataPgto,
          hora_pgto: new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          valor_total: parseFloat(valorPago),
          motivo_bonus: watch('motivo')?.toUpperCase(),
          associado: mensalidade?.associado?.nome,
          form_pagto: undefined,
          banco_dest: undefined,
          desconto: dispensa,
          id_proximaMensalidade: mensalidadeProx?.id_mensalidade_global,
          situacao: mensalidade?.contrato?.situacao,
          status: mensalidade.status,
          pix_por: mensalidade.pix_por,
          id_empresa: infoEmpresa?.id,
          valor_metodo: mensalidade?.valor_metodo,
          data_lanc: data_lanc,
          lancamentoForma: pagamentos

        },

      );

      //  handleAtualizar && await handleAtualizar({endDate:new Date(),startDate:new Date(),id_empresa:selectEmp,descricao:''}) 


    } catch (error) {
      console.log(error)
    }


  }


  const OnChangeValorPago = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("valorPago", e.target.value)
    setValue("valorRestante", parseFloat(e.target.value))

  }

  const adicionarPagamento: SubmitHandler<FormProps> = (data) => {
    const valorNumerico = parseFloat(data.valor);

    if (!data.formaPagamento || isNaN(valorNumerico) || valorNumerico <= 0) {
      toast("Erro", { description: "Preencha um valor válido e escolha uma forma de pagamento." });
      return;
    }

    if (valorNumerico > data.valorRestante) {
      toast("Erro", { description: "O valor excede o restante da mensalidade!" });
      return;
    }

    setPagamentos([...pagamentos, { valor: valorNumerico, forma: data.formaPagamento, banco: data.banco, observacao: data.observacao?.toUpperCase() }]);

    reset({
      valor: '',
      dispensa: false,
      formaPagamento: "",
      valorRestante: data.valorRestante - valorNumerico,
      banco: "",
      observacao: "",
      valorPago: data.valorPago
    })
    // setValorRestante(valorRestante - valorNumerico);
    //  setValor("");
    //  setFormaPagamento("");
    //  setBanco("")
    // setObservacao("")
  };



  return (
    <Dialog modal open={openModal} onOpenChange={setOpenModal}>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Baixar Mensalidade</DialogTitle>
          <DialogDescription>
            Preencha os dados para baixar a mensalidade do associado.
          </DialogDescription>
        </DialogHeader>
        <div>
          <span className="flex w-full text-gray-500 border-b">Associado</span>
          <h1 className="font-semibold text-sm">{mensalidade?.id_contrato}-{mensalidade?.associado?.nome}</h1>
          <p className="text-sm">Referência:<strong>{mensalidade?.referencia}</strong></p>
        </div>

        <form onSubmit={handleSubmit(adicionarPagamento)} className="space-y-3">

          <div className="flex justify-between items-center text-[13px]">
            <p>Valor Mensalidade: <strong>{Number(mensalidade?.valor_principal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>





            <p className="inline-flex items-center">Valor Total Pago: <Input disabled={pagamentos?.length > 0} type="number" placeholder="Valor" value={watch('valorPago')} onChange={OnChangeValorPago} className="w-[100px] text-[10px] h-6 " /></p>

            <div className="inline-flex items-center">
              Data Pagamento:
              <DatePicker disabled={!permissoes.includes('ADM1.2.7')} className="flex h-6 w-[100px] text-sm px-2 py-1 rounded-md border-gray-200 shadow" selected={dataPag} onChange={e => e && setDataPag(e)} dateFormat={'dd/MM/yyyy'} locale={pt} />


            </div>


          </div>

          {parseFloat(watch('valorPago')) < (mensalidade?.valor_principal ?? 0) && <div className="inline-flex w-full gap-4">
            <div className="flex items-center space-x-2">

              <Controller name="dispensa" control={control} render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="terms" />
              )} />

              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Dispensa
              </label>
            </div>
            <Input disabled={!dispensa} placeholder="Informe o motivo da dispensa" />
          </div>}

          <p className="text-[13px]">Valor Restante: <strong className={valorRestante === 0 ? "text-green-600" : "text-red-600"}>{Number(valorRestante).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></p>

          <div className="flex gap-2">

            <Controller
              name="formaPagamento"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Forma" />
                  </SelectTrigger>
                  <SelectContent>
                    {formasDePagamento?.map((forma) => (
                      <SelectItem key={forma} value={forma}>{forma}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="banco"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {bancos?.map((banco) => (
                      <SelectItem key={banco} value={banco}>{banco}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <Input type="number" placeholder="Valor" {...register("valor")} className="w-[120px]" />

            <Input {...register("observacao")} placeholder="Observações sobre o pagamento" />


            <Button type="submit" disabled={!watch("formaPagamento") || !watch("valor")}>+</Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-[13px]">Pagamentos Adicionados:</h4>
            {pagamentos.length > 0 ? (
              <ul className={`${roboto_Mono.className}  border p-2 rounded divide-y space-y-2 bg-gray-100 text-[13px]`}>
                {pagamentos?.map((p, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{p.forma}:  {Number(p.valor).toLocaleString('pt-BR',{ style: 'currency', currency: 'BRL'})} {p.banco} {p.observacao}</span>
                    <MdClose className="text-red-600 cursor-pointer" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum pagamento adicionado.</p>
            )}
          </div>



          <Button type="button" onClick={handleBaixar} className="w-full" disabled={valorRestante > 0}>Confirmar Baixa</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
