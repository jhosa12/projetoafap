import { ConvProps } from "../../servicos/_types/convalescente"
import { ImpressoesProps } from "./impressoes"
import { ObitoProps } from "../../servicos/_types/obito"

export type ContratoProps = {
    id_contrato_global: number | null,
    id_contrato: number,
    plano: string,
    id_plano: number,
    id_empresa: string
    valor_mensalidade: number,
    dt_adesao: Date,
    dt_carencia: Date,
    situacao: string,
    anotacoes: string,
    consultor: string,
    cobrador: string,
    data_vencimento: Date,
    n_parcelas: number,
    origem: string,
    supervisor: string,
    convalescencia: Array<ConvProps>,
    categoria_inativo: string,
    motivo_inativo: string,
    dt_cancelamento: Date,
    obitos: Array<ObitoProps>,
    impressoes: Array<ImpressoesProps>,
    acrescimo: number | null,
    desconto: number | null,
    planos: { limite_dep: number | null }
}