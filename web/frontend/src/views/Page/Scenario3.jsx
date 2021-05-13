import React, { Component } from 'react'
import Map from '../../components/PoliticalPartyMap'
import SelectedPieCitySupport from '../../components/SelectedPieCitySupport'
import VaccineLine from '../../components/VaccineLine'
import SelectionBar from '../../components/SelectionBar'

import Nav from '../../components/Nav'
import '../css/Scenarios.css'
import axios from 'axios'

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
                <div class="div2"> 
                    <Map classname='election-map'/>      
                </div>
                <div class="div3">  
                    <SelectedPieCitySupport/> 
                     <div onClick={() => this.setState({ city: !this.state.line })}>
                    </div>

                </div>
            </div>
            </div>
            
        )
    }
}
