import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from 'axios'
import "mapbox-gl/dist/mapbox-gl.css"
import "../App.css"

import '../css/styles.css'


// adding GeoJSON read from a file
import election_data from "../data/grouped_election_data.json";
import earthquake_data from "../data/earthquakes.geojson";


const Map = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef();
  
  useEffect(() => {
    const url = 'http://127.0.0.1:5000/political_party/?party=the_greens'
    // let radius = 10
    mapboxgl.accessToken = 'pk.eyJ1IjoiamVhbnN4dCIsImEiOiJja2Y3anRnZzEwMzJpMnpsa29ldDExbnZ5In0.9VVP31HO-qw7t14WaWOZ6g';
    const initializeMap = ({ setMap, mapContainer }) => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/jeansxt/cko9nl9d81nsw17mpgbwn11ph", // stylesheet location
      center: [150, -32],
      zoom: 3.3
    });
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

 
    map.on("load",function () {
      setMap(map);
      map.resize();

      axios
      .get(url)
      .then(res => {
      const data = res.data

      map.addSource('party_support', {
      type: 'geojson',
      data: data,
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

}, [map])

return <div ref={mapContainer} className='map'/>;
}


export default Map;
