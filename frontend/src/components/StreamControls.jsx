import React, { useState } from "react";
import { startRTSPStream, startYouTubeStream } from "../api";

const StreamControls = ({ onStreamStart }) => {
    const [rtspUrl, setRtspUrl] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");

    const handleRTSPStart = async () => {
        if (!rtspUrl) return alert("Enter RTSP URL.");
        try {
            await startRTSPStream(rtspUrl);
            alert("RTSP Stream started.");
            onStreamStart("rtsp");  // Set source to "rtsp"
        } catch (error) {
            alert("Error starting RTSP stream.");
        }
    };

    const handleYouTubeStart = async () => {
        if (!youtubeUrl) return alert("Enter YouTube URL.");
        try {
            await startYouTubeStream(youtubeUrl);
            alert("YouTube Stream started.");
            onStreamStart("youtube");  // Set source to "youtube"
        } catch (error) {
            alert("Error starting YouTube stream.");
        }
    };

    return (
        <div>
            <h2>Start Live Stream</h2>
            <input type="text" placeholder="RTSP URL" value={rtspUrl} onChange={(e) => setRtspUrl(e.target.value)} />
            <button onClick={handleRTSPStart}>Start RTSP</button>
            <br />
            <input type="text" placeholder="YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
            <button onClick={handleYouTubeStart}>Start YouTube</button>
        </div>
    );
};

export default StreamControls;
