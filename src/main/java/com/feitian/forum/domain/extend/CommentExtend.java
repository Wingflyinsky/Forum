package com.feitian.forum.domain.extend;

import com.feitian.forum.domain.User;

public class CommentExtend {
    private int thumbCs;
    private User commentOwner;

    public int getThumbCs() {
        return thumbCs;
    }

    public void setThumbCs(int thumbCs) {
        this.thumbCs = thumbCs;
    }

    public User getCommentOwner() {
        return commentOwner;
    }

    public void setCommentOwner(User commentOwner) {
        this.commentOwner = commentOwner;
    }
}
