package com.feitian.forum.controller;

import com.feitian.forum.domain.Topic;
import com.feitian.forum.domain.User;
import com.feitian.forum.service.AdminService;
import com.feitian.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/topic")
public class TopicController {

    @Autowired
    UserService userService;

    @Autowired
    AdminService adminService;

    @RequestMapping("/{topicId}")
    String readTopic(@PathVariable String topicId){
        return "topic/topic";
    }

    @RequestMapping("/getNumOfComments")
    @ResponseBody
    long getNumOfComments(long topicId){
        return userService.getNumOfComments(topicId);
    }

    @RequestMapping("/selectTopicById")
    @ResponseBody
    Object getTopicById(HttpServletRequest request, long topicId,int page){
        HttpSession session = request.getSession();
        Integer userType = (Integer) session.getAttribute("UserType");
        long userId = 0;
        if(userType != null && userType!=0){
            User currentUser = (User)session.getAttribute("currentUser");
            userId = currentUser.getUserId();
        }
        else {
            //当游客登录时，默认其用户Id为-1
            userId = -1;
        }
        Topic topic = userService.getTopicById(userId,topicId,page);
        return topic;
    }

    @RequestMapping("/deleteComment")
    @ResponseBody
    String deleteComment(long commentId,boolean delete_by_user){
        if(delete_by_user){
            return userService.deleteComment(commentId);
        }
        else{
            return adminService.deleteBadComment(commentId);
        }
    }

    @RequestMapping("/handleTopicLikes")
    @ResponseBody
    Boolean handleTopicLikes(long topicId,HttpServletRequest request){
        HttpSession session = request.getSession();
        User user = (User)session.getAttribute("currentUser");
        boolean ifThumbedNow = userService.ThumbT(user.getUserId(),topicId);
        return ifThumbedNow;
    }

    @RequestMapping("/handleCommentLikes")
    @ResponseBody
    Boolean handleCommentLikes(long commentId,HttpServletRequest request){
        HttpSession session = request.getSession();
        User user = (User)session.getAttribute("currentUser");
        boolean ifThumbedNow = userService.ThumbC(user.getUserId(),commentId);
        return ifThumbedNow;
    }

}
