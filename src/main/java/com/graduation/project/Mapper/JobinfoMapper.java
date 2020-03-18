package com.graduation.project.Mapper;

import com.graduation.project.Mapper.Dao.Jobinfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface JobinfoMapper extends tk.mybatis.mapper.common.Mapper<Jobinfo> {
    @Select("SELECT * FROM jobinfo WHERE place LIKE CONCAT('%',#{search},'%')  UNION SELECT * FROM jobinfo WHERE POSITION LIKE CONCAT('%',#{search},'%') UNION SELECT * FROM jobinfo WHERE company LIKE CONCAT('%',#{search},'%') order by  updateTime desc")
    List<Jobinfo> getJobInfo(String search);
}
