import React from 'react'

import PositiveMap from '../../components/PositiveMap'
import { useHistory } from 'react-router-dom'

import '../../css/styles.css'

export default function OpenPage() {
    let history = useHistory();

    function routeChange() {
        history.push("/scenario-1");}

    return (
        <div className='pos-map-container scenario'>
            <PositiveMap className='positive-map' onClick={routeChange}/>
        </div>

    )
}
