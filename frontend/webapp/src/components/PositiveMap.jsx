import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import axios from 'axios'
import "mapbox-gl/dist/mapbox-gl.css"
import "../App.css"

import '../css/styles.css'


// adding GeoJSON read from a file
import ExampleData from "../data/city_data.json";


const PositveMap = ({ onClick }) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef();
  
  useEffect(() => {
    const url = '/total_num_tweet/'
    // let radius = 10
    mapboxgl.accessToken = 'pk.eyJ1IjoiamVhbnN4dCIsImEiOiJja2Y3anRnZzEwMzJpMnpsa29ldDExbnZ5In0.9VVP31HO-qw7t14WaWOZ6g';
    const initializeMap = ({ setMap, mapContainer }) => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/jeansxt/cko9nl9d81nsw17mpgbwn11ph", // stylesheet location
      center: [135.2, -28], 
      zoom: 3.5
    });
    // map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.on("load", () => {
      setMap(map);
      map.resize();
      var nodeURL = `http://${window.location.hostname}:5000`
      axios
      .get(nodeURL)
      .then(res => {
        const url = 'http://' + res.data.data + ':5000/total_num_tweet/'
        axios
        .get(url)
        .then(res => {
        const data = res.data
  
        ExampleData.features.forEach(location => {
          if(data[location.properties.name]){
            let total = data[location.properties.name].total_tweet
            let pos = data[location.properties.name].pos_tweet
            location.properties.total_tweet = total
            location.properties.pos_tweet = pos
          }
        })
      })
        .then(() => {
  
          map.addSource("positive_tweet", {
            type: "geojson",
            data: ExampleData
          })
          // add a circle layer to the map
          map.addLayer({
            id: "positive_tweet",
            type: "circle",
            source: "positive_tweet",
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
              "circle-radius":['+', -25, ['number', ['get', 'pos_tweet'], -5]],
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
            <div style="text-align: center;"><p style="font-size: 18px; margin-bottom: 0;">${ele.name}</p></div>
            <div><strong>support raio </strong>: ${100 * (ele.pos_tweet / ele.total_tweet).toPrecision(2)}%</div>
            <div><strong># of tweets </strong>: ${ele.total_tweet}</div>
            `
          }
  
          map.on('mousemove', 'positive_tweet', (e) => {
            map.getCanvas().style.cursor = 'pointer'
  
            popup.setLngLat(e.features[0].geometry.coordinates)
            .setHTML(constructHTML(e.features[0].properties))
            .addTo(map);
            
          })
  
          map.on('mouseleave', 'positive_tweet', (e) => {
            map.getCanvas().style.cursor = ''
          })
        })
      })
    })
  }

  if (!map) initializeMap({ setMap, mapContainer });


}, [map])

return( 
    <div>
    <h3 className='scenario-title'>How many Australians support COVID-19 vaccine? </h3>
    <div ref={mapContainer} className='pos-map'onClick={onClick}/>
    </div>
)
}


export default PositveMap;
