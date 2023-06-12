console.log("HistoryBatch2加载")


document.addEventListener('DOMContentLoaded', function() {

// 获取查询表单元素
const queryForm = document.getElementById('queryForm');
const startTimeInput = document.getElementById('startTimeInput').value;
const endTimeInput = document.getElementById('endTimeInput').value;

// 监听表单提交事件
queryForm.addEventListener('submit', function(event) {
    console.log("监听器加载");
    event.preventDefault(); // 阻止表单默认提交行为
    handleBatchSearch();
});


function handleBatchSearch() {

    const fileInput = document.getElementById('csvFileInput');

    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function(event) {

        const csvData = event.target.result; // 获取CSV文件的内容

        const rows = csvData.split('\n'); // 按行分割CSV数据
        rows.shift(); // 移除标题行

        rows.forEach(function(row) {
            const [targetId, mmsi] = row.split(',');

            // 发起异步请求
            if (targetId && mmsi) {
                // 发起异步请求
                fetch('/api/history', {
                    method: 'POST',
                    body: JSON.stringify({
                        // startTime: startTimeInput,
                        startTime: getStartTime(),
                        // endTime: endTimeInput,
                        endTime: getEndTime(),
                        targetId: targetId.trim(),
                        mmsi: mmsi.trim()
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error('查询失败');
                        }
                    })
                    .then(function (data) {
                        // 处理返回的数据，将其展示在前端页面
                        console.log('查询结果:', data);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }
        });
    };

    reader.readAsText(file);
}
    function getStartTime() {
        const startTimeInput = document.getElementById('startTimeInput').value;
        const startTime = Date.parse(startTimeInput);
        console.log(startTime);
        return startTime;
    }

    function getEndTime() {
        const endTimeInput = document.getElementById('endTimeInput').value;
        const endTime = Date.parse(endTimeInput);
        return endTime;
    }
});