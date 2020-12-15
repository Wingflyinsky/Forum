package com.feitian.forum.mapper.extend;

import com.feitian.forum.domain.Comment;
import com.feitian.forum.domain.Topic;
import com.feitian.forum.domain.User;

import java.util.List;

public interface UserExtendMapper {
    List<User> getMyTopics(long userId);
    List<User> getMyComments(long userId);
}
