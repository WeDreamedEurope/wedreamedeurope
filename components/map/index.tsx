import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
const TOKEN =
  "pk.eyJ1IjoicmVkaG9vZCIsImEiOiJjbTZ3ZHlqeGkwbHRkMmlzODVlcGl5N2RxIn0.ogMd_1w-fwWi24Jz2JktIQ";
type coord = [number, number];
type MapProps = {
  onNewCoordinates: (coords: [number, number]) => void;
  defaultLocation: [number, number] | null;
  isInteractive: boolean;
};

const AT_PARLIAMENT: coord = [44.79855398381976, 41.69672049439785];

export default function MapComponent({
  defaultLocation,
  onNewCoordinates,
  isInteractive,
}: MapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapMarker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = TOKEN;
    const initialLocation = getInitialCoordinates();
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialLocation,
      zoom: 15,
      interactive: isInteractive,
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
      .setLngLat(initialLocation)
      .addTo(mapRef.current);

    mapRef.current.on("click", "places", (e) => {
      alert("Some Clicking And Shit");
    });

    mapRef.current.on("click", (e) => {
      mapMarker.current!.setLngLat([e.lngLat.lng, e.lngLat.lat]);
      onNewCoordinates([e.lngLat.lng, e.lngLat.lat]);
    });

    return () => mapRef.current!.remove();
  }, []);

  const getInitialCoordinates = (): [number, number] => {
    return defaultLocation ? defaultLocation : AT_PARLIAMENT;
  };

  return (
    <div className="w-full aspect-video  flex items-center justify-center ">
      <div
        ref={mapContainerRef}
        className="w-[800px] aspect-video border"
      ></div>
    </div>
  );
 
}
