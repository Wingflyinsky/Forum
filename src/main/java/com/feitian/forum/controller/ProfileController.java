package com.feitian.forum.controller;

import com.feitian.forum.domain.Comment;
import com.feitian.forum.domain.Topic;
import com.feitian.forum.domain.User;
import com.feitian.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@Controller
@RequestMapping("/profile")
public class ProfileController {
    @Autowired
    UserService userService;


    @RequestMapping("/")
    public String mainProfile(){
        return "profile";
    }

    @RequestMapping("/getProfile")
    @ResponseBody
    public User getProfile(HttpServletRequest request){
        HttpSession session = request.getSession();
        User user =(User) session.getAttribute("currentUser");
        return user;
    }

    @RequestMapping("/myTopics")
    public String MyTopicsPage(){
        return "myTopics";
    }

    @RequestMapping("/getMyTopics")
    @ResponseBody
    public List<Topic> getMyTopics(HttpServletRequest request){
        HttpSession session = request.getSession();
        User user =(User) session.getAttribute("currentUser");
        return userService.getMyTopics(user.getUserId());
    }

    @RequestMapping("/myComments")
    public String MyCommentsPage(){
        return "myComments";
    }

    @RequestMapping("/getMyComments")
    @ResponseBody
    public List<Comment> getMyComments(HttpServletRequest request){
        HttpSession session = request.getSession();
        User user =(User) session.getAttribute("currentUser");
        return userService.getMyComments(user.getUserId());
    }
}
