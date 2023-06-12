

console.log("HistoryBatch加载")
document.addEventListener('DOMContentLoaded', function() {
    // 导入 CSV 文件进行批量查询
    document.getElementById('BatchSearchButton').addEventListener('click', function() {
        var fileInput = document.getElementById('csvFileInput');
        var file = fileInput.files[0];
        if (file) {
            console.log("文件存在，开始解析");
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                parseCSV(contents);
                console.log("文件解析结果：", contents);
            };
            reader.readAsText(file);
        }
    });

    //文件解析 完成
    function parseCSV(contents) {
        var lines = contents.split('\n');
        var targetIds = [];
        var mmsis = [];

        lines.forEach(function(line) {
            var columns = line.split(',');
            if (columns.length >= 2) {
                var targetId = columns[0].trim();
                var mmsi = columns[1].trim();
                targetIds.push(targetId);
                mmsis.push(mmsi);
            }
        });

        // 执行批量查询
        const startTime = $('#startTimeInput').val();
        const endTime = $('#endTimeInput').val();
        const startTimeStamp = Date.parse(startTime);
        const endTimeStamp = Date.parse(endTime);

        console.log(startTime);
        console.log(startTimeStamp);
        console.log('请求数据:', JSON.stringify({
            startTime: startTimeStamp,
            endTime: endTimeStamp,
            targetIds: targetIds,
            mmsis: mmsis
        }));

        // 发起异步请求
        fetch('/api/historyBatch', {
            method: 'POST',
            body: JSON.stringify({
                startTime: startTimeStamp,
                endTime: endTimeStamp,
                targetIds: targetIds,
                mmsis: mmsis
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                // 请求成功的回调函数
                console.log(data);
                if (data.length > 0) {
                    // 清空上次的结果
                    $('#result').empty();

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
                            $('<td>').text(row[key]).appendTo(tableRow);
                        });
                    });

                    // 绑定导出按钮点击事件，并传递查询结果数据
                    $('#HistoryExportCSVButton').click(function() {
                        HistoryExportToCSV(data);
                    });
                } else {
                    // 数据为空的提示
                    $('#result').text('没有查询到数据');
                }
            })
            .catch(function(error) {
                // 请求失败的回调函数
                console.error(error);
                // 处理错误
            });
    }

    function HistoryExportToCSV(data) {
        if (data.length === 0) {
            return;
        }

        var csvContent = "data:text/csv;charset=utf-8,";

        var headers = Object.keys(data[0]);
        csvContent += headers.join(",") + "\n";

        data.forEach(function(row) {
            var values = Object.values(row).map(function(value) {
                if (typeof value === 'string') {
                    if (value.indexOf(',') !== -1) {
                        value = '"' + value + '"';
                    }
                }
                return value;
            });
            csvContent += values.join(",") + "\n";
        });

        var link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "history_data.csv");
        link.click();
    }
});
