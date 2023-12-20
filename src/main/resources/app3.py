from flask import Flask, render_template, Response
from flask_cors import CORS
import cv2
import mediapipe as mp
from ultralytics import YOLO
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model = YOLO("C:/Users/smhrd/Desktop/final_project_data/second_try.pt")

# Set detailed values for video recording
fps = 5
w = 640  # Update with your preferred width
h = 480  # Update with your preferred height
codec = cv2.VideoWriter_fourcc(*'DIVX')  # DIVX: default codec

# Capture and recording status (set to False since we are not recording from the beginning)
global record
record = False
record_start_time = 0
record_duration = 10  # seconds
cnt_rec = 1

out = cv2.VideoWriter(f'record_file_{cnt_rec}.avi', codec, fps, (w, h))

def gen():
    global record, cnt_rec  # Declare record and cnt_rec as global variables

    cap = cv2.VideoCapture(0)  # Assuming '0' is the default camera index, change it if needed

    while True:
        ret, frame = cap.read()

        if not ret:
            print("Camera error")
            break

        results = model.predict(frame, show=False, conf=0.5)
        for result in results:
            boxes = result.boxes.cpu().numpy()
            for box in boxes:
                label = result.names[int(box.cls[0])]
                confidence = box.conf.tolist()
                (x, y, w, h) = (int(box.xyxy[0][0]), int(box.xyxy[0][1]), int(box.xyxy[0][2] - box.xyxy[0][0]), int(box.xyxy[0][3] - box.xyxy[0][1]))
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                # 가정: label과 confidence가 리스트로 반환됨
                label = label[0] if isinstance(label, list) else label
                confidence = confidence[0] if isinstance(confidence, list) else confidence

                cv2.putText(frame, f'{label} {confidence:.2f}', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        ret, jpeg = cv2.imencode('.jpg', frame)
        frame_bytes = jpeg.tobytes()

        # Check if a cigarette is detected
        cigarette_detected = any(result.names[int(box.cls[0])] == "smoking" for result in results for box in result.boxes)

        if cigarette_detected:
            print("Cigarette detected!")

            # 프레임 단위로 이미지 저장
            formatted_filename = datetime.now().strftime("%Y-%m-%d_%H-%M")
            image_filename = f'C:/Users/smhrd/Desktop/deeplearning/image_save/frame_{formatted_filename}.jpg'
            cv2.imwrite(image_filename, frame)

            if not record:
                record = True
                record_start_time = time.time()
                print(f"Start recording_{cnt_rec}th")
                out = cv2.VideoWriter(f'record_file_{formatted_filename}_{cnt_rec}.avi', codec, fps, (w, h))
                cnt_rec += 1

        # Check if recording time exceeds the specified duration
        if record and (time.time() - record_start_time) > record_duration:
            record = False
            print("Stop recording")
            out.release()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')

@app.route('/')
def index():
    return render_template('videotest3.html')

@app.route('/python3')
def video_feed3():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)