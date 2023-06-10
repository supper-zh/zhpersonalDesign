// 监听表单提交事件
$('#queryForm').submit(function(event) {
    event.preventDefault();
    // 阻止表单默认提交行为

    // 获取用户输入的值
    var startTime = $('#startTimeInput').val();
    var endTime = $('#endTimeInput').val();
    var startTimeStamp = Date.parse(startTime);
    var endTimeStamp = Date.parse(endTime);
    var targetId = $('#targetIdInput').val();
    var mmsi = $('#mmsiInput').val();
    var zoom = $('#zoomInput').val();

    // 发起异步请求
    $.ajax({
        url: '/api/history',
        type: 'POST',
        data: {
            startTime: startTimeStamp,
            endTime: endTimeStamp,
            targetId: targetId,
            mmsi: mmsi,
            zoom: zoom
        },
        success: function(response) {
            // 请求成功的回调函数
            console.log(response);

            // 清空上次的结果
            $('#result').empty();

            // 处理返回的数据
            var data = response.data;
            if (data.length > 0) {
                // 创建表格
                var table = $('<table>').appendTo('#result');

                // 创建表头
                var tableHeader = $('<tr>').appendTo(table);
                Object.keys(data[0]).forEach(function(key) {
                    $('<th>').text(key).appendTo(tableHeader);
                });

                // 创建数据行
                data.forEach(function(row) {
                    var tableRow = $('<tr>').appendTo(table);
                    Object.keys(row).forEach(function(key) {
                        var value = row[key];
                        if (key === 'lastTm' && typeof value === 'number' && !isNaN(value)) {
                            var date = new Date(value);
                            value = date.toLocaleString(); // 将时间戳转换为具体时间格式
                        }
                        $('<td>').text(value).appendTo(tableRow);
                    });
                });

                // 绑定导出按钮点击事件，并传递查询结果数据
                $('#HistoryExportCSVButton').click(function() {
                    HistoryExportToCSV(data);
                });
            } else {
                // 数据为空的提示
                $('<p>').text('没有查询到数据').appendTo('#result');
            }
        },
        error: function(error) {
            // 请求失败的回调函数
            console.error(error);
            // 处理错误
        }
    });
});
//
// function HistoryExportToCSV(data) {
//     if (data.length === 0) {
//         return;
//     }
//
//     // 创建 CSV 数据
//     var csvContent = "data:text/csv;charset=utf-8,";
//
//     // 添加表头
//     var headers = Object.keys(data[0]);
//     csvContent += headers.join(",") + "\n";
//
//     // 添加数据行
//     data.forEach(function(row) {
//         var values = Object.values(row).map(function(value) {
//             if (typeof value === 'string') {
//                 // 如果数据中包含逗号，则用双引号括起来
//                 if (value.indexOf(',') !== -1) {
//                     value = '"' + value + '"';
//                 }
//             } else if (value instanceof Date) {
//                 // 将日期对象转换为具体时间格式
//                 value = value.toLocaleString();
//             }
//             // else if (typeof value === "number" && !isNaN(value)) {
//             //     var date = new Date(value);
//             //     value = date.toLocaleString();
//             // }
//             return value;
//         });
//         csvContent += values.join(",") + "\n";
//     });
//
//
//     // 创建一个隐藏的链接，并设置其下载属性和链接地址
//     var link = document.createElement("a");
//     link.setAttribute("href", encodeURI(csvContent));
//     link.setAttribute("download", "historyData.csv");
//     link.style.display = "none";
//     document.body.appendChild(link);
//     // 触发点击事件，执行下载操作
//     link.click();
//     document.body.removeChild(link);
// }
function HistoryExportToCSV(data) {
    if (data.length === 0) {
        return;
    }

    var csvContent = "data:text/csv;charset=utf-8,";

    var headers = Object.keys(data[0]);
    csvContent += headers.join(",") + "\n";

    data.forEach(function(row) {
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

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "historyData.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
