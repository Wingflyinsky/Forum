package com.feitian.forum.domain;

import java.util.Date;

public class Comment {
    private Long commentId;

    private Long topicId;

    private Long userId;

    private String content;

    private Long floor;

    private Date firstSent;

    private Date lastModified;

    private Boolean isDeleted;

    public Comment(Long commentId, Long topicId, Long userId, String content, Long floor, Date firstSent, Date lastModified, Boolean isDeleted) {
        this.commentId = commentId;
        this.topicId = topicId;
        this.userId = userId;
        this.content = content;
        this.floor = floor;
        this.firstSent = firstSent;
        this.lastModified = lastModified;
        this.isDeleted = isDeleted;
    }

    public Comment() {
        super();
    }

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content == null ? null : content.trim();
    }

    public Long getFloor() {
        return floor;
    }

    public void setFloor(Long floor) {
        this.floor = floor;
    }

    public Date getFirstSent() {
        return firstSent;
    }

    public void setFirstSent(Date firstSent) {
        this.firstSent = firstSent;
    }

    public Date getLastModified() {
        return lastModified;
    }

    public void setLastModified(Date lastModified) {
        this.lastModified = lastModified;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}