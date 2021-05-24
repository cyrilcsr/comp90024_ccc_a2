import React, { Component } from 'react'

import PoliticalPartyMap from '../../components/PoliticalPartyMap'
import CityPositivePie from '../../components/CityPositivePie'
import CorrelationPoints from '../../components/CorrelationPoints'
import Nav from '../../components/Nav'

import '../css/Scenarios.css'

export default class Scenario3 extends Component {
    constructor(props){
        super(props)

        this.state = {
            city: false
        }
    }

    render() {
        return (
            <div className='scenario'>
                <Nav />
                <div className="parent">
                    <div className="div1"> <h3 className='scenario-title'>Political Party Support Rate & Vaccination Support Rate</h3> </div>
                    <div className="div2"> <PoliticalPartyMap className='election-map'/></div>
                    <div className="div3">  
                        <CityPositivePie className='positive-pie'/> 
                        <CorrelationPoints className='coorelation'/>
                    </div>
                </div>
            </div>
        )
    }
}
