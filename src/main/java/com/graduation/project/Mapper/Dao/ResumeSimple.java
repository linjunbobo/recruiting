package com.graduation.project.Mapper.Dao;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

@ApiModel("主要简历信息")
public class ResumeSimple {


    @ApiModelProperty(notes = "简历Id")
    private  Integer    resumeBaseInfoId;

    @ApiModelProperty(notes = "姓名")
    private  String    name;

    @ApiModelProperty(notes = "学校")
    private  String    school;

    @ApiModelProperty(notes = "专业")
    private  String    profession;

    @ApiModelProperty(notes = "邮箱")
    private  String    emile;


    @ApiModelProperty(notes = "手机")
    private String phone;





}
