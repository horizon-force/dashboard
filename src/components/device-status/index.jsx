import React from 'react'
import { getAllDevices } from "../../api/device.js";
import MarkerClusterGroup from 'react-leaflet-cluster'
import {MapContainer, Marker, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const FIRE_DETECTED_FILTER = "fire_detected";
const initialFilters = {};
initialFilters[FIRE_DETECTED_FILTER] = {
    enabled: false,
    filterFunc: (device) => {
        return device?.status_code === "Fire";
    }
};

function DeviceStatus() {
    const [devices, setDevices] = React.useState(undefined);
    const [message, setMessage] = React.useState(undefined);
    const [filters, setFilters] = React.useState(initialFilters);

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

    const filterHandler = (evt) => {
        let checked = evt.target.checked;
        let name = evt.target.name;
        filters[name]['enabled'] = checked;
        const filtersCopy = {...filters};
        setFilters(filtersCopy);
    }

    return (
        <div style={{display: "flex", flex: 1}}>
            {
                (message && message !== "success") && (
                    <p>{message}</p>
                )
            }
            {
                <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                    {
                        devices && (
                            <div>
                                <h2>Filters</h2>
                                <label><input type="checkbox" name={FIRE_DETECTED_FILTER} value="value" onClick={filterHandler}/>Fire Detected</label>
                            </div>
                        )
                    }
                    {
                        !devices && (
                            <div
                                style={{
                                    position: 'absolute',
                                    width: "100%",
                                    height: "100%",
                                    top: 0,
                                    left: 0,
                                    zIndex: 10000,
                                    background: 'rgba(0.0, 0.0, 0.0, 0.5)',
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <h3>Loading</h3>
                            </div>
                        )
                    }
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
                            {
                                devices && Object.entries(devices).map((entry) => {
                                    const device = entry[1];
                                    for (const entry of Object.entries(filters)) {
                                        const filter = entry[1];
                                        if (filter.enabled && !filter.filterFunc(device)) {
                                            return;
                                        }
                                    }
                                    return (
                                        <Marker
                                            key={device.id}
                                            position={[device.lat, device.lng]}
                                            title={device.name}
                                        ></Marker>
                                    );
                                })
                            }

                        </MarkerClusterGroup>
                    </MapContainer>
                </div>
            }

        </div>
    );
}

export default DeviceStatus;
