package com.graduation.project.Mapper.Dao;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user")
@ApiModel("用户表")
public class User {
    @Column(name = "userId")
    @Id
    @ApiModelProperty(required = true,notes = "用户ID",example = "1")
    private  Integer    userId;
    @Column(name = "phone")
    @ApiModelProperty(required = true,notes = "手机",example = "13415639299")
    private  String    phone;
    @Column(name = "password")
    @ApiModelProperty(required = true,notes = "密码",example = "xxxxx")
    private  String    password;

    @ApiModelProperty(required = true,notes = "用户类型",value ="1.求职责 2.职位提供者 3.系统管理员" ,example = "1")
    @Column(name = "type")
    private  Integer type;

}
