import cv2
import numpy as np
from ultralytics import YOLO
from utils import is_point_inside_polygon, getColours


# Load YOLO model
yolo = YOLO('yolo11l.pt')

def process_frame(frame, geo_fence_polygon):
    """Processes a video frame with YOLO and geo-fencing."""
    results = yolo.track(frame, stream=True)

    for result in results:
        classes_names = result.names

        for box in result.boxes:
            if box.conf[0] > 0.4:
                cls = int(box.cls[0])
                class_name = classes_names[cls]

                # Only track persons (class ID = 0)
                if class_name == "person":
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    colour = getColours(cls)

                    # Calculate center of the bounding box
                    center_x = (x1 + x2) // 2
                    center_y = (y1 + y2) // 2

                    # Check if inside the geo-fenced area
                    polygon_tuples = [(point.x, point.y) for point in geo_fence_polygon]  # Convert to list of tuples

                    if is_point_inside_polygon((center_x, center_y), polygon_tuples):

                        print("Center_x: ",center_x)
                        print("Center_y: ",center_x)
                        print("Polygon_tuples: ",polygon_tuples)


                        cv2.putText(frame, "ALERT: Person in Geo-Fence!", 
                                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

                    cv2.rectangle(frame, (x1, y1), (x2, y2), colour, 2)
                    cv2.putText(frame, f"{class_name} {box.conf[0]:.2f}",
                                (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, colour, 2)

    return frame
