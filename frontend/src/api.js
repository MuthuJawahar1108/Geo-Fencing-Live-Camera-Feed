import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";


export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${API_BASE_URL}/upload`, formData);
};

export const startRTSPStream = async (rtspUrl) => {
    return axios.post(`${API_BASE_URL}/start_rtsp`, new URLSearchParams({ rtsp_url: rtspUrl }));
};


export const startYouTubeStream = async (youtubeUrl) => {
    return axios.post(`${API_BASE_URL}/start_youtube`, new URLSearchParams({ youtube_url: youtubeUrl }));
};


export const setGeoFenceAPI = async (geoFence) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/set_geofence`, { geo_fence: geoFence }); 
        console.log("Geo-Fence Set:", response.data);
    } catch (error) {
        console.error("Error setting geo-fence:", error);
    }
};
export const resetGeoFenceAPI = async () => {
    const response = await fetch(`${API_BASE_URL}/reset_geofence`, {
        method: "POST",
    });
    return response.json();
};
