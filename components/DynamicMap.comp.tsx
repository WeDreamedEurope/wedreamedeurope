import * as ReactLeaflet from "react-leaflet";
import Leaflet from "leaflet";
import { useEffect } from "react";
import 'leaflet/dist/leaflet.css';

const { MapContainer } = ReactLeaflet;

export default function DynamicMap() {
  useEffect(() => {
   ( async () => {
      // @ts-ignore
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png")
          .default,
        iconUrl: require("leaflet/dist/images/marker-icon.png").default,
        shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
      });
    })();
    // const map = Leaflet.map('map').setView([51.505, -0.09], 13);
    // Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '© OpenStreetMap contributors'
    // }).addTo(map);
  }, []);
}
