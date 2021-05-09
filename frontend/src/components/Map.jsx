import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"
import "../App.css"

import '../css/styles.css'


// adding GeoJSON read from a file
import ExampleData from "../data/example_data.json";

const Map = ({ onClick }) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);


  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamVhbnN4dCIsImEiOiJja2Y3anRnZzEwMzJpMnpsa29ldDExbnZ5In0.9VVP31HO-qw7t14WaWOZ6g';
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/jeansxt/cko9nl9d81nsw17mpgbwn11ph", // stylesheet location
        center: [135.2, -29.6],
        zoom: 4
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');


      map.on("load", () => {
        setMap(map);
        map.resize();

        map.addSource("city_tweet", {
          type: "geojson",
          data: ExampleData
        });

        map.addSource("avalanche-paths", {
        type: "vector",
        url: "mapbox://lcdesigns.arckuvnm",
        })

        map.addLayer({
        id: "avalanche-paths-fill",
        type: "fill",
        source: "avalanche-paths",
        "source-layer": "Utah_Avalanche_Paths-9s9ups",
        paint: {
          "fill-opacity": 0.5,
          "fill-color": "#f05c5c",
        },
        })

        // add a circle layer to the map
        map.addLayer({
          id: "city_tweet-circle",
          type: "circle",
          source: "city_tweet",
          paint: {
            "circle-color": "#FF5733",
            "circle-radius": 1000,
            "circle-stroke-color": "#FF5733",
            "circle-stroke-width": 2,
          },
        })
      });


    };
    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);
  

  return <div ref={el => (mapContainer.current = el)} className='map' onClick={onClick}/>;
};


export default Map;
