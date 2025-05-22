import { api } from "@/lib/axios/apiClient";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "@/store/AuthContext";
import Orcamento from "@/Documents/afapSaude/orcamento";
import { ajustarData } from "@/utils/ajusteData";
import handleWhatsAppClick from "@/utils/openWhats";
import pageStyle from "@/utils/pageStyle";
import { ReciboMensalidade } from "@/Documents/associado/mensalidade/Recibo";
import { ExameRealizadoProps, ExamesProps } from "@/types/afapSaude";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamesTable } from "@/components/afapSaude/exames/ExamesTable";
import { FiltroExames } from "./filtro";
import { ModalAdministrarExame } from "./modalDadosExame/modalAdministrarExame";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { useForm } from "react-hook-form";
import { useExamesHandlers } from "@/hooks/useExameHandlers";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HiDocumentAdd } from "react-icons/hi";
import { verify } from "crypto";

interface DataProps {
  exames: Array<ExamesProps>;
  verifyPermission: (permission: string) => boolean;
}

interface FiltroForm {
  endDate?: Date;
  nome?: string;
  startDate?: Date;
  status: string;
}

export default function Exames({ exames,verifyPermission }: DataProps) {
  const valorInicial = {
    id_exame: null,
    celular: "",
    data_orcamento: new Date(),
    data_realizado: new Date(),
    exames: [],
    coleta: "",
    tipoDesc: "",
    cpf: "",
    data_nasc: undefined,
    nome_responsavel: "",
    parentesco: "",
    nome: "",
    status: "",
    user: "",
    endereco: "",
    id_selected: null,
    numero: null,
    bairro: "",
    cidade: "",
    exame: "",
    data_prev: undefined
    


  };
  const [examesRealizados, setExames] = useState<Array<ExameRealizadoProps>>(
    []
  );
  const [exameSelected, setExameSelected] =
    useState<ExameRealizadoProps>(valorInicial);
  const { usuario } = useContext(AuthContext);
  const currentPage = useRef<HTMLDivElement|null>(null);
  const currentRecibo = useRef<HTMLDivElement|null>(null);
  const { control, handleSubmit, reset, getValues } = useForm<FiltroForm>({
    defaultValues: {
      endDate: new Date(),
      nome: undefined,
      startDate: new Date(),
      status: "",
    },
  });

  const [modal, setModal] = useState<{ [key: string]: boolean }>({
    receber: false,
    deletar: false,
    filtro: false,
    estornar: false,
    administrar: false,
  });

  const {
    handleDeletar,
    handleEditarExame,
    handleNovoExame,
    handleReceberExame,
    onRevert,
    formPag,
    setFormPag,
  } = useExamesHandlers({
    exameSelected,
    examesRealizados,
    setExames,
    listarExamesRealizados: () => listarExamesRealizados(getValues()),
    setModal,
    setExameSelected,
    valorInicial,
  });

  const imprimirOrcamento = useCallback(
    useReactToPrint({
      pageStyle: pageStyle,
      content: () => currentPage.current,
      onBeforeGetContent: () => {
        if (!exameSelected?.id_exame) {
          toast.error("Selecione um exame para imprimir");
          return Promise.reject();
        }
        Promise.resolve();
      },
    }),
    [exameSelected]
  );

  const imprimirRecibo = useCallback(
    useReactToPrint({
      pageStyle: pageStyle,
      content: () => currentRecibo.current,
      onBeforeGetContent: () => {
        if (!exameSelected?.id_exame) {
          toast.error("Selecione um exame para imprimir");
          return Promise.reject();
        }
        if (exameSelected?.status !== "RECEBIDO") {
          toast.error("Exame ainda não recebido");
          return Promise.reject();
        }
        Promise.resolve();
      },
    }),
    [exameSelected]
  );

  useEffect(() => {
    if(examesRealizados.length > 0) return
    listarExamesRealizados(getValues());
  }, []);

  const listarExamesRealizados = useCallback(
    async ({ endDate, nome, startDate, status }: FiltroForm) => {
      if (startDate && endDate && startDate > endDate) {
        toast.error("Data inicial maior que data final");
        return;
      }

      const { dataFim, dataIni } = ajustarData(startDate, endDate);

      try {
        const response = await api.post("/afapSaude/examesRealizados/listar", {
          endDate: dataFim,
          nome,
          startDate: dataIni,
          status,
        });
        setExames(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    []
  );

  return (
    <div className="flex flex-col px-4 space-y-2">
      {modal.administrar && (
        <ModalAdministrarExame
          verifyPermission={verifyPermission}
          handleEditarExame={handleEditarExame}
          handleNovoExame={handleNovoExame}
          arraySelectExames={exames}
          openModal={modal.administrar}
          setOpenModal={() => setModal({ administrar: false })}
          registro={exameSelected}
        />
      )}
      <div className="flex w-full justify-between items-center gap-2 flex-wrap">
        <div className="flex  gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setModal({ filtro: true })}
          className="text-black"
        >
          <FilterIcon />
          Filtro
        </Button>

        {modal.filtro && (
          <FiltroExames
            filtroExames={listarExamesRealizados}
            loading={false}
            openModal={modal.filtro}
            setOpenModal={() => setModal({ filtro: false })}
            control={control}
            handleSubmit={handleSubmit}
            reset={reset}
          />
        )}

         <Button
         disabled={verifyPermission('AFS2.1')}
          variant="outline"
          size="sm"
          onClick={()=>{setModal({ administrar: true });
            setExameSelected(valorInicial);}}
        >
          <HiDocumentAdd />
          <span className=" sm:inline">Adicionar</span>
        </Button>

        </div>

        
        <span className="text-xs font-medium">
          QUANTIDADE: {examesRealizados.length}
        </span>
      
      </div>

      <div className="overflow-auto  max-h-[calc(100vh-150px)]">
        <ExamesTable
          onAdd={() => setModal({ administrar: true })}
          onEdit={() => setModal({ administrar: true })}
          onPrintBudget={imprimirOrcamento}
          onPrintReceipt={imprimirRecibo}
          onReceive={() => setModal({ receber: true })}
          onRevert={() => setModal({ estornar: true })}
          onWhatsApp={() => handleWhatsAppClick({phone:exameSelected?.celular})}
          onDelete={() => setModal({ deletar: true })}
          exames={examesRealizados}
          selectedExame={exameSelected}
          onSelectExame={setExameSelected}
          verifyPermission={verifyPermission}
        />
      </div>

      {modal.receber && (
        <ModalConfirmar
          pergunta="Realmente deseja receber esse exame?"
          handleConfirmar={handleReceberExame}
          openModal={modal.receber}
          setOpenModal={() => setModal({ receber: false })}
        >
          <Select
            value={formPag}
            onValueChange={(e) => {
              setFormPag(e);
            }}
          >
            <SelectTrigger
              className={`  shadow-none font-semibold  focus:ring-0  `}
            >
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent className="shadow-none">
              <SelectGroup className="shadow-none">
                <SelectItem className="text-xs" value="DINHEIRO">
                  DINHEIRO
                </SelectItem>
                <SelectItem className="text-xs" value="CARTAO">
                  CARTÃO
                </SelectItem>
                <SelectItem className="text-xs" value="PIX">
                  PIX
                </SelectItem>
                <SelectItem className="text-xs" value="TRANSFERENCIA">
                  TRANSFERÊNCIA
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </ModalConfirmar>
      )}

      <ModalConfirmar
        handleConfirmar={handleDeletar}
        openModal={modal.deletar}
        pergunta="Tem certeza que deseja excluir esse exame?"
        setOpenModal={() => setModal({ deletar: false })}
      />

      <ModalConfirmar
        handleConfirmar={onRevert}
        openModal={modal.estornar}
        pergunta="Tem certeza que deseja estornar esse exame?"
        setOpenModal={() => setModal({ estornar: false })}
      />

      <div style={{ display: "none" }}>
        <Orcamento
          ref={currentPage}
          dados={exameSelected}
          usuario={usuario?.nome ?? ""}
       
        />
        
       <ReciboMensalidade
          cidade_uf="CEDRO/CE"
          endereco="RUA VER. SALUSTIANO MOURA, 394 - CENTRO"
          logoUrl="/afapsaude.png"
          associado={
            exameSelected.nome_responsavel
              ? exameSelected?.nome_responsavel
              : exameSelected?.nome
          }
          contrato={exameSelected?.id_exame ?? null}
          data_pgto={exameSelected?.data_realizado ?? null}
          n_doc=""
          referencia=""
          valor={exameSelected?.exames.reduce(
            (total, exame) => total + exame.valorFinal,
            0
          )}
          vencimento={new Date()}
          ref={currentRecibo}
          referente={`Exames`}
        />
        
       
      </div>
    </div>
  );
}
