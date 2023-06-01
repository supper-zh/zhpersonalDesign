package com.example.seasys.client;
import com.example.seasys.service.TokenService;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import okhttp3.*;
import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.mongodb.util.BsonUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;

@ConfigurationProperties
@Component
public class WebSocketClient {
    private final OkHttpClient httpClient;
    private WebSocket webSocket;
    private final TokenService tokenService;

//    使用@Value注解将配置值注入
    @Value("${spring.data.mongodb.host}")
    private String mongoHost;

    @Value("${spring.data.mongodb.port}")
    private int mongoPort;

    @Value("${spring.data.mongodb.database}")
    private String mongoDatabase;

    @Value(value = "${spring.session.mongodb.collection-name}")
    private String mongoCollection;

    private MongoClient mongoClient;
    private MongoDatabase database;
    private MongoCollection<Document> collection;

    // MongoDB连接相关配置
//    private static final String MONGO_HOST = "localhost";
//    private static final int MONGO_PORT = 27017;
//    private static final String MONGO_DATABASE = "MonitorSysDb";
//    private static final String MONGO_COLLECTION = "ship";
//    private MongoClient mongoClient;
//    private MongoDatabase database;
//    private MongoCollection<Document> collection;

    public WebSocketClient(TokenService tokenService) {
        this.tokenService = tokenService;
        this.httpClient = new OkHttpClient();

        // 初始化MongoDB连接  spring.data.mongodb.uri=mongodb://localhost:27017/MonitorSysDb
        mongoClient = MongoClients.create("mongodb://" + mongoHost + ":" + mongoPort);
        database = mongoClient.getDatabase(mongoDatabase);
        collection = database.getCollection(mongoCollection);
//        mongoClient = MongoClients.create("mongodb://" + MONGO_HOST + ":" + MONGO_PORT);
//        database = mongoClient.getDatabase(MONGO_DATABASE);
//        collection = database.getCollection(MONGO_COLLECTION);
    }

    private void storeData(JSONObject data) {
        // 将数据存储到MongoDB数据库
        // 在这里实现将数据存储到MongoDB的逻辑
        Document document = Document.parse(data.toString());
        collection.insertOne(document);
    }
    public void connectAndReceiveData() {
        try {
            String accessToken = tokenService.getToken();
            if (accessToken == null) {
                System.out.println("获取AccessToken失败");
                return;
            }

            Request request = new Request.Builder()
                    .url("ws://bs.uniseas.com.cn/apiv1/target/ws/" + accessToken)
                    .build();

            WebSocketListener webSocketListener = new WebSocketListener() {
                @Override
                public void onOpen(WebSocket webSocket, Response response) {
                    System.out.println("WebSocket连接已建立");
                }

                @Override
                public void onMessage(WebSocket webSocket, String text) {
                    System.out.println("收到消息：" + text);
                    parseAndStoreData(text);
                }

                @Override
                public void onClosed(WebSocket webSocket, int code, String reason) {
                    System.out.println("WebSocket连接已关闭");
                }

                @Override
                public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                    System.out.println("WebSocket连接失败: " + t.getMessage());
                }
            };

            webSocket = httpClient.newWebSocket(request, webSocketListener);
        } catch (IOException e) {
            System.out.println("无法建立WebSocket连接: " + e.getMessage());
        }
    }

    public void closeConnection() {
        if (webSocket != null) {
            webSocket.cancel();
            webSocket = null;
            System.out.println("WebSocket连接已关闭");
        } else {
            System.out.println("WebSocket连接已经关闭");
        }
    }

    private void parseAndStoreData(String message) {
        try {
            JSONArray jsonArray = new JSONArray(message);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                // 解析数据并存储到MongoDB数据库
                storeData(jsonObject);
            }
        } catch (JSONException e) {
            System.out.println("解析数据出错: " + e.getMessage());
        }
    }


}
