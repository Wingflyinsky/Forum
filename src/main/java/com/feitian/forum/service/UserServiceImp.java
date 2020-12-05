package com.feitian.forum.service;

import com.feitian.forum.domain.Admin;
import com.feitian.forum.domain.AdminExample;
import com.feitian.forum.domain.User;
import com.feitian.forum.domain.UserExample;
import com.feitian.forum.mapper.AdminMapper;
import com.feitian.forum.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    UserMapper userMapper;
    @Autowired
    AdminMapper adminMapper;

    @Override
    public Map<String,Object> loginCheck(User user) {
        Map<String,Object> result = new HashMap<String,Object>();
        UserExample userExample = new UserExample();
        userExample.createCriteria().andUsernameEqualTo(user.getUsername());
        List<User> userList = userMapper.selectByExample(userExample);
        if(userList.size()>0){
            if(user.getPassword().equals(userList.get(0).getPassword()) ){
                result.put("User", userList.get(0));
                result.put("msg", "success");
            }
            else{
                result.put("User", null);
                result.put("msg", "wrong password");
            }
            return result;
        }
        result.put("User", null);
        result.put("msg", "user not found");
        return result;
    }

    @Override
    public Admin adminCheck(long userId) {
        AdminExample adminExample = new AdminExample();
        adminExample.createCriteria().andUserIdEqualTo(userId);
        List<Admin> adminList = adminMapper.selectByExample(adminExample);
        if(adminList.size()>0){
            return adminList.get(0);
        }
        return null;
    }
}
