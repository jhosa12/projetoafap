import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Importa o dynamic para importações dinâmicas
import moment from 'moment-timezone'; // Importa moment-timezone para manipulação de datas com fuso horário
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

export function Grafico({ lancamentos, filtroDia, filtroMes, filtroAno, todoPeriodo, startDate, endDate, contratosGeral }:
  {
    lancamentos: Array<LancamentosProps>,
    filtroDia: boolean,
    filtroMes: boolean,
    filtroAno: boolean,
    todoPeriodo: boolean,
    startDate: Date,
    endDate: Date,
    contratosGeral: Array<ContratosGeral>
  }) {
  const [options, setOptions] = useState({}); // Estado para opções do gráfico
  const [series, setSeries] = useState<{ name: string; data: Array<DataProps> }[]>([]); // Estado para série de dados do gráfico
  const [seriesmensal, setSeriesMensal] = useState<{ name: string, data: Array<number>, color: string }[]>([]);

  useEffect(() => {
    const timezone = 'America/Distrito_Federal';
    let dataLancamento: string;

    const resultado = lancamentos.reduce((acumulador, atual) => {
      const dataLancTeste = new Date(new Date(atual.data).getUTCFullYear(),new Date(atual.data).getUTCMonth(),new Date(atual.data).getUTCDate())

      if (filtroDia) {
        dataLancamento = dataLancTeste.toLocaleDateString('pt-BR',{
          year:'numeric',
          month:'numeric',
          day:"numeric"
        });
      } else if (filtroMes) {
        dataLancamento = dataLancTeste.toLocaleDateString('pt-BR',{
          year:'numeric',
          month:'numeric',
       
        });
      } else if (filtroAno) {
        dataLancamento = dataLancTeste.toLocaleDateString('pt-BR',{
          year:'numeric',
          
        });
      }

      const atualDate = dataLancTeste
      const start = new Date(new Date(startDate).getUTCFullYear(),new Date(startDate).getUTCMonth(),new Date(startDate).getUTCDate())
      const end =new Date(new Date(endDate).getUTCFullYear(),new Date(endDate).getUTCMonth(),new Date(endDate).getUTCDate())

      if (!todoPeriodo && atualDate>=start && atualDate<=end) {
        const itemExistente = acumulador.find((item) => item.x === dataLancamento);

        if (itemExistente) {
          itemExistente.y += Number(atual._sum.valor);
          itemExistente.z += atual._count.data;
        } else {
          acumulador.push({ x: dataLancamento, y: Number(atual._sum.valor), z: atual._count.data, c: 0, dt: dataLancTeste, cancelamentos: 0 });
        }
      }

      return acumulador;
    }, [] as DataProps[]);

    const teste = resultado.reduce((acumulador, atual) => {
      const mesExistente = acumulador.find(item => moment(item.dt).isSame(atual.dt, 'month'));

      if (!mesExistente) {
        const contratosG = contratosGeral.filter((item) => {
          const anoContrato = moment(item.dt_adesao).tz(timezone).startOf('month');
          const anoAtual = moment(atual.dt).tz(timezone).startOf('month');
          return anoContrato.isSameOrBefore(anoAtual);
        });

        const contratosIN = contratosGeral.filter((item) => {
          const anoContrato = moment(item.dt_cancelamento).tz(timezone).startOf('month');
          const anoAtual = moment(atual.dt).tz(timezone).startOf('month');
          return item.dt_cancelamento !== null && anoContrato.isSameOrBefore(anoAtual);
        });

        const cancelamentosMes = contratosGeral.filter(item => {
          const anoContrato = moment(item.dt_cancelamento).tz(timezone).startOf('month');
          const anoAtual = moment(atual.dt).tz(timezone).startOf('month');
          return anoContrato.isSame(anoAtual);
        });

        acumulador.push({ x: atual.x, y: atual.y, z: atual.z, c: contratosG.length - contratosIN.length, dt: atual.dt, cancelamentos: cancelamentosMes.length });
      } else {
        acumulador.push({ x: atual.x, y: atual.y, z: atual.z, c: 0, dt: atual.dt, cancelamentos: atual.cancelamentos });
      }

      return acumulador;
    }, [] as DataProps[]);

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
        offsetY: -20
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
        categories: teste.map(item => item.x),
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

    let chartSeries;
    if (filtroMes || filtroAno) {
      chartSeries = [
        {
          name: "RECEITA COM MENSALIDADES",
          data: teste.map(item => item.y),
          color: '#1056b5'
        },
        {
          name: "QUANT. MENSALIDADES",
          data: teste.map(item => item.z),
          color: '#fede72'
        },
        {
          name: "CONTRATOS ATIVOS",
          data: teste.map(item => item.c),
          color: '#2c9171'
        },
        {
          name: "CANCELAMENTOS",
          data: teste.map(item => item.cancelamentos),
          color: '#B32824'
        },
      ];
    } else {
      chartSeries = [
        {
          name: "RECEITA",
          data: teste.map(item => item.y),
          color: '#B32824'
        },
        {
          name: "QUANTIDADE",
          data: teste.map(item => item.z),
          color: '#2c9171'
        },
      ];
    }

    setOptions(chartOptions); // Define as opções do gráfico no estado
    setSeriesMensal(chartSeries); // Define a série de dados do gráfico no estado
  }, [filtroDia, filtroMes, filtroAno, startDate, endDate, todoPeriodo, lancamentos, contratosGeral]); // Executa apenas uma vez quando o componente é montado

  // Renderiza o gráfico somente se as opções e a série de dados estiverem disponíveis
  return (
    options && seriesmensal && (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
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
