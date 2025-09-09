import { DependentesProps } from "./dependentes"
import { ContratoProps } from "./contrato"
import { PlanosProps } from "@/types/planos"
import { CidadesProps } from "@/types/cidades"
import { MensalidadeProps } from "./mensalidades"
import { AcordoProps } from "./acordos"

export type DadosCadastroProps = {
    id_empresa: string
    empresa: string
    name: string,
    nasc: Date,
    sexo: string,
    data?: Date | null,
    cep: string,
    endereco: string,
    numero: number,
    bairro: string,
    referencia: string,
    cidade: string,
    uf: string,
    email: string,
    rg: string,
    cpf: string,
    closeModalPlano: boolean,
    closeModalCadastro: boolean
    arraydep: Array<Partial<DependentesProps>>,
    dependente: Partial<DependentesProps>,
    naturalidade: string,
    celular1: string,
    celular2: string,
    telefone: string,
    contrato: Partial<ContratoProps>,
    origem: string,
    profissao: string,
    planos: Array<Partial<PlanosProps>>
    cidades: Array<Partial<CidadesProps>>
    id_associado: number,
    mensalidade: Partial<MensalidadeProps>
    mensalidadeAnt: Partial<MensalidadeProps>
    mensalidadeProx: Partial<MensalidadeProps>,
    acordo: Partial<AcordoProps>
}