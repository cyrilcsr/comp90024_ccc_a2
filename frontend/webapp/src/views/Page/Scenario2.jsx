import React, { Component } from 'react'

import PoliticalPartyMap from '../../components/PoliticalPartyMap'
import CityPositivePie from '../../components/CityPositivePie'
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
                <div class="parent">
                    <div class="div1"> <h3 className='scenario-title'>Political Party Support Rate & Vaccination Support Rate</h3> </div>
                    <div class="div2"> <PoliticalPartyMap className='election-map'/></div>
                    <div className="div3">  
                        <CityPositivePie/> 
                    </div>
                </div>
            </div>
        )
    }
}
