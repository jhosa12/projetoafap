import useApiGet from "@/hooks/useApiGet";
import { Label, Modal, Spinner, TextInput } from "flowbite-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ModalItem } from "./modalItem/modalItem";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import useApiPost from "@/hooks/useApiPost";
import { Button } from "@/components/ui/button";
import "react-datepicker/dist/react-datepicker.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 
import {
  Control,
  Controller,
  SubmitHandler,
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import {
  MdCheckCircle,
  MdCreateNewFolder,
  MdFilter1,
  MdPrint,
} from "react-icons/md";
import { Tooltip } from "react-tooltip";
import { AuthContext } from "@/store/AuthContext";
import { gerarMensalidade, ParcelaData } from "@/utils/gerarArrayMensal";
import { ContratoProps, DependentesProps } from "@/types/associado";
import Router from "next/router";
import { ajustarData } from "@/utils/ajusteData";
import { ModalLoading } from "@/components/modals/loading/modalLoading";

import DocListaLeads from "@/Documents/vendas/DocListaLeads";
import { useReactToPrint } from "react-to-print";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { DatePickerInput } from "@/components/DatePickerInput";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { pageStyleLandscape } from "@/utils/pageStyle";
import { MultiSelects } from "@/components/ui/multiSelect";

export interface ReqLeadsProps {
  id?: string;
  statusSelected?: string;
  status?: Array<string>;
  nome?: string;
  startDate?: string;
  endDate?: string;
  consultores?: Array<string> | [];
}

interface CadastroRequest {
  dataPlano: Partial<{
    id_empresa: string;
    nome: string;
    cpfcnpj: string;
    rg: string;
    cep: string;
    endereco: string;
    bairro: string;
    numero: number;
    cidade: string;
    uf: string;
    guia_rua: string;
    email: string;
    data_nasc: Date;
    data_cadastro: Date;
    celular1: string;
    celular2: string;
    telefone: string;
    cad_usu: string;
    cad_dh: Date;
    edi_usu: string;
    edi_dh: Date;
    profissao: string;
    sexo: string;
    situacao: string;
    contrato: Partial<
      ContratoProps & {
        form_pag: string;
        adesao: Date;
      }
    >;
    dependentes: Array<Partial<DependentesProps>>;
    mensalidades: Array<Partial<ParcelaData>>;
    empresa: string;
  }>;
  id_lead: number;
}

export interface LeadProps {
  index: number;
  id_lead: number;
  visita: Date;
  consultor: string;
  id_usuario: string;
  id_plano: number;
  plano: string;
  origem: string;
  uf: string;
  valor_mensalidade: number;
  nome: string;
  endereco: string;
  n_parcelas: number;
  possuiPet: string;
  planoPet: string;
  status: string;
  bairro: string;
  numero: number;
  data_nasc: Date;
  cep: string;
  rg: string;
  cpfcnpj: string;
  guia_rua: string;
  cidade: string;
  celular1: string;
  vencimento: Date | undefined;
  celular2: string;
  empresaAtual: string;
  servicosUsados: string;
  motivo: string;
  planodesaude: string;
  indicacao: string;
  usuario: string;
  data: Date;
  dependentes: Array<Partial<DependentesProps>>;
  form_pag?: string;
  adesao?: Date;
  dataVenda: Date;
}

export function Historico() {
  const [open,setOpen] = useState(false)
  const {
    postData,
    data,
    loading: loadingLeads,
  } = useApiGet<Array<LeadProps>, ReqLeadsProps>("/lead/lista");
  const [lead, setLead] = useState<Partial<LeadProps>>();
  const [categoria, setCategoria] = useState("");
  const { postData: postCategoria } = useApiPost<
    LeadProps,
    {
      id_lead: number | undefined;
      categoriaAtual: string;
      categoriaAnt: string | undefined;
      usuario: string | undefined;
    }
  >("/leads/alterarCategoria");
  const { selectEmp, carregarDados, consultores } = useContext(AuthContext);
  const [modal, setModal] = useState<{ [key: string]: boolean }>({
    lead: false,
    confirmaCategoria: false,
    filtro: false,
    novo: false,
    confirmaPlano: false,
    print: false,
  });
  const componenteRef = useRef<DocListaLeads>(null);

  const {
    data: associado,
    loading,
    postData: postAssociado,
  } = useApiPost<
    {
      id_contrato: number;
      id_global: number;
      id_contrato_global: number;
    },
    Partial<CadastroRequest>
  >("/leads/gerarPlano", undefined, undefined, () => {
    setModal({ novo: true }), reqDados(getValues());
  });

  const { register, handleSubmit, control, watch, getValues } =
    useForm<ReqLeadsProps>({
      defaultValues: {

        statusSelected: "VENDA",
      },
    });

  const onChangeCategoria = (
    e: React.ChangeEvent<HTMLSelectElement>,
    lead: Partial<LeadProps>
  ) => {
    if (lead.status === e.target.value) {
      return;
    }
    setCategoria(e.target.value);
    setLead(lead);
    setModal({ confirmaCategoria: true });
  };

  const imprimir = useReactToPrint({
    pageStyle: pageStyleLandscape,
    content: () => componenteRef.current,
    onAfterPrint: () => {
      setModal({
        print: false,
      });
    },
  });

  useEffect(() => {
    if (modal.print) imprimir();
  }, [modal]);

  const handleGerarContrato = async () => {
    if (lead?.status !== "VENDA") {
      toast.warning("Selecione uma venda para gerar contrato!");
      return;
    }
    if (
      !lead.endereco ||
      !lead.bairro ||
      !lead.cep ||
      !lead.cidade ||
      !lead.id_plano ||
      !lead.plano ||
      !lead.valor_mensalidade ||
      !lead.vencimento ||
      !lead.origem ||
      !lead.cpfcnpj ||
      !lead.n_parcelas
    ) {
      toast.warning(
        "Preencha todos os campos obrigatorios para gerar contrato!"
      );
      return;
    }
    let adesao;
    if (lead.adesao) {
      adesao = new Date(lead.adesao);
      adesao.setTime(adesao.getTime() - adesao.getTimezoneOffset() * 60 * 1000);
    }
    let dtVencimento;
    if (lead.vencimento) {
      dtVencimento = new Date(lead.vencimento);
      dtVencimento.setTime(
        dtVencimento.getTime() - dtVencimento.getTimezoneOffset() * 60 * 1000
      );
    }

    await postAssociado({
      dataPlano: {
        dependentes: lead.dependentes,
        bairro: lead.bairro,
        celular1: lead.celular1,
        celular2: lead.celular2,
        cep: lead.cep,
        cidade: lead.cidade,
        cpfcnpj: lead.cpfcnpj,
        data_nasc: lead.data_nasc,
        endereco: lead.endereco,
        id_empresa: selectEmp,
        nome: lead.nome,
        numero: lead.numero,
        uf: lead.uf,
        rg: lead.rg,
        contrato: {
          id_plano: lead.id_plano,
          plano: lead.plano,
          valor_mensalidade: lead.valor_mensalidade,
          n_parcelas: lead.n_parcelas,
          data_vencimento: dtVencimento,
          dt_adesao: adesao,
          dt_carencia: new Date(),
          origem: lead.origem,
          consultor: lead.consultor,
          // form_pag: lead.form_pag,
        },
        mensalidades: gerarMensalidade({
          vencimento: dtVencimento,
          n_parcelas: lead.n_parcelas,
          valorMensalidade: Number(lead.valor_mensalidade),
        }),
      },
      id_lead: lead.id_lead,
    });
  };

  const handleAtualizarCategoria = useCallback(async () => {
    try {
      await postCategoria({
        categoriaAtual: categoria,
        categoriaAnt: lead?.status,
        usuario: lead?.usuario,
        id_lead: lead?.id_lead,
      });
     // postData({});
      reqDados(getValues());
      setModal({ confirmaCategoria: false });
    } catch (error) {
      console.log(error);
    }
  }, [categoria, lead?.id_lead]);

  const reqDados: SubmitHandler<ReqLeadsProps> = useCallback(async (data) => {
    // const start =watch('startDate')
    //const  end = watch('endDate')

    if (
      data.startDate &&
      data.endDate &&
      new Date(data.startDate) > new Date(data.endDate)
    ) {
      toast.warning("Data inicial não pode ser maior que a data final");
    }
    const { dataIni, dataFim } = ajustarData(
      data.startDate ? new Date(data.startDate) : undefined,
      data.endDate ? new Date(data.endDate) : undefined
    );
    try {
      await postData({
        ...data,
        status: data.statusSelected ? data?.statusSelected?.split(",") : [],
        startDate: dataIni,
        endDate: dataFim,
      });

      setModal({ filtro: false });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // const start =watch('startDate')
    // const  end = watch('endDate')
    //  const {dataIni,dataFim} = ajustarData(start?new Date(start):undefined,
    //  end?new Date(end):undefined)
    reqDados({
      statusSelected: "VENDA",
    });
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="ml-2 text-sm ">
        Histórico
      </DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Leads/Prospecões/Vendas</DialogTitle>
        </DialogHeader>
      {modal.filtro && (
        <ModalFiltro
          consultores={consultores
            .filter((item) => item.funcao === "PROMOTOR(A) DE VENDAS")
            .map((item) => ({ label: item.nome, value: item.nome }))}
          loading={loadingLeads}
          handleSubmit={handleSubmit}
          register={register}
          control={control}
          handleOnSubmit={reqDados}
          show={modal.filtro}
          onClose={() => setModal({ filtro: false })}
        />
      )}
      {modal.lead && (
        <ModalItem
          handleLoadLeads={() => reqDados(getValues())}
          item={lead ?? {}}
          open={modal.lead}
          onClose={() => setModal({ lead: false })}
        />
      )}
      <ModalConfirmar
        pergunta={`Tem certeza que deseja alterar o(a) ${lead?.status} para um(a) ${categoria} ? Essa alteração será contabilizada na faturação!`}
        handleConfirmar={handleAtualizarCategoria}
        openModal={modal.confirmaCategoria}
        setOpenModal={() => setModal({ confirmaCategoria: false })}
      />

      {modal.confirmaPlano && (
        <ModalConfirmar
          pergunta={`Tem certeza que deseja Transformar essa venda em Plano ?`}
          handleConfirmar={handleGerarContrato}
          openModal={modal.confirmaPlano}
          setOpenModal={() => setModal({ confirmaPlano: false })}
        />
      )}

      {modal.novo && (
        <ModalNovoContrato
          id_global={associado?.id_global}
          carregarDados={carregarDados}
          id_contrato={associado?.id_contrato}
          loading={loading}
          show={modal.novo}
          onClose={() => setModal({ novo: false })}
        />
      )}
      <div className="inline-flex gap-4">
        `
        <Button
          onClick={() => setModal({ filtro: true })}
          size={"sm"}
          variant={"outline"}
        >
          <MdFilter1 />
          FILTRAR
        </Button>
        <Button
          onClick={() => setModal({ print: true })}
          size={"sm"}
          variant={"outline"}
        >
          <MdPrint />
          IMPRIMIR
        </Button>
      </div>

      {loadingLeads ? (
        <ModalLoading show={loadingLeads} />
      ) : (
        <div className="overflow-y-auto mt-2  max-h-[calc(100vh-185px)]   ">
  <Table className="rounded-none border-none shadow-none">
  <TableHeader>
    <TableRow className="bg-gray-50">
      <TableHead className="px-3 py-1 text-xs text-black font-bold">Nome</TableHead>
      <TableHead className="px-3 py-1 text-xs text-black font-bold">Cidade</TableHead>
      <TableHead className="px-3 py-1 text-xs text-black font-bold">Previsão de Visita</TableHead>
      <TableHead className="px-3 py-1 text-xs text-black font-bold">Data Cad.</TableHead>
      <TableHead className="px-3 py-1 text-xs text-black font-bold">Data Venda</TableHead>
      <TableHead className="px-3 py-1 text-xs text-black font-bold">Categoria</TableHead>
      <TableHead className="px-3 py-1 text-xs text-black font-bold">Vendedor</TableHead>
      <TableHead className="px-3 py-1 text-xs text-black font-bold">Celular1</TableHead>
      <TableHead className="px-3 py-1 text-xs text-black font-bold">Vencimento</TableHead>
      <TableHead className="px-3 py-1 text-xs text-black font-bold"></TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {data?.map((item, index) => (
      <TableRow
        key={index}
        className="cursor-pointer hover:bg-muted"
        onClick={() => {
          setLead(item);
          setModal({ lead: true });
        }}
      >
        <TableCell className="px-2 py-0 text-[10px] text-black">{item?.nome}</TableCell>
        <TableCell className="px-2 py-0 text-[10px] text-black">
          {item?.cidade}/{item?.uf}
        </TableCell>
        <TableCell className="px-2 py-0 text-[10px] text-black">
          {item?.visita &&
            new Date(item?.visita).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
        </TableCell>
        <TableCell className="px-2 py-0 text-[10px] text-black">
          {item?.data &&
            new Date(item?.data).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
        </TableCell>
        <TableCell className="px-2 py-0 text-[10px] text-black">
          {item?.dataVenda &&
            new Date(item?.dataVenda).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
        </TableCell>
        <TableCell
          className={`px-2 py-0 text-[10px] ${
            item?.status === "LEAD"
              ? "text-blue-600"
              : item.status === "PROSPECCAO"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <select
            onChange={(e) => onChangeCategoria(e, item)}
            className="appearance-none border-none bg-transparent text-xs focus:outline-none"
            value={item?.status}
          >
            <option value="LEAD">LEAD</option>
            <option value="PROSPECCAO">PROSPECCAO</option>
            <option value="PRE VENDA">PRE VENDA</option>
            <option value="VENDA">VENDA</option>
          </select>
        </TableCell>
        <TableCell className="px-2 py-0 text-[10px] text-black">{item?.consultor}</TableCell>
        <TableCell className="px-2 py-0 text-[10px] text-black">{item?.celular1}</TableCell>
        <TableCell className="px-2 py-0 text-[10px] text-black">
          {item?.vencimento
            ? new Date(item?.vencimento).toLocaleDateString()
            : ""}
        </TableCell>
        <TableCell className="px-2 py-0 text-[10px] text-black">
          {item.status === "VENDA" && (
            <button
              type="button"
              data-tooltip-id="tooltipAcoes"
              data-tooltip-content="Criar Plano"
              onClick={(e) => {
                e.stopPropagation();
                setLead(item);
                setModal({ confirmaPlano: true });
              }}
            >
              <MdCreateNewFolder size={20} />
            </button>
          )}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

          <Tooltip id="tooltipAcoes" />
        </div>
      )}

      <div style={{ display: "none" }}>
        {modal.print && <DocListaLeads ref={componenteRef} leads={data ?? []} />}
      </div>
      </DialogContent>
    </Dialog>
  );
}

interface DataProps {
  show: boolean;
  onClose: () => void;
  loading: boolean;
  handleOnSubmit: SubmitHandler<ReqLeadsProps>;
  register: UseFormRegister<ReqLeadsProps>;
  control: Control<ReqLeadsProps, any>;
  handleSubmit: UseFormHandleSubmit<ReqLeadsProps>;
  consultores: Array<{ label: string; value: string }> | [];
}

export const ModalFiltro = ({
  onClose,
  show,
  handleOnSubmit,
  register,
  control,
  handleSubmit,
  loading,
  consultores,
}: DataProps) => {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col gap-2 mt-1"
        >
          <Controller
            control={control}
            name="consultores"
            render={({ field }) => (
              <MultiSelects
                options={consultores}
                onChange={field.onChange}
                selected={field.value??[]}
                placeholder="CONSULTORES"
              />
            )}
          />

          <div>
            <Label className="text-xs" value="Nome" />
            <Input
              {...register("nome")}
              className="uppercase"
              placeholder="NOME"
            />
          </div>

          <div>
            <Label className="text-xs" value="Categoria" />

            <Controller
              control={control}
              name="statusSelected"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="STATUS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="LEAD">LEAD</SelectItem>
                      <SelectItem value="PROSPECCAO">PROSPECÇÃO</SelectItem>
                      <SelectItem value="PRE VENDA">PRE VENDA</SelectItem>
                      <SelectItem value="VENDA">VENDA</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="inline-flex w-full justify-between gap-2">
            <div>
              <Label className="text-xs" value="Data inicio" />
              <Controller
                control={control}
                name="startDate"
                render={({ field: { onChange, value } }) => (
                  <DatePickerInput
                    value={value ? new Date(value) : undefined}
                    onChange={onChange}
                    className="h-9"
                  />
                )}
              />
            </div>

            <div>
              <Label className="text-xs" value="Data fim" />
              <Controller
                control={control}
                name="endDate"
                render={({ field: { onChange, value } }) => (
                  <DatePickerInput
                    value={value ? new Date(value) : undefined}
                    onChange={onChange}
                    className="h-9"
                  />
                )}
              />
            </div>
          </div>
          <Button className="mt-2" type="submit">
            {loading ? <Spinner size="sm" /> : "Aplicar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ModalNovoContratoProps {
  show: boolean;
  onClose: () => void;
  loading: boolean;
  id_contrato: number | undefined;
  id_global: number | undefined;
  carregarDados: Function;
}

export const ModalNovoContrato = ({
  id_contrato,
  loading,
  onClose,
  show,
  carregarDados,
  id_global,
}: ModalNovoContratoProps) => {
  return (
    <Modal size="sm" popup show={show} onClose={onClose}>
      <Modal.Body>
        <div className="flex flex-col justify-center items-center w-full gap-2 mt-6">
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <div className="flex flex-col w-full gap-4">
              <div className="inline-flex items-center gap-1">
                <MdCheckCircle size={24} className="text-green-500" />
                <span className="font-semibold">Sucesso</span>
              </div>
              <h1 className="text-md font-semibold">
                Novo Contrato: {id_contrato?.toString()}
              </h1>
              <div className="flex w-full justify-between">
                <Button
                  onClick={() => {
                    Router.push(`/dashboard/admcontrato`);
                    carregarDados(id_global);
                  }}
                  variant={"outline"}
                >
                  Acessar Contrato
                </Button>
                <Button variant={"destructive"} onClick={onClose}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
