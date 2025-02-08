import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapMarker = useRef<mapboxgl.Marker | null>(null);
  const [defaultCenter, setDefaultCenter] = useState<[number, number]>([
    -74.0007, 40.7336,
  ]);
  useEffect(() => {
    if (!mapContainerRef.current) return;
    console.log(`Ready To Load Map!`);
    mapboxgl.accessToken =
      "pk.eyJ1IjoicmVkaG9vZCIsImEiOiJjbTZ3ZHlqeGkwbHRkMmlzODVlcGl5N2RxIn0.ogMd_1w-fwWi24Jz2JktIQ";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: defaultCenter,
      zoom: 15,
    });

    mapRef.current.on("load", (e) => {
      mapRef.current!.addSource("places", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { icon: "stadium", name: "Greenwich Village" },
              geometry: {
                type: "Point",
                coordinates: [-74.0007, 40.7336],
              },
            },
            {
              type: "Feature",
              properties: { icon: "stadium", name: "Washington Square Park" },
              geometry: {
                type: "Point",
                coordinates: [-73.9973, 40.7309],
              },
            },
            {
              type: "Feature",
              properties: { icon: "stadium", name: "The Stonewall Inn" },
              geometry: {
                type: "Point",
                coordinates: [-74.0017, 40.7331],
              },
            },
            {
              type: "Feature",
              properties: { icon: "theatre", name: "Comedy Cellar" },
              geometry: {
                type: "Point",
                coordinates: [-73.9992, 40.7305],
              },
            },
            {
              type: "Feature",
              properties: { name: "Jefferson Market Library" },
              geometry: {
                type: "Point",
                coordinates: [-74.0005, 40.7344],
              },
            },
            {
              type: "Feature",
              properties: { name: "Cafe Wha?" },
              geometry: {
                type: "Point",
                coordinates: [-74.0009, 40.7301],
              },
            },
            {
              type: "Feature",
              properties: { name: "Blue Note Jazz Club" },
              geometry: {
                type: "Point",
                coordinates: [-74.0, 40.7302],
              },
            },
            {
              type: "Feature",
              properties: { name: "The Spotted Pig (former location)" },
              geometry: {
                type: "Point",
                coordinates: [-74.0061, 40.7357],
              },
            },
            {
              type: "Feature",
              properties: {
                name: "New York Studio School of Drawing, Painting and Sculpture",
              },
              geometry: {
                type: "Point",
                coordinates: [-73.9985, 40.7313],
              },
            },
            {
              type: "Feature",
              properties: { name: "Minetta Tavern" },
              geometry: {
                type: "Point",
                coordinates: [-73.9994, 40.7298],
              },
            },
            {
              type: "Feature",
              properties: { name: "White Horse Tavern" },
              geometry: {
                type: "Point",
                coordinates: [-74.0062, 40.7351],
              },
            },
          ],
        },
      });

      
      mapRef.current!.addLayer({
        id: "places",
        type: "symbol",
        source: "places",
        layout: {
          "icon-image": ["get", "icon"],
          "icon-allow-overlap": true,
        },
      });
    });

    mapMarker.current = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat(defaultCenter)
      .addTo(mapRef.current);

    mapRef.current.on("click", "places", (e) => {
      alert("Some Clicking And Shit");

      //   mapMarker.current?.setLngLat([e.lngLat.lng, e.lngLat.lat]);
    });

    return () => mapRef.current!.remove();
  }, []);

  return (
    <div className="w-full h-full bg-yellow-600 flex items-center justify-center ">
      <div
        ref={mapContainerRef}
        className="w-[800px] aspect-video border"
      ></div>
    </div>
  );
  //   return <div

  //   style={{
  //     width:"800ox",
  //     height:"500px"
  //   }}
  //   ref={mapContainerRef} id="map"></div>;
}
