import React from 'react'
import { useHistory } from 'react-router-dom'
import Map from '../../components/Map'

import '../css/Home.css'

function FrontPage() {
    let history = useHistory();

    function routeChange() {
        history.push("/scenario-1");
      }


    return (
        
            <div className='map'>
                <div></div>
                <Map onClick={routeChange}/>
            </div>

    )
}

export default FrontPage
