import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { terminals, FLORIPA_CENTER } from "@/lib/mock-data";
// Fix default icon URLs (Leaflet + bundlers)
const terminalIcon = L.divIcon({
    className: "",
    html: `<div style="position:relative;width:34px;height:34px;display:grid;place-items:center;">
    <div style="position:absolute;inset:0;background:oklch(0.55 0.16 230);border-radius:9999px;opacity:.25;"></div>
    <div style="width:22px;height:22px;border-radius:9999px;background:linear-gradient(135deg,oklch(0.32 0.13 245),oklch(0.78 0.13 175));border:3px solid white;box-shadow:0 4px 10px rgba(0,0,0,.25);"></div>
  </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
});
const pinIcon = (color) => L.divIcon({
    className: "",
    html: `<div style="width:30px;height:38px;position:relative;">
      <div style="width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:3px solid white;box-shadow:0 6px 14px rgba(0,0,0,.3);"></div>
    </div>`,
    iconSize: [30, 38],
    iconAnchor: [15, 36],
});
function Recenter({ path }) {
    const map = useMap();
    useEffect(() => {
        if (path && path.length > 1) {
            map.fitBounds(L.latLngBounds(path), { padding: [50, 50] });
        }
    }, [path, map]);
    return null;
}
function ClickCapture({ onClick }) {
    const map = useMap();
    const ref = useRef(onClick);
    ref.current = onClick;
    useEffect(() => {
        const fn = (e) => ref.current?.([e.latlng.lat, e.latlng.lng]);
        map.on("click", fn);
        return () => { map.off("click", fn); };
    }, [map]);
    return null;
}
export default function FloripaMap({ path, origin, destination, showTerminals = true, height = "100%", interactive = true, onMapClick, }) {
    return (<MapContainer center={FLORIPA_CENTER} zoom={12} style={{ height, width: "100%" }} scrollWheelZoom={interactive} zoomControl={interactive} dragging={interactive}>
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"/>
      {showTerminals && terminals.map((t) => (<Marker key={t.id} position={t.coords} icon={terminalIcon}>
          <Popup>
            <strong>{t.name}</strong><br />
            {t.area}<br />
            <span style={{ opacity: 0.7 }}>{t.schedule}</span>
          </Popup>
        </Marker>))}
      {origin && <Marker position={origin} icon={pinIcon("oklch(0.78 0.13 175)")}/>}
      {destination && <Marker position={destination} icon={pinIcon("oklch(0.55 0.16 230)")}/>}
      {path && path.length > 1 && (<Polyline positions={path} pathOptions={{ color: "oklch(0.42 0.15 240)", weight: 5, opacity: 0.85, dashArray: "10 8" }}/>)}
      {path && <Recenter path={path}/>}
      {onMapClick && <ClickCapture onClick={onMapClick}/>}
    </MapContainer>);
}
