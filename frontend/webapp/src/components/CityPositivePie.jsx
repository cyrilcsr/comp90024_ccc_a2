import React, { Component } from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts'

import SelectionBar from './SelectionBar'

import '../css/styles.css'

export default class PositivePieLeft extends Component {
    constructor({props}){
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            city: 'Melbourne',
            needUpdate: false,
            series: [1, 1],
            options: {
              legend: {
                show: false
              },
              stroke:{
                show: false
              },
              tooltip: {

              },
              labels: ['Support', 'Neutral or Not Support'],
              chart: {
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

    handleChange(e){
        e.preventDefault()
        this.setState({
          city: e.target.attributes.name.value,
          needUpdate: true
        })
      }
    
    renderChart(){
        const url = 'http://127.0.0.1:5000/positive_per_city/'
        axios
        .get(url, {
            params: {
                city: this.state.city
            }
        })
        .then(res => {
          const data = res.data
          this.setState({
              series: [data.positive, data.others]
          })
        })
    }
    componentDidMount(){
        console.log('getting data')
        this.renderChart()
    }

    componentDidUpdate() {
        if(this.state.needUpdate){
            console.log(`updating, now city is ${this.state.city}`)
            this.renderChart()
            this.setState({ needUpdate: false})
        }
    }

    render() {
        return (
            <div className='pos-pie-chart'>
                <SelectionBar handleChange={this.handleChange} name={this.state.city} type='vaccine'/>
                <Chart type="pie" width={350} series={this.state.series} options={this.state.options} className='positive-chart'/>
          </div>
        )
    }
}
