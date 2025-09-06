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

interface EixosProps{
  y: number,
  x: string,
 // dt: Date
  z: number,
}


interface GraficoProps{
  name:string,
  data:Array<EixosProps>
 // color:string
}


interface DataProps {
 
 dados:Array<GraficoProps>
  
}

export function GraficoMensalidade({dados}:DataProps) {
  const [options, setOptions] = useState({}); // Estado para opções do gráfico
  const [series, setSeries] = useState<Array<{ name: string; data: Array<EixosProps> }>>([]); // Estado para série de dados do gráfico

  useEffect(()=>{
  //  const datas= lancamentos.map(item => item.x);
    //const receitaMensalidade = lancamentos.map(item => Number(item?.y?.toFixed(2)));
   // const quantMensal = lancamentos.map(item => item.z);
 

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
        style:{
          colors:['#000000']
        },
        offsetY: -20,
        formatter: function (value:number, { dataPointIndex,seriesIndex }:{dataPointIndex:number,seriesIndex:number}) {
              const total = dados[seriesIndex]?.data[dataPointIndex].z
            
              return `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
              (${total})`;
            
           
        
        },
      },
      title: {
        text: 'MENSALIDADE/QUANTIDADE'
      },
      theme:{
        mode: 'light',
        palette: 'palette1'
      },
      tooltip: {
        theme:false,
        
        y: {
         formatter:  function (value:number, { seriesIndex }:{seriesIndex:number}) {
          

             
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
              
              
            
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
      

      xaxis: {
       // categories: datas,
        type: 'bar',
       
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

      yaxis:{
        labels:{
          formatter:function(value:number){
            return value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
          }
        }
      }
    };
    let chartSeries
    

  chartSeries = dados.map(item=>{
    return {name:item.name,data:item.data}
  });



  

    setOptions(chartOptions); // Define as opções do gráfico no estado
    setSeries(chartSeries); // Define a série de dados do gráfico no estado

  },[dados]);
  
  // Renderiza o gráfico somente se as opções e a série de dados estiverem disponíveis
  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
         {series.length > 0 && <Chart
            options={options}
            series={series}
            type="bar"
            width={'100%'}
           height='400'
          />}
        </div>
      </div>
    </div>
  );
}

export default GraficoMensalidade;
