import React, { useState } from "react";
import VideoStream from "./components/VideoStream";
import UploadForm from "./components/UploadForm";
import StreamControls from "./components/StreamControls";

const App = () => {
    const [streamSource, setStreamSource] = useState("webcam");

    return (
        <div>
            <h1>AI-Powered Video Processing</h1>
            <VideoStream source={streamSource} />
            <UploadForm onUploadSuccess={setStreamSource} />
            <StreamControls onStreamStart={setStreamSource} />
            <button onClick={() => setStreamSource("webcam")}>Switch to Webcam</button>
        </div>
    );
};

export default App;
