import React,{Component} from "react";
import Chart from  "react-apexcharts";



class Grafico extends Component {
  state = {
    options: {
      chart: {
        id: "basic-bar"
       
      },
     
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
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91],
        color: '#B32824'
     
    
      }
    ]
  };

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-char">
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="area"
              width="500"
              
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Grafico;


