from ultralytics import YOLO
import cv2
import time

from datetime import datetime


formatted_filename = datetime.now().strftime("%Y-%m-%d %H:%M:%S").replace(" ", "_").replace(":", "-")


model = YOLO("C:/Users/smhrd/Desktop/final_project_data/second_try.pt")
# model = YOLO("C:/Users/smhrd/Downloads/bestcigar.pt")
# model = YOLO("yolov8n.pt")


try:
    cap = cv2.VideoCapture(0)
    print('Start reading video ^ㅡ^')

except:
    print('Failed to read video ㅠㅠ')

# Set detailed values for video recording
fps = 5
w = int(cap.get(3))
h = int(cap.get(4))
codec = cv2.VideoWriter_fourcc(*'DIVX')  # DIVX: default codec

# Capture and recording status (set to False since we are not recording from the beginning)
record = False
record_start_time = 0
record_duration = 10  # seconds
cnt_cap = cnt_rec = 1


out = cv2.VideoWriter(f'C:/Users/smhrd/Desktop/deeplearning/video_save/record_file_{formatted_filename}_{cnt_rec}.avi', codec, fps, (w, h))

while True:
    
    ret, frame = cap.read()

    results = model.predict(frame, show=True, conf=0.5)

    key = cv2.waitKey(33)

    # Check if a cigarette is detected
    cigarette_detected = any(result.names[int(box.cls[0])] == "smoking" for result in results for box in result.boxes)

    if cigarette_detected:
        print("Cigarette detected!")
    

        if not record:
            record = True
            record_start_time = time.time()
            print(f"Start recording_{cnt_rec}th")
            out = cv2.VideoWriter(f'C:/Users/smhrd/Desktop/deeplearning/video_save/record_file_{formatted_filename}_{cnt_rec}.avi', codec, fps, (w, h))
            cnt_rec += 1

    # Check if recording time exceeds the specified duration
    if record and (time.time() - record_start_time) > record_duration:
        record = False
        print("Stop recording")
        out.release()

    # Perform object detection on the frame
    if record:
        out.write(frame)

    # Display the frame
    

    

    if key == 27:
        print("End of video and cam reading")
        break

cap.release()
cv2.destroyAllWindows()