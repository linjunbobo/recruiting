package com.graduation.project.Config;


import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;

/**
 *
 * @description 定义切面类  日志
 * @author linjunbo
 */
@Component
@Aspect
public class WebLogAspect {
    private static final Logger logger = LoggerFactory.getLogger(WebLogAspect.class);

    /**
     * 定义一个切面
     * @ description 第一个*：表示方法返回任意值；第二个*：任意类；第三个*：任意方法 "..表示任意参数"
     */
    @Pointcut("execution(* com.graduation.project.Controller.*.*(..))")
    public void webLog() {
    }

    /**
     * 前置通知，该方法在目标方法执行之前执行
     * @param joinPoint
     * @throws Throwable
     */
    @Before("webLog()")
    public void doBefore(JoinPoint joinPoint) throws Throwable {
        // 接收到请求，记录请求内容
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        // 获取连接点的方法签名对象
        String methodName = joinPoint.getSignature().getName();


        logger.info("请求URL : " + request.getRequestURL().toString());
        //获取连接点方法运行时的入参列表
        Object[] arrayObj =  joinPoint.getArgs();
        for(int i=0; i < arrayObj.length; i++) {
            logger.info("请求参数arg["+i+"]:{}",arrayObj[i]);
        }
        Enumeration<String> enu = request.getParameterNames();
        while (enu.hasMoreElements()) {
            String name = (String) enu.nextElement();
            logger.info("name:{},value:{}", name, request.getParameter(name));
        }
    }
    @After("webLog()")
    public void doAfter(JoinPoint joinPoint){
        String methodName = joinPoint.getSignature().getName();

    }

    @AfterThrowing("webLog()")
    public void afterThrowing(JoinPoint joinPoint){

    }

    /**
     *
     * @param ret 返回结果 可获取方法的返回值
     * @throws Throwable
     */
    @AfterReturning(returning = "ret", pointcut = "webLog()")
    public void doAfterReturning(Object ret) throws Throwable {
        // 处理完请求，返回内容
        logger.info("返回结果 : " + ret);
    }

}
