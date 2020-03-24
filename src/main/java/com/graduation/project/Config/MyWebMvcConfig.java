package com.graduation.project.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.MultipartConfigElement;

/**
 * @author  跨域
 * @time 2019.08.22
 */
@Configuration
public class MyWebMvcConfig implements WebMvcConfigurer {

    private  String filePath;
    /**
     * 配置解决跨域问题
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 对那种格式的请求进行跨域处理
        registry.addMapping("/**")
                // 表示支持的域
                .allowedOrigins("*")
                // 表示允许的请求头，默认是全部
                .allowedHeaders("*")
                // 表示允许的请求方法，默认是post、get和head
                .allowedMethods("*")
                .allowCredentials(true)
                // 表示探测请求的有效期
                .maxAge(3600);
    }
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        //上传照片缩略图url地址
        registry.addResourceHandler("/uploads/**").addResourceLocations("file:"+"C:\\uploads/");
        WebMvcConfigurer.super.addResourceHandlers(registry);
    }


}
