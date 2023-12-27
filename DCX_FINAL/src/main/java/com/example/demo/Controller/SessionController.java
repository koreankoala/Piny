package com.example.demo.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Member;
import com.example.demo.Mapper.MemberMapper;

import jakarta.servlet.http.HttpSession;

@RestController
public class SessionController {

    @Autowired
    MemberMapper mapper;

    @GetMapping("/session-data")
    public Map<String, String> getSessionData(HttpSession session) {

        Map<String, String> sessionData = new HashMap<>();

        Member member = (Member) session.getAttribute("loginMember");
        // Python 쪽에서 Spring 서버로 호출을 하기 때문에 Spring 서버의 세션에 값을 가져오지 못함

        if(member == null){
            System.out.println("/session-data에서는 null임");
            // 그래서 얘가 출력됨(member == null → True)
        }

        // 세션에서 로그인 정보 가져오기
        
        String email = mapper.loginUserEmail();
        // String email = "";
        System.out.println(email);

        sessionData.put("email", email);

        return sessionData;
    }
}