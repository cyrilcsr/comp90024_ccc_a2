import React, { Component } from 'react'
import axios from 'axios'

import Nav from '../../components/Nav'
import BrandLine from '../../components/BrandLine'
import VaccineLine from '../../components/VaccineLine'
import BrushLine from '../../components/BrushLine'
import BubbleChart from '../../components/BubbleChart'
import SelectionBar from '../../components/SelectionBar'
import '../css/Scenarios.css'

export default class Scenario1 extends Component {
    constructor(props){
        super(props)

        this.state = {
            line: false
        }
    }

    render() {
        var style = {
            color: 'white'
        }
        return (
            <div className='scenario'>
                 <Nav />
                 <div className='scenario1-body'>
                     <VaccineLine/>
                     <div onClick={() => this.setState({ line: !this.state.line })}>
                        <BrandLine />
                     </div>
                 </div>
             </div>
            )
    }
}