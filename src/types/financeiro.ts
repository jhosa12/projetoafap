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


export interface MensalidadeBaixaProps{
    id_mensalidade:number,
    id_global:number,
    lancamentoForma:Array<{
        valor:number,
        forma:string,
        banco?:string,
        observacao?:string}>,
    id_mensalidade_global:number,
    aut:string,
    valor_metodo:number,
    recebido_por:string,
    contrato:{situacao:string},
    data_pgto:Date,
    associado:Partial<{
        nome:string,
        endereco:string,
        mensalidade:Array<Partial<{
            id_mensalidade_global:number,
            id_mensalidade:number,
            referencia:string,
            vencimento:Date,
            valor_principal:number,
            n_doc:string,
            status:string
        }>>
    }>,
    id_contrato:number,
    referencia:string,
    status:string,
    valor_principal:number,
    vencimento:Date,
    valor_total:number,
    pix_por:string,
    form_pagto:string,
    banco_dest:string,
    motivo_bonus:string,
    situacao:string
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
    mensalidadeAcordo:Array<{id_mensal_acordo?:number,mensalidade:Partial<MensalidadeProps>}>,
    status: string,
    descricao: string,
    metodo: string
    id_acordo: number,
}