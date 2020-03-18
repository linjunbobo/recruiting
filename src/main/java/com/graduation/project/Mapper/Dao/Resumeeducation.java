package com.graduation.project.Mapper.Dao;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "resumeeducation")
@ApiModel("教育背景表")
public class Resumeeducation {
    @Id
    @Column(name = "resumeEducationId")
    @ApiModelProperty(notes = "教育背景表ID")
    private  Integer   resumeEducationId;

    @Column(name = "school")
    @ApiModelProperty(notes = "毕业院校")
    private  String    school;

    @Column(name = "profession")
    @ApiModelProperty(notes = "专业")
    private  String    profession;

    @Column(name = "resumeBaseInfoId")
    @ApiModelProperty(notes = "简历基础表")
    private  Integer    resumeBaseInfoId;



    @Column(name = "startTime")
    @ApiModelProperty(notes = "开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;

    @Column(name = "endTime")
    @ApiModelProperty(notes = "结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;


}
