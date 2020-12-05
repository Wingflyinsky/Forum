package com.feitian.forum.mapper.extend;

public interface CommentExtendMapper {

    /*获得该评论的被点赞数*/
    int getThumbCs(long commentId);
}
