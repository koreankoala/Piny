from flask import Flask, render_template, Response
from flask_cors import CORS
import cv2
import requests
from ultralytics import YOLO
import time
from datetime import datetime
import imageio

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

model = YOLO("C:/Users/korea/OneDrive/바탕 화면/final_project_data/second_try.pt")

# Set detailed values for video recording
# fps = 10, record_duration = 25 딱 10초
fps = 10
w, h = 640, 480
record = False
record_start_time = 0
record_duration = 25  # seconds
cnt_rec = 1
email_notification_interval = 60

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

def get_session_data():
    url = 'http://172.30.1.57:3312/session-data'  # Spring 서버의 세션 정보 API URL
    try:
        response = requests.get(url)
        if response.status_code == 200:
            session_data = response.json()  # JSON 형태로 받아온 세션 데이터 처리
            # 세션 데이터 활용
            print(session_data)
            return session_data
        else:
            print('세션 데이터를 가져올 수 없음:', response.status_code)
    except requests.exceptions.RequestException as e:
        print('API 호출 실패:', e)

def send_email(image_filename,formatted_filename):
    url = 'http://172.30.1.57:3312/sendemail'  # Spring 서버의 URL
    
    try:
        session_data = get_session_data()  # 세션 데이터 가져오기
        if session_data:
            session_data['image_filename'] = image_filename
            session_data['formatted_filename'] = formatted_filename

            response = requests.post(url, json=session_data)
            response.raise_for_status()  # HTTP 오류를 일으킬 경우 예외 발생
            print('이메일 전송 성공')
        else:
            print('세션 데이터 없음')
    except requests.exceptions.RequestException as e:
        print(session_data)
        print('이메일 전송 실패:', e)

def gen():
    global record, record_start_time, last_email_time
    last_email_time = 0  # Initialize the last email time

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
            current_time = time.time()

            # Check if enough time has passed since the last email notification
            if current_time - last_email_time >= email_notification_interval:
                print("Cigarette detected!")

                image_filename = 'C:/Users/korea/OneDrive/바탕 화면/DCX_Fianl_Project-main/DCX_FINAL/src/main/resources/static/saved_images/frame_1.jpg'
                cv2.imwrite(image_filename, frame)

                if not record:
                    record = True
                    record_start_time = current_time
                    print(f"Start recording_{cnt_rec}th")
                    start_recording()

                send_email(image_filename, formatted_filename)
                last_email_time = current_time  # Update the last email time

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
        if record and (current_time - record_start_time) > record_duration:
            record = False
            stop_recording()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')

@app.route('/')
def index():
    return render_template('main')

@app.route('/python5')
def video_feed4():
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    formatted_filename = datetime.now().strftime("%Y-%m-%d_%H-%M")
    app.run(debug=True, host="0.0.0.0", port=5000)
