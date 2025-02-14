import React, { useState, useRef, useEffect } from "react";

const PolygonSelector = ({ onPolygonComplete }) => {
    const [points, setPoints] = useState([]); // Store clicked points
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Polygon
        if (points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            points.forEach(point => ctx.lineTo(point.x, point.y));
            ctx.closePath();
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }, [points]);

    const handleCanvasClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPoints([...points, { x, y }]);
    };

    const handleDone = () => {
        if (points.length >= 3) {
            onPolygonComplete(points); // Send points to parent component
        } else {
            alert("Select at least 3 points to form a polygon!");
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{ position: "absolute", top: 0, left: 0 }}
                onClick={handleCanvasClick}
            />
            <button onClick={handleDone}>Set Geo-Fence</button>
            <button onClick={() => setPoints([])}>Reset</button>
        </div>
    );
};

export default PolygonSelector;
