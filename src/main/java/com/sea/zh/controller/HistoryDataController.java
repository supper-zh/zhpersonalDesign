package com.sea.zh.controller;

import com.sea.zh.model.HistoryData;
import com.sea.zh.service.HistoryDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.ZoneId;


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
                                                      @RequestParam(value = "endTime") Long endTime,
                                                      @RequestParam(value = "targetId") String targetId,
                                                      @RequestParam(required = false) Integer mmsi,
                                                      @RequestParam(value = "zoom", defaultValue = "10") Integer zoom) {

        System.out.println("正在查询targetId：" + targetId);
        System.out.println("正在查询mmsi：" + mmsi);
        HistoryData historyData = null;
        historyData = historyDataService.getHistoryData(startTime, endTime, targetId, mmsi, zoom);
        return ResponseEntity.ok(historyData);
    }

    @PostMapping("/historyLunar")
    public ResponseEntity<List<HistoryData>> getHistoryBatchData(@RequestBody Map<String, List<String>> requestParams) {
        List<String> targetIds = requestParams.get("targetIds");
        List<String> mmsis = requestParams.get("mmsis");

        System.out.println("查询列表targetIds："+ targetIds); //[7351770590000073573, 7351874600000292467,....]
        System.out.println("查询列表mmsis："+ mmsis); //[200013028, 203388000,...]
        // 获取当前时间
        LocalDateTime now = LocalDateTime.now(); //2023-06-12T16:58:50.298554500
        System.out.println("动态获取当前时间：" + now);
        // 设置结束时间为当前时间
        long endTime = now.atZone(ZoneId.systemDefault()).toEpochSecond() * 1000; //1686560330000
        System.out.println("当前时间转换成查询的endTime:" + endTime);
        // 设置开始时间为当前时间的前30天
        LocalDateTime startTime = now.minusDays(30); //2023-05-13T16:58:50.298554500
        System.out.println("开始时间：" + startTime);
        long startTimeL = startTime.atZone(ZoneId.systemDefault()).toEpochSecond() * 1000; //1683968330000
        System.out.println("startTimeL:" + startTimeL);

        System.out.println("====批量查询开始====");
        List<HistoryData> historyDataList = new ArrayList<>();
        for (int i = 0; i < targetIds.size(); i++) {
            String targetId = targetIds.get(i);
            String mmsiStr = mmsis.get(i);
            Integer mmsi = Integer.valueOf(mmsiStr);
            Integer zoom = 10;
            System.out.println("正在查询targetId：" + targetId);
            System.out.println("正在查询mmsi：" + mmsi);
            // 调用历史数据服务获取数据
            HistoryData historyData = historyDataService.getHistoryData(startTimeL, endTime, targetId, mmsi, zoom);
            if (historyData != null) {
                historyDataList.add(historyData);
            }
        }
        if (!historyDataList.isEmpty()) {
            return ResponseEntity.ok(historyDataList);
        } else {
            return ResponseEntity.noContent().build();
        }
    }
}
