


 export const calcularIdade = (date:Date|undefined)=>{


          if(!date)return null
            const hoje = new Date();
            const nasc = new Date(date)
            const anoAtual = hoje.getFullYear();
            const mesAtual = hoje.getMonth();
            const diaAtual = hoje.getDate();
            const anoNascimento = nasc.getFullYear();
            const mesNascimento = nasc.getMonth();
            const diaNascimento = nasc.getDate();




            let idade = 0;
             idade = anoAtual - anoNascimento;


            if (mesNascimento > mesAtual || (mesNascimento === mesAtual && diaNascimento > diaAtual)) {
                // Se o aniversariante ainda não fez aniversário este ano, calcular a idade com base no aniversário do próximo ano
                
                idade--
            }
            return idade

         }