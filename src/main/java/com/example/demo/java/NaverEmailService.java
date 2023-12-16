package com.example.demo.java;

import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;

public class NaverEmailService {

    public static void sendEmail(String to, String subject, String text) {
        final String username = "dyk2098@naver.com"; // 네이버 이메일 주소
        final String password = "13579ehdduq"; // 네이버 비밀번호

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.naver.com"); // Naver의 SMTP 서버
        props.put("mail.smtp.port", "465"); // Naver SMTP 포트
        props.put("mail.smtp.ssl.enable", "true"); // SSL 설정

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(username, password);
                    }
                });

        try {
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username)); // 보내는 사람 주소
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to)); // 수신자 이메일 주소
            message.setSubject(subject);

            // HTML 형식의 메일 작성
            MimeMultipart multipart = new MimeMultipart("related");

            // HTML 본문 작성
            MimeBodyPart htmlPart = new MimeBodyPart();
            String htmlText = "<html><body><h1>" + subject + "</h1><p>" + text + "</p>"
                    + "<img src='cid:image'></body></html>";
            htmlPart.setContent(htmlText, "text/html; charset=utf-8"); // 한글 인코딩 설정
            multipart.addBodyPart(htmlPart);

            // 이미지 첨부
            MimeBodyPart imagePart = new MimeBodyPart();
            String imagePath = "C:/Users/smhrd/Desktop/test.png"; // 이미지 경로 지정
            DataSource fds = new FileDataSource(imagePath);
            imagePart.setDataHandler(new DataHandler(fds));
            imagePart.setHeader("Content-ID", "<image>");
            multipart.addBodyPart(imagePart);

            // 메시지에 다양한 파트를 설정하여 추가
            message.setContent(multipart);

            Transport.send(message);
            System.out.println(username + "에서 " + to + "으로 네이버 이메일 전송 완료!");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
