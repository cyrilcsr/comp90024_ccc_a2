import React, { Component } from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts'
 

export default class BrushLine extends Component {

    constructor(props) {
        super(props);
        this.state = {
          series: {
            data: [
                ['1', '2', '3', '4'],
                [1, 2, 3, 4]
            ]
        },
          options: {
            chart: {
              id: 'chart2',
              type: 'line',
              height: 230,
              toolbar: {
                autoSelected: 'pan',
                show: false
              }
            },
            colors: ['#546E7A'],
            stroke: {
              width: 3
            },
            dataLabels: {
              enabled: false
            },
            fill: {
              opacity: 1,
            },
            markers: {
              size: 0
            },
            xaxis: {
              type: 'datetime'
            }
          },
        
          seriesLine: [{
            data: [
              ['1', '2', '3', '4'],
              [1, 2, 3, 4]
            ]
          }],
          optionsLine: {
            chart: {
              id: 'chart1',
              height: 130,
              type: 'area',
              brush:{
                target: 'chart2',
                enabled: true
              },
              selection: {
                enabled: true,
                xaxis: {
                  categories:['1', '2', '3', '4']
                }
              },
            },
            colors: ['#008FFB'],
            fill: {
              type: 'gradient',
              gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.1,
              }
            },
            xaxis: {
              type: 'datetime',
              tooltip: {
                enabled: false
              }
            },
            yaxis: {
              tickAmount: 2
            }
          },
        
        
        };
    }
    render() {
        return (
        <div id="wrapper">
            <div id="chart-line2">
                {/* <Chart options={this.state.options} series={this.state.series} type="line" height={230} /> */}
            </div>
            <div id="chart-line">
                <Chart options={this.state.optionsLine} series={this.state.seriesLine} type="area" height={130} />
          </div>
          </div>
        )
    }
}
