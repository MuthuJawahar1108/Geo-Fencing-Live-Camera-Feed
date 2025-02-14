import cv2
import os
import subprocess
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import StreamingResponse, RedirectResponse
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from yolo_inference import process_frame


app = FastAPI()




# Allow frontend (React) to make requests to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


video_source = {
    "webcam": 0,
    "upload": None,
    "rtsp": None,
    "youtube": None
}


def get_youtube_stream(url):
    """Fetches direct stream URL from YouTube."""
    try:
        command = ["yt-dlp", "-f", "best", "-g", url]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode == 0:
            return result.stdout.strip()
        print("Error fetching YouTube stream:", result.stderr)
        return None
    except Exception as e:
        print("Exception:", str(e))
        return None
    

def generate_frames(source):
    """Streams video frames with YOLO-based object detection."""
    if source == "webcam":
        cap = cv2.VideoCapture(0)
    elif source == "upload" and video_source["upload"]:
        cap = cv2.VideoCapture(video_source["upload"])
    elif source == "rtsp" and video_source["rtsp"]:
        cap = cv2.VideoCapture(video_source["rtsp"])
    elif source == "youtube" and video_source["youtube"]:
        cap = cv2.VideoCapture(video_source["youtube"])
    else:
        return

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print(f"Error: Unable to read frames from {source}")
            break


        # Process frame with YOLO and geo-fencing check
        frame = process_frame(frame, geo_fence_polygon)

        # results = yolo.track(frame, stream=True)

        # for result in results:
        #     classes_names = result.names

        # #     for box in result.boxes:
        # #         if box.conf[0] > 0.4:
        # #             x1, y1, x2, y2 = map(int, box.xyxy[0])
        # #             cls = int(box.cls[0])
        # #             class_name = classes_names[cls]
        # #             colour = getColours(cls)

        # #             cv2.rectangle(frame, (x1, y1), (x2, y2), colour, 2)
        # #             cv2.putText(frame, f"{class_name} {box.conf[0]:.2f}",
        # #                         (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, colour, 2)

        #     for box in result.boxes:
        #         if box.conf[0] > 0.4:
        #             cls = int(box.cls[0])
        #             class_name = classes_names[cls]

        #             # Only track persons (class ID = 0)
        #             if class_name == "person":  # or cls == 0
        #                 x1, y1, x2, y2 = map(int, box.xyxy[0])
        #                 colour = getColours(cls)

        #                 cv2.rectangle(frame, (x1, y1), (x2, y2), colour, 2)
        #                 cv2.putText(frame, f"{class_name} {box.conf[0]:.2f}",
        #                             (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, colour, 2)


        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()


@app.get("/")
def index():
    return RedirectResponse(url="/frontend/index.html")


@app.get("/video_feed/{source}")
def video_feed(source: str):
    """Streams video from the selected source."""
    return StreamingResponse(generate_frames(source), media_type="multipart/x-mixed-replace; boundary=frame")


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    """Uploads a video file and saves it."""
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    video_source["upload"] = file_path
    return {"message": "File uploaded successfully", "filename": file.filename}


@app.post("/start_rtsp")
def start_rtsp(rtsp_url: str = Form(...)):
    """Starts an RTSP stream."""
    video_source["rtsp"] = rtsp_url
    return {"message": "RTSP Stream Started", "url": rtsp_url}


@app.post("/start_youtube")
def start_youtube(youtube_url: str = Form(...)):
    """Starts a YouTube live stream."""
    youtube_stream_url = get_youtube_stream(youtube_url)
    if youtube_stream_url:
        video_source["youtube"] = youtube_stream_url
        return {"message": "YouTube Stream Started", "url": youtube_stream_url}
    
    return {"error": "Failed to start YouTube stream"}


# Define Geo-Fence Data Model
class Point(BaseModel):
    x: float
    y: float

class PolygonData(BaseModel):
    geo_fence: List[Point]

# Store geo-fence in memory (TEMPORARY, use DB for production)
geo_fence_polygon = []

@app.post("/set_geofence")
async def set_geofence(data: PolygonData):
    """Sets geo-fence polygon coordinates."""
    # print("Data :",data)
    global geo_fence_polygon
    geo_fence_polygon = data.geo_fence
    print("Received Geo-Fence:", geo_fence_polygon)
    return {"message": "Geo-fence set successfully!", "geo_fence": geo_fence_polygon}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)