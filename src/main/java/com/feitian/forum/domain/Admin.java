package com.feitian.forum.domain;

public class Admin {
    private Integer adminId;

    private Long userId;

    public Admin(Integer adminId, Long userId) {
        this.adminId = adminId;
        this.userId = userId;
    }

    public Admin() {
        super();
    }

    public Integer getAdminId() {
        return adminId;
    }

    public void setAdminId(Integer adminId) {
        this.adminId = adminId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}