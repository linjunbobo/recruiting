package com.graduation.project.respone;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@ApiModel("信息返回")

public class ControllerRespone<T> implements Serializable {
    @ApiModelProperty(notes = "时间")
    private String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    @ApiModelProperty(value = "错误码", name = "错误码")
    private int status;
    @ApiModelProperty(value = "错误码描述", name = "错误码描述")
    private String msg;
    @ApiModelProperty(value = "数据对象", name = "数据对象")
    private T data;


    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public ControllerRespone(){}
    public ControllerRespone(T data){
        msg = "";

        ControllerRespone unifiedShow  =  new ControllerRespone();
        if (data == null) {

            unifiedShow.setMsg("操作失败");
            unifiedShow.setStatus(4);
            unifiedShow.setData(new ArrayList());

        }  else {

            unifiedShow.setMsg("");
            unifiedShow.setStatus(0);
            unifiedShow.setData(data);
        }
    }





}