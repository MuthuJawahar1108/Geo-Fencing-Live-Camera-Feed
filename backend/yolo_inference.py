import cv2
import numpy as np
from ultralytics import YOLO



# Load YOLO model
yolo = YOLO('yolo11l.pt')


def getColours(cls_num):
    """Returns a unique color for each object class."""
    base_colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255)]
    color_index = cls_num % len(base_colors)
    increments = [(1, -2, 1), (-2, 1, -1), (1, -1, 2)]
    color = [base_colors[color_index][i] + increments[color_index][i] *
             (cls_num // len(base_colors)) % 256 for i in range(3)]
    return tuple(color)

def is_point_inside_polygon(point, polygon):
    if not polygon:
        print("Error: Polygon is empty!")
        return False

    # Convert polygon to (N, 1, 2) shape
    polygon_np = np.array(polygon, dtype=np.int32).reshape((-1, 1, 2))

    # Convert point to tuple
    if isinstance(point, np.ndarray):
        point = tuple(map(float, point))

    # Debugging
    print("Polygon shape:", polygon_np.shape)
    print("Polygon data:", polygon_np)
    print("Point type:", type(point), "Point value:", point)

    # Run pointPolygonTest
    result = cv2.pointPolygonTest(polygon_np, point, False)

    print("PointPolygonTest Result:", result)  # Should be 1 (inside), -1 (outside), 0 (on edge)
    return result >= 0  # True if inside or on the edge



def process_frame(frame, geo_fence_polygon):
    """Processes a video frame with YOLO and geo-fencing."""
    results = yolo.track(frame, stream=True)
    image_width, image_height = frame.shape[1], frame.shape[0]

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

                    print("im_width: ",image_width,"im_height: ",image_height)


                    print("Center_x: ",center_x)
                    print("Center_y: ",center_y)
                    print("Polygon_tuples: ",polygon_tuples)



                    if is_point_inside_polygon((center_x, center_y), polygon_tuples):
                        cv2.putText(frame, "ALERT: Person in Geo-Fence!", 
                                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

                    cv2.rectangle(frame, (x1, y1), (x2, y2), colour, 2)
                    cv2.putText(frame, f"{class_name} {box.conf[0]:.2f}",
                                (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, colour, 2)

    return frame



