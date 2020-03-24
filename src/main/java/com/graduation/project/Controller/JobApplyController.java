package com.graduation.project.Controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.graduation.project.Mapper.*;
import com.graduation.project.Mapper.Dao.*;
import com.sun.org.apache.bcel.internal.generic.NEW;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tk.mybatis.mapper.entity.Example;

import javax.annotation.Resource;
import javax.xml.crypto.Data;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/jobaApply")
@Api(tags = "职位申请管理")
public class JobApplyController {
    @Resource
    private JobapplyMapper jobapplyMapper;
    @Resource
    private ResumebaseinfoMapper resumebaseinfoMapper;
    @Resource
    private JobinfoMapper jobinfoMapper;

    @Resource
    private ResumeeducationMapper resumeeducationMapper;
    @Resource
    private ResumeworkMapper resumeworkMapper;

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
        if (resumeBase==null){
            return UnifiedRespond.returnThis("false", "请创建简历！");
        }
        jobapply.setResumbaseinfoId(resumeBase.getResumeBaseInfoId());
        List<Jobapply> jobapplies = jobapplyMapper.select(jobapply);
        if (jobapplies.isEmpty()) {
            jobapply.setState(1);
            jobapply.setUpdateTime(new Date());
            jobapplyMapper.insertSelective(jobapply);

            return UnifiedRespond.returnThis("success", "申请成功");
        } else {
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
    public UnifiedShow getApply(Integer jobInfoId) {
        Jobapply jobapply = new Jobapply();
        jobapply.setJobInfoId(jobInfoId);
        List<Jobapply> jobapplys = jobapplyMapper.select(jobapply);

        List<ResumeSimple> resumeSimples = new ArrayList<>();
        for (Jobapply jobapply1 : jobapplys) {
            ResumeSimple resumeSimple = new ResumeSimple();

            Integer resumbaseinfoId = jobapply1.getResumbaseinfoId();

            ResumeBaseInfo resumeBaseInfo =   getResumeById(resumbaseinfoId);
            resumeSimple.setName(resumeBaseInfo.getName());
            resumeSimple.setEmile(resumeBaseInfo.getEmail());
            resumeSimple.setPhone(resumeBaseInfo.getPhone());
            List<Resumeeducation> resumeeducationList = resumeBaseInfo.getResumeeducationList();
            StringBuilder profession = new StringBuilder();
            StringBuilder school = new StringBuilder();
            for (Resumeeducation resumeeducation : resumeeducationList) {
                profession.append(resumeeducation.getProfession());
                profession.append(" ");
                school.append(resumeeducation.getSchool());
                school.append(" ");


            }
            resumeSimple.setProfession(profession.toString());
            resumeSimple.setResumeBaseInfoId(resumbaseinfoId);
            resumeSimple.setSchool(school.toString());
            resumeSimples.add(resumeSimple);


        }


        return new UnifiedShow().show(resumeSimples);
    }
    private ResumeBaseInfo getResumeById(int resumeBaseInfoId) {


        ResumeBaseInfo resumeBaseInfo1 = resumebaseinfoMapper.selectByPrimaryKey(resumeBaseInfoId);
        if (resumeBaseInfo1 != null) {
            Resumework resumework = new Resumework();
            resumework.setResumeBaseInfoId(resumeBaseInfo1.getResumeBaseInfoId());
            List<Resumework> resumeworkList = resumeworkMapper.select(resumework);
            if (!resumeworkList.isEmpty())
                resumeBaseInfo1.setResumeworkList(resumeworkList);

            Resumeeducation resumeeducation = new Resumeeducation();
            resumeeducation.setResumeBaseInfoId(resumeBaseInfo1.getResumeBaseInfoId());
            List<Resumeeducation> resumeeducationList = resumeeducationMapper.select(resumeeducation);
            if (!resumeeducationList.isEmpty())
                resumeBaseInfo1.setResumeeducationList(resumeeducationList);

        }

        return resumeBaseInfo1;
    }
    @ApiOperation(value = "根据用户ID 查找申请职位")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "职位申请表ID")

    })
    @GetMapping("/getJobApplyByuserId")
    public UnifiedShow getJobApplyByuserId(Integer userId) {
        ResumeBaseInfo resumeBaseInfo = new ResumeBaseInfo();
        resumeBaseInfo.setUserId(userId);

        List<ResumeBaseInfo> resumeBaseInfos = resumebaseinfoMapper.select(resumeBaseInfo);
        JSONArray jsonArray = new JSONArray();
        if (resumeBaseInfos.isEmpty()) {
            return new UnifiedShow().show(resumeBaseInfos);
        } else {
            Integer resumeBaseInfoId = resumeBaseInfos.get(0).getResumeBaseInfoId();
            Example ex = new Example(Jobapply.class);
            ex.createCriteria().andEqualTo("resumbaseinfoId",resumeBaseInfoId);
            List<Jobapply> listjobApp = jobapplyMapper.selectByExample(ex);

            for (Jobapply jobapply : listjobApp) {
                JSONObject jsonObject = new JSONObject();
                Integer jobID = jobapply.getJobInfoId();
                Jobinfo jobinfo =jobinfoMapper.selectByPrimaryKey(jobID);

                jsonObject.put("position",jobinfo.getPosition());
                jsonObject.put("updateTime",jobapply.getUpdateTime());
                jsonObject.put("state",jobapply.getState());
                jsonArray.add(jsonObject);

            }

        }

        return new UnifiedShow().show(jsonArray);
    }

}
