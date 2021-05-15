import React, { Component } from 'react'
import axios from 'axios'
import Chart from 'react-apexcharts'
import SelectionBar from './SelectionBar';

import '../css/styles.css'

export default class SelectedPieCitySupport extends Component {
    constructor({props}){
        super(props)
        this.handleChange = this.handleChange.bind(this)

        this.state = {
            param: 'Sydney',
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
              labels: ['Support', 'Others'],
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



    renderChart(){
      var location = this.state.param === 'Rural Area' ? 'rural' : this.state.param
      const url = 'http://127.0.0.1:5000/vaccine_trend/'
      axios
      .get(url, {
        param: {
          "location": location
        }
      })
      .then(res => {
        const data = res.data.data
        
        })
      }

      handleChange(e){
        console.log(e.target.attributes)
        e.preventDefault()
        this.setState({
          param: e.target.attributes.name.value,
          needUpdate: true
        })
      }


      componentDidMount(){
        this.renderChart()
      }
      
      componentDidUpdate(){
        if(this.state.needUpdate){
          this.renderChart()
          this.setState({
            needUpdate: false
          })
        }
      }


    render() {
        return (
        <div className="positive-charts">
          <div className='pos-pie-chart'>
            <SelectionBar handleChange={this.handleChange} name={ this.state.param } />
            <Chart type="pie" series={this.state.series} options={this.state.options} className='positive-chart'/>
          </div>
        </div>
        )
    }
}
