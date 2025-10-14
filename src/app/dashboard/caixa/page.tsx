"use client";

import { api } from "@/lib/axios/apiClient";
import { MdOutlineLaunch } from "react-icons/md";
import { useCallback, useContext, useEffect, useMemo, useRef, useState, memo } from "react";
import { IoSearchSharp } from "react-icons/io5";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Spinner } from "flowbite-react";

import { ModalLancamentosCaixa } from "@/app/dashboard/caixa/_components/modalLancamentosCaixa";
import { AuthContext } from "@/store/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { ajustarData } from "@/utils/ajusteData";
import { ScreenCloseCaixa } from "./_components/screenCloseCaixa";
import { ModalConfirmar } from "@/components/modals/modalConfirmar";
import { toast } from "sonner";
import { TableCaixa } from "./_components/table-caixa";
import { ModalFechamento } from "./_components/modalFechamento";
import HeaderCaixa from "./_components/header-caixa";
import { CardValuesCaixa } from "./_components/card-values-caixa";
import {
  FormCaixaProps,
  LancamentosProps,
  ResponseCaixaProps,
} from "./_types/types";
import useActionsCaixa from "./_hooks/useActionsCaixa";
import { ModalMensalidade } from "../admcontrato/_components/mensalidades/modal-mensalidade";
import { PlanoContasProps } from "../financeiro/_types/plano-contas";



function CaixaMovimentar() {

  const [saldo, setSaldo] = useState(0);
  const { usuario, permissoes, infoEmpresa } = useContext(AuthContext);
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
    setLoading,
    mov,
    setMov,
  } = useActionsCaixa();


  // Otimização: useMemo para cálculos pesados
  const { saldoCalculado, despesasCalculadas, valoresPorForma } = useMemo(() => {
    if (!data?.lista?.length) {
      return { saldoCalculado: 0, despesasCalculadas: 0, valoresPorForma: {} };
    }

    const totalPorFormaPagamento = data.lista.reduce((acc, lancamento) => {
      if (lancamento.lancamentoForma && typeof lancamento.lancamentoForma === "object") {
        Object.entries(lancamento.lancamentoForma).forEach(([forma, dados]) => {
          lancamento.tipo === "RECEITA"
            ? (acc[dados.forma] = (acc[dados.forma] || 0) + Number(dados.valor))
            : (acc[dados.forma] = (acc[dados.forma] || 0) - Number(dados.valor));
        });
      }
      return acc;
    }, {} as Record<string, number>);

    const soma = data.lista.reduce((total, item) => {
      return item.tipo === "RECEITA"
        ? total + Number(item.valor)
        : total - Number(item.valor);
    }, 0);

    const somadespesas = data.lista.reduce((total, item) => {
      return item.tipo === "DESPESA"
        ? total + Number(item.valor)
        : total;
    }, 0);

    return {
      saldoCalculado: soma,
      despesasCalculadas: somadespesas,
      valoresPorForma: totalPorFormaPagamento
    };
  }, [data?.lista]);

  // Atualiza os estados com os valores calculados
  useEffect(() => {
    if (data?.lista) {
      setSaldo(saldoCalculado);
      setDespesas(despesasCalculadas);
      setValorForma(valoresPorForma);
    } else {
      setSaldo(0);
      setDespesas(0);
      setValorForma({});
    }
  }, [data?.lista, saldoCalculado, despesasCalculadas, valoresPorForma]);

  const handleExcluir = useCallback(async () => {
    toast.promise(
      api.delete(`/caixa/deletar`, {
        data: {
          lanc_id: mov?.lanc_id,
          id_empresa: infoEmpresa?.id,
        },
      }),
      {
        error: (error: any) => {
          console.log(error);
          return "Erro ao deletar lancamento";
        },
        loading: "Solicitando exclusão..",
        success: () => {
          // const novo = [...(data?.lista||[])]
          // const index = novo.findIndex(item=>item.lanc_id===mov?.lanc_id)
          //  novo.splice(index,1)
          //  setData({...data,lista:novo})
          handleChamarFiltro(); // Ensure this is awaited
          setModal({ excluir: false });
          //setModalExc(false)

          return "Deletado com sucesso";
        },
      }
    );
  }, [mov?.lanc_id, data?.lista, infoEmpresa?.id]);





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
    async (formData) => {
      if (formData.startDate > formData.endDate) {
        toast.info("Data final deve ser maior que a data inicial");
        return;
      }

      const { dataIni, dataFim } = ajustarData(formData.startDate, formData.endDate);
      try {
        setLoading(true);
        const response = await api.post("/listarLancamentos", {
          id_empresa: infoEmpresa?.id,
          dataInicial: dataIni,
          dataFinal: dataFim,
          descricao: formData.descricao,
        });

        setData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        console.error("Erro ao listar lançamentos:", err);
        toast.error("Erro ao carregar os lançamentos");
      } finally {
        setLoading(false);
      }
    },
    [infoEmpresa?.id]
  );

  // Removido o useEffect redundante que foi movido para useMemo

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

      {/* Loading Modal */}
      <Modal size="sm" popup show={loading}>
        <Modal.Body>
          <div className="flex flex-col mt-6 w-full justify-center items-center">
            <Spinner size="lg" color="warning" />
            <span>Localizando dados....</span>
          </div>
        </Modal.Body>
      </Modal>

      {/* Conteúdo principal */}
      <div className="flex flex-col w-full">
        <HeaderCaixa
          planoContas={data?.plano_de_contas as Array<PlanoContasProps>}
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
          setFilteredData={setFilteredData}
          setModal={setModal}
          setMov={setMov}
        />

        {!!data?.fechamento ? (
          <ScreenCloseCaixa fechamento={data.fechamento} />
        ) : (
          <div className="flex flex-col w-full">
            <TableCaixa
              data={filteredData}
              permissoes={permissoes}
              setModal={setModal}
              setMov={setMov}
            />
          </div>
        )}

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
      </div>
    </>
  );
}

export default memo(CaixaMovimentar);
