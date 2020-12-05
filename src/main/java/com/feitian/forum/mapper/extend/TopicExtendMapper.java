package com.feitian.forum.mapper.extend;

import com.feitian.forum.domain.Comment;

import java.util.List;

public interface TopicExtendMapper {

    /*获得指定话题的所有评论*/
    List<Comment> getComments(long topicId);

    /*获得该话题的被点赞数*/
    int getThumbTs(long topicId);

    /*查看当前用户对指定话题是否处于点赞状态*/
    boolean ifThumbedByMe(long topicId,long userId);
}
