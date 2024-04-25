import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Importa o dynamic para importações dinâmicas
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false }); // Importa o Chart de forma dinâmica e desativa o SSR

interface LancamentosProps{
  conta: string,
  descricao: string,
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

  useEffect(() => {
  
  const resultado = lancamentos.reduce((acumulador,atual)=>{
    const itemExistente = acumulador.find(item=>item.descricao===atual.descricao);


    if(itemExistente){
      itemExistente.valor=Number(itemExistente.valor)+Number(atual.valor);
    }else{
      acumulador.push({descricao:atual.descricao,valor:atual.valor,conta:atual.conta,datalanc:atual.datalanc,historico:atual.historico,tipo:atual.tipo})
    }
    return acumulador
  },[] as Array<LancamentosProps>)
  console.log(resultado)

  const  arrayDeValores = resultado.map(item=>{return{x:item.descricao,y:Number(item.valor), goals: [
    {
       name: 'Expected',
      value: 550,
       strokeColor: '#B32824'
     }
    ] }});

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
        background:'#2b2e3b'
       
      },
     // xaxis: {
      //  categories:[],
      //  labels: {
      //    style: {
      //      colors: "#B32824", // Define a cor dos anos aqui
      //    },
     //   },
    //  },
    //  yaxis: {
    //    labels: {
      //    style: {
       //     colors: "#B32824", // Define a cor do texto no eixo Y aqui
        //  },
       // },
     // },
   };

    // Configuração da série de dados do gráfico
    const chartSeries = [
   
      {
        name: "Afap Cedro",
        data: arrayDeValores,
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
              width="1000"
              height='400'
            
            
            />
          </div>
        </div>
      </div>
    )
  );
}

export default Grafico;
