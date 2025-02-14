import React, { useState } from "react";
import PolygonSelector from "./PolygonSelector";
import axios from "axios";

const VideoStream = ({ source }) => {
    return (
        <div>
            <h2>Live Video Stream</h2>
            <img src={`http://127.0.0.1:8000/video_feed/${source}`} alt="Video Stream" width="640" height="480" />
        </div>
    );
};

export default VideoStream;
