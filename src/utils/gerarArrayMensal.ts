
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



  export const gerarMensalidade = ({ vencimento, n_parcelas, valorMensalidade }: DataProps) => {
    const mensalidades: Array<ParcelaData> = [];
    const dataInicial = new Date(vencimento ?? new Date());
    const diaOriginal = dataInicial.getDate();
  
    for (let i = 0; i < n_parcelas; i++) {
      const ano = dataInicial.getFullYear();
      const mes = dataInicial.getMonth() + i;
  
      // Cria a nova data com base no ano, mês e ajusta o dia
      const anoParcela = new Date(ano, mes, 1).getFullYear();
      const mesParcela = new Date(ano, mes, 1).getMonth();
      const ultimoDiaMes = new Date(anoParcela, mesParcela + 1, 0).getDate();
  
      const diaCorreto = Math.min(diaOriginal, ultimoDiaMes);
      const novaData = new Date(anoParcela, mesParcela, diaCorreto);
  
      const dataMensalidade: ParcelaData = {
        parcela_n: i + 1,
        vencimento: new Date(novaData),
        cobranca: new Date(novaData),
        valor_principal: valorMensalidade,
        status: 'A',
        referencia: `${String(novaData.getMonth() + 1).padStart(2, '0')}/${novaData.getFullYear() % 100}`,
      };
  
      mensalidades.push(dataMensalidade);
    }
  
    return mensalidades;
  };
  



// export interface ParcelaData {
//     parcela_n: number;
//     vencimento: Date;
//     cobranca: Date;
//     valor_principal: number;
//     status: string;
//     referencia: string;
//   }

//   interface DataProps{
//     vencimento:Date|undefined,
//     n_parcelas:number,
//     valorMensalidade:number
//   }


//   export const gerarMensalidade = ({ vencimento, n_parcelas, valorMensalidade }: DataProps) => {
//     const mensalidades: Array<ParcelaData> = [];
//     let currentDate = new Date(vencimento ?? new Date());
  
//     const diaOriginal = currentDate.getDate(); // Salva o dia do vencimento inicial
  
//     for (let i = 0; i < n_parcelas; i++) {
//       // Criando nova data para evitar mutação
//       let novaData = new Date(currentDate);
//     // Adiciona um mês
  
//       // Ajusta o dia para o último dia do mês caso necessário
//       const ultimoDiaMes = new Date(novaData.getFullYear(), novaData.getMonth() + 1, 0).getDate();
//       novaData.setDate(Math.min(diaOriginal, ultimoDiaMes));
  
//       const dataMensalidade: ParcelaData = {
//         parcela_n: i + 1,
//         vencimento: new Date(novaData),
//         cobranca: new Date(novaData),
//         valor_principal: valorMensalidade,
//         status: 'A',
//         referencia: `${String(novaData.getMonth() + 1).padStart(2, '0')}/${novaData.getFullYear() % 100}`,
//       };
  
//       mensalidades.push(dataMensalidade);
//       novaData.setMonth(novaData.getMonth() + 1);
//       currentDate = novaData; // Atualiza currentDate para a próxima iteração
//     }
//     return mensalidades;
//   };
  