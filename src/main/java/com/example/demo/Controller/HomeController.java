package com.example.demo.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.Entity.Member;
import com.example.demo.Entity.Storage;
import com.example.demo.Mapper.MemberMapper;
import com.example.demo.java.GoogleEmailService;
import com.example.demo.java.NaverAuthenticationService;
import com.example.demo.java.NaverEmailService;

import jakarta.servlet.http.HttpSession;
import java.util.Random;

// 동엽 1차

@Controller
public class HomeController {

    @Autowired
    MemberMapper mapper;

    @GetMapping("/")
    public String intro() {

        return "login";

    }

    @RequestMapping("/main")
    public String login(Member member, HttpSession session) {

        if (session.getAttribute("loginMember") != null) {
            return "main";
        }

        Member result = mapper.login(member);

        if (result == null) { // User에 입력한 회원 정보가 없어 로그인에 실패
            System.out.println("로그인 실패");
            return "redirect:/"; // 로그인 페이지로 다시 이동
        } else {
            session.setAttribute("loginMember", result); // 세션에 로그인한 계정의 정보를 저장, 해당 정보는 session.invalidate()나 브라우저를 종료하기
                                                         // 전까지 유효함
            Member loginMember = (Member) session.getAttribute("loginMember");
            String memberId = loginMember.getId(); // 로그인한 사용자의 Id를 memberId에 할당
            System.out.println(memberId);
            System.out.println(loginMember.getEmail().substring(loginMember.getEmail().length() - 9));

            List<Storage> result_storage = mapper.videoList(memberId);
            session.setAttribute("result_storage", result_storage);
            return "main";
        }

    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {

        session.invalidate(); // 세션에 저장된 정보를 날림(세션에 로그인한 계정 정보를 날림으로 로그아웃)

        return "redirect:/";

    }

    @PostMapping("/join")
    public String join(@ModelAttribute Member member) {

        String pw = member.getPw();
        if (pw.equals("")) {
            System.out.println("비밀번호 미입력");
            return "redirect:/";
        }

        try {
            mapper.join(member); // 입력한 회원 정보를 User 테이블에 삽입

            System.out.println("회원가입 성공");
            System.out.println(member.getId());
            return "redirect:/";
        } catch (DataIntegrityViolationException e) { // MySQL WorkBench에서는 PrimaryKey가 중복되어 User 테이블에 데이터를 삽입할 수 없으면
                                                      // 에러가 떠서 예외처리를 하였음
            System.out.println("회원가입 실패");
            return "redirect:/"; // 회원가입에 실패하면 다시 회원가입 페이지로 이동
        }

    }

    @PostMapping("/sendemail")
    public String sendEmail(HttpSession session) {

        Member member = (Member) session.getAttribute("loginMember");

        String to = member.getEmail();
        String subject = member.getId();
        String text = member.getPw();

        if (to.substring(to.length() - 9).equals("naver.com")) {

            NaverEmailService.sendEmail(to, subject, text);

            return "main";

        } else if (to.substring(to.length() - 9).equals("gmail.com")) {

            GoogleEmailService.sendEmail(to, subject, text);

            return "main";
        }

        return null;

    }

    @PostMapping("/sendauthentication")
    public String sendAuthentication(HttpSession session, @RequestParam("email") String email, @RequestParam("domain") String domain) {

        Random rand = new Random();
        int auth = rand.nextInt(900000) + 100000; // 0 <= auth < 10
        String auth_String = Integer.toString(auth);
        System.out.println(auth_String);
        session.setAttribute("auth", auth_String);

        String to = email;
        
        if(domain.equals("@naver.com")) {
            NaverAuthenticationService.sendEmail(to+domain, "인증번호", "인증번호 "+auth_String+" 을(를) 입력하세요.");
            
            return "login";
            
        } else if(domain.equals("@gmail.com")) {
            
            GoogleEmailService.sendEmail(to+domain, "인증번호", "인증번호 "+auth_String+" 을(를) 입력하세요.");
            
            return "login";
        }
        return null;

    }

    @PostMapping("/checkauthentication")
    public ResponseEntity<String> checkAuthentication(HttpSession session,
            @RequestParam("authentication") String authentication) {
        String auth = (String) session.getAttribute("auth");
        if (auth != null && auth.equals(authentication)) {
            return ResponseEntity.ok("인증이 완료되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("불일치");
        }
    }

    @PostMapping("/idcheck")
    public ResponseEntity<String> idcheck(HttpSession session, @RequestParam("id") String id) {

        int check = mapper.idCheck(id);

        if (check == 0) {
            return ResponseEntity.ok("사용 가능한 아이디입니다.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("중복된 아이디입니다.");
        }

    }

    @GetMapping(value = "/storage")
    public String storage(HttpSession session, Member member) {

        member = (Member) session.getAttribute("loginMember");
        if (member != null) {
            return "storage";
        } else {
            return "redirect:/";
        }
    }

    @GetMapping(value = "/loading")
    public String loading(Model model) {

        return "loading";
    }

    @GetMapping(value = "/mypage")
    public String mypage(HttpSession session, Member member) {

        member = (Member) session.getAttribute("loginMember");
        if (member != null) {
            return "mypage";
        } else {
            return "redirect:/";
        }
    }

    @GetMapping(value = "/videosender")
    public String video(HttpSession session, Member member) {

        member = (Member) session.getAttribute("loginMember");
        if (member != null) {
            return "videosender";
        } else {
            return "redirect:/";
        }
    }

    @GetMapping(value = "/videosender4")
    public String video4(HttpSession session, Member member) {

        member = (Member) session.getAttribute("loginMember");
        if (member != null) {
            return "videosender4";
        } else {
            return "redirect:/";
        }
    }

    @GetMapping(value = "/videotest")
    public String python(HttpSession session, Member member) {

        member = (Member) session.getAttribute("loginMember");
        if (member != null) {
            return "videotest";
        } else {
            return "redirect:/";
        }
    }

    @GetMapping(value = "/videotest2")
    public String python2(HttpSession session, Member member) {

        member = (Member) session.getAttribute("loginMember");
        if (member != null) {
            return "videotest2";
        } else {
            return "redirect:/";
        }
    }

    @GetMapping(value = "/videotest3")
    public String python3(HttpSession session, Member member) {

        member = (Member) session.getAttribute("loginMember");
        if (member != null) {
            return "videotest3";
        } else {
            return "redirect:/";
        }
    }

}