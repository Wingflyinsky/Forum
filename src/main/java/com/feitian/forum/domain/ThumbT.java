package com.feitian.forum.domain;

public class ThumbT {
    private Long thumbtId;

    private Long topicId;

    private Long userId;

    public ThumbT(Long thumbtId, Long topicId, Long userId) {
        this.thumbtId = thumbtId;
        this.topicId = topicId;
        this.userId = userId;
    }

    public ThumbT() {
        super();
    }

    public Long getThumbtId() {
        return thumbtId;
    }

    public void setThumbtId(Long thumbtId) {
        this.thumbtId = thumbtId;
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
}