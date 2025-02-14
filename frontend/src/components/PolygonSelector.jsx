// import React, { useState } from "react";

// const PolygonSelector = ({ onPolygonComplete, containerRef }) => {
//     const [points, setPoints] = useState([]);

//     const handleClick = (event) => {
//         if (!containerRef.current) return;

//         // Get bounding box of video
//         const rect = containerRef.current.getBoundingClientRect();
//         const x = event.clientX - rect.left;
//         const y = event.clientY - rect.top;

//         // Ensure clicks are inside the video area
//         if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
//             setPoints([...points, { x, y }]);
//             console.log("Clicked! - ",{x,y})
//         }
//     };

//     const handleSetGeoFence = () => {
//         if (points.length > 2) {
//             onPolygonComplete(points); // ✅ Send polygon to parent component
//         } else {
//             alert("Please select at least 3 points to create a polygon.");
//         }
//     };

//     const handleReset = () => {
//         setPoints([]);
//     };

//     return (
//         <div 
//             style={{ 
//                 position: "absolute", 
//                 top: 0, left: 0, 
//                 width: "100%", height: "100%", 
//                 cursor: "crosshair",
//                 pointerEvents: "auto" // Enables clicking
//             }} 
//             onClick={handleClick}
//         >
//             {points.map((point, index) => (
//                 <div 
//                     key={index} 
//                     style={{
//                         position: "absolute", 
//                         width: "8px", height: "8px", 
//                         background: "red", 
//                         borderRadius: "50%",
//                         top: point.y + "px", 
//                         left: point.x + "px", 
//                         transform: "translate(-50%, -50%)"
//                     }} 
//                 />
//             ))}
//         </div>
//     );
// };

// export default PolygonSelector;


import React, { useState } from "react";

const PolygonSelector = ({ onPolygonComplete, containerRef }) => {
    const [points, setPoints] = useState([]);

    const handleClick = (event) => {
        if (!containerRef.current) return;

        // Get bounding box of video
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Ensure clicks are inside the video area
        // if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        //     setPoints([...points, { x, y }]);
        //     console.log("Clicked - ",{x,y})
        // }

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const newPoints = [...points, { x, y }];
            setPoints(newPoints);
    
            // Automatically send to parent when at least 3 points are selected
            if (newPoints.length >= 3) {
                onPolygonComplete(newPoints);
            }
        }
        // console.log(points)
    };

    const handleSetGeoFence = () => {
        console.log("Inside handleSetGeoFence()")
        console.log(points)
        if (points.length > 2) {
            onPolygonComplete(points); // Send polygon to parent component
        } else {
            alert("Please select at least 3 points to create a polygon.");
        }
    };

    return (
        <div 
            style={{ 
                position: "absolute", 
                top: 0, left: 0, 
                width: "100%", height: "100%", 
                cursor: "crosshair",
                pointerEvents: "auto" // Enables clicking
            }} 
            onClick={handleClick}
        >
            {points.map((point, index) => (
                <div 
                    key={index} 
                    style={{
                        position: "absolute", 
                        width: "8px", height: "8px", 
                        background: "red", 
                        borderRadius: "50%",
                        top: `${point.y}px`, 
                        left: `${point.x}px`, 
                        transform: "translate(-50%, -50%)"
                    }} 
                />
            ))}
        </div>
    );
};

export default PolygonSelector;
