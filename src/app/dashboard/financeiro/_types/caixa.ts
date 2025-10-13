export interface CaixaProps {

  forma_pagamento: string
  lanc_id: number,
  num_seq: number,
  banco: string,
  conta: string,
  ccustos_id: number,
  id_grupo: number,
  ccustos_desc: string,
  descricao: string,
  conta_n: number,
  data: Date,
  notafiscal: string,
  historico: string,
  tipo: string,
  valor: number,
  valorreal: number,
  valordolar: number,
  modo_inc: string,
  datalanc: Date,
  horalanc: Date,
  usuario: string,
  cod_mens: string,
  cod_conta: number,
  mensalidade: {
    banco_dest: string,
    data_pagto: Date,
    form_pagto: string
  }

}