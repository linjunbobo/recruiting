package com.graduation.project.Mapper;

import com.graduation.project.Mapper.Dao.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserMapper extends tk.mybatis.mapper.common.Mapper<User> {

}
