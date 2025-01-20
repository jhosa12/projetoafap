export type MensalidadeProps = {
    id_usuario: number,
    id_mensalidade_global:number,
    id_empresa:string
    id_contrato_global:number,
    id_contrato: number,
    aut:string,
    estorno_dt: Date,
    estorno_user: string,
    dt_exclusao: Date,
    exclusao_motivo: string,
    user_exclusao: string,
    associado: string,
    n_doc: string,
    parcela_n: number,
    vencimento: Date,
    cobranca: Date,
    valor_principal: number,
    status: string,
    usuario: string,
    hora_pgto:string
    id_mensalidade: number,
    valor_total: number,
    motivo_bonus: string,
    data_pgto: Date,
    referencia: string,
    index: number,
    id_acordo: number,
    form_pagto:string,
    banco_dest:string,
    pix_por:string,
    valor_metodo: number
}

export type AcordoProps = {
    id_consultor: number,
    usuario: string,
    dt_criacao:Date,
    total_acordo: number,
    data_inicio: Date,
    data_fim: Date,
    realizado_por: string|undefined,
    dt_pgto: Date,
    mensalidade: Array<Partial<MensalidadeProps>>,
    status: string,
    descricao: string,
    metodo: string
    id_acordo: number,
}