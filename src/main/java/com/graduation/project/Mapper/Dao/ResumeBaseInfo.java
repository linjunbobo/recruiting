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
@Table(name = "resumebaseinfo")
@ApiModel("简历基础信息表")
public class ResumeBaseInfo {
    @Id
    @Column(name = "resumeBaseInfoId")
    @GeneratedValue(generator = "JDBC")
    @ApiModelProperty(notes = "简历Id")
    private  Integer    resumeBaseInfoId;

    @Column(name = "userId")
    @ApiModelProperty(notes = "用户ID")
    private  Integer    userId;

    @Column(name = "name")
    @ApiModelProperty(notes = "姓名")
    private  String    name;

    @Column(name = "birth")
    @ApiModelProperty(notes = "出生日期")
    private Date birth;

    @Column(name = "phone")
    @ApiModelProperty(notes = "手机")
    private  String    phone;

    @Column(name = "emile")
    @ApiModelProperty(notes = "邮箱")
    private  String    email;

    @Column(name = "picture")
    @ApiModelProperty(notes = "照片地址")
    private String picture;

    @Column(name = "evaluation")
    @ApiModelProperty(notes = "自我评价")
    private  String    evaluation;

    @Column(name = "honor")
    @ApiModelProperty(notes = "荣誉")
    private  String    honor;

    @Transient
    @ApiModelProperty(notes = "教育背景")
    private List<Resumeeducation> resumeeducationList ;

    @Transient
    @ApiModelProperty(notes = "工作经历")
    private  List<Resumework> resumeworkList;



}
