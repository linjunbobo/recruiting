package com.graduation.project.Mapper;

import com.graduation.project.Mapper.Dao.Jobapply;
import com.graduation.project.Mapper.Dao.Jobinfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface JobapplyMapper extends tk.mybatis.mapper.common.Mapper<Jobapply> {

}
