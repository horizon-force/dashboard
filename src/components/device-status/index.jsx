import { useState, useEffect } from 'react'
import { getAllDevices } from "../../api/device.js";

function DeviceStatus() {
    const [devices, setDevices] = useState(undefined);
    const [message, setMessage] = useState(undefined);

    useEffect(() => {
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
        <div>
            {
                (message && message !== "success") && (
                    <p>{message}</p>
                )
            }
            {
                devices ? (
                    <div>
                        {
                            JSON.stringify(devices)
                        }
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
