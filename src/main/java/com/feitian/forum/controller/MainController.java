package com.feitian.forum.controller;

import com.feitian.forum.domain.Admin;
import com.feitian.forum.domain.Topic;
import com.feitian.forum.domain.customize.QueryUserType;
import com.feitian.forum.domain.User;
import com.feitian.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@Controller
public class MainController {

    @Autowired
    UserService userService;

    final int GUEST = 0;
    final int USER = 1;
    final int ADMIN = 2;

    @RequestMapping("/")
    public String index(){
        return "index";
    }

    /*切换到登录界面*/
    @RequestMapping("/login")
    public String loginInterface(){
        return "login";
    }

    /*切换到注册界面*/
    @RequestMapping("/register")
    public String registerInterface(){
        return "register";
    }

    /*提交登录表单*/
    @RequestMapping("/submitLoginData")
    public String loginCheck(User user, HttpServletRequest request){

        User currentUser = (User) userService.loginCheck(user).get("User");
        HttpSession session = request.getSession();
        if (currentUser!=null){
            Map<String,Object> usermap= userService.loginCheck(user);
            User userInDB = (User) usermap.get("User");
            user.setUserId(userInDB.getUserId());
            session.setAttribute("currentUser", userInDB);
            session.setAttribute("loginState",(String)usermap.get("msg"));
            Admin currentAdmin = userService.adminCheck(currentUser.getUserId());
            if(currentAdmin==null){
                session.setAttribute("UserType", USER);
            }
            else{
                session.setAttribute("UserType", ADMIN);
            }
            return "redirect:/";
        }
        else{
            session.setAttribute("loginState",(String)userService.loginCheck(user).get("msg"));
            return "redirect:/login";
        }
    }

    /*提交注册表单*/
    @RequestMapping("/submitRegisterData")
    public String RegisterCheck(User user,HttpServletRequest request){
        HttpSession session = request.getSession();
        String registerState = userService.register(user);
        session.setAttribute("registerState", registerState);
        return "redirect:/register";
    }


    /*前端获取用户名*/
    @RequestMapping("/getUsername")
    @ResponseBody
    public String getUsername(HttpServletRequest request){
        HttpSession session = request.getSession();
        User currentUser = (User)session.getAttribute("currentUser");
        return currentUser.getUsername();
    }


    /*前端获取用户类型*/
    @RequestMapping("/getUserType")
    @ResponseBody
    public Object getUserType(HttpServletRequest request){
        HttpSession session = request.getSession();
        Integer currentUserType = (Integer) session.getAttribute("UserType");

        /*用于以结构化数据返回前端*/
        QueryUserType queryUserType = new QueryUserType("guest", 0);
        if (currentUserType==null){
            return queryUserType;
        }
        if(currentUserType == 1 || currentUserType == 2){
            User currentUser = (User)session.getAttribute("currentUser");
            queryUserType.setAlias(currentUser.getUsername());
            queryUserType.setState(currentUserType);
        }
        return queryUserType;
    }


    /*前端获取登录是否成功的状态*/
    @RequestMapping("/getLoginState")
    @ResponseBody
    public String getLoginState(HttpServletRequest request){
        HttpSession session = request.getSession();
        String loginState=(String) session.getAttribute("loginState");
        session.setAttribute("loginState","");
        if(loginState==null){
            return "";
        }
        return loginState;
    }

    /*前端获取注册是否成功的状态*/
    @RequestMapping("/getRegisterState")
    @ResponseBody
    public String getRegisterState(HttpServletRequest request){
        HttpSession session = request.getSession();
        String registerState=(String) session.getAttribute("registerState");
        session.setAttribute("registerState","");
        if(registerState==null){
            return "";
        }
        return registerState;
    }

    /*前端获取所有话题*/
    @RequestMapping("/searchAllTopic")
    @ResponseBody
    public Object getTopics(HttpServletRequest request){
        HttpSession session = request.getSession();
        List<Topic> topicList = userService.searchAllTopic();
        return topicList;
    }


    /*登出*/
    @RequestMapping("/logout")
    public String logout(HttpServletRequest request){
        HttpSession session = request.getSession();
        session.setAttribute("UserType", GUEST);
        session.removeAttribute("currentUser");
        return "redirect:/";
    }

    /*测试用，清空session*/
    @RequestMapping("/clear")
    public void clearSession(HttpServletRequest request){
        HttpSession session=request.getSession();
        session.invalidate();
    }

}
