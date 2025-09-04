import { AcordoProps } from "./acordos"
import { MensalidadeProps } from "./mensalidades" 
import { ContratoProps } from "./contrato"
import { DependentesProps } from "./dependentes"


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








