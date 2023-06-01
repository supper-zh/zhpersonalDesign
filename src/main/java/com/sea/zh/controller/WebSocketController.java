package com.example.seasys.controller;

import com.example.seasys.client.WebSocketClient;
import com.example.seasys.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;


/**
 * 负责接收控制WebSocket连接的请求。*/
@Controller
public class WebSocketController {
    private final WebSocketClient webSocketClient;
    private final TokenService tokenService;
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
        // 开启WebSocket连接
        webSocketClient.connectAndReceiveData();
        return "WebSocket连接已开启";
    }

    @GetMapping("/stop")
    @ResponseBody
    public String stopWebSocket() {
        // 关闭WebSocket连接
        webSocketClient.closeConnection();
        return "WebSocket连接已关闭";
    }
}
