package com.graduation.project.Controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.DynamicParameter;
import com.github.xiaoymin.knife4j.annotations.DynamicResponseParameters;
import com.graduation.project.Mapper.Dao.Jobapply;
import com.graduation.project.Mapper.Dao.Jobinfo;
import com.graduation.project.Mapper.Dao.UnifiedRespond;
import com.graduation.project.Mapper.Dao.User;
import com.graduation.project.Mapper.JobapplyMapper;
import com.graduation.project.Mapper.JobinfoMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tk.mybatis.mapper.entity.Example;
import tk.mybatis.mapper.util.StringUtil;

import javax.annotation.Resource;
import javax.websocket.server.PathParam;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/jobInfo")
@Api(tags = "职位管理")
public class JobInfoController {
    @Resource
    private JobinfoMapper jobinfoMapper;
    @Resource
    private JobapplyMapper jobapplyMapper;

    @ApiOperation(value = "查找所有的职位")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "page", value = "页数"),
            @ApiImplicitParam(name = "limit", value = "数量"),
            @ApiImplicitParam(name = "search", value = "搜索", example = "为\"\"则为不搜索")

    })

    @ApiOperationSupport(
            responses = @DynamicResponseParameters(properties = {
                    @DynamicParameter(name = "count", value = "数据数量", example = "10"),
                    @DynamicParameter(name = "data", value = "职位信息", dataTypeClass = Jobinfo.class),
            })
    )
    @GetMapping("/getAllJobinfo/")
    public JSONObject getAllJobinfo( int page,  int limit,  String search) {
        JSONObject jsonObject = new JSONObject();
        if (StringUtil.isEmpty(search)) {

            Example example = new Example(Jobinfo.class);
            example.orderBy("updateTime").desc();
            PageHelper.startPage(page, limit);
            List<Jobinfo> jobinfos = jobinfoMapper.selectByExample(example);
            jsonObject.put("data", jobinfos);
            PageInfo<Jobinfo> pageInfo = new PageInfo<>(jobinfos);
            jsonObject.put("count", pageInfo.getTotal());

            return jsonObject;
        } else {
            PageHelper.startPage(page, limit);
            List<Jobinfo> jobinfos = jobinfoMapper.getJobInfo(search);
            PageInfo<Jobinfo> pageInfo = new PageInfo<>(jobinfos);
            jsonObject.put("data", jobinfos);
            jsonObject.put("count", pageInfo.getTotal());
            return jsonObject;
        }


    }

    @ApiOperation(value = "根据Id查找职位信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "jobInfoId", value = "职位ID")
    })
    @GetMapping("/getJobinfoById")
    public Jobinfo getJobinfoById( Integer jobInfoId) {

        return jobinfoMapper.selectByPrimaryKey(jobInfoId);
    }

    @ApiOperation(value = "添加职位信息")
    @PostMapping("/addJobInfo")
    public UnifiedRespond addJobInfo(@RequestBody Jobinfo jobinfo) {
        jobinfo.setUpdateTime(new Date());
        jobinfoMapper.insert(jobinfo);
        return UnifiedRespond.returnThis("success", "添加成功");
    }

    @ApiOperation(value = "根据Id删除职位信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "jobInfoId", value = "职位ID")
    })
    @DeleteMapping("/deleteJobInfo")
    @Transactional
    public UnifiedRespond deleteJobInfo( Integer jobInfoId) {
        jobinfoMapper.deleteByPrimaryKey(jobInfoId);
        Example exp = new Example(Jobapply.class);
        exp.createCriteria().andEqualTo("jobInfoId",jobInfoId);
        jobapplyMapper.deleteByExample(exp);

        return UnifiedRespond.returnThis("success", "删除成功");
    }



}
