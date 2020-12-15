package com.feitian.forum.domain.extend;

import com.feitian.forum.domain.Comment;
import com.feitian.forum.domain.User;

import java.util.List;

public class TopicExtend {
    private List<Comment> comments;
    private int thumbTs;
    private User topicOwner;

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public int getThumbTs() {
        return thumbTs;
    }

    public void setThumbTs(int thumbTs) {
        this.thumbTs = thumbTs;
    }

    public User getTopicOwner() {
        return topicOwner;
    }

    public void setTopicOwner(User topicOwner) {
        this.topicOwner = topicOwner;
    }


}
