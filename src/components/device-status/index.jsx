import React from 'react'
import { getAllDevices } from "../../api/device.js";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import {GOOGLE_MAP_API_KEY} from "../../api/map.js";

function DeviceStatus() {
    const [center, ] = React.useState({
        lat: 38.439700,
        lng: -122.715640
    });
    const [devices, setDevices] = React.useState(undefined);
    const [message, setMessage] = React.useState(undefined);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAP_API_KEY
    })

    // eslint-disable-next-line no-unused-vars
    const [_map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(_) {
        setMap(null)
    }, [])

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
                (devices && isLoaded) ? (
                    <div style={{display: "flex", flex: 1}}>
                        <GoogleMap
                            mapContainerStyle={{
                                width: '100%',
                                height: `800px`
                            }}
                            center={center}
                            zoom={7}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                        >
                            { /* Child components, such as markers, info windows, etc. */ }
                            <></>
                        </GoogleMap>
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
