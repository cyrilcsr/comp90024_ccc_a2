import React, { Component } from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts'

import '../css/styles.css'

export default class PositivePieRight extends Component {
    constructor({props}){
        super(props)
        this.state = {
            series1: [1, 1],
            series2: [1, 1],
            series3: [1, 1],
            options: {
              legend: {
                show: false
              },
              tooltip: {

              },
              stroke:{
                show: false
              },
              labels: ['Support', 'Neutral or Not Support'],
              chart: {
                width: 35,
                type: 'pie'
              },
              colors:['#fbb03b', '#3e3c3c'],
              responsive: [{
                breakpoint: 480,
                options: {

                }
              }]
            }
        }
    }

    componentDidMount(){
      var nodeURL = `http://${window.location.hostname}:5000`
      axios
      .get(nodeURL)
      .then(res => {
        const url = 'http://' + res.data.data + ':5000/positive_score/'
        axios
        .get(url)
        .then(res => {
          const data = res.data.data
          this.setState({ 
            series1: [data.Brisbane.positive, data.Brisbane.others],
            // series2: [data.Perth.positive, data.Perth.others],
            // series3: [data.RuralArea.positive, data.RuralArea.others]
        })
        })
      })
   

    }
    render() {
        return (
          <div className="positive-charts">
            <div className='pos-pie-chart'>
              <h3 className='city-name'>Brisbane</h3>
              <Chart type="pie" series={this.state.series1} options={this.state.options} className='positive-chart'/>
            </div>
            <div className='pos-pie-chart'>
              <h3 className='city-name'>Perth</h3>
              <Chart type="pie" series={this.state.series2} options={this.state.options} className='positive-chart'/>
            </div>
            <div className='pos-pie-chart'>
              <h3 className='city-name'>Rural Area</h3>
              <Chart type="pie" series={this.state.series3} options={this.state.options} className='positive-chart'/>
            </div>
        </div>
        )
    }
}
