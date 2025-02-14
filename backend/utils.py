import cv2
import numpy as np




def getColours(cls_num):
    """Returns a unique color for each object class."""
    base_colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255)]
    color_index = cls_num % len(base_colors)
    increments = [(1, -2, 1), (-2, 1, -1), (1, -1, 2)]
    color = [base_colors[color_index][i] + increments[color_index][i] *
             (cls_num // len(base_colors)) % 256 for i in range(3)]
    return tuple(color)

# def is_point_inside_polygon(point, polygon):
#     """
#     Check if a point (x, y) is inside a polygon.
#     Uses OpenCV's pointPolygonTest function.
#     """
#     if not polygon:
#         return False

#     point = np.array(point, dtype=np.float32)
#     polygon = np.array(polygon, dtype=np.float32)
    
#     return cv2.pointPolygonTest(polygon, point, False) >= 0

#----------------------------------------------------
# def is_point_inside_polygon(point, polygon):
#     """
#     Check if a point (x, y) is inside a polygon using OpenCV.

#     :param point: (x, y) tuple representing the point to check.
#     :param polygon: List of (x, y) tuples representing polygon vertices.
#     :return: True if the point is inside the polygon, False otherwise.
#     """
#     if not polygon:  
#         print("Error: Polygon is empty!")
#         return False  
    
#     # polygon = np.array(polygon, dtype=np.int32)  # Convert to NumPy array
#     # polygon_np = np.array(polygon, dtype=np.int32).reshape((-1, 1, 2))

#    # ✅ Convert polygon to a NumPy array (N, 1, 2)
#     polygon_np = np.array(polygon, dtype=np.int32).reshape((-1, 1, 2))

#     # ✅ Convert NumPy array `point` into a tuple (x, y)
#     if isinstance(point, np.ndarray):
#         point = tuple(point.astype(float))  # Ensure it's a float tuple


#     # print("Polygon shape:", polygon_np.shape, "Polygon data:", polygon_np)
#     # print("Point type:", type(point), "Point value:", point)
#     # print("Final Point type:", type(point), "Final Point value:", point)

#     print("cv2.pointPolygonTest: ",cv2.pointPolygonTest(polygon_np, point, False))
#     return cv2.pointPolygonTest(polygon_np, point, False) >= 0



import numpy as np
import cv2

def is_point_inside_polygon(point, polygon):
    if not polygon:
        print("Error: Polygon is empty!")
        return False

    # ✅ Convert polygon to (N, 1, 2) shape
    polygon_np = np.array(polygon, dtype=np.int32).reshape((-1, 1, 2))

    # ✅ Convert point to tuple
    if isinstance(point, np.ndarray):
        point = tuple(map(float, point))

    # 🔍 Debugging
    print("Polygon shape:", polygon_np.shape)
    print("Polygon data:", polygon_np)
    print("Point type:", type(point), "Point value:", point)

    # ✅ Run pointPolygonTest
    result = cv2.pointPolygonTest(polygon_np, point, False)

    print("PointPolygonTest Result:", result)  # Should be 1 (inside), -1 (outside), 0 (on edge)
    return result >= 0  # True if inside or on the edge
