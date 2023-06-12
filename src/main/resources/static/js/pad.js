//填充数据
const shipData = [
    { targetId: "1", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "1", length: "1", speed: "0", timestamp: "1685436578875", fixed: "false" /* 其他属性 */ },
    { targetId: "2", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "0", length: "8", speed: "0", timestamp: "1685436578875", fixed: "false" /* 其他属性 */ },
    { targetId: "3", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "2", length: "78", speed: "5", timestamp: "1685436578875", fixed: "false" /* 其他属性 */ },
    { targetId: "4", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "1", length: "8", speed: "5", timestamp: "1685436578875", fixed: "false" /* 其他属性 */ },
    { targetId: "5", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "1", length: "-8", speed: "5", timestamp: "1685436578875", fixed: "false" /* 其他属性 */ },
    // { targetId: "6", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "RADAR", state: "1", length: "8", speed: "5", timestamp: "1685436578875", fixed: "false" /* 其他属性 */ },
    // { targetId: "7", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "RADAR", state: "0", length: "8", speed: "5", timestamp: "1685436578875", fixed: "false" /* 其他属性 */ },
    // { targetId: "8", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "RADAR", state: "0", length: "2.5678", speed: "0", timestamp: "1685436578875", fixed: "false" /* 其他属性 */ },
    // { targetId: "9", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "RADAR", state: "0", length: "2.5678", speed: "0", timestamp: "1685436578875", fixed: "false" /* 其他属性 */ },
    // { targetId: "10", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "RADAR", state: "0", length: "2.5678", speed: "0", timestamp: "1685436578875", fixed: "false" /* 其他属性 */ },
    // 其他查询到的数据对象
];
// 获取表格的<tbody>元素
const tbody = document.querySelector("#shipList tbody");

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

// 清空<tbody>元素中的内容
tbody.innerHTML = "";

// 遍历查询结果数组，创建行和单元格，并将数据填充到单元格中
shipData.forEach(ship => {
    const row = document.createElement("tr");
    const targetIdCell = document.createElement("td");
    targetIdCell.textContent = ship.targetId;
    const mmsiCell = document.createElement("td");
    mmsiCell.textContent = ship.mmsi;
    const headingCell = document.createElement("td");
    headingCell.textContent = ship.heading;
    const latitudeCell = document.createElement("td");
    latitudeCell.textContent = ship.latitude;
    const longitudeCell = document.createElement("td");
    longitudeCell.textContent = ship.latitude;
    const courseCell = document.createElement("td");
    courseCell.textContent = ship.course;
    const typeCell = document.createElement("td");
    typeCell.textContent = ship.type;
    const stateCell = document.createElement("td");
    stateCell.textContent = ship.state;
    const lengthCell = document.createElement("td");
    lengthCell.textContent = ship.length;
    const speedCell = document.createElement("td");
    speedCell.textContent = ship.speed;
    const timestampCell = document.createElement("td");
    timestampCell.textContent = formatTimestamp(ship.timestamp);
    const fixedCell = document.createElement("td");
    fixedCell.textContent = ship.fixed;
    // 创建其他单元格并填充数据

    row.appendChild(targetIdCell);
    row.appendChild(mmsiCell);
    row.appendChild(headingCell);
    row.appendChild(latitudeCell);
    row.appendChild(longitudeCell);
    row.appendChild(courseCell);
    row.appendChild(typeCell);
    row.appendChild(stateCell);
    row.appendChild(lengthCell);
    row.appendChild(speedCell);
    row.appendChild(timestampCell);
    row.appendChild(fixedCell);
    // 添加其他单元格到行中

    tbody.appendChild(row);
});