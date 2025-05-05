

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
  