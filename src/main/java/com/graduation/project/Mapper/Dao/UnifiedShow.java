package com.graduation.project.Mapper.Dao;



import io.swagger.annotations.ApiModel;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author
 * @date
 * Web Api 统一格式输出类
 */
@ApiModel("返回内容")
public class UnifiedShow  {

    private String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    private int status;
    private String msg;
    private Object data;


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

    public void setData(Object data) {
        this.data = data;
    }

    public UnifiedShow(){}


    public UnifiedShow show(List<?> list){
        msg = "";
        data = new ArrayList();

        if (list == null) {
            status = 4;
            msg = "操作失败";

        } else if (list.size() == 0) {
            status = 1;
            msg = "无数据";
            data = list;
        } else {
            status = 0;
            data = list;
        }
        return this;
    }


    public UnifiedShow show(Object o) {
        msg = "";
        if (o == null) {
            status = 4;
            msg = "操作失败";
            data = "";
        } else if (o instanceof List<?> && ((List<?>) o).size() == 0) {
            status = 1;
            msg = "无数据";
            data = o;
        } else {
            data = o;
            status = 0;
        }
        return this;
    }


    public UnifiedShow show(Object o, boolean canBeNull) {
        msg = "";
        if (o == null) {
            if (canBeNull) {
                status = 1;
                msg = "无数据";
            } else {
                status = 4;
                msg = "操作失败";
            }
            data = "";
        } else {
            data = o;
            status = 0;
        }
        return this;
    }


    public UnifiedShow show(int i){
        msg = "";
        if (i <= 0) {
            status = 4;
            msg = "操作失败";
            data = i;
        } else {
            status = 0;
            data = i;
        }
        return this;
    }

}