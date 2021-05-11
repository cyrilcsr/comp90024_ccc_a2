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
              labels: ['Support', 'Neutral or Not Support'],
              chart: {
                width: 30,
                type: 'pie'
              },
              colors:['#F44336', '#242424'],
              responsive: [{
                breakpoint: 480,
                options: {

                }
              }]
            }
        }
    }

    componentDidMount(){
      const url = 'http://127.0.0.1:5000/positive_score/'
      axios
      .get(url)
      .then(res => {
        const data = res.data.data
        this.setState({ 
          series1: [data.Brisbane.positive, data.Brisbane.others],
          // series2: [data.Perth.positive, data.Perth.others],
          series3: [data.Canberra.positive, data.Canberra.others]
      })
      })
    }
    render() {
        return (
          <div className="positive-charts">
            <div className='pos-pie-chart'>
              <h3 className='city-name'>Brisbane</h3>
              <Chart type="pie" series={this.state.series1} options={this.state.options} />
            </div>
            <div className='pos-pie-chart'>
              <h3 className='city-name'>Perth</h3>
              <Chart type="pie" series={this.state.series2} options={this.state.options} />
            </div>
            <div className='pos-pie-chart'>
              <h3 className='city-name'>Canberra</h3>
              <Chart type="pie" series={this.state.series3} options={this.state.options} />
            </div>
        </div>
        )
    }
}
