package com.graduation.project.Mapper.Dao;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonFormat;
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
@Table(name = "jobapply")
public class Jobapply {
    @Id
    @Column(name = "jobApplyId")
    private  Integer    jobApplyId;

    @Column(name = "jobInfoId")
    private  Integer    jobInfoId;
    @Column(name = "resumbaseinfoId")
    private  Integer    resumbaseinfoId;
    @Column(name = "state")
    private  Integer    state;

   // @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @JSONField (format="yyyy-MM-dd HH:mm:ss")
    @Column(name = "updateTime")
    private Date updateTime;

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}
