package com.graduation.project.Mapper.Dao;



import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author
 * @date
 * Web Api 统一格式输出类
 */
@ApiModel("返回操作成功是否")
@Data
public class UnifiedRespond {
    @ApiModelProperty(notes = "现在时间",example = "")
    private String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    @ApiModelProperty(notes = "操作结果",example = "success/false")
    private String status;
    @ApiModelProperty(notes = "返回信息",example = "XX成功")
    private String msg;


    public UnifiedRespond() {

    }

    public UnifiedRespond(String status, String msg) {
        this.status = status;
        this.msg = msg;
    }

    public static UnifiedRespond returnThis (String status, String msg){
        UnifiedRespond unifiedRespond = new UnifiedRespond(status,msg);
      //  unifiedRespond.setMsg(msg);
     //   unifiedRespond.setStatus(status);
        return unifiedRespond;
    }
}