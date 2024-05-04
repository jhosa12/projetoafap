import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Importa o dynamic para importações dinâmicas
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }); // Importa o Chart de forma dinâmica e desativa o SSR

interface LancamentosProps{
  conta: string,
  descricao: string,
  id_grupo:number,
  historico:  string ,
  tipo: string,
  valor: number,
  datalanc: Date,
  
}

interface DataProps{
  y:number,
  x:string
}




export function Grafico({lancamentos}:{lancamentos:Array<LancamentosProps>}) {
  const [options, setOptions] = useState({}); // Estado para opções do gráfico
  const [series, setSeries] = useState<{ name: string; data:Array<DataProps >  }[]>([]); // Estado para série de dados do gráfico
  const [seriesmensal,setSeriesMensal]=useState<{name: string; data:Array<number>}[]>([]);
  useEffect(() => {
 
  const resultado = lancamentos.reduce((acumulador,atual)=>{
    const itemExistente = acumulador.find(item=>item.descricao===atual.descricao);

    if(itemExistente){
      itemExistente.valor=Number(itemExistente.valor)+Number(atual.valor);
    }else{
      acumulador.push({descricao:atual.descricao,valor:atual.valor,conta:atual.conta,datalanc:atual.datalanc,historico:atual.historico,tipo:atual.tipo,id_grupo:atual.id_grupo})
    }
    return acumulador
  },[] as Array<LancamentosProps>)


  const  arrayDeValores = resultado.map(item=>{return{x:item.descricao,y:Number(item.valor),}});
    
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
    
    title:{
      text:'GRAFICO TESTE'
    },
    theme:{
      mode:'dark',
      palette1:'palette1'
    },
      tooltip:{
        theme:'dark',
      

      },
      chart: {
        type:'bar',
        background:'#2b2e3b',
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
       
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
     xaxis: {
       categories:lancamentos.map(item=>{return new Date(item.datalanc).toDateString()}),
      
        labels: {
         style: {
        colors: "#B32824", // Define a cor dos anos aqui
        },
      }
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
        name: "Afap Cedro",
        data: lancamentos.map(item=>{return Number(item.valor)}),
      },
  
    ];

    setOptions(chartOptions); // Define as opções do gráfico no estado
   // setSeries(chartSeries); // Define a série de dados do gráfico no estado
   setSeriesMensal(chartSeries)
  }, []); // Executa apenas uma vez quando o componente é montado

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
              width="1000"
              height='380'
            
            
            />
          </div>
        </div>
      </div>
    )
  );
}

export default Grafico;
