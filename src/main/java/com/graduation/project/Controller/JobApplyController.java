package com.graduation.project.Controller;

import com.graduation.project.Mapper.Dao.*;
import com.graduation.project.Mapper.JobapplyMapper;
import com.graduation.project.Mapper.ResumebaseinfoMapper;
import com.sun.org.apache.bcel.internal.generic.NEW;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/jobaApply")
@Api(tags = "职位申请管理")
public class JobApplyController {
    @Resource
    private JobapplyMapper jobapplyMapper;
    @Resource
    private ResumebaseinfoMapper resumebaseinfoMapper;

    @ApiOperation(value = "申请职位")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "jobInfoId", value = "职位ID"),
            @ApiImplicitParam(name = "userId", value = "用户ID")
    })
    @GetMapping("/AddJobApply")
    public UnifiedRespond AddJobApply(Integer jobInfoId, Integer userId) {
        Jobapply jobapply = new Jobapply();
        jobapply.setJobInfoId(jobInfoId);

        ResumeBaseInfo resumeBaseInfo = new ResumeBaseInfo();
        resumeBaseInfo.setUserId(userId);
        ResumeBaseInfo resumeBase = resumebaseinfoMapper.selectOne(resumeBaseInfo);

        jobapply.setResumbaseinfoId(resumeBase.getResumeBaseInfoId());
       List<Jobapply> jobapplies = jobapplyMapper.select(jobapply);
       if (jobapplies.isEmpty()){
           jobapply.setState(1);
        jobapplyMapper.insertSelective(jobapply);

           return UnifiedRespond.returnThis("success", "申请成功");
       }else {
           return UnifiedRespond.returnThis("false", "申请失败,已经申请过了");
       }

    }

    @ApiOperation(value = "更新职位申请状态")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "jobapplyId", value = "职位申请表ID"),
            @ApiImplicitParam(name = "state", value = "状态1:未读,2:已读,3:已通知")
    })
    @GetMapping("/updateJobApplyState")
    public UnifiedRespond updateJobApplyState(Integer jobapplyId, Integer state) {
        Jobapply jobapply = new Jobapply();
        jobapply.setJobApplyId(jobapplyId);
        jobapply.setState(state);

        jobapplyMapper.updateByPrimaryKeySelective(jobapply);

        return UnifiedRespond.returnThis("success", "操作成功");
    }

    @Autowired
    private ResumeController resumeController;

    @ApiOperation(value = "查询投递信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "jobInfoId", value = "职位ID"),

    })

    @GetMapping("/getApply")
    public  List<ResumeSimple> getApply(Integer jobInfoId) {
        Jobapply jobapply = new Jobapply();
        jobapply.setJobInfoId(jobInfoId);
        List<Jobapply> jobapplys = jobapplyMapper.select(jobapply);

        List<ResumeSimple> resumeSimples = new ArrayList<>();
        for (Jobapply jobapply1 : jobapplys) {
            ResumeSimple resumeSimple = new ResumeSimple();

            Integer resumbaseinfoId = jobapply1.getResumbaseinfoId();
            ResumeBaseInfo resumeBaseInfo = resumeController.getResumeById(resumbaseinfoId);
            resumeSimple.setName(resumeBaseInfo.getName());
            resumeSimple.setEmile(resumeBaseInfo.getEmile());
            resumeSimple.setPhone(resumeBaseInfo.getPhone());
            List<Resumeeducation> resumeeducationList = resumeBaseInfo.getResumeeducationList();
            StringBuilder profession = new StringBuilder();
            StringBuilder school = new StringBuilder();
            for (Resumeeducation resumeeducation : resumeeducationList) {
                profession.append(resumeeducation.getProfession());
                profession.append(" ");
                school.append( resumeeducation.getSchool());
                school.append(" ");


            }
            resumeSimple.setProfession(profession.toString());
            resumeSimple.setResumeBaseInfoId(resumbaseinfoId);
            resumeSimple.setSchool(school.toString());
            resumeSimples.add(resumeSimple);



        }


        return resumeSimples;
    }

}
