"use client";

import { api } from "@/lib/axios/apiClient";
import { MdOutlineLaunch } from "react-icons/md";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import pt from "date-fns/locale/pt-BR";
import { ModalLancamentosCaixa } from "@/components/modals/caixa/modalLancamentosCaixa";
import { AuthContext } from "@/store/AuthContext";
import { Modal, Spinner } from "flowbite-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ajustarData } from "@/utils/ajusteData";
import { ScreenCloseCaixa } from "@/app/(protected)/dashboard/caixa/_components/screenCloseCaixa";
import { ModalMensalidade } from "@/components/modals/admContrato/historico/modalmensalidade";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BiCalendarMinus } from "react-icons/bi";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { toast } from "sonner";

import { MensalidadeBaixaProps } from "@/types/financeiro";
import ActionsCaixa from "@/app/(protected)/dashboard/caixa/_components/ActionsCaixa";
import { CardValuesCaixa } from "@/app/(protected)/dashboard/caixa/_components/card-values-caixa";
import { TableCaixa } from "@/app/(protected)/dashboard/caixa/_components/table-caixa";
import { ModalFechamento } from "@/components/modals/caixa/modalFechamento";
import HeaderCaixa from "./_components/header-caixa";
import {
  FormCaixaProps,
  LancamentosProps,
  ResponseCaixaProps,
} from "./_types/types";
import useActionsCaixa from "./_hooks/useActionsCaixa";

export default function CaixaMovimentar() {

  const [saldo, setSaldo] = useState(0);
  const { usuario, permissoes, infoEmpresa } = useContext(AuthContext);
  const [selectRelatorio, setSelectRelatorio] = useState<string | null>(null);
  const [despesas, setDespesas] = useState<number>(0);
  const [data, setData] = useState<Partial<ResponseCaixaProps>>();
  const [filteredData, setFilteredData] =
    useState<Partial<ResponseCaixaProps>>();
  const [tipoFiltro, setTipoFiltro] = useState<string>("TODOS");
  const [valorForma, setValorForma] = useState<Record<string, number>>();
  const [openModal, setModal] = useState<{ [key: string]: boolean }>({
    lancar: false,
    excluir: false,
    fecharCaixa: false,
  });
  const { register, watch, handleSubmit, control } = useForm<FormCaixaProps>({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const {
    buscarMensalidade,
    loading,
    mensalidade,
    modalDados,
    setModalDados,
    setLoading
  } = useActionsCaixa();

  useEffect(() => {
    if (modalDados) return;
    let currentBarcode = "";
    let timeout: ReturnType<typeof setTimeout>;

    const handleKeyPress = (event: KeyboardEvent) => {
      event.stopPropagation();
      //Verifica se a tecla "Enter" foi pressionada
      if (event.key === "Enter") {
        //setScannedCode(currentBarcode);

        event.preventDefault();
        buscarMensalidade(currentBarcode);
        currentBarcode = ""; // Reinicia o código de barras após a leitura
        setModal({ lancar: false });
      } else {
        //Acumula os caracteres do código de barras
        currentBarcode += event.key;
      }

      //Limpa o buffer se não houver atividade por 300ms
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        currentBarcode = "";
      }, 300);
    };

    //Adiciona o ouvinte de eventos para capturar as teclas pressionadas
    document.addEventListener("keydown", handleKeyPress, true);

    //Remove o ouvinte de eventos quando o componente é desmontado
    return () => {
      document.removeEventListener("keydown", handleKeyPress, true);
    };
  }, [modalDados, infoEmpresa]);

  /*  useEffect(()=>{



        const handleScanner=(event:KeyboardEvent)=>{

            if(event.key==='F2'){
               if (!watch('id_empresa')) {
                toast.info('Selecione uma empresa')
                return
               }
                setScanner(true)
            }
           
        }

        document.addEventListener('keydown',handleScanner)

        return () => {
            document.removeEventListener('keydown', handleScanner);
        };



    },[])*/

  useEffect(() => {
    handleChamarFiltro();
  }, [infoEmpresa]);

  

  const handleChamarFiltro = () => {
    listarLancamentos({
      endDate: watch("endDate"),
      startDate: watch("startDate"),
      id_empresa: infoEmpresa?.id ?? "",
      descricao: watch("descricao"),
    });
  };

  const listarLancamentos: SubmitHandler<FormCaixaProps> = useCallback(
    async (data) => {
      if (data.startDate > data.endDate) {
        toast.info("Data final deve ser maior que a data inicial");
        return;
      }

      const { dataIni, dataFim } = ajustarData(data.startDate, data.endDate);
      try {
        setLoading(true);
        const response = await api.post("/listarLancamentos", {
          id_empresa: infoEmpresa?.id,
          dataInicial: dataIni,
          dataFinal: dataFim,
          descricao: data.descricao,
          // id_user:usuario?.id
        });

        //console.log(response.data)

        setData(response.data);
        setFilteredData(response.data);
        // setLancamentos(lista)
        // setPlanos(plano_de_contas)
        // setGrupos(grupos)
        // setFechado(fechamento)
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    },
    [infoEmpresa?.id, usuario]
  );

  useEffect(() => {
    if (data?.lista && data?.lista.length > 0) {
      const totalPorFormaPagamento = data?.lista?.reduce((acc, lancamento) => {
        if (
          lancamento.lancamentoForma &&
          typeof lancamento.lancamentoForma === "object"
        ) {
          Object?.entries(lancamento?.lancamentoForma)?.forEach(
            ([forma, dados]) => {
              lancamento.tipo === "RECEITA"
                ? (acc[dados.forma] =
                    (acc[dados.forma] || 0) + Number(dados.valor))
                : (acc[dados.forma] =
                    (acc[dados.forma] || 0) - Number(dados.valor));
            }
          );
        }
        return acc;
      }, {} as Record<string, number>);

      setValorForma(totalPorFormaPagamento);

      const soma = data.lista?.reduce((total, item) => {
        if (item.tipo === "RECEITA") {
          return (total = total + Number(item.valor));
        } else return (total = total - Number(item.valor));
      }, 0);
      setSaldo(soma);
      const somadespesas = data.lista?.reduce((total, item) => {
        if (item.tipo === "DESPESA") {
          return (total = total + Number(item.valor));
        } else {
          return total;
        }
      }, 0);
      setDespesas(somadespesas);
    } else {
      setSaldo(0);
      setDespesas(0);
      setValorForma({});
    }
  }, [data?.lista]);

  return (
    <>
      {/*openModal.lancar && <ModalLancamento bancos={infoEmpresa?.bancos??[]} id_empresa={infoEmpresa?.id??''} handleFiltro={handleChamarFiltro}  mov={mov??{}} openModal={openModal.lancar} setOpenModal={()=>setModal({lancar:false})}  planos={data?.plano_de_contas??[]}  grupo={data?.grupo??[]}/>*/}

      <ModalConfirmar
        openModal={openModal.excluir}
        handleConfirmar={handleExcluir}
        pergunta="Deseja excluir o lançamento?"
        setOpenModal={() => setModal({ excluir: false })}
      />

      {/*<ModalDadosMensalidade  handleChamarFiltro={handleChamarFiltro} setMensalidade={setMensalidade} mensalidade={mensalidade??{}} open={modalDados} setOpen={setModalDados}/>*/}

      {modalDados && (
        <ModalMensalidade
          handleAtualizar={() =>
            listarLancamentos({
              startDate: watch("startDate"),
              endDate: watch("endDate"),
              id_empresa: infoEmpresa?.id ?? "",
              descricao: watch("descricao"),
            })
          }
          mensalidade={{
            ...mensalidade,
          }}
          openModal={modalDados}
          setOpenModal={setModalDados}
        />
      )}

      <Modal size={"sm"} popup show={loading}>
        <Modal.Body>
          <div className=" flex flex-col mt-6 w-full justify-center items-center">
            <Spinner size={"lg"} color={"warning"} />
            <span>Localizando dados....</span>
          </div>
        </Modal.Body>
      </Modal>

      <div className="flex flex-col  w-full ">
        <HeaderCaixa
          setFilteredData={setFilteredData}
          setModal={setModal}
          setMov={setMov}
          setSelectRelatorio={setSelectRelatorio}
          saldo={saldo}
          despesas={despesas}
          valorForma={valorForma}
          data={data}
          control={control}
          handleSubmit={handleSubmit}
          listarLancamentos={listarLancamentos}
          register={register}
          tipoFiltro={tipoFiltro}
          setTipoFiltro={setTipoFiltro}
          infoEmpresa={infoEmpresa}
        />
        {!!data?.fechamento ? (
          <ScreenCloseCaixa fechamento={data.fechamento} />
        ) : (
          <TableCaixa
            setModal={setModal}
            setMov={setMov}
            permissoes={permissoes}
            data={filteredData || data}
          />
        )}

        {!data?.fechamento && (
          <div className="inline-flex gap-3   text-black w-full bg-white p-2"></div>
        )}
      </div>

      {openModal.fecharCaixa && (
        <ModalFechamento
          listar={() =>
            listarLancamentos({
              endDate: watch("endDate"),
              startDate: watch("startDate"),
              id_empresa: infoEmpresa?.id ?? "",
              descricao: watch("descricao"),
            })
          }
          dataCaixaEnd={watch("endDate")}
          dataCaixa={watch("startDate")}
          id_empresa={infoEmpresa?.id ?? ""}
          lancamentos={data?.lista ?? []}
          openModal={openModal.fecharCaixa}
          setOpenModal={() => setModal({ fecharCaixa: false })}
        />
      )}

      {/*openModalPrint && <ModalImpressao array={data?.lista??[]} openModal={openModalPrint} setOpenModal={setPrint} startDate={watch('startDate')} endDate={watch('endDate')} usuario={usuario?.nome??''}/>*/}

      {openModal.lancar && (
        <ModalLancamentosCaixa
          id_empresa={infoEmpresa?.id ?? ""}
          handleFiltro={handleChamarFiltro}
          mov={mov ?? {}}
          openModal={openModal.lancar}
          setOpenModal={() => setModal({ lancar: false })}
          planos={data?.plano_de_contas ?? []}
          grupo={data?.grupo ?? []}
        />
      )}
      {/* 
      <div style={{ display: "none" }}>
      
        {selectRelatorio && (
          <RelatorioSintetico
            infoEmpresa={infoEmpresa}
            tipoRelatorio={selectRelatorio}
            soma={handleGerirRelatorio() ?? ({} as SomaProps)}
            usuario={usuario?.nome ?? ""}
            startDate={watch("startDate")}
            endDate={watch("endDate")}
            array={data?.lista ?? []}
            ref={currentPage}
          />
        )}
      </div> */}
    </>
  );
}
