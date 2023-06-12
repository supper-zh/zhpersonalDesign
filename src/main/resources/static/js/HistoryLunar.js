console.log("HistoryLunar加载");

$(document).ready(function() {
    // 获取查询表单元素
    const queryForm = $('#queryForm');
    const result = $('#result');

    // 监听表单提交事件
    queryForm.submit(function(event) {
        event.preventDefault(); // 阻止表单默认提交行为
        handleBatchSearch();
    });

    function handleBatchSearch() {
        const fileInput = $('#csvFileInput');
        const file = fileInput[0].files[0];

        const reader = new FileReader();

        reader.onload = function(event) {
            const csvData = event.target.result; // 获取CSV文件的内容

            const rows = csvData.split('\n'); // 按行分割CSV数据
            rows.shift(); // 移除标题行

            const targetIds = [];
            const mmsis = [];

            rows.forEach(function(row) {
                const [targetId, mmsi] = row.split(',');

                if (targetId && mmsi) {
                    targetIds.push(targetId.trim());
                    mmsis.push(mmsi.trim());
                }
            });

            // 发起异步请求
            $.ajax({
                url: '/api/historyLunar',
                type: 'POST',
                data: JSON.stringify({
                    targetIds: targetIds,
                    mmsis: mmsis
                }),
                contentType: 'application/json',
                success: function(response) {
                    //response: [{…}, {…}] 字典数组，其中字典：{code: 0, msg: 'success', data: Array(3)}，data:{mmsi: 200013028, lastTm: 1684202063298, speed: 0, longitude: 109.09672, latitude: 21.49072667, …}
                    console.log("请求成功，响应数据：",response);
                    // 清空之前的结果
                    $('#result').empty();

                    // console.log("response[0]:",response[0])
                    // console.log("response[0].data:",response[0].data)
                    //[{…}, {…}, {…}],{}:{mmsi: 200013028, lastTm: 1684202063298, speed: 0, longitude: 109.09672, latitude: 21.49072667, …}
                    // response.forEach(function (item){
                    //     console.log("data.item:",item);
                    //     //item：{code: 0, msg: 'success', data: Array(3)},字典类型
                    //     // 处理返回的数据
                    //     var data = item.data;
                    //     console.log("实际需要的数据：",data);
                    //     //数组data:[{…}, {…}, {…}],{}:{mmsi: 200013028, lastTm: 1684202063298, speed: 0, longitude: 109.0967...
                    //     if (data.length > 0) {
                    //
                    //     }
                    // });

                    // 创建表格
                    var table = $('<table>').appendTo('#result');
                    // 创建表头
                    var tableHeader = $('<tr>').appendTo(table);
                    Object.keys(response[0].data[0]).forEach(function(key) {
                        $('<th>').text(key).appendTo(tableHeader);
                    });

                    response.forEach(function (responseItem){
                       responseItem.data.forEach(function (row){
                           var tableRow = $('<tr>').appendTo(table);
                           Object.keys(row).forEach(function(key) {
                               var value = row[key];
                               if (key === 'lastTm' && typeof value === 'number' && !isNaN(value)) {
                                   var date = new Date(value);
                                   value = date.toLocaleString(); // 将时间戳转换为具体时间格式
                               }
                               $('<td>').text(value).appendTo(tableRow);
                           });
                       }) ;
                    });
                    // 绑定导出按钮点击事件，并传递查询结果数据
                    $('#HistoryExportCSVButton').click(function() {
                        LunarHistoryExportToCSV(response.map(item => item.data));
                    });

                    // 数据为空的提示
                    // $('<p>').text('没有查询到数据').appendTo(result);

                },
                error: function(error) {
                    // 请求失败的回调函数
                    console.error(error);
                    // 处理错误
                }
            });
        };

        reader.readAsText(file);
    }

    function LunarHistoryExportToCSV(data) {
        if (data.length === 0) {
            return;
        }

        var csvContent = "data:text/csv;charset=utf-8,";
        var headers = Object.keys(data[0][0]);
        csvContent += headers.join(",") + "\n";

        data.forEach(function(items) {
            items.forEach(function(row) {
                var values = Object.values(row).map(function(value, index) {
                    // 导出时将lastTm字段转变为具体时间
                    if (headers[index] === "lastTm" && typeof value === "number" && !isNaN(value)) {
                        var date = new Date(value);
                        value = date.toLocaleString();
                    }
                    if (typeof value === "string") {
                        if (value.indexOf(",") !== -1) {
                            value = '"' + value + '"';
                        }
                    }
                    return value;
                });
                csvContent += values.join(",") + "\n";
            });
        });

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "historyData.csv");
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

});
