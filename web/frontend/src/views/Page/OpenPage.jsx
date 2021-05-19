import React from 'react'

import PositiveMap from '../../components/PositiveMap'
import PositivePieLeft from '../../components/PositivePieLeft'
import PositivePieRight from '../../components/PositivePieRight'
import { useHistory } from 'react-router-dom'

import '../../css/styles.css'

export default function OpenPage() {
    let history = useHistory();

    function routeChange() {
        history.push("/scenario-1");}

    return (

        <div className='pos-map-container scenario'>
                    <PositivePieLeft className='positive-charts'/>
                    <PositiveMap className='positive-map' onClick={routeChange}/>
                    <PositivePieRight className='positive-charts'/>
        </div>

    )
}
