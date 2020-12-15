package com.feitian.forum.domain.customize;

public class Statistics {
    private long numOfUser;
    private long numOfTopic;
    private long numOfComment;

    public long getNumOfUser() {
        return numOfUser;
    }

    public void setNumOfUser(long numOfUser) {
        this.numOfUser = numOfUser;
    }

    public long getNumOfTopic() {
        return numOfTopic;
    }

    public void setNumOfTopic(long numOfTopic) {
        this.numOfTopic = numOfTopic;
    }

    public long getNumOfComment() {
        return numOfComment;
    }

    public void setNumOfComment(long numOfComment) {
        this.numOfComment = numOfComment;
    }
}
