# 웹 캠을 키고 담배를 탐지해주는 가장 기본적 기능 구현
# 터미널 창에 얼굴만 인식되면 face라고 뜨고, 담배까지 같이 뜨면 face, cigarette이라고 뜸
# q 누르면 종료됨
#==========================================================================================



from ultralytics import YOLO
import cv2


model = YOLO("C:/Users/smhrd/Desktop/final_project_data/bestcigar.pt")

cap = cv2.VideoCapture(0)  # Assuming '0' is the default camera index, change it if needed

while True:
    ret, frame = cap.read()

    # Perform object detection on the frame
    results = model.predict(frame, show = True, conf=0.5)
    for result in results:
        boxes = result.boxes.cpu().numpy()                         # get boxes on cpu in numpy
        for box in boxes:  
            print(result.names[int(box.cls[0])])   # result.names[int(box.cls[0])]-> str 타입으로 face 또는 cigarette

    # Display the results
    # cv2.imshow('Object Detection', frame)

    # Check for the 'q' key to exit the loop
    key = cv2.waitKey(200) & 0xFF  # 키보드 입력받기
    if key == 27:  # ESC를 눌렀을 경우
        break  # 반복문 종료

# Release the webcam and close OpenCV windows
cap.release()
cv2.destroyAllWindows()