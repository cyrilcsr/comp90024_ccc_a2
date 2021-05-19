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
    const url = 'http://127.0.0.1:5000/total_num_tweet/'
    // let radius = 10

    mapboxgl.accessToken = 'pk.eyJ1IjoiamVhbnN4dCIsImEiOiJja2Y3anRnZzEwMzJpMnpsa29ldDExbnZ5In0.9VVP31HO-qw7t14WaWOZ6g';
    const initializeMap = ({ setMap, mapContainer }) => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/jeansxt/cko9nl9d81nsw17mpgbwn11ph", // stylesheet location
      center: [135.2, -26.3],
      zoom: 3.2
    });
    // map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on("load", () => {
      setMap(map);
      map.resize();

      axios
      .get(url)
      .then(res => {
      const data = res.data

      ExampleData.features.forEach(location => {
        if(data[location.properties.name]){
          location.properties.total_tweet = data[location.properties.name].total_tweet
          location.properties.pos_tweet = data[location.properties.name].pos_tweet
          location.properties.neg_tweet = data[location.properties.name].neg_tweet
          location.properties.neutral_tweet = data[location.properties.name].neutral_tweet
        }
      })
    })
      .then(() => {

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
    })
  }

  if (!map) initializeMap({ setMap, mapContainer });

}, [map])

return <div ref={mapContainer} className='map' onClick={onClick}/>;

}


export default Map;
