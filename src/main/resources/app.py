# from flask import Flask, render_template, Response
# import cv2
# import sys
# import mediapipe as mp
# import math

# app = Flask(__name__)

# def gen():
#     cap = cv2.VideoCapture(0)
#     hands = mp.solutions.hands.Hands()

#     while True:
#         res, frame = cap.read()

#         if not res:
#             print("Camera error")
#             break

#         frame = cv2.flip(frame, 1)
#         image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         results = hands.process(image)

#         if results.multi_hand_landmarks:
#             for hand_landmarks in results.multi_hand_landmarks:
#                 mp.solutions.drawing_utils.draw_landmarks(
#                     frame,
#                     hand_landmarks,
#                     mp.solutions.hands.HAND_CONNECTIONS,
#                     mp.solutions.drawing_styles.get_default_hand_landmarks_style(),
#                     mp.solutions.drawing_styles.get_default_hand_connections_style(),
#                 )

#                 # The rest of your hand tracking and gesture recognition code

#         ret, jpeg = cv2.imencode('.jpg', frame)
#         frame_bytes = jpeg.tobytes()
#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')

# @app.route('/')
# def index():
#     return render_template('videotest.html')

# @app.route('/python')
# def video_feed():
#     return Response(gen(),
#                     mimetype='multipart/x-mixed-replace; boundary=frame')

# if __name__ == '__main__':
#     app.run(debug=True)  # app.run(debug=True, port=3313) 은 가능

from flask import Flask, render_template, Response
from flask_cors import CORS  # Import CORS from flask_cors
import cv2
import mediapipe as mp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def gen():
    cap = cv2.VideoCapture(0)
    hands = mp.solutions.hands.Hands()

    while True:
        res, frame = cap.read()

        if not res:
            print("Camera error")
            break

        frame = cv2.flip(frame, 1)
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(image)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp.solutions.drawing_utils.draw_landmarks(
                    frame,
                    hand_landmarks,
                    mp.solutions.hands.HAND_CONNECTIONS,
                    mp.solutions.drawing_styles.get_default_hand_landmarks_style(),
                    mp.solutions.drawing_styles.get_default_hand_connections_style(),
                )

                # The rest of your hand tracking and gesture recognition code

        ret, jpeg = cv2.imencode('.jpg', frame)
        frame_bytes = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n\r\n')

@app.route('/')
def index():
    return render_template('videotest.html')

@app.route('/python')
def video_feed():
    return Response(gen(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, port=5000)

