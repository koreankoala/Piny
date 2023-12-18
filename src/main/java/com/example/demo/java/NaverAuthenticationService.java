package com.example.demo.java;

import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;

public class NaverAuthenticationService {

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
            
            // 텍스트 내용 설정
            message.setText(text);

            Transport.send(message);
            System.out.println(username + "에서 " + to + "으로 네이버 이메일 인증번호 전송 완료!");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}