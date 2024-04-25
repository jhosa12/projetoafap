import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Importa o dynamic para importações dinâmicas
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }); // Importa o Chart de forma dinâmica e desativa o SSR

export function Grafico() {
  const [options, setOptions] = useState({}); // Estado para opções do gráfico
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]); // Estado para série de dados do gráfico

  useEffect(() => {
    // Configuração das opções do gráfico
    const chartOptions = {
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        labels: {
          style: {
            colors: "#B32824", // Define a cor dos anos aqui
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#B32824", // Define a cor do texto no eixo Y aqui
          },
        },
      },
    };

    // Configuração da série de dados do gráfico
    const chartSeries = [
      {
        name: "Afap Lavras",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Afap Cedro",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: "Ótica Viver",
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
      },
    ];

    setOptions(chartOptions); // Define as opções do gráfico no estado
    setSeries(chartSeries); // Define a série de dados do gráfico no estado
  }, []); // Executa apenas uma vez quando o componente é montado

  // Renderiza o gráfico somente se as opções e a série de dados estiverem disponíveis
  return (
    options && series && (
      <div className="app">
        <div className="row">
          <div className="mixed-char">
            <Chart
              options={options}
              series={series}
              type="bar"
              width="600"
            />
          </div>
        </div>
      </div>
    )
  );
}

export default Grafico;
