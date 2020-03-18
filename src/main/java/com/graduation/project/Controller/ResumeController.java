package com.graduation.project.Controller;

import com.graduation.project.Mapper.Dao.*;
import com.graduation.project.Mapper.ResumebaseinfoMapper;
import com.graduation.project.Mapper.ResumeeducationMapper;
import com.graduation.project.Mapper.ResumeworkMapper;
import io.swagger.annotations.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;
import tk.mybatis.mapper.entity.Example;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
@RequestMapping("/resume")
@Api(tags = "简历管理")
public class ResumeController {
    @Resource
    private ResumebaseinfoMapper resumebaseinfoMapper;
    @Resource
    private ResumeeducationMapper resumeeducationMapper;
    @Resource
    private ResumeworkMapper resumeworkMapper;


    @ApiOperation(value = "添加简历")
    @PostMapping("/addResume")
    @Transactional
    public UnifiedRespond addResume(@RequestBody ResumeBaseInfo resumeBaseInfo, @ApiIgnore HttpSession session) {

        if (resumeBaseInfo.getUserId() == null) {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return UnifiedRespond.returnThis("false", "未登录");
            } else {
                resumeBaseInfo.setUserId(user.getUserId());
            }
        }
        resumebaseinfoMapper.insertSelective(resumeBaseInfo);
        //返回主键ID
        int baseInfoId = resumeBaseInfo.getResumeBaseInfoId();

        //教育经历
        List<Resumeeducation> resumeeducationList = resumeBaseInfo.getResumeeducationList();
        for (Resumeeducation resumeeducation : resumeeducationList) {
            resumeeducation.setResumeBaseInfoId(baseInfoId);
            resumeeducationMapper.insertSelective(resumeeducation);

        }
        //工作经历
        List<Resumework> resumeworkList = resumeBaseInfo.getResumeworkList();
        for (Resumework resumework : resumeworkList) {
            resumework.setResumeBaseInfoId(baseInfoId);
            resumeworkMapper.insert(resumework);
        }


        return UnifiedRespond.returnThis("success", "添加成功");

    }
    @ApiOperation(value = "根据用户ID查找简历")
    @GetMapping("/getResumeByUserId")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "用户Id" ),
    })
    @Transactional
    public ResumeBaseInfo getResumeByUserId(int userId) {
        ResumeBaseInfo resumeBaseInfo = new ResumeBaseInfo();
        resumeBaseInfo.setUserId(userId);

        ResumeBaseInfo resumeBaseInfo1 = resumebaseinfoMapper.selectOne(resumeBaseInfo);
        if (resumeBaseInfo1 != null){

        Resumework resumework = new Resumework();
        resumework.setResumeBaseInfoId(resumeBaseInfo1.getResumeBaseInfoId());
        List<Resumework> resumeworkList = resumeworkMapper.select(resumework);
        if (!resumeworkList.isEmpty())
        resumeBaseInfo1.setResumeworkList(resumeworkList);

        Resumeeducation resumeeducation = new Resumeeducation();
        resumeeducation.setResumeBaseInfoId(resumeBaseInfo1.getResumeBaseInfoId());
        List<Resumeeducation> resumeeducationList=resumeeducationMapper.select(resumeeducation);
        if (!resumeeducationList.isEmpty())
        resumeBaseInfo1.setResumeeducationList(resumeeducationList);


        }

        return resumeBaseInfo1;

    }

    @ApiOperation(value = "根据简历ID查找简历")
    @GetMapping("/getResumeById")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "resumeBaseInfoId", value = "简历Id" ),
    })
    @Transactional
    public ResumeBaseInfo getResumeById(int resumeBaseInfoId) {


        ResumeBaseInfo resumeBaseInfo1 = resumebaseinfoMapper.selectByPrimaryKey(resumeBaseInfoId);
        if (resumeBaseInfo1 != null){
            Resumework resumework = new Resumework();
            resumework.setResumeBaseInfoId(resumeBaseInfo1.getResumeBaseInfoId());
            List<Resumework> resumeworkList = resumeworkMapper.select(resumework);
            if (!resumeworkList.isEmpty())
                resumeBaseInfo1.setResumeworkList(resumeworkList);

            Resumeeducation resumeeducation = new Resumeeducation();
            resumeeducation.setResumeBaseInfoId(resumeBaseInfo1.getResumeBaseInfoId());
            List<Resumeeducation> resumeeducationList=resumeeducationMapper.select(resumeeducation);
            if (!resumeeducationList.isEmpty())
                resumeBaseInfo1.setResumeeducationList(resumeeducationList);

        }

        return resumeBaseInfo1;

    }


    @ApiOperation(value = "更新简历信息")
    @PostMapping("/updateResume")

    @Transactional
    public UnifiedRespond updateResume(@RequestBody ResumeBaseInfo resumeBaseInfo) {
        resumebaseinfoMapper.updateByPrimaryKeySelective(resumeBaseInfo);

       int resumeBaseInfoId = resumeBaseInfo.getResumeBaseInfoId();
        Example example = new Example(Resumework.class);
        example.createCriteria().andEqualTo("resumeBaseInfoId",resumeBaseInfoId);
        resumeworkMapper.deleteByExample(example);
        List<Resumework> resumeworkList = resumeBaseInfo.getResumeworkList();
        for (Resumework resumework : resumeworkList) {
            resumework.setResumeBaseInfoId(resumeBaseInfoId);
            resumeworkMapper.insertSelective(resumework);
        }
        Example example2 = new Example(Resumeeducation.class);
        example.createCriteria().andEqualTo("resumeBaseInfoId",resumeBaseInfoId);
        resumeeducationMapper.deleteByExample(example2);

       List<Resumeeducation> resumeeducationList =  resumeBaseInfo.getResumeeducationList();
        for (Resumeeducation resumeeducation : resumeeducationList) {
            resumeeducation.setResumeBaseInfoId(resumeBaseInfoId);
            resumeeducationMapper.insertSelective(resumeeducation);
        }
        return UnifiedRespond.returnThis("success","更新成功");

    }


}
