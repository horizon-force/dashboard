const API_HOST = import.meta.env.MODE === 'production' ? "https://device-status-server-b73fe300040d.herokuapp.com" : "http://localhost:8081";
console.log("Meta ENV MODE", import.meta.env.MODE);
console.log("Using API_HOST", API_HOST);

/**
 * Get all devices
 * @returns {Promise<Response>}
 */
export async function getAllDevices() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    return fetch(`${API_HOST}/api/v0/device`, requestOptions);
}

export async function getDevice(id) {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    return fetch(`${API_HOST}/api/v0/device/${id}`, requestOptions);
}
