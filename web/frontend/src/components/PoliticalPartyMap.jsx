import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from 'axios'
import "mapbox-gl/dist/mapbox-gl.css"
import "../App.css"

import '../css/styles.css'


// adding GeoJSON read from a file
import ExampleData from "../data/city_data.json";


const Map = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef();
  
  useEffect(() => {
    const url = 'http://127.0.0.1:5000/total_num_tweet/'
    // let radius = 10
    mapboxgl.accessToken = 'pk.eyJ1IjoiamVhbnN4dCIsImEiOiJja2Y3anRnZzEwMzJpMnpsa29ldDExbnZ5In0.9VVP31HO-qw7t14WaWOZ6g';
    const initializeMap = ({ setMap, mapContainer }) => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/jeansxt/cko9nl9d81nsw17mpgbwn11ph", // stylesheet location
      center: [150, -32],
      zoom: 3.3
    });
    // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on("load", () => {
      setMap(map);
      map.resize();

      axios
      .get(url)
      .then(res => {
      const data = res.data

      
        map.on('mousemove', 'city_tweet', (e) => {
          map.getCanvas().style.cursor = 'pointer'

        })

        map.on('mouseleave', 'city_tweet', (e) => {
          map.getCanvas().style.cursor = ''
        })
      })
    })
  }

  if (!map) initializeMap({ setMap, mapContainer });

}, [map])

return <div ref={mapContainer} className='map'/>;
}


export default Map;
