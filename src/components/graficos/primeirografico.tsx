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
  x:string,
  z:number
}

export function Grafico({lancamentos,filtro}:{lancamentos:Array<LancamentosProps>,filtro:string}) {
  const [options, setOptions] = useState({}); // Estado para opções do gráfico
  const [series, setSeries] = useState<{ name: string; data:Array<DataProps >  }[]>([]); // Estado para série de dados do gráfico
  const [seriesmensal,setSeriesMensal]=useState<{name:string,data:Array<number>}[]>([]);
  
  useEffect(() => {
 let contador =1
  const resultado = lancamentos.reduce((acumulador,atual)=>{
    const dataLancamento = new Date(atual.datalanc).toLocaleDateString('en-US');
    const itemExistente = acumulador.find(item=>item.x===dataLancamento);
    
    if(itemExistente){
      itemExistente.y=Number(itemExistente.y) +Number(atual.valor);
      itemExistente.z+=1
    }else{
      acumulador.push({x:dataLancamento,y:atual.valor,z:1})
     
    }
    return acumulador
  },[] as DataProps[])


  

 
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
      
      
       
        borderRadiusApplication: 'end', // 'around', 'end'
        borderRadiusWhenStacked: 'last', // 'all', 'last'
      //  dataLabels: {
        //  total: {
        //    enabled: true,
         //   style: {
          //    color: "#B32824",
           //   fontSize: '23px',
             
          //  }
         // }
       // }
      },
    },
 
    title:{
      text:'MENSALIDADES'
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
        stacked: true,
        toolbar: {
          show: true
        },

        zoom:{
          enabled: true
          },
      
       
      },
    
     
     xaxis: {
       categories:resultado.map(item => item.x),
      
        type:'category',
        labels: {
          formatter: function (val:string) {
            return new Date(val).toLocaleDateString(); // Formatando as datas
          },
         
         style: {
       // colors: "#B32824", // Define a cor dos anos aqui
        },
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
   //  yaxis: {
   //   labels: {
    //     style: {
      //     colors: "#B32824", // Define a cor do texto no eixo Y aqui
      //   },
     //   },
    //  },
   };

    // Configuração da série de dados do gráfico
    const chartSeries = [
   
      {
        name: "RECEITA",
        data: resultado.map(item=>item.y),
      },
      {
        name: "QUANTIDADE",
        data: resultado.map(item=>item.z),
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
              width={'100%'}
              height={500}

            />
          </div>
        </div>
      </div>
    )
  );
}

export default Grafico;
