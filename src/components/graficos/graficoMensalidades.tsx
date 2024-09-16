import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Importa o dynamic para importações dinâmicas
// Importa moment-timezone para manipulação de datas com fuso horário
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }); // Importa o Chart de forma dinâmica e desativa o SSR

interface LancamentosProps {
  data: Date,
  _sum: { valor: number },
  _count: { data: number }
}

interface ContratosGeral {
  dt_adesao: Date,
  dt_cancelamento: Date
}

interface DataProps {
  y: number,
  x: string,
  dt: Date
  z: number,
 
  
}

export function GraficoMensalidade({lancamentos,completo }:
  {
    lancamentos: Array<DataProps>,
   completo:boolean
  }) {
  const [options, setOptions] = useState({}); // Estado para opções do gráfico
  const [series, setSeries] = useState<{ name: string; data: Array<number>; color: string }[]>([]); // Estado para série de dados do gráfico

  useEffect(()=>{
    const datas= lancamentos.map(item => item.x);
    const receitaMensalidade = lancamentos.map(item => Number(item?.y?.toFixed(2)));
    const quantMensal = lancamentos.map(item => item.z);
 

    const chartOptions = {
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          columnWidth: '60%',
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last',
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        offsetY: -20,
        formatter: function (value:number, { seriesIndex }:{seriesIndex:number}) {
          if (seriesIndex === 0) {
            if(completo){
              return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
            }
           
          }
          return value;
        },
      },
      title: {
        text: completo?'MENSALIDADE/QUANTIDADE':'ATIVOS/CANCELAMENTOS'
      },
      theme:{
        mode: 'light',
        palette: 'palette1'
      },
      tooltip: {
        theme:false,
        
        y: {
         formatter:completo &&  function (value:number, { seriesIndex }:{seriesIndex:number}) {
            if (seriesIndex === 0) {

              if(completo){
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
              }
              
            }
            return value;
          }
        }
      },
      chart: {
        type: 'bar',
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        },
      },
      
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      xaxis: {
        categories: datas,
        type: 'category',
        min: new Date("01 Mar 2012").getTime(),
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
    };
    let chartSeries
    

  chartSeries = [
    {
      name: "RECEITA COM MENSALIDADES",
      data: receitaMensalidade,
      color: '#1056b5'
    },
    {
      name: "QUANT. MENSALIDADES",
      data: quantMensal,
      color: '#fede72'
    },

    
  ];



  

    setOptions(chartOptions); // Define as opções do gráfico no estado
    setSeries(chartSeries); // Define a série de dados do gráfico no estado

  },[lancamentos]);
  
  // Renderiza o gráfico somente se as opções e a série de dados estiverem disponíveis
  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart
            options={options}
            series={series}
            type="bar"
            width={'100%'}
           height='400'
          />
        </div>
      </div>
    </div>
  );
}

export default GraficoMensalidade;
