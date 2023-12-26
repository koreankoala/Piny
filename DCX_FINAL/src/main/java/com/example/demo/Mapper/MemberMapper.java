package com.example.demo.Mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.Entity.Member;
import com.example.demo.Entity.Storage;

@Mapper
public interface MemberMapper {
	
	public int join(Member member);
	
	public Member login(Member member);
	
	public List<Storage> videoList(String memberId);

	public List<Storage> videoListtwo(String memberId);

	public List<Storage> videoListthree(String memberId, String date1, String date2);

	public List<Storage> searching(String memberId, String item_name);

	public int idCheck(String id);

	public int savevid(String id, String record_start, String video_path);

	public int updateConfirmed(String video_path);

	public int update(String id, String pw, String email);

	public int withdraw(String id);

	public int countSmoke(String date1, String date2, String id);

	public int countCheck(String id);

	public int countCheckCalendar(String id, String date1, String date2);

}