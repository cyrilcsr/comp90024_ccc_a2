import React, { Component } from 'react'
import axios from 'axios'
import { PieChart } from 'react-minimal-pie-chart';

import Nav from '../../components/Nav'
import './css/Scenarios.css'

export default class Scenario1 extends Component {
    constructor(props){
        super(props)
        this.state = {
            rural: {},
            city: {},
            total: {}
        }
    }

    componentDidMount() {
        axios.get(`https://localhost:5000/num_tweet/total`)
          .then(res => {
            const rural = res.data;
            this.setState({ rural })
          })
      }

    render() {
        return (
            <div className='scenario'>
                <Nav />
                <div className='scenario-body'>
                    <h3 className='scenario-title'>Scenario 1</h3>
                    <div className="chart-container">
                    <PieChart 

                        data={[
                            { title: 'One', value: 10, color: '#E38627' },
                            { title: 'Two', value: 15, color: '#C13C37' },
                            { title: 'Three', value: 20, color: '#6A2135' },
                        ]}
                        radius={5}
                        center={[5, 5]}
                        viewBoxSize={[100, 100]}
                        label={(data) => data.dataEntry.title}
                          labelPosition={5}
                          labelStyle={{
                            fontSize: "1px",
                            fontColor: "FFFFFA",
                            fontWeight: "0.05",
                          }}
                    />;
                    </div>
                </div>
            </div>
        )
    }
}
