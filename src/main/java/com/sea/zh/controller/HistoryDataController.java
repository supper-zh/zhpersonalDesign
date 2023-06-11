package com.sea.zh.controller;

import com.sea.zh.model.HistoryData;
import com.sea.zh.service.HistoryDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
public class HistoryDataController {

    private final HistoryDataService historyDataService;

    @Autowired
    public HistoryDataController(HistoryDataService historyDataService) {
        this.historyDataService = historyDataService;
    }
    @GetMapping("/history")
    public String  getHistoryData(){
//            测试一下
        return "ok";
    }

//    @GetMapping("/error")
//    public ResponseEntity<String> handleError() {
//        // 处理错误逻辑，例如返回自定义的错误信息
//        String errorMessage = "请求的资源不存在";
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
//    }

//    @PostMapping("/history/{startTime}/{endTime}/{targetId}/{mmsi}/{zoom}")
//    public ResponseEntity<HistoryData> getHistoryData( @PathVariable Long startTime,
//                                                       @PathVariable Long endTime,
//                                                       @PathVariable int targetId,
//                                                      @PathVariable(required = false) int mmsi,
//                                                      @RequestParam(value = "zoom", defaultValue = "10") Integer zoom){
//        HistoryData historyData = null;
//        historyData = historyDataService.getHistoryData(startTime, endTime, targetId, mmsi, zoom);
//        return ResponseEntity.ok(historyData);
//    }
    @PostMapping("/history")
    public ResponseEntity<HistoryData> getHistoryData(@RequestParam(value = "startTime") Long startTime,
                                                      @RequestParam(value = "endTime") Long endTime, @RequestParam(value = "targetId", defaultValue = "7388326400000338584") String targetId,
                                                      @RequestParam(value = "mmsi", defaultValue = "413283880") Integer mmsi, @RequestParam(value = "zoom", defaultValue = "10") Integer zoom) {
        System.out.println("正在查询：" + mmsi);
        HistoryData historyData = null;
        historyData = historyDataService.getHistoryData(startTime, endTime, targetId, mmsi, zoom);
        return ResponseEntity.ok(historyData);
    }

}
