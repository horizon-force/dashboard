import React from 'react'
import { getAllDevices } from "../../api/device.js";
import MarkerClusterGroup from 'react-leaflet-cluster'
import {MapContainer, Marker, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function DeviceStatus() {
    const [devices, setDevices] = React.useState(undefined);
    const [message, setMessage] = React.useState(undefined);


    React.useEffect(() => {
        getAllDevices()
            .catch(err => {
                console.error(err);
                setMessage(err.toString());
                setDevices({});
            })
            .then((response) => {
                response.json().then((data) => {
                    console.info("Fetched all devices", data);
                    setDevices(data?.devices);
                    setMessage(data?.message);
                }).catch((err) => {
                    console.error(err);
                    setMessage(err.toString());
                    setDevices({});
                });
            })
    }, []);

    return (
        <div style={{display: "flex", flex: 1}}>
            {
                (message && message !== "success") && (
                    <p>{message}</p>
                )
            }
            {
                (devices) ? (
                    <div style={{display: "flex", flex: 1}}>
                        <MapContainer
                            style={{height: '100%', width: '100%'}}
                            center={[38.44, -122.71]}
                            zoom={6}
                            scrollWheelZoom={true}
                            maxZoom={10}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MarkerClusterGroup
                                chunkedLoading
                            >
                                {Object.entries(devices).map((entry) => {
                                    const device = entry[1];
                                    return (
                                        <Marker
                                            key={device.id}
                                            position={[device.lat, device.lng]}
                                            title={device.name}
                                        ></Marker>
                                    );
                                })}
                            </MarkerClusterGroup>
                        </MapContainer>
                    </div>
                ) : (
                    <div>
                        <p>Loading</p>
                    </div>
                )
            }

        </div>
    );
}

export default DeviceStatus;
