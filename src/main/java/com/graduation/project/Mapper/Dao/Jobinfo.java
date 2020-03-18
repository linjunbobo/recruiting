package com.graduation.project.Mapper.Dao;

import com.fasterxml.jackson.annotation.JsonFormat;
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
@Table(name = "jobinfo")
@ApiModel("岗位信息表")
public class Jobinfo {
    @Id
    @Column(name = "jobInfoId")
    @ApiModelProperty(notes = "岗位信息表")
    private  Integer    jobInfoId;

    @Column(name = "company")
    @ApiModelProperty(notes = "公司名")
    private  String    company;

    @ApiModelProperty(notes = "职位")
    @Column(name = "position")
    private  String    position;

    @ApiModelProperty(notes = "工资")
    @Column(name = "salary")
    private  String    salary;

    @ApiModelProperty(notes = "工作地点")
    @Column(name = "place")
    private  String    place;

    @ApiModelProperty(notes = "工作几年")
    @Column(name = "workAge")
    private  String    workAge;

    @ApiModelProperty(notes = "岗位职责")
    @Column(name = "responsibility")
    private  String    responsibility;

    @ApiModelProperty(notes = "岗位要求")
    @Column(name = "requirement")
    private  String  requirement;

    @ApiModelProperty(notes = "更新时间")
    @Column(name = "updateTime")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private  Date updateTime;
    @ApiModelProperty(notes = "发布人")
    @Column(name = "userId")
    private Integer userId;


}
