import { PlanoContasProps } from "../../financeiro/_types/plano-contas"






export interface LancamentosProps {
    lanc_id: number,
    forma_pagamento: string,
    num_seq: number | null,
    valorForma?: string
    valor_restante?: number,
    observacao?: string,
    conta: string,
    ccustos_id: number | null,
    ccustos_desc: string,
    descricao: string,
    conta_n: string,
    data: Date,
    notafiscal: string,
    historico: string,
    tipo: string,
    valor: number | null,
    datalanc: Date,
    usuario: string,
    id_grupo: number | null,
    pix_por: string,
    banco: string,
    empresa: string,
    mensalidade: { form_pagto: string }
    lancamentoForma: Array<{ id_forma?: number, forma: string, valor: number, banco?: string | undefined, observacao?: string | undefined }> | [],
}



export interface FechamentoProps {
    id_conf: number,
    caixaCad: {
        pix: number,
        cedulas: number,
        cartao: number,
        transferencia: number
    },
    data: Date,
    empresa: string,
    usuario: string,
    observacao: string
}


interface GrupoProps {
    id_grupo: number,
    descricao: string
}


export interface ResponseCaixaProps {
    lista: Array<LancamentosProps> | [],
    dif: number | null,
    plano_de_contas: Array<PlanoContasProps>,
    grupo: Array<GrupoProps>,
    fechamento: FechamentoProps | null,
    valorAnterior: number | null
}


export interface FormCaixaProps {
    startDate: Date,
    endDate: Date,
    descricao: string
    id_empresa: string
}