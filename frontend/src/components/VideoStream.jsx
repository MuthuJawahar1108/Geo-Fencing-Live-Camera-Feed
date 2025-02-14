// import React, { useState } from "react";
// import PolygonSelector from "./PolygonSelector";
// import axios from "axios";

// const VideoStream = ({ source }) => {
//     return (
//         <div>
//             <h2>Live Video Stream</h2>
//             <img src={`http://127.0.0.1:8000/video_feed/${source}`} alt="Video Stream" width="640" height="480" />
//         </div>
//     );
// };

// export default VideoStream;


// import React, { useState, useRef, useEffect } from "react";
// import PolygonSelector from "./PolygonSelector";
// import axios from "axios";

// const VideoStream = ({ source }) => {
//     const [geoFence, setGeoFence] = useState([]);
//     const videoContainerRef = useRef(null);

//     const handlePolygonComplete = (points) => {
//         setGeoFence(points);

//         // Send polygon to backend
//         axios.post("http://127.0.0.1:8000/set_geofence", { geo_fence: points })
//             .then(response => console.log("Geo-Fence Set:", response.data))
//             .catch(error => console.error("Error setting geo-fence:", error));
//     };

//     return (
//         <div>
//             <h2>Live Video Stream</h2>
//             <div 
//                 ref={videoContainerRef} 
//                 style={{ 
//                     position: "relative", 
//                     display: "inline-block" 
//                 }}
//             >
//                 {/* Video Feed */}
//                 <img 
//                     src={`http://127.0.0.1:8000/video_feed/${source}`} 
//                     alt="Video Stream" 
//                     width="640" 
//                     height="480" 
//                 />

//                 {/* Polygon Selection (Ensures Clicks Stay Inside the Video) */}
//                 <div 
//                     style={{ 
//                         position: "absolute", 
//                         top: 0, left: 0, 
//                         width: "100%", height: "100%", 
//                         pointerEvents: "none" // Allows interaction with video but not overlay
//                     }}
//                 >
//                     <PolygonSelector 
//                         onPolygonComplete={handlePolygonComplete} 
//                         containerRef={videoContainerRef} // Ensures selection is within the video
//                     />
//                 </div>
//             </div>

//             {/* Buttons (Outside the Video) */}
//             <div>
//                 <button onClick={() => setGeoFence([])}>Reset</button>
//             </div>
//         </div>
//     );
// };

// export default VideoStream;


//-----------------------------------------------------




// import React, { useState, useRef } from "react";
// import PolygonSelector from "./PolygonSelector";
// // import axios from "axios";
// import { setGeoFenceAPI } from "../api";


// const VideoStream = ({ source }) => {
//     const [geoFence, setGeoFence] = useState([]);
//     const videoContainerRef = useRef(null);

//     const handlePolygonComplete = (points) => {
//         console.log("Selected Geo-Fence Points:", points);
//         setGeoFence(points);
//     };

//     const handleSetGeoFence = async () => {
//         if (geoFence.length < 3) {
//             alert("Please select at least 3 points to create a valid geo-fence.");
//             return;
//         }

//         // // Send polygon to backend
//         // console.log(geoFence)
//         await setGeoFenceAPI(geoFence);

//         // axios.post("http://127.0.0.1:8000/set_geofence", { geo_fence: geoFence })
//         //     .then(response => console.log("Geo-Fence Set:", response.data))
//         //     .catch(error => console.error("Error setting geo-fence:", error));
//     };

//     const handleReset = () => {
//         setGeoFence([]);
//     };

//     return (
//         <div>
//             <h2>Live Video Stream</h2>

//             <div 
//                 ref={videoContainerRef} 
//                 style={{ position: "relative", display: "inline-block" }}
//             >
//                 {/* Video Feed */}
//                 <img 
//                     src={`http://127.0.0.1:8000/video_feed/${source}`} 
//                     alt="Video Stream" 
//                     width="640" 
//                     height="480" 
//                 />

//                 {/* Polygon Selection (Ensures Clicks Stay Inside the Video) */}
//                 <div 
//                     style={{ 
//                         position: "absolute", 
//                         top: 0, left: 0, 
//                         width: "100%", height: "100%", 
//                         pointerEvents: "none" // Allows interaction with video but not overlay
//                     }}
//                 >
//                     <PolygonSelector 
//                         onPolygonComplete={handlePolygonComplete} 
//                         containerRef={videoContainerRef} // Ensures selection is within the video
//                     />
//                 </div>
//             </div>

//             {/* Buttons for Geo-Fencing */}
//             <div style={{ marginTop: "10px" }}>
//                 <button onClick={handleSetGeoFence} style={{ marginRight: "10px" }}>
//                     Set Geo-Fence
//                 </button>
//                 <button onClick={handleReset}>Reset</button>
//             </div>
//         </div>
//     );
// };

// export default VideoStream;





//----------------------------------

import { useState, useRef } from "react";
import PolygonSelector from "./PolygonSelector";
import { setGeoFenceAPI } from "../api";

const VideoStream = ({ source }) => {
    const [geoFence, setGeoFence] = useState([]);  // Stores user-selected points
    const [geoFenceSet, setGeoFenceSet] = useState(false);  // Tracks if geo-fence is set
    const videoContainerRef = useRef(null);

    // Callback when user completes polygon selection
    const handlePolygonComplete = (points) => {
        console.log("Selected Geo-Fence Points:", points);
        setGeoFence(points);
    };

    // Set Geo-Fence (Send to backend and clear selection)
    const handleSetGeoFence = async () => {
        if (geoFence.length < 3) {
            alert("Please select at least 3 points to create a valid geo-fence.");
            return;
        }

        try {
            await setGeoFenceAPI(geoFence); // Send polygon to backend
            console.log("Geo-Fence Set Successfully");

            setGeoFenceSet(true);  // ✅ Mark geo-fence as set
            setGeoFence([]);  // ✅ Clear selection after setting

        } catch (error) {
            console.error("Error setting geo-fence:", error);
        }
    };

    // Reset Geo-Fence (Allows user to re-select)
    const handleReset = () => {
        setGeoFence([]);  
        setGeoFenceSet(false);  // ✅ Allow new selection
    };

    return (
        <div>
            <h2>Live Video Stream</h2>

            <div 
                ref={videoContainerRef} 
                style={{ position: "relative", display: "inline-block" }}
            >
                {/* Video Feed */}
                <img 
                    src={`http://127.0.0.1:8000/video_feed/${source}`} 
                    alt="Video Stream" 
                    width="640" 
                    height="480" 
                />

                {/* Polygon Selection */}
                <div 
                    style={{ 
                        position: "absolute", 
                        top: 0, left: 0, 
                        width: "100%", height: "100%", 
                        pointerEvents: "none" // Ensures interaction with video
                    }}
                >
                    {!geoFenceSet && (
                        <PolygonSelector 
                            onPolygonComplete={handlePolygonComplete} 
                            containerRef={videoContainerRef} 
                        />
                    )}
                </div>
            </div>

            {/* Buttons */}
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
