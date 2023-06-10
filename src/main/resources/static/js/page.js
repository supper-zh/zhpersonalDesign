// // 定义每页显示的船舶数量和当前页码
// const shipsPerPage = 10;
// let currentPage = 1;
// // 更新船舶列表和分页控件的显示
// function updateShipList(ships) {
//     // 清空船舶列表
//     var shipList = document.getElementById('shipList');
//     shipList.innerHTML = '';
//
//     // 计算当前页的起始索引和结束索引
//     var startIndex = (currentPage - 1) * shipsPerPage;
//     var endIndex = startIndex + shipsPerPage;
//
//     // 循环遍历当前页的船舶数据并添加到表格中
//     for (var i = startIndex; i < endIndex && i < ships.length; i++) {
//         var ship = ships[i];
//         var row = document.createElement('tr');
//         row.innerHTML = '<td>' + ship.id + '</td><td>' + ship.targetId + '</td>';
//         shipList.appendChild(row);
//     }
//
//     // 更新分页控件状态
//     var prevPageBtn = document.getElementById('prevPageBtn');
//     var nextPageBtn = document.getElementById('nextPageBtn');
//     prevPageBtn.disabled = currentPage === 1;
//     nextPageBtn.disabled = endIndex >= ships.length;
// }
//
// // 上一页按钮点击事件处理函数
// function goToPrevPage() {
//     if (currentPage > 1) {
//         currentPage--;
//         searchShips();
//     }
// }
//
// // 下一页按钮点击事件处理函数
// function goToNextPage() {
//     currentPage++;
//     searchShips();
// }
//
// // 注册按钮点击事件监听器
// var prevPageBtn = document.getElementById('prevPageBtn');
// var nextPageBtn = document.getElementById('nextPageBtn');
// prevPageBtn.addEventListener('click', goToPrevPage);
// nextPageBtn.addEventListener('click', goToNextPage);
//
//
//
// // 获取船舶数据并显示在表格中（分页）
// function displayShips(ships) {
//     const shipListTable = document.getElementById('shipList');
//     const tableBody = shipListTable.querySelector('tbody');
//
//     // 清空表格内容
//     tableBody.innerHTML = '';
//
//     // 计算当前页起始和结束索引
//     const startIndex = (currentPage - 1) * shipsPerPage;
//     const endIndex = startIndex + shipsPerPage;
//
//     // 遍历当前页的船舶数据，并添加到表格中
//     for (let i = startIndex; i < endIndex && i < ships.length; i++) {
//         const ship = ships[i];
//         const row = document.createElement('tr');
//         row.innerHTML = `
//       <td>${ship.mmsi}</td>
//       <td>${ship.name}</td>
//       <td>${ship.type}</td>
//       <td>${ship.state}</td>
//       <td>${ship.length}</td>
//       <td>${ship.speed}</td>
//       <td>${ship.timestamp}</td>
//     `;
//         tableBody.appendChild(row);
//     }
// }
//
// // 获取船舶数据并显示分页导航
// function displayPagination(ships) {
//     const paginationContainer = document.getElementById('pagination');
//     const totalPages = Math.ceil(ships.length / shipsPerPage);
//
//     // 清空分页导航内容
//     paginationContainer.innerHTML = '';
//
//     // 创建并添加分页导航元素
//     for (let i = 1; i <= totalPages; i++) {
//         const pageLink = document.createElement('a');
//         pageLink.href = '#';
//         pageLink.textContent = i;
//         pageLink.addEventListener('click', () => {
//             currentPage = i;
//             displayShips(ships);
//             displayPagination(ships);
//         });
//         paginationContainer.appendChild(pageLink);
//     }
// }
//
// // 在表单提交时触发船舶查询事件
// document.getElementById('searchForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const mmsi = document.getElementById('mmsiInput').value;
//     getShipsByMmsi(mmsi);
// });
//
// document.getElementById('latLonForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const startLat = document.getElementById('startLatInput').value;
//     const endLat = document.getElementById('endLatInput').value;
//     const startLon = document.getElementById('startLonInput').value;
//     const endLon = document.getElementById('endLonInput').value;
//     getShipsByLatitudeAndLongitudeRange(startLat, endLat, startLon, endLon);
// });
//
// document.getElementById('typeForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const type = document.getElementById('typeInput').value;
//     getShipsByType(type);
// });
//
// document.getElementById('timestampForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const startTimestamp = document.getElementById('startTimestampInput').value;
//     const endTimestamp = document.getElementById('endTimestampInput').value;
//     getShipsByTimestampRange(startTimestamp, endTimestamp);
// });
//
// document.getElementById('stateForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const state = document.getElementById('stateInput').value;
//     getShipsByState(state);
// });
//
// document.getElementById('lengthForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const length = document.getElementById('lengthInput').value;
//     getShipsByLength(length);
// });
//
// document.getElementById('speedForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const minSpeed = document.getElementById('minSpeedInput').value;
//     const maxSpeed = document.getElementById('maxSpeedInput').value;
//     getShipsBySpeedRange(minSpeed, maxSpeed);
// });
//
// document.getElementById('mmsiListForm').addEventListener('submit', function (event) {
//     event.preventDefault();
//     const mmsiListInput = document.getElementById('mmsiListInput').value;
//     const mmsiList = mmsiListInput.split(',').map(mmsi => mmsi.trim());
//     getShipsByMmsiList(mmsiList);
// });
//
// // 为方便起见，将获取船舶数据和显示分页导航的逻辑合并到一个函数中
// function getShipsAndDisplay() {
//     const shipListTable = document.getElementById('shipList');
//     shipListTable.innerHTML = '<p>Loading ships...</p>';
//
//     // 发起AJAX请求，获取船舶数据
//     fetch('/api/ship')
//         .then(response => response.json())
//         .then(data => {
//             // 检查船舶数据是否为空
//             if (data.length === 0) {
//                 shipListTable.innerHTML = '<p>No ships found.</p>';
//                 return;
//             }
//
//             // 显示船舶数据和分页导航
//             displayShips(data);
//             displayPagination(data);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             shipListTable.innerHTML = '<p>An error occurred while retrieving ships.</p>';
//         });
// }
//
// // 初始化页面时获取船舶数据并显示
// getShipsAndDisplay();
