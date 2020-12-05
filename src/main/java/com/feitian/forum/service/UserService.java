package com.feitian.forum.service;

import com.feitian.forum.domain.Admin;
import com.feitian.forum.domain.User;

import java.util.Map;

public interface UserService {
    Map<String,Object> loginCheck(User user);
    Admin adminCheck(long userId);
}
