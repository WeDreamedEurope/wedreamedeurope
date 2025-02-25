import { Feature, FeatureCollection, Polygon } from "geojson";
import mapboxgl, { GeoJSONSource, LngLatBounds } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
const TOKEN =
  "pk.eyJ1IjoicmVkaG9vZCIsImEiOiJjbTZ3ZHlqeGkwbHRkMmlzODVlcGl5N2RxIn0.ogMd_1w-fwWi24Jz2JktIQ";
type coord = [number, number];
interface MapComponentProps {
  defaultLocation: [number, number] | null;
  isInteractive: boolean;
  onNewCoordinates: (coordinates: [number, number]) => void;
  points?: [number, number][];
  selectedPointID?: number | null;
}

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

const calculateCircleBounds = (
  center: [number, number],
  radiusInKm: number
): LngLatBounds => {
  const km = radiusInKm;
  const lat = center[1];
  const lng = center[0];

  // Calculate the rough bounds (approximate)
  const latChange = km / 111.32; // 1 degree of latitude is approximately 111.32 km
  const lngChange = km / (111.32 * Math.cos((lat * Math.PI) / 180)); // Adjust for latitude

  return new mapboxgl.LngLatBounds(
    [lng - lngChange, lat - latChange], // Southwest
    [lng + lngChange, lat + latChange] // Northeast
  );
};

const createGeoJSONPoints = (coordinates: [number, number][]) => {
  return {
    type: "FeatureCollection",
    features: coordinates.map((coord, index) => ({
      type: "Feature",
      properties: {
        id: index,
      },
      geometry: {
        type: "Point",
        coordinates: coord,
      },
    })),
  } as FeatureCollection;
};

export default function MapComponent({
  defaultLocation,
  isInteractive,
  onNewCoordinates,
  points = [],
  selectedPointID,
}: MapComponentProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapMarker = useRef<mapboxgl.Marker | null>(null);
  const readyToAcceptNewCoordinates = useRef(false);
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
      const circleFeatures = createGeoJSONCircle(initialLocation, 0.02);
      mapRef.current?.addSource("circle-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [circleFeatures],
        },
      });
      mapRef.current?.addLayer({
        id: "circle-layer",
        type: "fill",
        source: "circle-source",
        paint: {
          "fill-color": "blue",
          "fill-opacity": 0.1,
          "fill-outline-color": "green",
        },
      });

      // Add source and layer for points
      mapRef.current!.addSource("points-source", {
        type: "geojson",
        data: createGeoJSONPoints(points),
      });

      mapRef.current!.addLayer({
        id: "points-layer",
        type: "circle",
        source: "points-source",
        paint: {
          "circle-radius": 4,
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#00FF00",
            "#FF0000",
          ],
          "circle-opacity": 0.8,
        },
      });
    });

    mapMarker.current = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat(initialLocation)
      .addTo(mapRef.current);

    mapRef.current.on("click", (e) => {
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
          maxZoom: 15,
          duration: 1000,
        });
      } else {
        console.log(`There Is No Source!`);
      }
    });

    return () => mapRef.current!.remove();
  }, []);

  useEffect(() => {
    if (mapRef.current && points.length > 0) {
      console.log("Updating points:", points);
      if (mapRef.current && points.length > 0) {
        console.log(`We Should Display Points!`);
        const source = mapRef.current.getSource(
          "points-source"
        ) as GeoJSONSource;
        console.log("Source:", source);
        if (source) {
          console.log("%cSetting new data for points-source", "color:green");
          source.setData(createGeoJSONPoints(points));
        } else {
          console.log("%cpoints-source not found", "color:red");
        }
      }
    }
  }, [points]);

  useEffect(() => {
    if (!mapRef || !mapRef.current || !selectedPointID) return;

    console.log(`We Are Ready To Update Point!`);
    mapRef.current.setFeatureState(
      {
        source: "points-source",
        id: selectedPointID,
      },
      { selected: true }
    );
  }, [selectedPointID]);

  const getInitialCoordinates = (): [number, number] => {
    return defaultLocation ? defaultLocation : AT_PARLIAMENT;
  };

  return (
    <div className="w-full h-full  flex items-center justify-center ">
      <div ref={mapContainerRef} className="w-full h-full border"></div>
    </div>
  );
}
