


import React, { useState, useEffect, useRef } from "react";

const PolygonSelector = ({ onPolygonComplete, containerRef, geoFenceSet }) => {
    const [points, setPoints] = useState([]);
    const canvasRef = useRef(null);

    useEffect(() => {
        drawPolygon(); // Redraw polygon when points change
    }, [points, geoFenceSet]);

    const handleClick = (event) => {
        if (!containerRef.current || geoFenceSet) return;  // Disable if geo-fence is set

        // Get bounding box of video
        const rect = containerRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
            const newPoints = [...points, { x, y }];
            setPoints(newPoints);

            if (newPoints.length >= 3) {
                onPolygonComplete(newPoints); // Send to parent
            }
        }
    };

    const drawPolygon = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        // Clear previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the polygon if there are points
        if (points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            points.forEach((point) => ctx.lineTo(point.x, point.y));
            if (geoFenceSet) ctx.closePath(); // Complete polygon if set
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw circles for each point
        points.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
        });
    };

    return (
        <div 
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} 
            onClick={handleClick}
        >
            <canvas 
                ref={canvasRef} 
                width={containerRef.current?.offsetWidth || 640} 
                height={containerRef.current?.offsetHeight || 480} 
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
            />
        </div>
    );
};

export default PolygonSelector;
