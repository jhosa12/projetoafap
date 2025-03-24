
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
  complemento:string,
  dt_pgto:Date|null,
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
  nascimento:Date,
  endereco:string,
  bairro:string,
  numero:number,
  cidade:string,
  responsavel:string,
  grau_parentesco:string,
  informacoes:string,
  receita:string,
  peso:number,
  altura:number,
  temperatura:number,
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

export interface ClientProps {
  data_prev:Date|undefined,
  id_agcli: number,
  user:string,
  espec: string,
  medico: string,
  id_agmed: number|null,
  id_med: number,
  id_usuario: number
  data: Date
  start: Date,
  end: Date,
  title: string
  status: string,
  endereco: string,
  numero:number,
  bairro:string
  cidade:string
  complemento:string,
  buscar:string
  obs: string,
  nome: string,
  hora_prev:Date,
  celular: string,
  tipoAg: string
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
  editar: boolean
}




export interface ExameRealizadoProps{
  id_exame:number|null,
  id_selected:number|null,
  celular:string,
  endereco:string,
  numero:number|null,
  bairro:string,
  cidade:string,
  data_orcamento: Date,
  data_realizado:Date,
  exames:Array<ExamesData>,
  coleta:string,
  tipoDesc:string,
  cpf:string,
  data_nasc:Date,
  nome_responsavel:string,
  parentesco:string,
  nome:string,
  status:string,
  user:string,
}
