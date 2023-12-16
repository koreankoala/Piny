from flask import Flask, render_template, Response
from flask_cors import CORS  # Import CORS from flask_cors
import cv2
import mediapipe as mp
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model = YOLO("C:/Users/smhrd/Desktop/final_project_data/bestcigar.pt")


def gen():
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
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')

@app.route('/')
def index():
    return render_template('videotest2.html')

@app.route('/python2')
def video_feed2():
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
