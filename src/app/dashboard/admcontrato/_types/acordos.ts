import { AssociadoProps } from "./associado";
import { ConsultoresProps } from "@/types/consultores";
import { MensalidadeProps } from "./mensalidades"

export type AcordoProps = {
    id_consultor: number,
    consultores: Array<Partial<ConsultoresProps>>;
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
    carregarDados: (id: number) => Promise<void>;
    id_contrato: number | undefined;
    id_associado: Partial<AssociadoProps>;
    id_global: number | null;
}