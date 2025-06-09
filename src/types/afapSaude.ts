
import { Dispatch, SetStateAction } from "react";
import { View } from "react-big-calendar";


export type ConsultaStatus = "AGENDADO" | "AGUARDANDO DATA" | "CONFIRMADO" | "ATENDIDO" | "CANCELADO" | "RECEBIDO" | "INDECISO"|"AGUARDANDO RESPOSTA";

export const statusConsultaArray = ["AGENDADO","AGUARDANDO DATA","CONFIRMADO","ATENDIDO","CANCELADO","RECEBIDO","VENDA OCULOS","INDECISO","AGUARDANDO RESPOSTA"]

export interface ClienteFormProps {
  id_client?: number;
  nome: string;
  endereco?: string;
  bairro?: string;
  numero?: number|null;
  cidade?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  celular?: string;
  email?: string;
  data_nasc?: Date;       // Para DatePicker
  cpf?: string;
  identidade?: string;
  obs?: string;

  // Esses dois geralmente não vão pro form direto, mas se usar, define as interfaces também
  consultas?: ConsultaProps[];         // Pode ser tipo: ConsultaProps[]
  retornoConsulta?: any[];   // Pode ser tipo: RetornoConsultaProps[]
}

export interface ClientePayload {
  id_cliente?: number;
  nome: string;
  endereco?: string;
  bairro?: string;
  numero?: number|null;
  cidade?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  celular?: string;
  email?: string;
  data_nasc?: string; // convertido antes de enviar
  cpf?: string;
  identidade?: string;
  obs?: string;
  data_cadastro?:string
}


export interface ExamesData{
  id_exame:number,
  nome:string,
  obs:string,
  data:Date,
  valorExame:number,
  desconto:number,
  valorFinal:number,
}

export interface ExamesProps{
  id_exame:number,
  nome:string,
  data:Date,
  usuario:string,
  valorBruto:number,
  porcFun:number,
  porcPart:number,
  porcPlan:number
  valorFinal:number,
  valorRepasse:number,
  obs:string
}


export interface ConsultaProps{
  id_consulta:number|null,
  id_med:number|null,
  id_empresa:string,
  id_global:number|null,
  id_contrato:number|null,
  id_empContrato?:string,
  nome_associado:string
  complemento:string,
  dt_pgto:Date|null,
  id_client?:number|null,
  user:string,
  procedimentos:Array<ExamesData>,
  nome:string,
  celular:string,
  cpf:string,
  espec:string,
  status:string,
  vl_consulta:number|null,
  tipoDesc:string,
  vl_desc:number|null,
  vl_final:number|null,
  data:Date,
  exames:Array<ExamesData>,
  nascimento?:Date,
  endereco:string,
  bairro:string,
  numero:number|null,
  cidade:string,
  responsavel:string,
  grau_parentesco:string,
  informacoes:string,
  receita:string,
  peso:number,
  altura:number,
  temperatura:number,
  externo:string,
  idade:number,
  identidade:string,
  observacao:string
  id_selected:number,
  id_agmed:number|null,
  hora_prev:Date,
  buscar:string,
  data_prev:Date|undefined,
  retorno:string
}

export interface MedicoProps {
  id_med: number,
  espec: string,
  nome: string,
  sobre: string,
  file: File | undefined,
  imageUrl: string,
  tmpUrl: string,
  funeraria: number,
  particular: number,
  plano: number,
  time: number,
  exames: Array<ExamesProps>

}


export interface EventProps {

  id_agcli: number,
  id_agmed: number|null
  id_med: number,
  id_usuario: number
  data: Date,
  endereco: string,
  start: Date,
  end: Date,
  title: string
  status: string,
  obs: string,
  nome: string,
  celular: string,
  tipoAg: string,
  editar: boolean,
  id_empresa:string
}




export interface ExameRealizadoProps{
  id_exame:number|null,
  id_selected:number|null,
  id_empresa:string,
  exame:string,
  celular:string,
  endereco:string,
  numero:number|null,
  bairro:string,
  cidade:string,
  data_prev:Date|undefined,
  data_orcamento: Date,
  data_realizado:Date,
  exames:Array<ExamesData>,
  coleta:string,
  tipoDesc:string,
  cpf:string,
  data_nasc:Date|undefined,
  nome_responsavel:string,
  parentesco:string,
  nome:string,
  status:string,
  user:string,
}



export interface FiltroConsultaProps {
  startDate: Date | undefined,
  endDate: Date | undefined,
  id_med?: number,
  status: string[] | undefined,
  buscar?: string,
  externo?: string,
  nome?: string,
  id_consultor?: number,
  medico?:string
  signal?: AbortSignal;
  especialidade?:string,
}



export interface SidebarProps {
  view: View;
  nomeEmpresa:string,
  setView: Dispatch<SetStateAction<View>>;
  date: Date;
  onNavigate: (date: Date) => void;
  onAddEvent: () => void;
  hideControls?: boolean;
  medicos: Array<MedicoProps>;
  selectedDoctor:number|undefined,
  setSelectedDoctor:Dispatch<SetStateAction<number|undefined>>,

}




export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  desc?: string;
  location?: string;
  category?: "work" | "personal" | "important" | "other";
  color?: string;
}
