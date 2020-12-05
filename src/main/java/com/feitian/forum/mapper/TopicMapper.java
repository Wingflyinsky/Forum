package com.feitian.forum.mapper;

import com.feitian.forum.domain.Topic;
import com.feitian.forum.domain.TopicExample;
import java.util.List;

import com.feitian.forum.mapper.extend.TopicExtendMapper;
import org.apache.ibatis.annotations.Param;

public interface TopicMapper extends TopicExtendMapper {
    long countByExample(TopicExample example);

    int deleteByExample(TopicExample example);

    int deleteByPrimaryKey(Long topicId);

    int insert(Topic record);

    int insertSelective(Topic record);

    List<Topic> selectByExample(TopicExample example);

    Topic selectByPrimaryKey(Long topicId);

    int updateByExampleSelective(@Param("record") Topic record, @Param("example") TopicExample example);

    int updateByExample(@Param("record") Topic record, @Param("example") TopicExample example);

    int updateByPrimaryKeySelective(Topic record);

    int updateByPrimaryKey(Topic record);
}