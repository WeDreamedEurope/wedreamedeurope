import mapboxgl, { GeoJSONSource, LngLatBounds  } from "mapbox-gl";
import { Feature, Polygon } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
const TOKEN =
  "pk.eyJ1IjoicmVkaG9vZCIsImEiOiJjbTZ3ZHlqeGkwbHRkMmlzODVlcGl5N2RxIn0.ogMd_1w-fwWi24Jz2JktIQ";
type coord = [number, number];
type MapProps = {
  onNewCoordinates: (coords: [number, number]) => void;
  defaultLocation: [number, number] | null;
  isInteractive: boolean;
};

const AT_PARLIAMENT: coord = [44.79855398381976, 41.69672049439785];

const createGeoJSONCircle = (
  center: [number, number],
  radiusInKm: number,
  points = 64
): Feature<Polygon> => {
  const coords = {
    latitude: center[1],
    longitude: center[0],
  };

  const km = radiusInKm;
  const ret: [number, number][] = [];
  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  let theta, x, y;
  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);
    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [ret],
    },
    properties: {},
  };
};

const calculateCircleBounds = (center: [number, number], radiusInKm: number): LngLatBounds => {
  const km = radiusInKm;
  const lat = center[1];
  const lng = center[0];
  
  // Calculate the rough bounds (approximate)
  const latChange = (km / 111.32); // 1 degree of latitude is approximately 111.32 km
  const lngChange = (km / (111.32 * Math.cos(lat * Math.PI / 180))); // Adjust for latitude

  return new mapboxgl.LngLatBounds(
    [lng - lngChange, lat - latChange], // Southwest
    [lng + lngChange, lat + latChange]  // Northeast
  );
};





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

    mapRef.current.on("load", () => {
      mapRef.current?.addSource("circle-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      mapRef.current?.addLayer({
        id: "circle-layer",
        type: "fill",
        source: "circle-source",
        paint: {
          "fill-color": "red",
          "fill-opacity": 0.1,
          "fill-outline-color": "green",
        },
      });

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

    mapRef.current.on("click", "places", () => {
      alert("Some Clicking And Shit");
    });

    mapRef.current.on("click", (e) => {
      // mapMarker.current!.setLngLat([e.lngLat.lng, e.lngLat.lat]);
      // onNewCoordinates([e.lngLat.lng, e.lngLat.lat]);
      const coordinates = [e.lngLat.lng, e.lngLat.lat] as [number, number];
      const circleFeatures = createGeoJSONCircle(coordinates, 0.02);
      const source = mapRef.current?.getSource(
        "circle-source"
      ) as GeoJSONSource;
      if (source) {



        source.setData({
          type: "FeatureCollection",
          features: [circleFeatures],
        });

        const bounds = calculateCircleBounds(coordinates, 0.02);
        mapRef.current!.fitBounds(bounds, {
          padding: 50,
          maxZoom:25,
          duration:1000
        });
      } else {
        console.log(`There Is No Source!`);
      }
    });

    return () => mapRef.current!.remove();
  }, []);

  const getInitialCoordinates = (): [number, number] => {
    return defaultLocation ? defaultLocation : AT_PARLIAMENT;
  };

  return (
    <div className="w-full h-full  flex items-center justify-center ">
      <div
        ref={mapContainerRef}
        className="w-full h-full border"
      ></div>
    </div>
  );
}
