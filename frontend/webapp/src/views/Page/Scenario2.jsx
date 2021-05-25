import React, { Component } from 'react'

import PoliticalPartyMap from '../../components/PoliticalPartyMap'
import CityPositivePie from '../../components/CityPositivePie'
import CorrelationBar from '../../components/CorrelationBar'
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
                    <div className="div1"> <h3 className='scenario-title'>How Does Political Party Support Ratio Relate To Vaccine Support Ratio?</h3> </div>
                    <div className="div2"> <PoliticalPartyMap className='election-map'/></div>
                    <div className="div3">  
                        <h3>Vaccine Support Ratio</h3>
                        <CityPositivePie className='positive-pie'/> 
                        <CorrelationBar className='coorelation'/>
                    </div>
                </div>
            </div>
        )
    }
}
