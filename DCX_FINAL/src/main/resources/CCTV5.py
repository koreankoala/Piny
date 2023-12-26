from flask import Flask, render_template, Response
from flask_cors import CORS
import cv2
from ultralytics import YOLO
import time
from datetime import datetime
import imageio

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model = YOLO("C:/Users/korea/OneDrive/바탕 화면/final_project_data/second_try.pt")

# Set detailed values for video recording
fps = 10
w, h = 640, 480
record = False
record_start_time = 0
record_duration = 20  # seconds
cnt_rec = 1

def start_recording():
    global writer, cnt_rec
    filename = f'C:/Users/korea/OneDrive/바탕 화면/DCX_Fianl_Project-main/DCX_FINAL/src/main/resources/static/videos/record_file_{formatted_filename}_{cnt_rec}.mp4'
    writer = imageio.get_writer(filename, fps=fps)
    cnt_rec += 1

def stop_recording():
    global writer
    if writer is not None:
        print("Stop recording")
        writer.close()

def gen():
    global record, record_start_time
    cap = cv2.VideoCapture(0)

    while True:
        ret, frame = cap.read()

        if not ret:
            print("Camera error")
            break

        results = model.predict(frame, show=False, conf=0.5)
        key = cv2.waitKey(33)
        cigarette_detected = any(result.names[int(box.cls[0])] == "smoking" for result in results for box in result.boxes)

        if cigarette_detected:
            print("Cigarette detected!")

            image_filename = f'C:/Users/korea/OneDrive/바탕 화면/DCX_Fianl_Project-main/DCX_FINAL/src/main/resources/static/saved_images/frame_{formatted_filename}.jpg'
            cv2.imwrite(image_filename, frame)

            if not record:
                record = True
                record_start_time = time.time()
                print(f"Start recording_{cnt_rec}th")
                start_recording()

        if record:
            writer.append_data(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        # Draw bounding boxes and labels
        for result in results:
            boxes = result.boxes.cpu().numpy()
            for box in boxes:
                label = result.names[int(box.cls[0])]
                confidence = box.conf.tolist()
                (x, y, w, h) = (int(box.xyxy[0][0]), int(box.xyxy[0][1]), int(box.xyxy[0][2] - box.xyxy[0][0]), int(box.xyxy[0][3] - box.xyxy[0][1]))
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                label = label[0] if isinstance(label, list) else label
                confidence = confidence[0] if isinstance(confidence, list) else confidence
                cv2.putText(frame, f'{label} {confidence:.2f}', (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        ret, jpeg = cv2.imencode('.jpg', frame)
        frame_bytes = jpeg.tobytes()

        # Check if recording time exceeds the specified duration
        if record and (time.time() - record_start_time) > record_duration:
            record = False
            stop_recording()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')

@app.route('/')
def index():
    return render_template('videotest4.html')

@app.route('/python5')
def video_feed4():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    formatted_filename = datetime.now().strftime("%Y-%m-%d_%H-%M")
    app.run(debug=True, host="0.0.0.0", port=5000)
