package com.feitian.forum.domain.customize;

public class QueryUserType{
    String alias;
    int state;

    public QueryUserType(String alias, int state) {
        this.alias = alias;
        this.state = state;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public int getState() {
        return state;
    }

    public void setState(int state) {
        this.state = state;
    }
}
