package com.example.demo.java;

import java.util.Properties;
import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;

public class GoogleEmailService {

    public static void sendEmail(String toEmail, String subject, String content) {
        final String username = "dyk209885@gmail.com"; // GMail 주소
        final String password = "gstbdaflylessmfh"; // 구글 앱 비밀번호

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com"); // Gmail의 SMTP 서버
        props.put("mail.smtp.port", "587"); // Gmail SMTP 포트

        Session session = Session.getInstance(props,
            new javax.mail.Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(username, password);
                }
            });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username)); // 보내는 사람 주소
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail)); // 수신자 이메일 주소
            message.setSubject(subject); // 제목

            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText(content); // 내용

            // 이미지 파일 경로 설정
            String imagePath = "C:/Users/smhrd/Desktop/test.png";

            // 이미지 첨부
            MimeBodyPart imagePart = new MimeBodyPart();
            DataSource imageSource = new FileDataSource(imagePath);
            imagePart.setDataHandler(new DataHandler(imageSource));
            imagePart.setFileName("test.png");

            // 이미지를 첨부하여 메시지 생성
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(textPart);
            multipart.addBodyPart(imagePart);

            // 메시지에 다양한 파트를 설정하여 추가
            message.setContent(multipart);

            Transport.send(message);

            System.out.println(username + "에서 " + toEmail + "으로 GMail 전송 완료!");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
