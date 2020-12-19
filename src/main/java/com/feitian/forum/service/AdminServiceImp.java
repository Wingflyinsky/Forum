package com.feitian.forum.service;

import com.feitian.forum.domain.*;
import com.feitian.forum.domain.customize.Statistics;
import com.feitian.forum.mapper.AdminMapper;
import com.feitian.forum.mapper.CommentMapper;
import com.feitian.forum.mapper.TopicMapper;
import com.feitian.forum.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImp implements AdminService{

    @Autowired
    UserMapper userMapper;
    @Autowired
    AdminMapper adminMapper;
    @Autowired
    TopicMapper topicMapper;
    @Autowired
    CommentMapper commentMapper;

    @Override
    public void pinTopic(long topicId, int pin_level) {
        TopicExample topicExample = new TopicExample();
        topicExample.createCriteria().andTopicIdEqualTo(topicId).andIsDeletedEqualTo(false);
        if(pin_level<6&&pin_level>=0) {
            Topic topic = new Topic();
            topic.setPinLevel((short) pin_level);
            topicMapper.updateByExampleSelective(topic, topicExample);
        }
    }


    @Override
    public String recoverTopic(long topicId) {
        TopicExample topicExample = new TopicExample();
        topicExample.createCriteria().andTopicIdEqualTo(topicId).andIsDeletedEqualTo(true);
        if(topicMapper.selectByExample(topicExample).size()>0){
            Topic topic = new Topic();
            topic.setIsDeleted(false);
            topicMapper.updateByExampleSelective(topic, topicExample);
            return "success";
        }
        else{
            return "no such deleted topics";
        }
    }


    @Override
    public String recoverComment(long commentId) {
        CommentExample commentExample = new CommentExample();
        commentExample.createCriteria().andCommentIdEqualTo(commentId).andIsDeletedEqualTo(true);
        if(commentMapper.selectByExample(commentExample).size()>0){
            Comment comment = new Comment();
            comment.setIsDeleted(false);
            commentMapper.updateByExampleSelective(comment, commentExample);
            return "success";
        }
        else{
            return "no such deleted comments";
        }
    }

    @Override
    public String banUser(long userId) {
        UserExample userExample = new UserExample();
        userExample.createCriteria().andUserIdEqualTo(userId).andIfBannedEqualTo(false);
        AdminExample adminExample = new AdminExample();
        adminExample.createCriteria().andUserIdEqualTo(userId);
        if(userMapper.selectByExample(userExample).size()>0){
            if(adminMapper.selectByExample(adminExample).size()>0){
                return "can't ban admin";
            }
            User user = new User();
            user.setIfBanned(true);
            userMapper.updateByExampleSelective(user, userExample);
            return "success";
        }
        else{
            return "no such users to ban";
        }
    }

    @Override
    public String liftBan(long userId) {
        UserExample userExample = new UserExample();
        userExample.createCriteria().andUserIdEqualTo(userId).andIfBannedEqualTo(true);
        if(userMapper.selectByExample(userExample).size()>0){
            User user = new User();
            user.setIfBanned(false);
            userMapper.updateByExampleSelective(user, userExample);
            return "success";
        }
        else{
            return "no such banned users";
        }
    }

    @Override
    public List<User> showBannedUser() {
        UserExample userExample = new UserExample();
        userExample.createCriteria().andIfBannedEqualTo(true);
        return userMapper.selectByExample(userExample).size()>0?userMapper.selectByExample(userExample):null;
    }

    @Override
    public List<Topic> showDeletedTopics() {
        TopicExample topicExample = new TopicExample();
        topicExample.createCriteria().andIsDeletedEqualTo(true);
        return topicMapper.selectByExample(topicExample).size()>0?topicMapper.selectByExample(topicExample):null;
    }

    @Override
    public List<Comment> showDeletedComments() {
        CommentExample commentExample = new CommentExample();
        commentExample.createCriteria().andIsDeletedEqualTo(true);
        return commentMapper.selectByExample(commentExample).size()>0?commentMapper.selectByExample(commentExample):null;
    }

    @Override
    public String deleteBadTopic(long topicId) {
        TopicExample topicExample = new TopicExample();
        topicExample.createCriteria().andTopicIdEqualTo(topicId).andIsDeletedEqualTo(false);
        if(topicMapper.selectByExample(topicExample).size()>0){
            Topic topic = new Topic();
            topic.setIsDeleted(true);
            topic.setDeletedByUser(false);
            topicMapper.updateByExampleSelective(topic, topicExample);
            return "success";
        }
        else{
            return "no such topics to delete";
        }
    }

    @Override
    public String deleteBadComment(long commentId) {
        CommentExample commentExample = new CommentExample();
        commentExample.createCriteria().andCommentIdEqualTo(commentId).andIsDeletedEqualTo(false);
        if(commentMapper.selectByExample(commentExample).size()>0){
            Comment comment = new Comment();
            comment.setIsDeleted(true);
            comment.setDeleteByUser(false);
            commentMapper.updateByExampleSelective(comment, commentExample);
            return "success";
        }
        else{
            return "no such comments to delete";
        }
    }

    @Override
    public Statistics Statistics() {
        Statistics stats = new Statistics();

        UserExample userExample = new UserExample();
        TopicExample topicExample = new TopicExample();
        CommentExample commentExample = new CommentExample();

        topicExample.createCriteria().andIsDeletedEqualTo(false);
        commentExample.createCriteria().andIsDeletedEqualTo(false);
        stats.setNumOfUser(userMapper.countByExample(userExample));
        stats.setNumOfTopic(topicMapper.countByExample(topicExample));
        stats.setNumOfComment(commentMapper.countByExample(commentExample));
        return stats;
    }
}
