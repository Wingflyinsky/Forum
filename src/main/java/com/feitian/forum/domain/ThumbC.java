package com.feitian.forum.domain;

public class ThumbC {
    private Long thumbcId;

    private Long commentId;

    private Long userId;

    public ThumbC(Long thumbcId, Long commentId, Long userId) {
        this.thumbcId = thumbcId;
        this.commentId = commentId;
        this.userId = userId;
    }

    public ThumbC() {
        super();
    }

    public Long getThumbcId() {
        return thumbcId;
    }

    public void setThumbcId(Long thumbcId) {
        this.thumbcId = thumbcId;
    }

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}