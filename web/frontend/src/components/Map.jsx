import React, { useEffect, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import mapboxgl from "mapbox-gl";

import '../css/styles.css'



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
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);
  

  return <div ref={el => (mapContainer.current = el)} className='map' onClick={onClick}/>;
};

export default Map;
