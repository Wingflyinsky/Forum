package com.feitian.forum.service;

import com.feitian.forum.domain.*;
import com.feitian.forum.domain.extend.CommentExtend;
import com.feitian.forum.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    UserMapper userMapper;
    @Autowired
    AdminMapper adminMapper;
    @Autowired
    TopicMapper topicMapper;
    @Autowired
    CommentMapper commentMapper;
    @Autowired
    ThumbCMapper thumbCMapper;
    @Autowired
    ThumbTMapper thumbTMapper;

    @Override
    public Map<String,Object> loginCheck(User user) {
        Map<String,Object> result = new HashMap<String,Object>();
        UserExample userExample = new UserExample();
        userExample.createCriteria().andUsernameEqualTo(user.getUsername());
        List<User> userList = userMapper.selectByExample(userExample);
        if(userList.size()>0){
            if(user.getPassword().equals(userList.get(0).getPassword()) ){
                result.put("User", userList.get(0));
                result.put("msg", "success");
            }
            else{
                result.put("User", null);
                result.put("msg", "wrong password");
            }
            return result;
        }
        result.put("User", null);
        result.put("msg", "user not found");
        return result;
    }

    @Override
    public Admin adminCheck(long userId) {
        AdminExample adminExample = new AdminExample();
        adminExample.createCriteria().andUserIdEqualTo(userId);
        List<Admin> adminList = adminMapper.selectByExample(adminExample);
        if(adminList.size()>0){
            return adminList.get(0);
        }
        return null;
    }

    @Override
    public String register(User user) {
        UserExample userExample = new UserExample();
        userExample.createCriteria().andUsernameEqualTo(user.getUsername());
        List<User> userList = userMapper.selectByExample(userExample);
        if(userList.size()>0){
            return "occupied username";
        }
        //insertSelective方法在插入数据时，有默认值的为默认值，无默认值的为空值，但不是null
        userMapper.insertSelective(user);
        return "success";
    }

    @Override
    public List<Topic> searchAllTopic() {
        TopicExample topicExample = new TopicExample();
        topicExample.createCriteria().andIsDeletedEqualTo(false);
        List<Topic> topicList = topicMapper.selectByExample(topicExample);
        return topicList;
    }

    @Override
    public long getNumOfComments(long topicId) {
        CommentExample commentExample = new CommentExample();
        commentExample.createCriteria().andTopicIdEqualTo(topicId).andIsDeletedEqualTo(false);
        return commentMapper.countByExample(commentExample);
    }

    @Override
    public Topic getTopicById(long userId,long topicId,int page) {
        List<Topic> topicList = topicMapper.getTopicById(topicId);
        if (topicList.size()>0){
            topicList.get(0).setThumbTs(getThumbTs(topicId));
            topicList.get(0).setThumbed(ifThumbTed(userId, topicId));
            CommentExample commentExample = new CommentExample();
            commentExample.createCriteria().andTopicIdEqualTo(topicId).andIsDeletedEqualTo(false);
            topicList.get(0).setNumOfComments(commentMapper.countByExample(commentExample));
            List<Comment> commentList = commentMapper.getCommentsOfTopic(topicId,(page-1)*10);
            for(int i=0; i<commentList.size(); i++){
                Comment temp = commentList.get(i);
                temp.setThumbCs(getThumbCs(temp.getCommentId()));
                temp.setThumbed(ifThumbCed(userId, temp.getCommentId()));
            }
            topicList.get(0).setComments(commentList);
            return topicList.get(0);
        }
        return null;
    }

    @Override
    public String writeNewTopic(Topic topic) {
        Date now = new Date();
        topic.setFirstSent(now);
        topic.setLastModified(now);
        topicMapper.insertSelective(topic);
        return "success";
    }

    @Override
    public String modifyMyTopic(Topic topic) {
        TopicExample topicExample = new TopicExample();
        topicExample.createCriteria().andTopicIdEqualTo(topic.getTopicId()).andIsDeletedEqualTo(false);
        List<Topic> topicInDB = topicMapper.selectByExample(topicExample);
        if(topicInDB.size()==0){
            return "no such topic";
        }
        Date now = new Date();
        topic.setLastModified(now);
        //按照topicExample选定的元组，以topic中不为null的属性来更新
        topicMapper.updateByExampleSelective(topic, topicExample);
        return "success";
    }

    @Override
    public String deleteTopic(long topicId) {
        TopicExample topicExample = new TopicExample();
        topicExample.createCriteria().andTopicIdEqualTo(topicId).andIsDeletedEqualTo(false);
        if(topicMapper.selectByExample(topicExample).size()>0){
            Topic topic = new Topic();
            topic.setIsDeleted(true);
            topic.setDeletedByUser(true);
            topicMapper.updateByExampleSelective(topic, topicExample);
            return "success";
        }
        else{
            return "no such topics to delete";
        }
    }

    @Override
    public String writeNewComment(Comment comment) {
        Date now = new Date();
        comment.setFirstSent(now);
        comment.setLastModified(now);
        commentMapper.insertSelective(comment);
        return "success";
    }

    @Override
    public String modifyMyComment(Comment comment){
        CommentExample commentExample = new CommentExample();
        commentExample.createCriteria().andCommentIdEqualTo(comment.getTopicId()).andIsDeletedEqualTo(false);
        List<Comment> commentInDB = commentMapper.selectByExample(commentExample);
        if(commentInDB.size()==0){
        return "no such comment";
    }
    Date now = new Date();
        comment.setLastModified(now);
        //按照commentExample选定的元组，以comment中不为null的属性来更新
        commentMapper.updateByExampleSelective(comment, commentExample);
        return "success";
    }

    @Override
    public String deleteComment(long commentId) {
        CommentExample commentExample = new CommentExample();
        commentExample.createCriteria().andCommentIdEqualTo(commentId).andIsDeletedEqualTo(false);
        if(commentMapper.selectByExample(commentExample).size()>0){
            Comment comment = new Comment();
            comment.setIsDeleted(true);
            comment.setDeleteByUser(true);
            commentMapper.updateByExampleSelective(comment, commentExample);
            return "success";
        }
        else{
            return "no such comments to delete";
        }
    }


    @Override
    public int getThumbCs(long commentId) {
        ThumbCExample thumbCExample = new ThumbCExample();
        thumbCExample.createCriteria().andCommentIdEqualTo(commentId);
        Integer thumbCs = commentMapper.getThumbCs(commentId);
        return  thumbCs;
    }

    @Override
    public int getThumbTs(long topicId) {
        ThumbTExample thumbTExample = new ThumbTExample();
        thumbTExample.createCriteria().andTopicIdEqualTo(topicId);
        Integer thumbTs = topicMapper.getThumbTs(topicId);
        return thumbTs;
    }

    @Override
    public boolean ifThumbCed(long userId, long commentId) {
        ThumbCExample thumbCExample = new ThumbCExample();
        thumbCExample.createCriteria().andUserIdEqualTo(userId).andCommentIdEqualTo(commentId);
        List<ThumbC> thumbCs = thumbCMapper.selectByExample(thumbCExample);
        return thumbCs.size()>0;
    }

    @Override
    public boolean ifThumbTed(long userId, long topicId) {
        ThumbTExample thumbTExample = new ThumbTExample();
        thumbTExample.createCriteria().andUserIdEqualTo(userId).andTopicIdEqualTo(topicId);
        List<ThumbT> thumbTs = thumbTMapper.selectByExample(thumbTExample);
        return thumbTs.size()>0;
    }

    @Override
    public boolean ThumbC(long userId, long commentId) {
        ThumbCExample thumbCExample = new ThumbCExample();
        thumbCExample.createCriteria().andUserIdEqualTo(userId).andCommentIdEqualTo(commentId);
        List<ThumbC> thumbCs = thumbCMapper.selectByExample(thumbCExample);
        if(thumbCs.size()==0){
            ThumbC thumbC = new ThumbC();
            thumbC.setCommentId(commentId);
            thumbC.setUserId(userId);
            thumbCMapper.insertSelective(thumbC);
            return true;
        }
        else{
            thumbCMapper.deleteByPrimaryKey(thumbCs.get(0).getThumbcId());
            return false;
        }
    }

    @Override
    public boolean ThumbT(long userId, long topicId) {
        ThumbTExample thumbTExample = new ThumbTExample();
        thumbTExample.createCriteria().andUserIdEqualTo(userId).andTopicIdEqualTo(topicId);
        List<ThumbT> thumbTs = thumbTMapper.selectByExample(thumbTExample);
        if(thumbTs.size()==0){
            ThumbT thumbT = new ThumbT();
            thumbT.setTopicId(topicId);
            thumbT.setUserId(userId);
            thumbTMapper.insertSelective(thumbT);
            return true;
        }
        else{
            thumbTMapper.deleteByPrimaryKey(thumbTs.get(0).getThumbtId());
            return false;
        }
    }

    @Override
    public List<Topic> getMyTopics(long userId) {
        User userInDB = userMapper.getMyTopics(userId).get(0);
        if (userInDB.getMyTopic().size()>0){
            return userInDB.getMyTopic();
        }
        else{
            return null;
        }
    }

    @Override
    public List<Comment> getMyComments(long userId) {
        User userInDB = userMapper.getMyComments(userId).get(0);
        if (userInDB.getMyComment().size()>0){
            return userInDB.getMyComment();
        }
        else{
            return null;
        }
    }
}
