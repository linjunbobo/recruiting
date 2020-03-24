package com.graduation.project.Controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.DynamicParameter;
import com.github.xiaoymin.knife4j.annotations.DynamicParameters;
import com.github.xiaoymin.knife4j.annotations.DynamicResponseParameters;
import com.graduation.project.Mapper.Dao.UnifiedRespond;

import com.graduation.project.Mapper.Dao.UnifiedShow;
import com.graduation.project.Mapper.Dao.User;
import com.graduation.project.Mapper.UserMapper;
import com.graduation.project.respone.ControllerRespone;
import io.swagger.annotations.*;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@Api(tags = "用户管理")
public class UserController {

    @Resource
    private UserMapper userMapper;


    @DynamicParameters(name = "jsonObject",properties = {
            @DynamicParameter(name = "phone",value = "手机"),
            @DynamicParameter(name = "password",value = "密码"),
            @DynamicParameter(name = "type",value = "1.求职责 2.职位提供者 3.系统管理员"),
    })
    @ApiOperation(value = "注册信息", notes = "添加用户")
    @PostMapping("/addUser")
    public UnifiedRespond addUser( @RequestBody JSONObject jsonObject) {
        String phone =jsonObject.get("phone").toString();
        String password=  jsonObject.get("password").toString();
        Integer type =(Integer)jsonObject.get("type");
        User user = new User();
        user.setPhone(phone);
        List<User> users = userMapper.select(user);
        if (users.isEmpty()) {
            user.setPassword(password);
            user.setType(type);
            userMapper.insert(user);
            return UnifiedRespond.returnThis("success", "注册成功");
        } else {
            return UnifiedRespond.returnThis("false", "用户已存在");

        }
    }
    @ApiImplicitParams({
            @ApiImplicitParam(name = "page", value = "页数" ),
            @ApiImplicitParam(name = "limit", value = "数量")

    })
//    @ApiOperationSupport(
//            responses = @DynamicResponseParameters(properties = {
//                    @DynamicParameter(name = "timestamp",value = "时间"),
//                    @DynamicParameter(name = "status",value = "状态码"),
//                    @DynamicParameter(name = "msg",value = "状态信息"),
//                    @DynamicParameter(name = "data",value = "数据信息",dataTypeClass =JSONObject.class )
//
//            })
//    )
    @ApiOperation(value = "查找所有用户信息")
    @GetMapping("/getAllUser")
    public UnifiedShow selectAllUser(int page , int limit ) {
        JSONObject jsonObject = new JSONObject();

        PageHelper.startPage(page,limit);
        List<User> users = userMapper.selectAll();

        PageInfo<User> pageInfo =new PageInfo<>(users);
        jsonObject.put("data",users);
        jsonObject.put("count",  pageInfo.getTotal());


        return    new UnifiedShow().show(jsonObject);

    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "用户ID", required = true, paramType = "path", example = "1")
    })
    @ApiOperation(value = "删除用户")
    @GetMapping("/deleteUser")
    public UnifiedRespond deleteUser( int userId) {

        int users = userMapper.deleteByPrimaryKey(userId);

        return UnifiedRespond.returnThis("success", "删除成功");

    }

    @ApiOperation(value = "更新用户信息")
    @PutMapping("/updateUser")
    public UnifiedRespond updateUser(@RequestBody User user) {

        int users = userMapper.updateByPrimaryKeySelective(user);

        return UnifiedRespond.returnThis("success", "更新成功");

    }

    @ApiOperation(value = "获取登录用户信息")
    @GetMapping("/getLoginInfo")
    public UnifiedShow getLoginInfo(@ApiIgnore HttpSession session) {

        User user = (User) session.getAttribute("user");
        return new UnifiedShow().show(user);


    }
    @ApiOperation(value = "用户退出")

    @GetMapping("/logout")
    public UnifiedRespond logout(@ApiIgnore HttpSession session) {

        session.removeAttribute("user");
        return UnifiedRespond.returnThis("success","退出成功");

    }
    @ApiOperation(value = "用户登录")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "phone", value = "手机", required = true, dataType = "String", paramType = "path", example = "13415630200"),
            @ApiImplicitParam(name = "password", value = "密码", required = true, dataType = "String", paramType = "path", example = "xxx")

    })
    @GetMapping("/login")
    public UnifiedShow login( @RequestParam String phone ,@RequestParam String password ,@ApiIgnore HttpSession session ) {
       User user = new User();
       user.setPhone(phone);
       user.setPassword(password);
        List<User> users = userMapper.select(user);
        if (users.isEmpty()){
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("userId",null);
            jsonObject.put("type",null);
            jsonObject.put("status","false");
            jsonObject.put("msg","账号密码错误");
            return new UnifiedShow().show(jsonObject);
        }else {
            session.setAttribute("user",users.get(0));
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("userId",users.get(0).getUserId());
            jsonObject.put("type",users.get(0).getType());
            jsonObject.put("userName",users.get(0).getPhone());
            jsonObject.put("status","success");
            jsonObject.put("msg","登录成功");
          return new UnifiedShow().show(jsonObject);
        }

    }


}
