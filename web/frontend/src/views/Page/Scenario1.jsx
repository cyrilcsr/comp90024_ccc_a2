import React, { Component } from 'react'
import axios from 'axios'

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
                </div>
            </div>
        )
    }
}
