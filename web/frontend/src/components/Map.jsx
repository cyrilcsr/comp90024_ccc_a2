import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from 'axios'
import "mapbox-gl/dist/mapbox-gl.css"
import "../App.css"

import '../css/styles.css'


// adding GeoJSON read from a file
import ExampleData from "../data/example_data.json";


const Map = ({ onClick }) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef();
  

  useEffect(() => {
    // prepare data
    axios
    .get('http://127.0.0.1:5000/num_tweet/?option=city')
    .then(res => {
      const data = res.data.data
      ExampleData.features.forEach(location => {
        if(data[location.properties.name]){
          location.properties.total_tweet = data[location.properties.name].total_tweet
        }
      })
    })
    .then(() => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiamVhbnN4dCIsImEiOiJja2Y3anRnZzEwMzJpMnpsa29ldDExbnZ5In0.9VVP31HO-qw7t14WaWOZ6g';
      const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/jeansxt/cko9nl9d81nsw17mpgbwn11ph", // stylesheet location
        center: [135.2, -29.6],
        zoom: 3
      });
      // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.on("load", () => {
        setMap(map);
        map.resize();

        map.addSource("city_tweet", {
          type: "geojson",
          data: ExampleData
        })

        // add a circle layer to the map
        map.addLayer({
          id: "city_tweet-circle",
          type: "circle",
          source: "city_tweet",
          paint: {
            'circle-color':[
              'match',
              ['get', 'type'],
              'metropolitan',
              '#fbb03b',
              'rural',
              '#223b53',
              /* other */ '#ccc'
            ],
            "circle-radius": ['+', -10, ['number', ['get', 'total_tweet'], -10]],
            'circle-opacity': 0.8,
          },

        })
      });
    };
    if (!map) initializeMap({ setMap, mapContainer });
  })
}, [map]);
  

  return <div ref={mapContainer} className='map' onClick={onClick}/>;
};


export default Map;