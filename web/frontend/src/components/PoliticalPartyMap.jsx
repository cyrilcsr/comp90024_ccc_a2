import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from 'axios'
import "mapbox-gl/dist/mapbox-gl.css"
import "../App.css"

import '../css/styles.css'

const PoliticalPartyMap = () => {
  const [map, setMap] = useState(null);
  const [party, setParty] = useState('the_greens')
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
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });

        map.addLayer({
          id:"2019_election",
          type: 'circle',
          source: 'party_support',
          'paint': {
            'circle-radius': 8,
            'circle-color': '#223b53',
            }
          });
  
        map.on('mouseenter', '2019_election', function () {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', '2019_election', function () {
          map.getCanvas().style.cursor = '';
        });
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
