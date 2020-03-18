package com.graduation.project.Controller;

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

    @ApiImplicitParams({
            @ApiImplicitParam(name = "phone", value = "手机", required = true, dataType = "String", paramType = "path", example = "13415630200"),
            @ApiImplicitParam(name = "password", value = "密码", required = true, dataType = "String", paramType = "path", example = "xxx"),
            @ApiImplicitParam(name = "type", value = "1.求职责 2.职位提供者 3.系统管理员", required = true, dataType = "int", paramType = "path", example = "1")

    })

    @ApiOperation(value = "注册信息", notes = "添加用户")
    @PostMapping("/addUser")
    public UnifiedRespond addUser( String phone,  String password,  Integer type) {
        User user = new User();
        user.setPhone(phone);
        List<User> users = userMapper.select(user);
        if (users.isEmpty()) {
            user.setPassword(password);
            user.setType(type);
            userMapper.insert(user);
            return UnifiedRespond.returnThis("success", "注册成功");
        } else {
            return UnifiedRespond.returnThis("false", "手机号已经存在");

        }
    }
    @ApiImplicitParams({
            @ApiImplicitParam(name = "page", value = "页数" ),
            @ApiImplicitParam(name = "limit", value = "数量")

    })
    @ApiOperationSupport(
            responses = @DynamicResponseParameters(properties = {
                    @DynamicParameter(name = "count",value = "数据数量",example = "10"),
                    @DynamicParameter(name = "data",value = "用户信息",dataTypeClass = User.class),
            })
    )
    @ApiOperation(value = "查找所有用户信息")
    @GetMapping("/getAllUser")
    public JSONObject selectAllUser( int page , int limit ) {
        JSONObject jsonObject = new JSONObject();

        PageHelper.startPage(page,limit);
        List<User> users = userMapper.selectAll();

        PageInfo<User> pageInfo =new PageInfo<>(users);
        jsonObject.put("data",users);
        jsonObject.put("count",  pageInfo.getTotal());


        return jsonObject;

    }

    @ApiImplicitParams({
            @ApiImplicitParam(name = "userId", value = "用户ID", required = true, paramType = "path", example = "1")
    })
    @ApiOperation(value = "删除用户")
    @DeleteMapping("/deleteUser")
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
    public User getLoginInfo(@ApiIgnore HttpSession session) {

        User user = (User) session.getAttribute("user");
        return user;


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
    public UnifiedRespond login( String phone ,String password ,@ApiIgnore HttpSession session ) {
       User user = new User();
       user.setPhone(phone);
       user.setPassword(password);
        List<User> users = userMapper.select(user);
        if (users.isEmpty()){
            return UnifiedRespond.returnThis("false","账号密码错误");
        }else {
            session.setAttribute("user",users.get(0));
        return UnifiedRespond.returnThis("success","登录成功");
        }

    }


}
