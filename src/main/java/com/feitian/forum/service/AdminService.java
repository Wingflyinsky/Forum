package com.feitian.forum.service;

import com.feitian.forum.domain.Comment;
import com.feitian.forum.domain.Topic;
import com.feitian.forum.domain.User;
import com.feitian.forum.domain.customize.Statistics;

import java.util.List;

public interface AdminService {
    void pinTopic(long topicId,int pin_level);
    String recoverTopic(long topicId);
    String recoverComment(long commentId);
    String banUser(long userId);
    String liftBan(long userId);
    List<User> showBannedUser();
    List<Topic> showDeletedTopics();
    List<Comment> showDeletedComments();
    Statistics Statistics();
}
