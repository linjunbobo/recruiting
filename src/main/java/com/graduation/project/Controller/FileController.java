package com.graduation.project.Controller;

import com.github.xiaoymin.knife4j.annotations.ApiOperationSupport;
import com.github.xiaoymin.knife4j.annotations.DynamicParameter;
import com.github.xiaoymin.knife4j.annotations.DynamicResponseParameters;

import com.graduation.project.Mapper.Dao.UnifiedShow;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.Tag;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/file")
@Api(tags = "文件上传")
public class FileController  {


    @PostMapping("/upload")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "myFile", value = "文件"),

    })
    @ApiOperationSupport(
            responses = @DynamicResponseParameters(properties = {
                    @DynamicParameter(name = "src", value = "图片地址"),
                    @DynamicParameter(name = "fileName", value = "图片名字"),
            })
    )
    public UnifiedShow file(@ApiIgnore  HttpServletRequest request, @RequestParam("myFile") MultipartFile myFile) throws IllegalStateException, IOException {
        //	System.out.println("myFile="+myFile);
        Map<String,String> map1 = new HashMap<>();
        //获取保存文件的真实路径

       //String savePath=request.getServletContext().getRealPath("/uploads");

        String savePath = "C:\\uploads";

        //获取文件上传名字
        String filename =myFile.getOriginalFilename();
        //	System.out.println("filename="+filename);

        //创建File对象
        File file =new File(savePath,filename);
        //System.out.println("file"+file);
        if(!file.getParentFile().exists()){
            file.getParentFile().mkdirs();
        }

        try {
            //保存文件
            myFile.transferTo(file);
            //绝对地址
            String imgIrl=savePath+"\\"+filename;
            // 图片地址
            String imgUrl = "/uploads/" + filename;


            map1.put("src",imgUrl);
            map1.put("fileName",filename);

            return new UnifiedShow().show(map1);

        } catch (Exception e) {
            e.printStackTrace();
            // TODO: handle exception
        }


        return new UnifiedShow().show(map1);

    }




}
