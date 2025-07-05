

export interface InadimplenciaProps{
    id_contrato:number,
    associado:{
      nome:string,
      endereco:string,
      bairro:string,
      telefone:string,
      celular1:string,
      celular2:string,
      numero:string,
      cidade:string,
      guia_rua:string
    },
    mensalidade:Array<{valor_principal:number,referencia:string}>
    overdueCount:number,//numero de mensalidades vencidas
    totalOverdueAmount:number // Valor total das mensalidades vencidas
    lastPaidPayment:Date,
    cobranca:Date,
}

export interface ResInadimplenciaApiProps{
    filtered:Array<InadimplenciaProps>, 
    active:number|null
}



export interface RouteProps{
id_cobranca :number
consultor:string
id_empresa:string
 cobranca :Array<{valor_principal:number,referencia:string}> 
 parametros :{
    bairros:Array<string>,
    periodo:{
      start:Date|null,
      end:Date|null
    },
    criterio:{
      operator:string,
      value:number
    },
    consultor:string
 } 
 status:string
 dt_created :Date
 dt_updated :Date
 updated_by :string
 created_by :string
 pagamentos :Array<string>
 solicitacoes :Array<string>
 observacao :string
}
  