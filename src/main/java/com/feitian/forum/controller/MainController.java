package com.feitian.forum.controller;

import com.feitian.forum.domain.Admin;
import com.feitian.forum.domain.User;
import com.feitian.forum.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
public class MainController {

    @Autowired
    UserService userService;

    @RequestMapping("/")
    public String index(HttpServletRequest request){
        HttpSession session = request.getSession();
        session.setAttribute("loginState", "");
        /*0表示游客 1表示普通用户 2表示管理员*/
        Integer UserType = (Integer) session.getAttribute("UserType");
        if(UserType == null){
            UserType = 0;
            session.setAttribute("UserType", 0);
        }
        if(UserType!=0){
            return "redirect:/zone";
        }
        else{
            return "redirect:/login";
        }
    }

    /*切换到登录界面*/
    @RequestMapping("/login")
    public String loginInterface(){
        return "login";
    }

    /*提交登录表单*/
    @RequestMapping("/submitLoginData")
    public String loginCheck(User user, HttpServletRequest request){

        User currentUser = (User) userService.loginCheck(user).get("User");
        HttpSession session = request.getSession();
        if (currentUser!=null){
            session.setAttribute("currentUser", user);
            session.setAttribute("loginState",(String)userService.loginCheck(user).get("msg"));
            Admin currentAdmin = userService.adminCheck(currentUser.getUserId());
            if(currentAdmin==null){
                session.setAttribute("UserType", 1);
            }
            else{
                session.setAttribute("UserType", 2);
            }
            return "redirect:/zone";
        }
        else{
            session.setAttribute("loginState",(String)userService.loginCheck(user).get("msg"));
            return "redirect:/login";
        }
    }

    /*切换到论坛页面*/
    @RequestMapping("/zone")
    public String zone(){
        return "zone";
    }

    /*前端获取用户名*/
    @RequestMapping("/getUsername")
    @ResponseBody
    public String getUsername(HttpServletRequest request){
        HttpSession session = request.getSession();
        User currentUser = (User)session.getAttribute("currentUser");
        return currentUser.getUsername();
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

    /*登出*/
    @RequestMapping("/logout")
    public String logout(HttpServletRequest request){
        HttpSession session = request.getSession();
        session.setAttribute("UserType", 0);
        session.removeAttribute("currentUser");
        return "redirect:/login";
    }

}
