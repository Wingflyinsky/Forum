package com.feitian.forum.mapper.extend;

import com.feitian.forum.domain.Comment;
import com.feitian.forum.domain.Topic;

import java.util.List;

public interface TopicExtendMapper {

    /*取得指定话题Id，包括评论*/
    List<Topic> getTopicById(long topicId);

    /*获得该话题的被点赞数*/
    int getThumbTs(long topicId);

}
