



//------------------------------------
import { useState, useRef } from "react";
import PolygonSelector from "./PolygonSelector";
import { setGeoFenceAPI } from "../api";

const VideoStream = ({ source }) => {
    const [geoFence, setGeoFence] = useState([]);
    const [geoFenceSet, setGeoFenceSet] = useState(false);
    const videoContainerRef = useRef(null);

    const handlePolygonComplete = (points) => {
        setGeoFence(points);
    };

    const handleSetGeoFence = async () => {
        if (geoFence.length < 3) {
            alert("Please select at least 3 points to create a valid geo-fence.");
            return;
        }


        // Ensure the polygon is closed
        const closedGeoFence = [...geoFence];
        if (
            closedGeoFence[0].x !== closedGeoFence[closedGeoFence.length - 1].x ||
            closedGeoFence[0].y !== closedGeoFence[closedGeoFence.length - 1].y
        ) {
            closedGeoFence.push(closedGeoFence[0]);
        }


        try {
            await setGeoFenceAPI(geoFence);
            setGeoFenceSet(true);
        } catch (error) {
            console.error("Error setting geo-fence:", error);
        }
    };

    const handleReset = () => {
        setGeoFence([]);
        setGeoFenceSet(false); // Allow new selection
    };

    return (
        <div>
            <h2>Live Video Stream</h2>

            <div ref={videoContainerRef} style={{ position: "relative", display: "inline-block" }}>
                <img 
                    src={`http://127.0.0.1:8000/video_feed/${source}`} 
                    alt="Video Stream" 
                    // width="640" 
                    // height="480" 
                />

                <div 
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                >
                    <PolygonSelector 
                        onPolygonComplete={handlePolygonComplete} 
                        containerRef={videoContainerRef} 
                        geoFenceSet={geoFenceSet} 
                    />
                </div>
            </div>

            <div style={{ marginTop: "10px" }}>
                <button onClick={handleSetGeoFence} style={{ marginRight: "10px" }}>
                    Set Geo-Fence
                </button>
                <button onClick={handleReset}>Reset</button>
            </div>
        </div>
    );
};

export default VideoStream;
