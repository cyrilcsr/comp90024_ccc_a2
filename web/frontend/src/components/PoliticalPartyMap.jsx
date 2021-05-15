import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from 'axios'
import "mapbox-gl/dist/mapbox-gl.css"
import "../App.css"

import '../css/styles.css'

const PoliticalPartyMap = () => {
  const [map, setMap] = useState(null);
  const [party, setParty] = useState('liberal')
  const mapContainer = useRef();
  
  useEffect(() => {

    mapboxgl.accessToken = 'pk.eyJ1IjoiamVhbnN4dCIsImEiOiJja2Y3anRnZzEwMzJpMnpsa29ldDExbnZ5In0.9VVP31HO-qw7t14WaWOZ6g';
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/jeansxt/cko9nl9d81nsw17mpgbwn11ph", // stylesheet location
        center: [150, -32],
        zoom: 3.3
      })
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      var geoData = {}
      map.on("load",function () {
      setMap(map);
      map.resize();
      axios
      .get('http://127.0.0.1:5000/political_party/', {
        params: {
          'party': party
        }
      })
      .then(res => {
        geoData = res.data
      })
      .then(() => {
        map.addSource('party_support', {
          type: 'geojson',
          data: geoData,
        });

        map.addLayer({
          id:"2019_election",
          type: 'circle',
          source: 'party_support',
          'paint': {
            'circle-radius': 10,
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
    
    })
  }

  if (!map) initializeMap({ setMap, mapContainer });

}, [map, party])

return (
  <div>
    <div ref={mapContainer} className='map'/>
  </div>
)
}


export default PoliticalPartyMap;
