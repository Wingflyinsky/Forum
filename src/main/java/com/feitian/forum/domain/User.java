package com.feitian.forum.domain;

import com.feitian.forum.domain.extend.UserExtend;

public class User extends UserExtend {
    private Long userId;

    private String username;

    private String password;

    private String gender;

    private String email;

    private Boolean ifBanned;

    public User(Long userId, String username, String password, String gender, String email, Boolean ifBanned) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.gender = gender;
        this.email = email;
        this.ifBanned = ifBanned;
    }

    public User() {
        super();
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender == null ? null : gender.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public Boolean getIfBanned() {
        return ifBanned;
    }

    public void setIfBanned(Boolean ifBanned) {
        this.ifBanned = ifBanned;
    }
}