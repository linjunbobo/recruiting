package com.graduation.project.Mapper.Dao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

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

    
}
