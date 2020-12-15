package com.feitian.forum.service;

import com.feitian.forum.domain.*;
import org.apache.ibatis.annotations.SelectKey;

import java.util.List;
import java.util.Map;

public interface UserService {
    Map<String,Object> loginCheck(User user);
    Admin adminCheck(long userId);
    String register(User user);
    List<Topic> searchAllTopic();
    Topic getTopicById(long topicId);
    String writeNewTopic(Topic topic);
    String modifyMyTopic(Topic topic);
    String deleteTopic(long topicId);
    String writeNewComment(Comment comment);
    String modifyMyComment(Comment comment);
    String deleteComment(long commentId);
    boolean ifThumbCed(long userId,long commentId);
    boolean ifThumbTed(long userId,long topicId);
    void ThumbC(long userId,long commentId);
    void ThumbT(long userId,long topicId);
    List<Topic> getMyTopics(long userId);
    List<Comment> getMyComments(long userId);

}
