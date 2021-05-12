import React, { Component } from 'react'
import Chart from 'react-apexcharts'

export default class BubbleChart extends Component {
     constructor(props) {
          super(props);

          this.state = {
          
            series: [
            {
              name: 'Bubble4',
              data: [[1, 34], [3, 54], [5, 23], [15, 43], [1, 34], [3, 54], [5, 23], [15, 43]],
        }],
            options: {
              chart: {
                  height: 350,
                  type: 'bubble',
              },
              dataLabels: {
                  enabled: false
              },
              fill: {
                  opacity: 0.8
              },
              title: {
                  text: 'Simple Bubble Chart'
              },
              xaxis: {
                  type: 'numeric'
              },
              yaxis: {
                  min: 10
              }
            },
          
          
          };
        }
    render() {
        return (
        <div id="chart">
            <Chart options={this.state.options} series={this.state.series} type="bubble" height={350} />
        </div>
        )
    }
}
