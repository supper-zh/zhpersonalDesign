// 监听表单提交事件
console.log("History加载")
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
            console.log("请求成功返回的数据",response); //{code: 0, msg: 'success', data: Array(3)}
            // 处理返回的数据
            var data = response.data;
            console.log("处理返回的数据",data);

            // 清空上次的结果
            $('#result').empty();

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

// 监听导入CSV文件按钮点击事件
$('#ImportCSVButton').click(function() {
    // 获取用户选择的CSV文件
    var fileInput = document.getElementById('csvFileInput');
    var file = fileInput.files[0];

    // 创建FileReader对象来读取文件内容
    var reader = new FileReader();
    reader.onload = function(e) {
        var csvContent = e.target.result;

        // 解析CSV文件内容
        var rows = csvContent.split('\n');
        var targetIds = [];
        for (var i = 1; i < rows.length; i++) { // 从第2行开始读取，第1行为表头
            var row = rows[i].trim();
            if (row.length > 0) {
                var values = row.split(',');
                var targetId = values[0].trim(); // 假设目标ID在第一列
                targetIds.push(targetId);
            }
        }

        // 执行批量查询
        performBatchQuery(targetIds);
    };
    reader.readAsText(file);
});

function performBatchQuery(targetIds) {
    // 清空上次的结果
    $('#result').empty();

    // 发起批量查询请求
    var batchResults = [];
    var counter = 0;
    for (var i = 0; i < targetIds.length; i++) {
        var targetId = targetIds[i];

        $.ajax({
            url: '/api/history',
            type: 'POST',
            data: {
                targetId: targetId
            },
            success: function(response) {
                // 将查询结果保存到数组中
                batchResults.push(response);

                // 所有查询完成后显示结果
                counter++;
                if (counter === targetIds.length) {
                    displayBatchResults(batchResults);
                }
            },
            error: function(error) {
                console.error(error);
                // 处理错误
            }
        });
    }
}

function displayBatchResults(results) {
    // 创建表格
    var table = $('<table>').appendTo('#result');

    // 创建表头
    var tableHeader = $('<tr>').appendTo(table);
    Object.keys(results[0].data[0]).forEach(function(key) {
        $('<th>').text(key).appendTo(tableHeader);
    });

    // 创建数据行
    results.forEach(function(result) {
        var data = result.data;
        data.forEach(function(row) {
            var tableRow = $('<tr>').appendTo(table);
            Object.keys(row).forEach(function(key) {
                var value = row[key];
                if (key === 'lastTm' && typeof value === 'number' && !isNaN(value)) {
                    var date = new Date(value);
                    value = date.toLocaleString();
                }
                $('<td>').text(value).appendTo(tableRow);
            });
        });
    });
}

