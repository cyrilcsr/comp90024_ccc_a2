import React, { Component } from 'react'
import axios from 'axios'

import Nav from '../../components/Nav'
import '../css/Scenarios.css'

export default class Scenario1 extends Component {

    render() {
        return (
            <div className='scenario'>
                <Nav />
            </div>
        )
    }
}
