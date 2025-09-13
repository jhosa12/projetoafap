import { CidadesProps } from "../../../../types/cidades"
import { PlanosProps } from "../../../../types/planos"
import { AcordoProps } from "./acordos"
import { ContratoProps } from "./contrato"
import { DependentesProps } from "./dependentes"
import { MensalidadeProps } from "./mensalidades"

export type AssociadoProps = {
    id_global: number | null,
    nome: string,
    data_nasc: Date,
    sexo: string,
    celular1: string, celular2: string, telefone: string,
    id_associado: number,
    id_empresa: string
    naturalidade: string,
    endereco: string,
    bairro: string,
    numero: number,
    cidade: string,
    cep: string,
    cpfcnpj: string,
    rg: string
    email: string,
    profissao: string,
    guia_rua: string,
    uf: string,
    empresa: string,
    mensalidade: Array<MensalidadeProps> | [],
    contrato: Partial<ContratoProps>,
    dependentes: Array<DependentesProps>
    acordo: Array<AcordoProps>


}

export interface CheckListProps {
    id_check: number,
    descricao: string,
    status: boolean
}


export interface ArrayProdutoProps {
    id_ob_itens: number | null
    id_produto: number | null,
    id_estoque: number | null,
    descricao_item: string;
    valor_unit: number | null,
    quantidade: number | null,
    desconto: number | null,
    acrescimo: number | null,
    valor_total: number | null
}



export interface ImpressoesProps {
    arquivo: string,
    date: Date | string | undefined,
    user: string | undefined
}


