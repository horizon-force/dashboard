function throwError(message) {
    alert(`Error: ${message}`);
    console.error(message);
    throw new Error(message);
}

// eslint-disable-next-line no-undef
export const GOOGLE_MAP_API_KEY = "AIzaSyDiaQWlgpAEVBkCiwluNme9IfKY4ElgYco" || throwError("REACT_APP_GOOGLE_MAP_API_KEY not defined");
