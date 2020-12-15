package com.feitian.forum.domain;

import com.feitian.forum.domain.extend.TopicExtend;

import java.util.Date;

public class Topic extends TopicExtend {
    private Long topicId;

    private Long userId;

    private String title;

    private String content;

    private Date firstSent;

    private Date lastModified;

    private Boolean isDeleted;

    private Short pinLevel;

    public Topic(Long topicId, Long userId, String title, String content, Date firstSent, Date lastModified, Boolean isDeleted, Short pinLevel) {
        this.topicId = topicId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.firstSent = firstSent;
        this.lastModified = lastModified;
        this.isDeleted = isDeleted;
        this.pinLevel = pinLevel;
    }

    public Topic() {
        super();
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title == null ? null : title.trim();
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content == null ? null : content.trim();
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

    public Short getPinLevel() {
        return pinLevel;
    }

    public void setPinLevel(Short pinLevel) {
        this.pinLevel = pinLevel;
    }
}