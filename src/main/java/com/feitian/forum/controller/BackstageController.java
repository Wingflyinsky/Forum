package com.feitian.forum.controller;

import com.feitian.forum.service.AdminService;
import com.feitian.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/backstage")
public class BackstageController {

    @Autowired
    UserService userService;
    @Autowired
    AdminService adminService;

    @RequestMapping("/")
    public String mainProfile(){
        return "backstage";
    }

    @RequestMapping("/userManagement")
    public String userManagement(){
        return "userManagement";
    }

    @RequestMapping("/topicManagement")
    public String topicManagement(){
        return "topicManagement";
    }
}
