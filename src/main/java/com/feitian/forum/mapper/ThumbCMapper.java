package com.feitian.forum.mapper;

import com.feitian.forum.domain.ThumbC;
import com.feitian.forum.domain.ThumbCExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ThumbCMapper {
    long countByExample(ThumbCExample example);

    int deleteByExample(ThumbCExample example);

    int deleteByPrimaryKey(Long thumbcId);

    int insert(ThumbC record);

    int insertSelective(ThumbC record);

    List<ThumbC> selectByExample(ThumbCExample example);

    ThumbC selectByPrimaryKey(Long thumbcId);

    int updateByExampleSelective(@Param("record") ThumbC record, @Param("example") ThumbCExample example);

    int updateByExample(@Param("record") ThumbC record, @Param("example") ThumbCExample example);

    int updateByPrimaryKeySelective(ThumbC record);

    int updateByPrimaryKey(ThumbC record);
}