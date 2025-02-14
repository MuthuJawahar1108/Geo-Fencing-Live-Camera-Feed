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