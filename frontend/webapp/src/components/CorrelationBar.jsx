import React, { Component } from 'react'
import Chart from 'react-apexcharts'

export default class CorrelationBar extends Component {
    constructor(props){
        super(props)
        this.state = {
            series: [{
                name: 'Points',
                type: 'scatter',
                data: [
                    {x: 'ALP', y: -0.261}, 
                    {x: 'LNP', y: 0.0914}, 
                    {x: 'RGN', y: 0.177}, 
                    {x: 'OTH', y:  0.252}
                ]
              }],
            options: {
                markers: {
                    size: [6, 0]
                }, 
                chart: {
                    foreColor: 'white'
                },
                title: {
                    text:'Correlation Between Party and Vaccine Support'
                },
                xaxis: {
                    type: 'category',
                    categories: ['ALP', 'LNP', 'RGN', 'OTH'],
                }
           }
        };
    }
    render(){
        return (
            <div>
                <Chart options={this.state.options} series={this.state.series} type="bar" width={400}/>
            </div>
        )
    }
}
