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
    const url = 'http://127.0.0.1:5000/political_party_per_area/the_greens'
    // let radius = 10
    mapboxgl.accessToken = 'pk.eyJ1IjoiamVhbnN4dCIsImEiOiJja2Y3anRnZzEwMzJpMnpsa29ldDExbnZ5In0.9VVP31HO-qw7t14WaWOZ6g';
    const initializeMap = ({ setMap, mapContainer }) => {
    // const map = new mapboxgl.Map({
    //   container: mapContainer.current,
    //   style: "mapbox://styles/jeansxt/cko9nl9d81nsw17mpgbwn11ph", // stylesheet location
    //   center: [150, -32],
    //   zoom: 1
    // });
    // // map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    var map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-103.59179687498357, 40.66995747013945],
      zoom: 3
      });
 
    map.on("load",function () {
      // setMap(map);
      // map.resize();

      // axios
      // .get(url)
      // .then(res => {
      // const data = res.data

      map.addSource('earthquakes', {
      type: 'geojson',
      // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
      // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
      data: earthquake_data,
      //https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });
       
      map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'earthquakes',
      filter: ['has', 'point_count'],
      paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      // with three steps to implement three types of circles:
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      'circle-color': [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      100,
      '#f1f075',
      750,
      '#f28cb1'
      ],
      'circle-radius': [
      'step',
      ['get', 'point_count'],
      20,
      100,
      30,
      750,
      40
      ]
      }
      });
       
      map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'earthquakes',
      filter: ['has', 'point_count'],
      layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
      }
      });
       
      map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'earthquakes',
      filter: ['!', ['has', 'point_count']],
      paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
      }
      });
       
      // // inspect a cluster on click
      // map.on('click', 'clusters', function (e) {
      // var features = map.queryRenderedFeatures(e.point, {
      // layers: ['clusters']
      // });
      // var clusterId = features[0].properties.cluster_id;
      // map.getSource('earthquakes').getClusterExpansionZoom(
      // clusterId,
      // function (err, zoom) {
      // if (err) return;
       
      // map.easeTo({
      // center: features[0].geometry.coordinates,
      // zoom: zoom
      // });
      // }
      // );
      // });
 




      
        map.on('mouseenter', 'clusters', function () {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'clusters', function () {
          map.getCanvas().style.cursor = '';
        });



      })
    // })
  }

  if (!map) initializeMap({ setMap, mapContainer });

}, [map])

return <div ref={mapContainer} className='map'/>;
}


export default Map;
