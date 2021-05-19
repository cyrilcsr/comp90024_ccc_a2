import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from 'axios'
import "mapbox-gl/dist/mapbox-gl.css"
import "../App.css"

import SelectionBar from './SelectionBar'
import '../css/styles.css'

const PoliticalPartyMap = () => {
  const [map, setMap] = useState();
  const [party, setParty] = useState('liberal')
  const [update, setUpdate] = useState(false)
  const mapContainer = useRef();
  
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamVhbnN4dCIsImEiOiJja2Y3anRnZzEwMzJpMnpsa29ldDExbnZ5In0.9VVP31HO-qw7t14WaWOZ6g';
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/jeansxt/cko9nl9d81nsw17mpgbwn11ph", // stylesheet location
        center: [150, -28],
        zoom: 2.8
      })

      map.on("load",function () {
        console.log('loading map')
        setMap(map);
        map.resize();
        renderMap(map, party)
    })
  }

  if (!map) initializeMap({ setMap, mapContainer });

})

useEffect(() => {
  if(update){
    renderMap(map, party)
    setUpdate(false)
  }
}, [update])

  function handleChange(e){
    e.preventDefault()
    setParty(e.target.attributes.name.value)
    setUpdate(true)
  }

  function renderMap(map, party){
    console.log('rendering map')
    axios
    .get('http://127.0.0.1:5000/political_party/', {
      params: {
        'party': party
      }
    })
    .then(res => {
      console.log('adding source')

      // removing previous layer & source
      var layer = map.getLayer('2019_election');
      if(typeof layer !== 'undefined') {
      map.removeLayer('2019_election').removeSource('party_support');
    }

      map.addSource('party_support', {
        type: 'geojson',
        data: res.data,
      });
      console.log('adding layer')
      map.addLayer({
        id:"2019_election",
        type: 'circle',
        source: 'party_support',
        'paint': {
          'circle-radius': 3,
          'circle-color': {
            property: 'mag',
            stops: [
            [0, '#f1f075'],
            [80, '#e55e5e']
            ]
            },
          'circle-opacity': 0.5,
          }
        });


      // my cute tiny popup
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      function constructHTML(ele){
        return `
        <div style="text-align: center;"><p style="font-size: 20px; margin-bottom: 0;">Party Support Percent</p></div>
        <div><strong>support raio </strong>: ${ele.mag}%</div>
        <div><strong>State </strong>: ${ele.state}</div>
        `
      }

      map.on('mousemove', '2019_election', (e) => {
        map.getCanvas().style.cursor = 'pointer'
        popup.setLngLat(e.features[0].geometry.coordinates)
        .setHTML(constructHTML(e.features[0].properties))
        .addTo(map);
        
      })

      map.on('mouseleave', '2019_election', (e) => {
        map.getCanvas().style.cursor = ''
      })
    })
  }

return (
  <div className='politial-map'>
    <SelectionBar handleChange={handleChange} name={party} type='parties' />
    <div ref={mapContainer} className='map'/>
  </div>
)
}


export default PoliticalPartyMap;
