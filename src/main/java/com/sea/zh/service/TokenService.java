package com.sea.zh.service;

import okhttp3.*;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**负责发送HTTP请求获取token令牌并返回access_token
 * 返回值：access_token, String
 * */
@Service
public class TokenService {
    private final OkHttpClient httpClient = new OkHttpClient();

    public String getToken() throws IOException {
        MediaType mediaType = MediaType.parse("application/x-www-form-urlencoded");
        RequestBody body = RequestBody.create(mediaType, "scope=all&grant_type=password&username=zouyonghua&password=zouyh@6622");
        Request request = new Request.Builder()
                .url("http://bs.uniseas.com.cn/apiv1/uaa/oauth/token")
                .post(body)
                .addHeader("Authorization", "Basic Y2xpZW50OnNlY3JldA==")
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (response.isSuccessful()) {
                assert response.body() != null;
                String responseBody = response.body().string();
                return parseAccessToken(responseBody);
            } else {
                throw new IOException("Failed to get token: " + response.code());
            }
        }
    }

    private String parseAccessToken(String responseBody) {
        JSONObject jsonObject = new JSONObject(responseBody);
        return jsonObject.getString("access_token");
    }
}