//填充数据
const shipData = [
    { targetId: "1", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "-122.5678", length: "-122.5678", speed: "0", timestamp: "1685436562346", fixed: "false" /* 其他属性 */ },
    { targetId: "2", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "-122.5678", length: "-122.5678", speed: "0", timestamp: "1685436562346", fixed: "false" /* 其他属性 */ },
    { targetId: "3", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "-122.5678", length: "-122.5678", speed: "0", timestamp: "1685436562346", fixed: "false" /* 其他属性 */ },
    { targetId: "4", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "-122.5678", length: "-122.5678", speed: "0", timestamp: "1685436562346", fixed: "false" /* 其他属性 */ },
    { targetId: "5", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "-122.5678", length: "-122.5678", speed: "0", timestamp: "1685436562346", fixed: "false" /* 其他属性 */ },
    { targetId: "6", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "-122.5678", length: "-122.5678", speed: "0", timestamp: "1685436562346", fixed: "false" /* 其他属性 */ },
    { targetId: "7", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "-122.5678", length: "-122.5678", speed: "0", timestamp: "1685436562346", fixed: "false" /* 其他属性 */ },
    { targetId: "8", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "-122.5678", length: "-122.5678", speed: "0", timestamp: "1685436562346", fixed: "false" /* 其他属性 */ },
    { targetId: "9", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "-122.5678", length: "-122.5678", speed: "0", timestamp: "1685436562346", fixed: "false" /* 其他属性 */ },
    { targetId: "10", mmsi: "413489990", heading: "157", latitude: "19.956206", longitude: "110.01837",course: "290.3", type: "AIS_A", state: "-122.5678", length: "-122.5678", speed: "0", timestamp: "1685436562346", fixed: "false" /* 其他属性 */ },
    // 其他查询到的数据对象
];
// 获取表格的<tbody>元素
const tbody = document.querySelector("#shipList tbody");

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
    courseCell.textContent = ship.longitude;
    const typeCell = document.createElement("td");
    typeCell.textContent = ship.longitude;
    const stateCell = document.createElement("td");
    stateCell.textContent = ship.longitude;
    const lengthCell = document.createElement("td");
    lengthCell.textContent = ship.longitude;
    const speedCell = document.createElement("td");
    speedCell.textContent = ship.longitude;
    const timestampCell = document.createElement("td");
    timestampCell.textContent = ship.longitude;
    const fixedCell = document.createElement("td");
    fixedCell.textContent = ship.longitude;
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