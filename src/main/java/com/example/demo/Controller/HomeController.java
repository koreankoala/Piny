package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.demo.Entity.Member;
import com.example.demo.Entity.Storage;
import com.example.demo.Mapper.MemberMapper;

import jakarta.servlet.http.HttpSession;


    // 1차 테스트54444544321321
    @Controller
    public class HomeController{

    @Autowired
    MemberMapper mapper;

    @GetMapping("/")
    public String intro() {
    
    return "login";
		
	}

    @PostMapping("/main")
	public String login(Member member, HttpSession session) {
		
		Member result = mapper.login(member);
		
		if(result == null) { // Uesr에 입력한 회원 정보가 없어 로그인에 실패
			System.out.println("로그인 실패");
			return "redirect:/"; // 로그인 페이지로 다시 이동
		} else {
			session.setAttribute("loginMember", result); // 세션에 로그인한 계정의 정보를 저장, 해당 정보는 session.invalidate()나 브라우저를 종료하기 전까지 유효함
			Member loginMember = (Member)session.getAttribute("loginMember"); // boardcontent.jsp에서 로그인한 사용자 정보를 사용해야 함
			String memberId = loginMember.getId(); // 로그인한 사용자의 Id를 memberId에 할당
			System.out.println(memberId);
			System.out.println(loginMember.getEmail().substring(loginMember.getEmail().length()-9));
			
			
			List<Storage> result_storage = mapper.videoList(memberId);
			session.setAttribute("result_storage", result_storage);
			
			return "main";
		
			}

	}

        @GetMapping(value="/service")
        public String service(Model model) {

            return "index";
        }

        @GetMapping(value="/storage")
        public String storage(Model model) {
            
            return "storage";
        }
        
        @GetMapping(value="/video")
        public String video(Model model) {
            
            return "videosender";
        }
        
        @GetMapping(value="/video4")
        public String video4(Model model) {
            
            return "videosender4";
        }

        @GetMapping(value="/python")
        public String python(Model model) {
            
            return "videotest";
        }
        
        @GetMapping(value="/python2")
        public String python2(Model model) {
            
            return "videotest2";
        }

        @GetMapping(value="/python3")
        public String python3(Model model) {
            
            return "videotest3";
        }
        
        
    }
