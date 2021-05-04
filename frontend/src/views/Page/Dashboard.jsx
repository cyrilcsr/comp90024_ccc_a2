import React from 'react'
import Chartjs from '../Charts/Chartjs'
import Tableau from '../Charts/Tableau'

export default function Dashboard() {
    return (
        <div>
            <p>Just to see how different data viz solutions work for us...</p>
            <h1>Chartjs</h1>
            <p>This is to load data from db from backend (ajax), then use a JS library to generare chart</p>
            <p>Basically, charts will be generared by the web</p>
            <p>Thus all the customization will be done by code</p>
            <Chartjs />
            <h1>Tableau</h1>
            <p>In this case, web just loads pre-made Tableau charts from Tableau. Web is just a place to display them.</p>
            <Tableau />
        </div>
    )
}
