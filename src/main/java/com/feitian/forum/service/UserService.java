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
    long getNumOfComments(long topicId);
    Topic getTopicById(long userId,long topicId,int page);
    String writeNewTopic(Topic topic);
    String modifyMyTopic(Topic topic);
    String deleteTopic(long topicId);
    String writeNewComment(Comment comment);
    String modifyMyComment(Comment comment);
    String deleteComment(long commentId);
    int getThumbCs(long commentId);
    int getThumbTs(long topicId);
    boolean ifThumbCed(long userId,long commentId);
    boolean ifThumbTed(long userId,long topicId);
    boolean ThumbC(long userId,long commentId);
    boolean ThumbT(long userId,long topicId);
    List<Topic> getMyTopics(long userId);
    List<Comment> getMyComments(long userId);

}
