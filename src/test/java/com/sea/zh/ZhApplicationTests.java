package com.sea.zh;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@SpringBootTest
class ZhApplicationTests {

    @Test
    void contextLoads() {
//        long timestamp = 1622282075000L; // 示例时间戳
        long timestamp = 1685436578875L; // 示例时间戳
        Instant instant = Instant.ofEpochMilli(timestamp);
        LocalDateTime dateTime = LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        System.out.println(dateTime);
    }

}
