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

	public int idCheck(String id);

	public int savevid(String id, String record_start, String video_path);

	public int updateConfirmed(String video_path);

}