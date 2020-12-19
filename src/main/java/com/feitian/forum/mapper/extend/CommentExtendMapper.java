package com.feitian.forum.mapper.extend;

import com.feitian.forum.domain.Comment;

import java.util.List;

public interface CommentExtendMapper {

    /*获得该评论的被点赞数*/
    int getThumbCs(long commentId);

    /*获得某一话题的某一页评论*/
    List<Comment> getCommentsOfTopic(long topicId,int offset);

}
