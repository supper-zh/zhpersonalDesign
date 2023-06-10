document.getElementById('shipsInfoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        console.error('未选择文件');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const contents = e.target.result;
        const shipData = parseFileContents(contents);

        fetchShipInfo(shipData)
            .then(shipInfoArray => {
                displayShipInfo(shipInfoArray);
            })
            .catch(error => {
                console.error('查询船舶信息失败:', error);
            });
    };

    if (file) {
        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
        } else if (file.name.endsWith('.xlsx')) {
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['targetId', 'mmsi'] });

                const shipData = jsonData.map(({ targetId, mmsi }) => ({
                    targetId: targetId.trim(),
                    mmsi: mmsi.trim(),
                }));

                return fetchShipInfo(shipData);
            };
            reader.readAsArrayBuffer(file);
        } else {
            console.error('不支持的文件类型');
        }
    }
});

function fetchShipInfo(shipData) {
    const requests = shipData.map(({ targetId, mmsi }) => {
        return fetch(`/db/shipDetail/${targetId}/${mmsi}`)
            .then(response => response.json())
            .then(shipInfo => {
                shipInfo.timestamp = new Date(shipInfo.timestamp * 1 ); // 将时间戳转换为 Date 对象
                return shipInfo;
            });
    });

    return Promise.all(requests);
}

function displayShipInfo(shipInfoArray) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';

    const table = document.createElement('table');
    table.classList.add('ship-info-table');

    const tableHead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.innerHTML = `
        <th>目标ID</th>
        <th>MMSI</th>
        <th>船名</th>
        <th>长度</th>
        <th>宽度</th>
        <th>吃水（米）</th>
        <th>船的类型</th>
        <th>AIS级别</th>
        <th>查询时间</th>
        <th>呼号</th>
        <th>目的港</th>
        <th>国籍</th>
        <th>预计到达时间</th>
<!--        <th>制造商</th>-->
<!--        <th>AIS IMO</th>-->
        <!-- 其他船舶信息字段... -->
    `;
    tableHead.appendChild(headRow);
    table.appendChild(tableHead);

    const tableBody = document.createElement('tbody');
    shipInfoArray.forEach(shipInfo => {
        const row = document.createElement('tr');


        row.innerHTML = `
            <td>${shipInfo.targetId}</td>
            <td>${shipInfo.mmsi}</td>
            <td>${shipInfo.vesselName}</td>
            
            <td>${shipInfo.length}</td>
            <td>${shipInfo.wide}</td>
            <td>${shipInfo.draught}</td>
            
            <td>${shipInfo.shipType}</td>
            <td>${shipInfo.shipClass}</td>
            <td>${formatTimestamp(shipInfo.timestamp)}</td>
            <td>${shipInfo.callSign}</td>
            <td>${shipInfo.destination}</td>
            <td>${shipInfo.nationality}</td>
            <td>${shipInfo.etaTime}</td>

            <!-- 其他船舶信息字段... -->
        `;
        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    resultContainer.appendChild(table);


}
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function parseFileContents(contents) {
    const lines = contents.split('\n');
    const shipData = lines.map(line => {
        const [targetId, mmsi] = line.split(',');
        return { targetId, mmsi };
    });

    return shipData;
}
document.getElementById('exportAsCsvButton').addEventListener('click', function() {
    const tableRows = document.querySelectorAll('.ship-info-table tbody tr');
    const shipInfoArray = Array.from(tableRows).map(row => {
        const shipInfo = {};
        const columns = row.querySelectorAll('td');

        shipInfo.targetId = columns[0].textContent;
        shipInfo.mmsi = columns[1].textContent;
        shipInfo.vesselName = columns[2].textContent;
        shipInfo.length = columns[3].textContent;
        shipInfo.wide = columns[4].textContent;
        shipInfo.draught = columns[5].textContent;
        shipInfo.shipType = columns[6].textContent;
        shipInfo.shipClass = columns[7].textContent;
        shipInfo.timestamp = columns[8].textContent;
        shipInfo.callSign = columns[9].textContent;
        shipInfo.destination = columns[10].textContent;
        shipInfo.nationality = columns[11].textContent;
        shipInfo.etaTime = columns[12].textContent;

        // Add other ship info fields...

        return shipInfo;
    });

    exportToCSV(shipInfoArray, 'ship_info.csv');
});

function exportToCSV(data, fileName) {
    const csvContent = convertArrayToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) { // For Microsoft Edge and Internet Explorer
        navigator.msSaveBlob(blob, fileName);
    } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function convertArrayToCSV(array) {
    const header = Object.keys(array[0]).join(',');
    const rows = array.map(obj => Object.values(obj).join(','));
    return `${header}\n${rows.join('\n')}`;
}
