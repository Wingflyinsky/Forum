package com.feitian.forum.domain.extend;

import com.feitian.forum.domain.ThumbC;
import com.feitian.forum.domain.User;

public class CommentExtend {
    private int thumbCs;
    private User commentOwner;
    private boolean isThumbed;

    public boolean isThumbed() {
        return isThumbed;
    }

    public void setThumbed(boolean thumbed) {
        isThumbed = thumbed;
    }

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
