import React from 'react'

import PositiveMap from '../../components/PositiveMap'
import PositivePieLeft from '../../components/PositivePieLeft'
import PositivePieRight from '../../components/PositivePieRight'

import '../css/Scenarios.css'

export default function OpenPage() {
    return (
        <div className='pos-map-container scenario'>
            <PositivePieLeft />
            <PositiveMap className='positive-map'/>
            <PositivePieRight />
        </div>

    )
}
