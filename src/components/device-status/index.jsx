import React from 'react'
import { getAllDevices } from "../../api/device.js";
import MarkerClusterGroup from 'react-leaflet-cluster'
import {MapContainer, Marker, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const initialFilters = {};
const FIRE_DETECTED_FILTER = "fire_detected";
initialFilters[FIRE_DETECTED_FILTER] = {
    enabled: false,
    filterFunc: (device) => {
        return device?.status_code === "Fire";
    }
};
const NOT_DISABLED_FILTER = "NOT_DISABLED";
initialFilters[NOT_DISABLED_FILTER] = {
    enabled: true,
    filterFunc: (device) => {
        return device?.disabled === false;
    }
};

function DeviceStatus() {
    const [devices, setDevices] = React.useState(undefined);
    const [message, setMessage] = React.useState(undefined);
    const [filters, setFilters] = React.useState(initialFilters);

    const refreshData = () => {
        getAllDevices()
            .catch(err => {
                console.error(err);
                setMessage(err.toString());
                setDevices({});
            })
            .then((response) => {
                response.json().then((data) => {
                    console.info("Fetched all devices", data);
                    let devices = [];
                    if (data?.devices) {
                        for (const entry of Object.entries(data.devices)) {
                            const device = entry[1];
                            let passFilters = true;
                            for (const entry of Object.entries(filters)) {
                                const filter = entry[1];
                                if (filter.enabled && !filter.filterFunc(device)) {
                                    passFilters = false;
                                }
                            }
                            if (passFilters) {
                                devices.push(device);
                            }
                        }
                    }
                    setDevices(devices);
                    setMessage(data?.message);
                }).catch((err) => {
                    console.error(err);
                    setMessage(err.toString());
                    setDevices({});
                });
            });
    }

    const filterHandler = (evt) => {
        let checked = evt.target.checked;
        let name = evt.target.name;
        filters[name]['enabled'] = checked;
        const filtersCopy = {...filters};
        setFilters(filtersCopy);
        setDevices(undefined);
        refreshData();
    }

    React.useEffect(() => {
        refreshData();
    }, []);

    return (
        <div style={{display: "flex", flex: 1}}>
            {
                (message && message !== "success") && (
                    <p>{message}</p>
                )
            }
            {
                <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                    <div>
                        <h2>Filters</h2>
                        <label><input type="checkbox" name={FIRE_DETECTED_FILTER} value="value" onClick={filterHandler}
                                      checked={filters[FIRE_DETECTED_FILTER].enabled}/>Fire Detected</label>
                    </div>
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
