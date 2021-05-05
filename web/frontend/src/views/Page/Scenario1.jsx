import React, { Component } from 'react'

import Nav from '../../components/Nav'
import './css/Scenarios.css'

export default class Scenario1 extends Component {


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
