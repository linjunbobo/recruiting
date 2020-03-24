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

@ApiModel("工作经历表")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "resumework")
public class Resumework {
    @Id
    @Column(name = "resumeWorkId")
    @ApiModelProperty(notes = "工作经历表ID")
    private  Integer    resumeWorkId;

    @Column(name = "company")
    @ApiModelProperty(notes = "公司名字")
    private  String    company;

    @Column(name = "resumeBaseInfoId")
    @ApiModelProperty(notes = "简历表Id")
    private  Integer    resumeBaseInfoId;

    @Column(name = "work")
    @ApiModelProperty(notes = "职位")
    private  String    work;

    @Column(name = "position")
    @ApiModelProperty(notes = "负责工作")
    private  String    position;

    @Column(name = "startTime")
    @ApiModelProperty(notes = "开始时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;

    @Column(name = "endTime")
    @ApiModelProperty(notes = "结束时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;

    @Column(name = "time")
    @ApiModelProperty(notes = "时间")
    private  String    time ;


}
