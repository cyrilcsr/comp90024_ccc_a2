import React, { Component } from 'react'
import Chart from 'react-apexcharts'
import axios from 'axios'

import SelectionBar from '../components/SelectionBar'

export default class BrandLine extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.state = {
          param: 'Overall Brands',
          needUpdate: false,
          elements: [],
          series: [],
          options: {
            chart: {
              height: 350,
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
              text: 'All Brands',
              align: 'left'
            },
            legend: {
              tooltipHoverFormatter: function(val, opts) {
                return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
              },
              top:0,

            
            },
            markers: {
              size: 0,
              hover: {
                sizeOffset: 6
              }
            },
            xaxis: {
              categories: [],
              name:"Date"
            },
            yaxis:{
              name:"Count of Tweets",
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
        console.log(e.target.attributes)
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
        var nodeURL = `http://${window.location.hostname}:5000`
        axios
        .get(nodeURL)
        .then(res => {
          const url = 'http://' + res.data.data + ':5000/brand_trend'
          axios
          .get(url, {
              params: {
                  'brand': this.state.param
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
                    text: this.state.param === '' ? 'All Brands' : this.state.param
                  }
                }
              })
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
              <SelectionBar handleChange={this.handleChange} name={this.state.param} type='brand'/>
              <Chart options={this.state.options} series={this.state.series} type="line" height={400} width={600}/>
            </div>

        )
    }
}

