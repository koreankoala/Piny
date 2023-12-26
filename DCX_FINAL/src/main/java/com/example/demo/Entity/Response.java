package com.example.demo.Entity;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Response {
	
	private List<Storage> storageList;
    private String smokeCount;
    private String calendarCount;
	
}