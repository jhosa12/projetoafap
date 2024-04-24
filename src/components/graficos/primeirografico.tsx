import React,{Component} from "react";
import Chart from  "react-apexcharts";



export function Grafico()  {
 const state = {
    options: {
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        labels: {
            style: {
              colors: '#B32824' // Define a cor dos anos aqui
            }
          },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#B32824' // Define a cor do texto no eixo Y aqui
          }
        }
      }
     
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    chart: {
      type: 'bar',
      
    },
   

    series: [{
    
      name: 'Afap Lavras',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, {
      name: 'Afap Cedro',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }, {
      name: 'Ótica Viver',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    }],
   
  };

  
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-char">
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              width="600"
              
            />
          </div>
        </div>
      </div>
    );
  
}

export default Grafico;


