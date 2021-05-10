import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from 'axios'
import "mapbox-gl/dist/mapbox-gl.css"
import "../App.css"

import '../css/styles.css'


// adding GeoJSON read from a file
import ExampleData from "../data/city_data.json";


const Map = ({ onClick }) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef();
  
  useEffect(() => {
    let cityUrl = 'http://127.0.0.1:5000/num_tweet/?option=city'
    let ruralUrl = 'http://127.0.0.1:5000/num_tweet/?option=rural'
    let radius = 10

    const cityRequest = axios.get(cityUrl);
    const ruralRequest = axios.get(ruralUrl);

    
    axios
    .all([cityRequest, ruralRequest])
    .then(axios.spread((...res) => {
      const cityData = res[0].data.data
      const ruralData = res[1].data.data

      ExampleData.features.forEach(location => {
        if(cityData[location.properties.name]){
          location.properties.total_tweet = cityData[location.properties.name].total_tweet
          location.properties.pos_tweet = cityData[location.properties.name].pos_tweet
          location.properties.neg_tweet = cityData[location.properties.name].neg_tweet
          location.properties.neutral_tweet = cityData[location.properties.name].neutral_tweet
        }
        else if(ruralData[location.properties.name]){
          location.properties.total_tweet = ruralData[location.properties.name].total_tweet
          location.properties.pos_tweet = ruralData[location.properties.name].pos_tweet
          location.properties.neg_tweet = ruralData[location.properties.name].neg_tweet
          location.properties.neutral_tweet = ruralData[location.properties.name].neutral_tweet
          location.properties.name = 'Rural Area'
        }

      })
    }))
    .then(res => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiamVhbnN4dCIsImEiOiJja2Y3anRnZzEwMzJpMnpsa29ldDExbnZ5In0.9VVP31HO-qw7t14WaWOZ6g';
      const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/jeansxt/cko9nl9d81nsw17mpgbwn11ph", // stylesheet location
        center: [135.2, -29.6],
        zoom: 4
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
          id: "city_tweet",
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
            "circle-radius":['+', -10, ['number', ['get', 'total_tweet'], -10]],
            'circle-opacity': 0.5,
          },

        });

        // my cute tiny popup
        var popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        function constructHTML(ele){
          return `
          <div style="text-align: center;"><p style="font-size: 20px; margin-bottom: 0;">${ele.name}</p></div>
          <div><strong>total tweet</strong>: ${ele.total_tweet}</div>
          <div><strong>positive tweet</strong>: ${ele.pos_tweet}</div>
          <div><strong>neutral tweet</strong>: ${ele.neutral_tweet}</div>
          <div><strong>negtive tweet</strong>: ${ele.neg_tweet}</div>
          `
        }

        map.on('mousemove', 'city_tweet', (e) => {
          map.getCanvas().style.cursor = 'pointer'

          popup.setLngLat(e.features[0].geometry.coordinates)
          .setHTML(constructHTML(e.features[0].properties))
          .addTo(map);
          
        })

        map.on('mouseleave', 'city_tweet', (e) => {
          map.getCanvas().style.cursor = ''
        })

      })


    };
    if (!map) initializeMap({ setMap, mapContainer });

  })
}, [map]);


  

  return <div ref={mapContainer} className='map'/>;
};


export default Map;
