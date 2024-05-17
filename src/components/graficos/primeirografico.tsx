import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Importa o dynamic para importações dinâmicas
import { getDate } from "date-fns";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }); // Importa o Chart de forma dinâmica e desativa o SSR

interface LancamentosProps {
  data:Date,
  _sum:{valor:number},
  _count:{data:number}
  
}

interface ContratosGeral {
  dt_adesao: Date,
  dt_cancelamento: Date
}

interface DataProps {
  y: number,
  x: string,
  dt:Date
  z: number,
  c: number,
  cancelamentos:number
}

export function Grafico({ lancamentos, filtroDia, filtroMes, filtroAno, todoPeriodo, startDate, endDate, contratosGeral }:
  {
    lancamentos: Array<LancamentosProps>,
    filtroDia: boolean,
    filtroMes: boolean,
    filtroAno: boolean,

    todoPeriodo: boolean,
    startDate: Date,
    endDate: Date
    contratosGeral: Array<ContratosGeral>

  }) {
  const [options, setOptions] = useState({}); // Estado para opções do gráfico
  const [series, setSeries] = useState<{ name: string; data: Array<DataProps> }[]>([]); // Estado para série de dados do gráfico
  const [seriesmensal, setSeriesMensal] = useState<{ name: string, data: Array<number>,color:string }[]>([]);
 // let formatter = new Intl.NumberFormat('pt-BR', {
 //   style: 'currency',
 //   currency: 'BRL'
//  });
   
  useEffect(() => {
    let dataLancamento: string
    //let itemExistente:DataProps | undefined ={x:'',y:0,z:0}
    const resultado = lancamentos.reduce((acumulador, atual) => {

      if (filtroDia) {
        dataLancamento = new Date(atual.data).toLocaleDateString('pt-BR', {

          year: 'numeric', // Ano completo
          month: 'long', // Mês por extenso
          day: 'numeric'
        });
      }

      else if (filtroMes) {
        dataLancamento = new Date(atual.data).toLocaleDateString('pt-BR', {

          year: 'numeric', // Ano completo
          month: 'long', // Mês por extenso

        });
      }
      else if (filtroAno) {
        dataLancamento = new Date(atual.data).toLocaleDateString('pt-BR', {

          year: 'numeric', // Ano completo


        });

      }
     // const startNoTime = new Date(startDate)
//const endNoTime = new Date(endDate)
      const atualDateNoTime = new Date(new Date(atual.data).getUTCFullYear(),new Date(atual.data).getUTCMonth(),new Date(atual.data).getUTCDate())
      
      console.log(startDate)
    
   
      if (
        !todoPeriodo && atualDateNoTime >=startDate && atualDateNoTime <= endDate
      ) {
        const itemExistente = acumulador.find((item) => item.x === dataLancamento);

        if (itemExistente) {
        // itemExistente.y+=Number(atual._sum.valor)
          itemExistente.y = Number(itemExistente.y) + Number(atual._sum.valor);
          itemExistente.z += atual._count.data;
        
       
        } else {
        

          acumulador.push({ x: dataLancamento, y: Number(atual._sum.valor), z: atual._count.data, c:0,dt:atual.data,cancelamentos:0 });
          
        }
      }
    //  if (todoPeriodo) {
    //    const itemExistente = acumulador.find((item) => item.x == dataLancamento);
   //     if (itemExistente) {
   //       itemExistente.y = Number(itemExistente.y) + Number(atual._sum.valor);
   //       itemExistente.z += atual._count.data;
        
  //     } else {

   //       acumulador.push({ x: dataLancamento, y: Number(atual._sum.valor), z: 0, c: 0,dt:atual.data,cancelamentos:0 });
   //     }

  //    }
      return acumulador
     
    }, [] as DataProps[])


      const teste = resultado.reduce((acumulador,atual)=>{
         const mesExistente = acumulador.find(item=>new Date(item.dt).getMonth()===new Date(atual.dt).getMonth() && new Date(item.dt).getFullYear()===new Date(atual.dt).getFullYear())
     //
         if(!mesExistente){
        const  contratosG = contratosGeral.filter((item) => {
    const anoContrato =  new Date(new Date(item.dt_adesao).getFullYear(),new Date(item.dt_adesao).getMonth(),1);
    const anoAtual = new Date(new Date(atual.dt).getFullYear(),new Date(atual.dt).getMonth(),1);

    return anoContrato <= anoAtual;
           
            
          },0)
          const contratosIN = contratosGeral.filter((item)=>{
            const anoContrato =  new Date(new Date(item.dt_cancelamento).getFullYear(),new Date(item.dt_cancelamento).getMonth(),1);
            const anoAtual = new Date(new Date(atual.dt).getFullYear(),new Date(atual.dt).getMonth(),1);
            return item.dt_cancelamento!==null && anoContrato<=anoAtual;
          })
          const cancelamentosMes = contratosGeral.filter(item=>{
            const anoContrato =  new Date(new Date(item.dt_cancelamento).getFullYear(),new Date(item.dt_cancelamento).getMonth(),1);
            const anoAtual = new Date(new Date(atual.dt).getFullYear(),new Date(atual.dt).getMonth(),1);
            return anoContrato.toLocaleDateString()===anoAtual.toLocaleDateString()
          })
         
          acumulador.push({x: atual.x, y: atual.y, z: atual.z, c: contratosG.length-contratosIN.length ,dt:atual.dt,cancelamentos:cancelamentosMes.length })
         }
         else{
          acumulador.push({x: atual.x, y: atual.y, z: atual.z, c: 0,dt:atual.dt,cancelamentos:atual.cancelamentos })
         }
        

return acumulador

},[]as DataProps[])

    /* goals: [
       {
          name: 'Expected',
         value: 550,
          strokeColor: '#B32824'
        }
       ] */

    // Configuração das opções do gráfico
    const chartOptions = {
      // plotOptions: {
      //   bar: {
      //     distributed: true
      //  }
      //  } ,

      plotOptions: {
        bar: {
          
          horizontal: false,
          borderRadius: 10,
          columnWidth: '60%',
          borderRadiusApplication: 'end', // 'around', 'end'
          borderRadiusWhenStacked: 'last',
         // distributed:true,
         // stacked: false, // 'all', 'last'
          //  dataLabels: {
          //  total: {
          //    enabled: true,
          //   style: {
          //    color: "#B32824",
          //   fontSize: '23px',

          //  }
          // }
          // }

          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels:{
        offsetY:-20
      },
    

      title: {
        text: 'MENSAL./QUANT./ATIVOS/CANCELAMENTOS'
      },
      theme: {
        mode: 'dark',
        palette1: 'palette1'
      },
      tooltip: {
        theme: 'dark',
      //  y: {
     //     formatter: function(value:number) {
       // return Number(value)
        //  }
     //   }
        


      },
      chart: {
        type: 'bar',
        background: '#2b2e3b',
     // stacked: true,
     
        toolbar: {
          show: true
        },

        zoom: {
          enabled: true
        },


      },


      xaxis: {
        categories:teste.map(item => item.x),

        type: 'category',
        labels: {


        //  style: {
            // colors: "#B32824", // Define a cor dos anos aqui
         // },
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
      },
     // yaxis: {
      //  labels: {
       //   formatter: function (value:number) {
        //    return formatter.format(value);
        //  }
      //  },
    //  },
  
     
    };

    // Configuração da série de dados do gráfico
    let chartSeries
    if (filtroMes || filtroAno) {
      chartSeries = [

        {
          name: "RECEITA COM MENSALIDADES",
          data: teste.map(item =>item.y),
          color:'#1056b5'
        },
        {
          name: "QUANT. MENSALIDADES",
          data: teste.map(item => item.z),
          color:'#fede72'
          
        },
        {
          name: "CONTRATOS ATIVOS",
          data: teste.map(item => item.c),
          color:'#2c9171'
        },
        {
          name: "CANCELAMENTOS",
          data: teste.map(item => item.cancelamentos),
          color:'#B32824'
        },

      ];

    } else {
      chartSeries = [

        {
          name: "RECEITA",
          data: teste.map(item => item.y),
          color:'#B32824'
        },
        {
          name: "QUANTIDADE",
          data: teste.map(item => item.z),
          color:'#2c9171'
        },

      ];


    }


    setOptions(chartOptions); // Define as opções do gráfico no estado
    // setSeries(chartSeries); // Define a série de dados do gráfico no estado
    setSeriesMensal(chartSeries)
  }, [filtroDia, filtroMes, filtroAno, startDate, endDate, todoPeriodo]); // Executa apenas uma vez quando o componente é montado

  // Renderiza o gráfico somente se as opções e a série de dados estiverem disponíveis
  return (
    options && seriesmensal && (
      <div className="app">
        <div className="row">
          <div className="mixed-char">
            <Chart
              options={options}
              series={seriesmensal}
              type="bar"
              width={'100%'}
              height={400}

            />
          </div>
        </div>
      </div>
    )
  );
}

export default Grafico;
