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
  c: number,
  cancelamentos: number
}

export function Grafico({lancamentos, contratosGeral }:
  {
    lancamentos: Array<DataProps>,
    contratosGeral: Array<ContratosGeral>
  }) {
  const [options, setOptions] = useState({}); // Estado para opções do gráfico
  const [series, setSeries] = useState<{ name: string; data: Array<number>; color: string }[]>([]); // Estado para série de dados do gráfico

  useEffect(()=>{
    const datas= lancamentos.map(item => item.x);
    const receitaMensalidade = lancamentos.map(item => Number(item.y.toFixed(2)));
    const quantMensal = lancamentos.map(item => item.z);
    const ativos= lancamentos.map(item => item.c);
    const cancel =  lancamentos.map(item => item.cancelamentos);

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
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
          }
          return value;
        },
      },
      title: {
        text: 'MENSAL./QUANT./ATIVOS/CANCELAMENTOS'
      },
      theme: {
        mode: 'dark',
        palette: 'palette1'
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function (value:number, { seriesIndex }:{seriesIndex:number}) {
            if (seriesIndex === 0) {
              return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
            }
            return value;
          }
        }
      },
      chart: {
        type: 'bar',
        background: '#2b2e3b',
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        },
      },
      xaxis: {
        categories: datas,
        type: 'category',
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

    const chartSeries = [
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
      {
        name: "CONTRATOS ATIVOS",
        data: ativos,
        color: '#2c9171'
      },
      {
        name: "CANCELAMENTOS",
        data: cancel,
        color: '#B32824'
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
            height={400}
          />
        </div>
      </div>
    </div>
  );
}

export default Grafico;
