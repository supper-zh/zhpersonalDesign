package com.sea.zh.controller;


import com.sea.zh.client.WebSocketClient;
import com.sea.zh.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;


/**
 * 负责接收控制WebSocket连接的请求。*/
@Controller
@RequestMapping("/db")
public class WebSocketController {
    private final WebSocketClient webSocketClient;
    private final TokenService tokenService;
//    private Timer timer;//计时器对象
//    private ScheduledExecutorService scheduler;
//    private boolean isWebSocketRunning = false;



    @Autowired
    public WebSocketController(WebSocketClient webSocketClient, TokenService tokenService) {
        this.webSocketClient = webSocketClient;
        this.tokenService = tokenService;
    }

//    @PostMapping("/token")
    @GetMapping("/token")
    @ResponseBody
    public String getToken() {
        // 处理获取令牌的逻辑
        String token = null;
        try {
            token = tokenService.getToken();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return token != null ? token : "";
    }

    @GetMapping("/start")
    @ResponseBody
    public String startWebSocket() {
        // 如果任务已经在执行中，则不再启动新任务
//        if (isWebSocketRunning) {
//            return "WebSocket 连接已经在执行中";
//        }

        // 开启WebSocket连接
        webSocketClient.connectAndReceiveData();
//        // 刷新时间间隔，毫秒单位60000为1分钟
//        long intervalInMilliseconds = 60000 * 60 *12; //12h刷新一次
//        timer = new Timer();
//        timer.schedule(new TimerTask() {
//            @Override
//            public void run() {
//                webSocketClient.connectAndReceiveData();
//            }
//        }, 11110, intervalInMilliseconds); // intervalInMilliseconds 是刷新时间间隔，以毫秒为单位


//        long intervalInMilliseconds = 6000;
        // 创建 ScheduledExecutorService 并安排定期执行任务
////        long intervalInMilliseconds = 86400000;  // 设置为 24 小时
//        scheduler = Executors.newSingleThreadScheduledExecutor();
//        scheduler.scheduleAtFixedRate(() -> {
//            webSocketClient.connectAndReceiveData();
//        }, 0, intervalInMilliseconds, TimeUnit.MILLISECONDS);
//         设置定时器，每隔一段时间重新执行连接和数据接收操作

//         启动定时任务
//        long intervalInMilliseconds = 86400000;  // 设置为 24 小时
//        isWebSocketRunning = true;
//        new Thread(() -> {
//            while (isWebSocketRunning) {
//                webSocketClient.connectAndReceiveData();
//                try {
//                    Thread.sleep(intervalInMilliseconds);
//                } catch (InterruptedException e) {
//                    // 处理异常
//                    e.printStackTrace();
//                }
//            }
//        }).start();
        return "WebSocket连接已开启,后台正在接收数据";
    }

    @GetMapping("/stop")
    @ResponseBody
    public String stopWebSocket() {

        // 停止计时器的执行
//        if (timer != null) {
//            timer.cancel();
//            timer = null;
//        }
        // 关闭 ScheduledExecutorService
//        if (scheduler != null) {
//            scheduler.shutdown();
//            scheduler = null;
//        }
//        // 停止定时任务
//        isWebSocketRunning = false;
        // 关闭WebSocket连接
        webSocketClient.closeConnection();
        return "WebSocket连接已关闭，后台停止接收数据";
    }
}
