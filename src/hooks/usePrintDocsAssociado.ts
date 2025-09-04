import { CartaNovoAssociado } from "@/Documents/associado/cartaNovoAssociado/cartaDocument";
import CarteiraAssociado from "@/Documents/associado/carteiraAssociado/CarteiraAssociado";
import DocumentTemplate from "@/Documents/associado/contratoAdesão/DocumentTemplate";
import ContratoResumo from "@/Documents/associado/contratoResumido/ContratoResumo";
import ImpressaoCarne from "@/Documents/associado/mensalidade/ImpressaoCarne";
import { ReciboMensalidade } from "@/Documents/associado/mensalidade/Recibo";
import { ProtocoloCancelamento } from "@/Documents/associado/protocoloCancelamento/ProtocoloCancelamento";
import { api } from "@/lib/axios/apiClient";
import { AuthContext } from "@/store/AuthContext";
import { AssociadoProps } from "@/app/dashboard/admcontrato/_types/associado";
import { pageStyle } from "@/utils/pageStyle";
import { removerFusoDate } from "@/utils/removerFusoDate";
import { useCallback, useContext, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";





type Docs = 'carne' | 'cancelamento' | 'contrato' | 'carteira' | 'resumo' | 'carta'



export function usePrintDocsAssociado(
    dadosassociado: Partial<AssociadoProps>,
    usuario: string,
    id_empresa: string,
    setarDadosAssociado: Function,
    onClose?: Function
) {

    const [printState, setPrintState] = useState<{ [key in Docs]: boolean }>({
        carne: false,
        contrato: false,
        carteira: false,
        resumo: false,
        carta: false,
        cancelamento: false
    });


    const chaveAtiva = printState
        ? Object.entries(printState).find(([_, valor]) => valor === true)?.[0]
        : null;

    const componentRefs = {
        contrato: useRef<DocumentTemplate>(null),
        carteira: useRef<CarteiraAssociado>(null),
        carne: useRef<ImpressaoCarne>(null),
        resumo: useRef<ContratoResumo>(null),
        carta: useRef<CartaNovoAssociado>(null),
        cancelamento: useRef<ProtocoloCancelamento>(null)
    };


    const handlePrint = (doc: Docs) => {
        setPrintState((prev) => ({ ...prev, [doc]: !prev[doc] }));


    };


    const handleImpressao = useCallback(async () => {

        if (printState.contrato) imprimirContrato();
        if (printState.carteira) imprimirCarteira();
        if (printState.carne) imprimirCarne();
        if (printState.resumo) imprimirResumo();
        if (printState.carta) imprimirCarta();
        if (printState.cancelamento) imprimirCancelamento();


    }, [printState])

    const handleRegisterImpressao = useCallback(async (arquivo: Docs) => {
        const { newDate } = removerFusoDate(new Date());
        const impressoes = [...(dadosassociado.contrato?.impressoes || [])];
        const index = impressoes.findIndex((imp) => imp.arquivo === arquivo);

        if (index === -1) {
            impressoes.push({ arquivo, date: newDate, user: usuario });
        } else {
            impressoes[index] = { ...impressoes[index], date: newDate, user: usuario };
        }

        try {
            const response = await api.put("/contrato/impressoes", {
                id_contrato_global: dadosassociado?.contrato?.id_contrato_global,
                impressoes,
            });
            handlePrint(arquivo)
            setarDadosAssociado({ contrato: { ...dadosassociado?.contrato, impressoes: response.data.impressoes } });
            onClose?.()
        } catch (error) {
            toast.error("Erro ao registrar impressão");
        }
    }, [dadosassociado, usuario, setarDadosAssociado]);




    const imprimirCancelamento = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "CANCELAMENTO",
        content: () => componentRefs.cancelamento.current,
        onBeforeGetContent: async () => {
            await handleRegisterImpressao('cancelamento');
        },
    });



    const imprimirContrato = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "CONTRATO",
        content: () => componentRefs.contrato.current,
        onBeforeGetContent: async () => {
            await handleRegisterImpressao('contrato');
        },

    });

    const imprimirCarteira = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "CARTEIRA",
        content: () => componentRefs.carteira.current,
        onBeforeGetContent: async () => {
            await handleRegisterImpressao('carteira');
        },
    });

    const imprimirCarne = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "CARNÊ",
        content: () => componentRefs.carne.current,
        onBeforeGetContent: async () => {
            await handleRegisterImpressao('carne');
        },
    });

    const imprimirResumo = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "RESUMO",
        content: () => componentRefs.resumo.current,
        onBeforeGetContent: async () => {
            await handleRegisterImpressao('resumo');


        },
    });


    const imprimirCarta = useReactToPrint({
        pageStyle: pageStyle,
        documentTitle: "CARTA",
        content: () => componentRefs.carta.current,
        onBeforeGetContent: async () => {
            await handleRegisterImpressao('carta');
        },
    });





    return {
        printState,
        handleImpressao,
        chaveAtiva,
        handlePrint,
        componentRefs

    }

}