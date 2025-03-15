import { useMapContext } from "@/context/MapContenxt";
import { Feature, FeatureCollection, Polygon } from "geojson";
import mapboxgl, { GeoJSONSource, LngLatBounds } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
type coord = [number, number];
interface MapComponentProps {
  defaultLocation: [number, number] | null;
  isInteractive: boolean;
  onNewCoordinates: (coordinates: [number, number]) => void;
  points?: [number, number][];
  selectedPointID: string | null;
}
const AT_PARLIAMENT: coord = [44.799186155911414, 41.69702822055032];
export default function MapComponent({
  defaultLocation,
  isInteractive,
  onNewCoordinates,
}: MapComponentProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapMarker = useRef<mapboxgl.Marker | null>(null);
  const previousSelectedPointRef = useRef<string | null>(null);
  const {
    pointsToDisplay,
    setSelectedLocation,
    selectedPointId,
    setHoveredPointId,
  } = useMapContext();
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY!;
    const initialLocation = getInitialCoordinates();
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: initialLocation,
      zoom: 15,
      interactive: isInteractive,
      doubleClickZoom: false,
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
        data: createGeoJSONPoints(pointsToDisplay),
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
            "purple",
            "#FF0000",
          ],
          "circle-opacity": 0.8,
        },
      });
    });

    mapMarker.current = new mapboxgl.Marker({
      draggable: false,
    })
      .setLngLat(initialLocation)
      .addTo(mapRef.current);

    // mapRef.current.on("mousedown", (e) => {
    //   console.log(`REMOVE IN PRODUCTION`);
    //   setSelectedLocation([44.7932, 41.70129]);
    // });
    mapRef.current.on("dblclick", (e) => {
      console.log(`Click Fucking Clack`);
      // console.log(`Double Clicked!`);
      // mapRef.current?.doubleClickZoom.disable();
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
          padding: 25,
          maxZoom: 20,
          duration: 1000,
        });
        mapRef.current?.once("moveend", () => {
          onNewCoordinates(coordinates);
          setSelectedLocation(coordinates);
          // mapRef.current?.doubleClickZoom.enable();
        });
      } else {
        console.log(`There Is No Source!`);
      }
    });

    mapRef.current.on("click", "points-layer", (e) => {
      e.originalEvent.stopPropagation();
      e.preventDefault();
      if (e.features && e.features.length > 0) {
        const feature = e.features[0];
        const pointID = feature.id?.toString();
        console.log(`Point ID: ${pointID}`);
      }
    });

    mapRef.current.on("mouseenter", "points-layer", (e) => {
      if (mapRef.current) {
        e.originalEvent.stopPropagation();
        mapRef.current.getCanvas().style.cursor = "pointer";
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const pointID = feature.id?.toString();
          if (pointID) setHoveredPointId(pointID);
          console.log(`Hovering over point ID: ${pointID}`);
        }
      }
    });

    mapRef.current.on("mouseleave", "points-layer", () => {
      if (mapRef.current) {
        mapRef.current.getCanvas().style.cursor = "";
      }
    });

    return () => mapRef.current!.remove();
  }, []);

  useEffect(() => {
    if (mapRef.current && pointsToDisplay.length > 0) {
      const source = mapRef.current.getSource("points-source") as GeoJSONSource;
      if (source) {
        source.setData(createGeoJSONPoints(pointsToDisplay));
      } else {
        console.log("%cpoints-source not found", "color:red");
      }
    }
  }, [pointsToDisplay]);

  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    // First, clear the previous selection
    if (previousSelectedPointRef.current) {
      mapRef.current.setFeatureState(
        { source: "points-source", id: previousSelectedPointRef.current },
        { selected: false }
      );
    }

    // Then set the new selection
    if (selectedPointId) {
      const source = mapRef.current.getSource("points-source") as GeoJSONSource;
      const searialized = source.serialize().data as FeatureCollection;
      const foundOne = searialized.features.find(
        (f) => f.id === selectedPointId
      ) as Feature;

      if (foundOne) {
        mapRef.current.flyTo({
          // @ts-expect-error
          center: foundOne.geometry.coordinates,
        });
      }

      mapRef.current.setFeatureState(
        { source: "points-source", id: selectedPointId },
        { selected: true }
      );
      // Update the ref with current selection
      previousSelectedPointRef.current = selectedPointId;
    }
  }, [selectedPointId]);
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
    const distanceX =
      km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
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

  const createGeoJSONPoints = (points: [number, number][]) => {
    return {
      type: "FeatureCollection",
      features: points.map((point, index) => ({
        type: "Feature",
        id: index.toString(), // Add ID at the feature level for feature-state
        properties: {
          pointId: index.toString(), // Keep ID in properties for data access
        },
        geometry: {
          type: "Point",
          coordinates: point,
        },
      })),
    } as FeatureCollection;
  };
  const getInitialCoordinates = (): [number, number] => {
    return defaultLocation ? defaultLocation : AT_PARLIAMENT;
  };

  return (
    <div className="w-full h-full  flex items-center justify-center ">
      <div ref={mapContainerRef} className="w-full h-full "></div>
    </div>
  );
}
