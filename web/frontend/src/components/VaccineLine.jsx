import React, { Component } from 'react'
import Chart from 'react-apexcharts'
import axios from 'axios'

import SelectionBar from './SelectionBar';

import '../css/styles.css'

export default class VaccineLine extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
          param: 'Overall Tweet',
          needUpdate: false,
          series: [],
          options: {
            chart: {
              width: '500px',
              type: 'line',
              zoom: {
                enabled: true
              },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [5, 7],
              curve: 'smooth',
              dashArray: [0, 8]
            },
            title: {
              text: 'Overall Tweet',
              align: 'left'
            },
            legend: {
              tooltipHoverFormatter: function(val, opts) {
                return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
              }
            },
            markers: {
              size: 0,
              hover: {
                sizeOffset: 6
              }
            },
            xaxis: {
              categories: [],
            },
            tooltip: {
              y: [
                {
                  title: {
                    formatter: function (val) {
                      return val 
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val 
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                }
              ]
            },
            grid: {
              borderColor: '#f1f1f1',
            }
          },
        
        
        };
      }

      handleChange(e){
        e.preventDefault()
        this.setState({
          param: e.target.attributes.name.value,
          needUpdate: true,
          options: {
            title: {
              text: e.target.attributes.name.value
            }
          }
        })
      }

      renderChart(){
        var location = this.state.param === 'Rural Area' ? 'rural' : this.state.param
        const url = 'http://127.0.0.1:5000/vaccine_trend/'
        axios
        .get(url, {
            params: {
                'location': location
            }
        })
        .then(res => {
            const dates = []
            Object.keys(res.data).forEach(d => dates.push(d))
            const neg_tweet = []
            const pos_tweet = []
            const total_tweet = []
            dates.forEach(d => {
                neg_tweet.push(res.data[d].neg)
                pos_tweet.push(res.data[d].pos)
                total_tweet.push(res.data[d].total)
            })
            this.setState({
                series:[{
                  name: "Positive Tweets",
                  data: [...pos_tweet]
                },
                {
                  name: "Negtive Tweet",
                  data: [...neg_tweet]
                }
              ],
              options: {
                xaxis: {
                  categories: [...dates]
                },
                title: {
                  text: this.state.param === '' ? 'Overall Tweet' : this.state.param
                }
              }
            })
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
            <div>
              <SelectionBar handleChange={this.handleChange} name={this.state.param} type='vaccine'/>
              <Chart options={this.state.options} series={this.state.series} type="line" height={500} width={600} />
            </div>

        )
    }
}

