


export interface ParcelaData {
    parcela_n: number;
    vencimento: Date;
    cobranca: Date;
    valor_principal: number;
    status: string;
    referencia: string;
  }

  interface DataProps{
    vencimento:Date|undefined,
    n_parcelas:number,
    valorMensalidade:number
  }


export const gerarMensalidade= ({vencimento,n_parcelas,valorMensalidade}:DataProps)=>{
    const mensalidades : Array<ParcelaData> = []
    let currentDate = new Date(vencimento??new Date());
    for (let i = 0;i<n_parcelas;i++){
      const dataMensalidade: ParcelaData = {
        parcela_n: i + 1,
        vencimento: new Date(currentDate), // Copia da data atual
        cobranca: new Date(currentDate), // Copia da data atual
        valor_principal:valorMensalidade,
        status:'A',
        referencia: `${String(new Date(currentDate).getMonth()+1).padStart(2,'0')}/${new Date(currentDate).getFullYear()%100}`
    };
    mensalidades.push(dataMensalidade);
    
    // Aumenta um mês para a próxima iteração
    currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return mensalidades
   }