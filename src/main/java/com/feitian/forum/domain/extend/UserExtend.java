package com.feitian.forum.domain.extend;

import com.feitian.forum.domain.Comment;
import com.feitian.forum.domain.Topic;

import java.util.List;

public class UserExtend {
    List<Topic> myTopic;
    List<Comment> myComment;

    public List<Topic> getMyTopic() {
        return myTopic;
    }

    public void setMyTopic(List<Topic> myTopic) {
        this.myTopic = myTopic;
    }

    public List<Comment> getMyComment() {
        return myComment;
    }

    public void setMyComment(List<Comment> myComment) {
        this.myComment = myComment;
    }
}
