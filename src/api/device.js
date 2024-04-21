const API_HOST = "http://localhost:8081";

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
