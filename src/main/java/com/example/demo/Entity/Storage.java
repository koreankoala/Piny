package com.example.demo.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Storage {
	
	private int idx;
	private String id;
	private String record_start;
	private String video_path;
	private int confirmed;

}