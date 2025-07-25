import useApiGet from "@/hooks/useApiGet";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ModalItem } from "./modalItem/modalItem";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import useApiPost from "@/hooks/useApiPost";
import { Button } from "@/components/ui/button";
import "react-datepicker/dist/react-datepicker.css";

import {
  SubmitHandler,
  useForm,
} from "react-hook-form";
import {

  MdFilter1,
  MdPrint,
} from "react-icons/md";

import { AuthContext } from "@/store/AuthContext";
import { gerarMensalidade, ParcelaData } from "@/utils/gerarArrayMensal";
import { ContratoProps, DependentesProps } from "@/types/associado";
import { ajustarData } from "@/utils/ajusteData";
import { ModalLoading } from "@/components/modals/loading/modalLoading";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { pageStyleLandscape } from "@/utils/pageStyle";
import { PaginationComponent } from "@/components/PaginationComponent";
import { ModalFiltroHistorico } from "./ModalFiltroHistorico";
import { TableHistoricoVendas } from "./TableHistorico";
import { ModalNovoContrato } from "./ModalNovoContrato";
import { LeadProps } from "@/types/vendas";
import DocListaLeads from "@/Documents/vendas/DocLeads";



const camposObrigatorios: Partial<Record<keyof LeadProps, string>> = {
  endereco: "Endereço",
  bairro: "Bairro",
  cep: "CEP",
  cidade: "Cidade",
  id_plano: "Plano (ID)",
  plano: "Plano",
  valor_mensalidade: "Valor da Mensalidade",
  vencimento: "Vencimento",
  origem: "Origem",
  cpfcnpj: "CPF/CNPJ",
  n_parcelas: "Número de Parcelas",
  adesao: "Data de Adesão",
};

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



export function Historico() {
  const [open,setOpen] = useState(false)
  const {
    postData,
    data,
    loading: loadingLeads,
  } = useApiGet<Array<LeadProps>, ReqLeadsProps>("/lead/lista");
  const [lead, setLead] = useState<Partial<LeadProps>>({});
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


  const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage =10;

const paginatedData = data?.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);

const totalPages = data ? Math.ceil(data.length / rowsPerPage) : 1;

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
  >("/leads/gerarPlano", undefined, () => {
     reqDados(getValues())},
    () => {
      setModal(prev=>({...prev,novo:true}))
    },  
    
    );

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
    setModal(prev=>({...prev,confirmaCategoria:true}));
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

  const handleGerarContrato:SubmitHandler<LeadProps> = async (data) => {
   
    if (lead?.status !== "VENDA") {
      toast.warning("Selecione uma venda para gerar contrato!");
      return;
    }
   
    const camposFaltando = Object.entries(camposObrigatorios)
    .filter(([key]) => !data[key as keyof LeadProps])
    .map(([, nomeLegivel]) => nomeLegivel);

  if (camposFaltando.length > 0) {
    toast.warning(
      `Preencha os seguintes campos obrigatórios para gerar o contrato:\n${camposFaltando.join(", ")}`
    );
    return;
  }
    let adesao;
    if (data.adesao) {
      adesao = new Date(data.adesao);
      adesao.setTime(adesao.getTime() - adesao.getTimezoneOffset() * 60 * 1000);
    }
    let dtVencimento;
    if (data.vencimento) {
      dtVencimento = new Date(data.vencimento);
      dtVencimento.setTime(
        dtVencimento.getTime() - dtVencimento.getTimezoneOffset() * 60 * 1000
      );
    }
try{
    await postAssociado({
      dataPlano: {
        dependentes: data.dependentes,
        bairro: data.bairro,
        celular1: data.celular1,
        celular2: data.celular2,
        cep: data.cep,
        cidade: data.cidade,
        cpfcnpj: data.cpfcnpj,
        data_nasc: data.data_nasc,
        endereco: data.endereco,
        id_empresa: selectEmp,
        nome: data.nome,
        numero: data.numero,
        uf: data.uf,
        rg: data.rg,
        contrato: {
          id_plano: Number(data.id_plano),
          plano: data.plano,
          valor_mensalidade: data.valor_mensalidade,
          n_parcelas: data.n_parcelas,
          data_vencimento: dtVencimento,
          dt_adesao: adesao,
          dt_carencia: new Date(),
          origem: data.origem,
          consultor: data.consultor,
          // form_pag: lead.form_pag,
        },
        mensalidades: gerarMensalidade({
          vencimento: dtVencimento,
          n_parcelas: data.n_parcelas,
          valorMensalidade: Number(data.valor_mensalidade),
        }),
      },
      id_lead: data.id_lead,
    });
    
   // setModal({ novo: true });
  
  }catch(error){
    console.log(error);
  }
}

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

      setModal(prev=>({...prev,filtro:false}));
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
        <ModalFiltroHistorico
          consultores={consultores
            .filter((item) => item.funcao === "PROMOTOR(A) DE VENDAS")
            .map((item) => ({ label: item.nome, value: item.nome }))}
          loading={loadingLeads}
          handleSubmit={handleSubmit}
          register={register}
          control={control}
          handleOnSubmit={reqDados}
          show={modal.filtro}
          onClose={() => setModal(prev=>({...prev,filtro:false}))}
        />
      )}
      {modal.lead && (
        <ModalItem
          handleLoadLeads={() => reqDados(getValues())}
          item={lead ?? {}}
          open={modal.lead}
          onClose={() => setModal(prev=>({...prev,lead:false}))}
          handleGerarContrato={handleGerarContrato}
        />
      )}
      <ModalConfirmar
        pergunta={`Tem certeza que deseja alterar o(a) ${lead?.status} para um(a) ${categoria} ? Essa alteração será contabilizada na faturação!`}
        handleConfirmar={handleAtualizarCategoria}
        openModal={modal.confirmaCategoria}
        setOpenModal={() => setModal(prev=>({...prev,confirmaCategoria:false}))}
      />

  
      {modal.novo && (
        <ModalNovoContrato
          closeAll={()=>setOpen(false)}
          id_global={associado?.id_global}
          carregarDados={carregarDados}
          id_contrato={associado?.id_contrato}
          loading={loading}
          show={modal.novo??false}
          onClose={() => setModal(prev=>({...prev,novo:false}))}
        />
      )}
      <div className="inline-flex gap-4">
        `
        <Button
          onClick={() => setModal(prev=>({...prev,filtro:true}))}
          size={"sm"}
          variant={"outline"}
        >
          <MdFilter1 />
          FILTRAR
        </Button>
        <Button
          onClick={() => setModal(prev=>({...prev,print:true}))}
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

          <TableHistoricoVendas
            data={paginatedData ?? []}
            onChangeCategoria={onChangeCategoria}
            setLead={setLead}
            setModal={setModal}
          />

{data && data.length > rowsPerPage && (
  <div className="mt-4 flex justify-center">
<PaginationComponent
  currentPage={currentPage}
  totalPages={totalPages}
  setCurrentPage={setCurrentPage}
/>
  </div>
)}

         
        </div>
      )}

      <div style={{ display: "none" }}>
        {modal.print && <DocListaLeads ref={componenteRef} leads={data ?? []} />}
      </div>
      </DialogContent>
    </Dialog>
  );
}




