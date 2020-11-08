package com.feitian.forum.mapper;

import com.feitian.forum.domain.ThumbT;
import com.feitian.forum.domain.ThumbTExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface ThumbTMapper {
    long countByExample(ThumbTExample example);

    int deleteByExample(ThumbTExample example);

    int deleteByPrimaryKey(Long thumbtId);

    int insert(ThumbT record);

    int insertSelective(ThumbT record);

    List<ThumbT> selectByExample(ThumbTExample example);

    ThumbT selectByPrimaryKey(Long thumbtId);

    int updateByExampleSelective(@Param("record") ThumbT record, @Param("example") ThumbTExample example);

    int updateByExample(@Param("record") ThumbT record, @Param("example") ThumbTExample example);

    int updateByPrimaryKeySelective(ThumbT record);

    int updateByPrimaryKey(ThumbT record);
}