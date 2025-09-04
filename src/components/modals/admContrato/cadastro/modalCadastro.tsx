import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/store/AuthContext";
import { ResumoCadastro } from "@/components/modals/admContrato/cadastro/resumoCadastro";
import { api } from "@/lib/axios/apiClient";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { HiInboxIn } from "react-icons/hi";
import {
  Control,
  SubmitHandler,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch
} from "react-hook-form";

import { MultiStep } from "@/utils/multiStep";
import { DadosCadastro } from '@/app/dashboard/admcontrato/_types/associado';
import { DadosTitular } from '@/app/dashboard/admcontrato/_components/cadastro/dadosTitular';
import { DadosPlano } from '@/app/dashboard/admcontrato/_components/cadastro/dadosPlano';
import { DadosDependentes } from '@/app/dashboard/admcontrato/_components/cadastro/dadosDependentes';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { Badge } from "@/components/ui/badge";
import { gerarMensalidade } from "@/utils/gerarArrayMensal";

interface ParcelaData {
  parcela_n: number;
  vencimento: Date;
  cobranca: Date;
  valor_principal: number;
  status: string;
  referencia: string;
}

export interface ChildrenProps {
  register: UseFormRegister<DadosCadastro>,
  setValue: UseFormSetValue<DadosCadastro>,
  watch: UseFormWatch<DadosCadastro>
  trigger: UseFormTrigger<DadosCadastro>
  control: Control<DadosCadastro>

}

export default function ModalCadastro({ isEmpresa, empresa }: { isEmpresa?: boolean, empresa: string }) {
  const [open, setOpen] = useState(false);

  const { usuario, carregarDados, selectEmp } = useContext(AuthContext);
  const { register, handleSubmit, setValue, watch, trigger, control, reset } = useForm<DadosCadastro>();
  useEffect(() => {
    reset({})
    setCurrentStepIndex(0);
  }, [open]);


  // function gerarMensalidade() {
  //   const mensalidades: Array<ParcelaData> = [];
  //   let currentDate = new Date(watch('contrato.data_vencimento') ?? new Date());
  //   for (let i = 0; i < Number(watch('contrato.n_parcelas')); i++) {
  //     const dataMensalidade: ParcelaData = {
  //       parcela_n: i + 1,
  //       vencimento: new Date(currentDate),
  //       cobranca: new Date(currentDate),
  //       valor_principal: Number(watch('contrato.valor_mensalidade')),
  //       status: 'A',
  //       referencia: `${String(new Date(currentDate).getMonth() + 1).padStart(2, '0')}/${new Date(currentDate).getFullYear() % 100}`
  //     };
  //     mensalidades.push(dataMensalidade);
  //     currentDate.setMonth(currentDate.getMonth() + 1);
  //   }
  //   return mensalidades;
  // }

  const handleSave = async (data: DadosCadastro) => {
    const dataAtual = new Date();
    dataAtual.setTime(dataAtual.getTime() - dataAtual.getTimezoneOffset() * 60 * 1000);

    const dataNasc = new Date(data.nasc);
    dataNasc.setTime(dataNasc.getTime() - dataNasc.getTimezoneOffset() * 60 * 1000);

    let dataAdesao;
    if (data.contrato?.dt_adesao) {
      dataAdesao = new Date(data?.contrato?.dt_adesao);
      dataAdesao.setTime(dataAdesao.getTime() - dataAdesao.getTimezoneOffset() * 60 * 1000);
    }

    let dataCarencia;
    if (data.contrato?.dt_carencia) {
      dataCarencia = new Date(data?.contrato?.dt_carencia);
      dataCarencia.setTime(dataCarencia.getTime() - dataCarencia.getTimezoneOffset() * 60 * 1000);
    }

    if (selectEmp === null) {
      toast.warning('Selecione uma empresa');
      return;
    }

    toast.promise(
      api.post('/novoAssociado', {
        id_empresa: selectEmp,
        nome: data.name.toUpperCase(),
        cep: data.cep,
        cpfcnpj: data.cpf,
        endereco: data.endereco,
        bairro: data.bairro,
        numero: Number(data.numero),
        cidade: data.cidade,
        uf: data.uf,
        guia_rua: data.referencia,
        email: data.email,
        data_nasc: data.nasc ? dataNasc : undefined,
        data_cadastro: dataAtual,
        celular1: data.celular1,
        celular2: data.celular2,
        telefone: data.telefone,
        cad_usu: usuario?.nome,
        cad_dh: dataAtual,
        rg: data.rg,
        profissao: data.profissao,
        sexo: data.sexo,
        contrato: {
          id_plano: data.contrato?.id_plano,
          plano: data.contrato?.plano,
          consultor: data.contrato?.consultor,
          situacao: "ATIVO",
          valor_mensalidade: data.contrato?.valor_mensalidade,
          dt_adesao: data.contrato?.dt_adesao ? dataAdesao : dataAtual,
          cobrador: data.contrato?.cobrador,
          data_vencimento: data.contrato?.data_vencimento ? new Date(data.contrato.data_vencimento) : null,
          n_parcelas: Number(data.contrato?.n_parcelas),
          origem: data.contrato?.origem,
          carencia: "",
          dt_carencia: data.contrato?.dt_carencia ? dataCarencia : null
        },
        dependentes: data.arraydep,
        mensalidades: gerarMensalidade({
          vencimento: data.contrato?.data_vencimento,
          n_parcelas: Number(data.contrato?.n_parcelas),
          valorMensalidade: Number(data.contrato?.valor_mensalidade)
        })
      }),
      {
        loading: `Efetuando`,
        success: (response) => {
          setValue('contrato.id_contrato', response.data.id_contrato);
          carregarDados(response.data.id_global);
          setOpen(false);
          return `Cadastrado com sucesso`;
        },
        error: `Erro ao efetuar Cadastro`
      }
    );
  };

  const { steps, currentStepIndex, step, next, back, setCurrentStepIndex } = MultiStep([
    <DadosTitular control={control} trigger={trigger} key={1} register={register} setValue={setValue} watch={watch} />,
    <DadosPlano control={control} trigger={trigger} key={2} register={register} setValue={setValue} watch={watch} />,
    <DadosDependentes control={control} key={3} trigger={trigger} register={register} setValue={setValue} watch={watch} />,
    <ResumoCadastro control={control} key={4} trigger={trigger} register={register} setValue={setValue} watch={watch} />
  ]);

  const onSubmit: SubmitHandler<DadosCadastro> = (data) => {
    steps.length - 1 === currentStepIndex ? handleSave(data) : next();
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isEmpresa} variant={'outline'} size={'sm'} type="button"  >
          <IoMdAdd size={18} />
          Novo Associado
        </Button>
      </DialogTrigger>

      <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Cadastro de Contrato - <Badge variant={'success'} className="text-sm">{empresa}</Badge></DialogTitle>
          <DialogDescription>Preencha os dados do Associado/Contrato</DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {step}
          <div className="flex justify-end gap-4">
            {currentStepIndex !== 0 && (
              <Button

                type="button"
                onClick={back}
              >
                <HiOutlineChevronLeft color="white" size={15} />
              </Button>
            )}
            {steps.length - 1 === currentStepIndex ? (
              <Button type="submit">
                <HiInboxIn size={22} /> SALVAR
              </Button>
            ) : (
              <Button
                variant={'default'}
                type="submit"
              >
                <HiOutlineChevronRight color="white" />
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
