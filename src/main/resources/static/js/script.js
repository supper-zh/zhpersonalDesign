document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const latLonForm = document.getElementById('latLonForm');
    const typeForm = document.getElementById('typeForm');
    const timestampForm = document.getElementById('timestampForm');
    const stateForm = document.getElementById('stateForm');
    const lengthForm = document.getElementById('lengthForm');
    const speedForm = document.getElementById('speedForm');
    const mmsiListForm = document.getElementById('mmsiListForm');
    const shipList = document.getElementById('shipList');
    const lengthRangeForm = document.getElementById('lengthRangeForm');
    const LongitudeRangeForm = document.getElementById('LongitudeRangeForm');
    const LatitudeRangeForm = document.getElementById('LatitudeRangeForm');
    const combinedSearchForm = document.getElementById('combinedSearchForm');


    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const mmsi = document.getElementById('mmsiInput').value;
        getShipsByMmsi(mmsi);
    });

    latLonForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const startLat = document.getElementById('startLatInput').value;
        const endLat = document.getElementById('endLatInput').value;
        const startLon = document.getElementById('startLonInput').value;
        const endLon = document.getElementById('endLonInput').value;
        getShipsByLatitudeAndLongitudeRange(startLat, endLat, startLon, endLon);
    });

    typeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const type = document.getElementById('typeInput').value;
        getShipsByType(type);
    });

    timestampForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const startTimestamp = document.getElementById('startTimestampInput').value;
        const endTimestamp = document.getElementById('endTimestampInput').value;
        getShipsByTimestampRange(startTimestamp, endTimestamp);
    });

    stateForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const state = document.getElementById('stateInput').value;
        getShipsByState(state);
    });

    lengthForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const length = document.getElementById('lengthInput').value;
        getShipsByLength(length);
    });

    speedForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const minSpeed = document.getElementById('minSpeedInput').value;
        const maxSpeed = document.getElementById('maxSpeedInput').value;
        getShipsBySpeedRange(minSpeed, maxSpeed);
    });

    lengthRangeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const minLength = document.getElementById('minLength').value;
        const maxLength = document.getElementById('maxLength').value;
        getShipsByLengthRange(minLength, maxLength);
    });


    LongitudeRangeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const LongitudeStart = document.getElementById('LongitudeStart').value;
        const LongitudeEnd = document.getElementById('LongitudeEnd').value;
        getShipsByLongitudeRange(LongitudeStart, LongitudeEnd);
    });

    LatitudeRangeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const LatitudeStart = document.getElementById('LatitudeStart').value;
        const LatitudeEnd = document.getElementById('LatitudeEnd').value;
        getShipsByLatitudeRange(LatitudeStart, LatitudeEnd);
    });

    LongitudeRangeForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const LongitudeStart = document.getElementById('LatitudeStart').value;
        const LongitudeEnd = document.getElementById('LongitudetEnd').value;
        getShipsByLongitudeRange(LongitudeStart, LongitudeEnd);
    });

    mmsiListForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const mmsiList = document.getElementById('mmsiListInput').value;
        const mmsiArray = mmsiList.split(',').map(Number);
        getShipsByMmsiList(mmsiArray);
    });

    combinedSearchForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const state = document.getElementById('stateInputCombined').value;
        const type = document.getElementById('typeInputCombined').value;
        const minLength = document.getElementById('minLengthInput').value;
        const maxLength = document.getElementById('maxLengthInput').value;
        const startLat = document.getElementById('startLatInputCombined').value;
        const endLat = document.getElementById('endLatInputCombined').value;
        const startLon = document.getElementById('startLonInputCombined').value;
        const endLon = document.getElementById('endLonInputCombined').value;
        const startTimestamp = document.getElementById('startTimestampInputCombined').value;
        const endTimestamp = document.getElementById('endTimestampInputCombined').value;
        const minSpeed = document.getElementById('minSpeedInputCombined').value;
        const maxSpeed = document.getElementById('maxSpeedInputCombined').value;

        getShipsByCombinedSearch(state, type, minLength, maxLength, startLat, endLat, startLon, endLon, startTimestamp, endTimestamp, minSpeed, maxSpeed);
    });


    function getShipsByCombinedSearch(state, type, minLength, maxLength, startLat, endLat, startLon, endLon, startTimestamp, endTimestamp, minSpeed, maxSpeed) {
        // 构造请求参数对象
        const params = {
            state: state,
            type: type,
            minLength: minLength,
            maxLength: maxLength,
            startLat: startLat,
            endLat: endLat,
            startLon: startLon,
            endLon: endLon,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            minSpeed: minSpeed,
            maxSpeed: maxSpeed
        };

        // 构造查询字符串
        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/search?${queryString}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
            <thead>
                <tr>
                    <th>targetId</th>
                    <th>mmsi</th>
                    <th>heading</th>
                    <th>latitude</th>
                    <th>longitude</th>
                    <th>course</th>
                    <th>type</th>
                    <th>state</th>
                    <th>length</th>
                    <th>speed</th>
                    <th>timestamp</th>
                    <th>fixed</th>
                </tr>
            </thead>
            `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                    <td>${ship.targetId}</td>
                    <td>${ship.mmsi}</td>
                    <td>${ship.heading}</td>
                    <td>${ship.latitude}</td>
                    <td>${ship.longitude}</td>
                    <td>${ship.course}</td>
                    <td>${ship.type}</td>
                    <td>${ship.state}</td>
                    <td>${ship.length}</td>
                    <td>${ship.speed}</td>
                    <td>${ship.timestamp}</td>
                    <td>${ship.fixed}</td>
                `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }

    // function getShipsByCombinedSearch(state, type, minLength, maxLength, startLat, endLat, startLon, endLon, startTimestamp, endTimestamp, minSpeed, maxSpeed) {
    //     // 构造请求参数对象
    //     const params = {
    //         state: state,
    //         type: type,
    //         minLength: minLength,
    //         maxLength: maxLength,
    //         startLat: startLat,
    //         endLat: endLat,
    //         startLon: startLon,
    //         endLon: endLon,
    //         startTimestamp: startTimestamp,
    //         endTimestamp: endTimestamp,
    //         minSpeed: minSpeed,
    //         maxSpeed: maxSpeed
    //     };
    //
    //     // 构造查询字符串
    //     const queryString = Object.keys(params)
    //         .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    //         .join('&');
    //
    //     // 发起AJAX请求，获取船舶数据
    //     fetch(`/api/ship/search?${queryString}`)
    //         .then(response => response.json()) // 将响应数据转换为JSON格式
    //         .then(data => {
    //             // 清空shipList div的内容
    //             shipList.innerHTML = '';
    //
    //             // 检查船舶数据是否为空
    //             if (data.length === 0) {
    //                 shipList.innerHTML = '<p>No ships found.</p>';
    //                 return;
    //             }
    //
    //             // 创建表格元素
    //             const table = document.createElement('table');
    //             table.innerHTML = `
    //     <thead>
    //          <tr>
    //             <th>targetId</th>
    //             <th>mmsi</th>
    //             <th>heading</th>
    //             <th>latitude</th>
    //             <th>longitude</th>
    //             <th>course</th>
    //             <th>type</th>
    //             <th>state</th>
    //             <th>length</th>
    //             <th>speed</th>
    //             <th>timestamp</th>
    //             <th>fixed</th>
    //           </tr>
    //         </thead>
    //       `;
    //
    //             // 遍历船舶数据，并添加到表格中
    //             data.forEach(ship => {
    //                 const row = document.createElement('tr');
    //                 row.innerHTML = `
    //           <td>${ship.targetId}</td>
    //           <td>${ship.mmsi}</td>
    //           <td>${ship.heading}</td>
    //           <td>${ship.latitude}</td>
    //           <td>${ship.longitude}</td>
    //           <td>${ship.course}</td>
    //           <td>${ship.type}</td>
    //           <td>${ship.state}</td>
    //           <td>${ship.length}</td>
    //           <td>${ship.speed}</td>
    //           <td>${ship.timestamp}</td>
    //           <td>${ship.fixed}</td>
    //     `;
    //                 table.appendChild(row);
    //             });
    //
    //             // 将表格添加到shipList div中
    //             shipList.appendChild(table);
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //             shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
    //         });
    // }
    //
    //     // 构造查询字符串
    //     const queryString = Object.keys(params)
    //         .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    //         .join('&');

    function getShipsByMmsi(mmsi) {
        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/mmsi/${mmsi}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素

                const table = document.createElement('table');
                // const table = document.createElement('table');
                table.innerHTML = `
        <thead>
          <tr>
            <th>targetId</th>
            <th>mmsi</th>
            <th>heading</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>course</th>
            <th>type</th>
            <th>state</th>
            <th>length</th>
            <th>speed</th>
            <th>timestamp</th>
            <th>fixed</th>
          </tr>
        </thead>
      `;
                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td>${ship.targetId}</td>
          <td>${ship.mmsi}</td>
          <td>${ship.heading}</td>
          <td>${ship.latitude}</td>
          <td>${ship.longitude}</td>
          <td>${ship.course}</td>
          <td>${ship.type}</td>
          <td>${ship.state}</td>
          <td>${ship.length}</td>
          <td>${ship.speed}</td>
          <td>${ship.timestamp}</td>
          <td>${ship.fixed}</td>
        `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }

    function getShipsByLatitudeAndLongitudeRange(startLat, endLat, startLon, endLon) {
        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/latitude/${startLat}/${endLat}/longitude/${startLon}/${endLon}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
        <thead>
          <tr>
            <th>targetId</th>
            <th>mmsi</th>
            <th>heading</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>course</th>
            <th>type</th>
            <th>state</th>
            <th>length</th>
            <th>speed</th>
            <th>timestamp</th>
            <th>fixed</th>
          </tr>
        </thead>
      `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td>${ship.targetId}</td>
          <td>${ship.mmsi}</td>
          <td>${ship.heading}</td>
          <td>${ship.latitude}</td>
          <td>${ship.longitude}</td>
          <td>${ship.course}</td>
          <td>${ship.type}</td>
          <td>${ship.state}</td>
          <td>${ship.length}</td>
          <td>${ship.speed}</td>
          <td>${ship.timestamp}</td>
          <td>${ship.fixed}</td>
        `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }


    function getShipsByType(type) {
        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/type/${type}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
        <thead>
          <tr>
          <tr>
            <th>targetId</th>
            <th>mmsi</th>
            <th>heading</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>course</th>
            <th>type</th>
            <th>state</th>
            <th>length</th>
            <th>speed</th>
            <th>timestamp</th>
            <th>fixed</th>
          </tr>
        </thead>
      `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td>${ship.targetId}</td>
          <td>${ship.mmsi}</td>
          <td>${ship.heading}</td>
          <td>${ship.latitude}</td>
          <td>${ship.longitude}</td>
          <td>${ship.course}</td>
          <td>${ship.type}</td>
          <td>${ship.state}</td>
          <td>${ship.length}</td>
          <td>${ship.speed}</td>
          <td>${ship.timestamp}</td>
          <td>${ship.fixed}</td>
        `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }


    function getShipsByTimestampRange(startTimestamp, endTimestamp) {
        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/timestamp/${startTimestamp}/${endTimestamp}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
        <thead>
           <tr>
            <th>targetId</th>
            <th>mmsi</th>
            <th>heading</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>course</th>
            <th>type</th>
            <th>state</th>
            <th>length</th>
            <th>speed</th>
            <th>timestamp</th>
            <th>fixed</th>
          </tr>
        </thead>
      `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td>${ship.targetId}</td>
          <td>${ship.mmsi}</td>
          <td>${ship.heading}</td>
          <td>${ship.latitude}</td>
          <td>${ship.longitude}</td>
          <td>${ship.course}</td>
          <td>${ship.type}</td>
          <td>${ship.state}</td>
          <td>${ship.length}</td>
          <td>${ship.speed}</td>
          <td>${ship.timestamp}</td>
          <td>${ship.fixed}</td>
        `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }


    function getShipsByState(state) {
        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/state/${state}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
        <thead>
          <tr>
            <th>targetId</th>
            <th>mmsi</th>
            <th>heading</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>course</th>
            <th>type</th>
            <th>state</th>
            <th>length</th>
            <th>speed</th>
            <th>timestamp</th>
            <th>fixed</th>
          </tr>
        </thead>
      `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td>${ship.targetId}</td>
          <td>${ship.mmsi}</td>
          <td>${ship.heading}</td>
          <td>${ship.latitude}</td>
          <td>${ship.longitude}</td>
          <td>${ship.course}</td>
          <td>${ship.type}</td>
          <td>${ship.state}</td>
          <td>${ship.length}</td>
          <td>${ship.speed}</td>
          <td>${ship.timestamp}</td>
          <td>${ship.fixed}</td>
        `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }


    function getShipsByLength(length) {
        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/length/${length}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
        <thead>
          <tr>
            <th>targetId</th>
            <th>mmsi</th>
            <th>heading</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>course</th>
            <th>type</th>
            <th>state</th>
            <th>length</th>
            <th>speed</th>
            <th>timestamp</th>
            <th>fixed</th>
          </tr>
        </thead>
      `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td>${ship.targetId}</td>
          <td>${ship.mmsi}</td>
          <td>${ship.heading}</td>
          <td>${ship.latitude}</td>
          <td>${ship.longitude}</td>
          <td>${ship.course}</td>
          <td>${ship.type}</td>
          <td>${ship.state}</td>
          <td>${ship.length}</td>
          <td>${ship.speed}</td>
          <td>${ship.timestamp}</td>
          <td>${ship.fixed}</td>
        `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }

    function getShipsByLengthRange(minLength, maxLength) {
        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/length/${minLength}/${maxLength}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
        <thead>
          <tr>
            <th>targetId</th>
            <th>mmsi</th>
            <th>heading</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>course</th>
            <th>type</th>
            <th>state</th>
            <th>length</th>
            <th>speed</th>
            <th>timestamp</th>
            <th>fixed</th>
          </tr>
        </thead>
      `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td>${ship.targetId}</td>
          <td>${ship.mmsi}</td>
          <td>${ship.heading}</td>
          <td>${ship.latitude}</td>
          <td>${ship.longitude}</td>
          <td>${ship.course}</td>
          <td>${ship.type}</td>
          <td>${ship.state}</td>
          <td>${ship.length}</td>
          <td>${ship.speed}</td>
          <td>${ship.timestamp}</td>
          <td>${ship.fixed}</td>
        `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }
    function getShipsByLatitudeRange(LatitudeStart, LatitudeEnd) {
        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/latitude/${LatitudeStart}/${LatitudeEnd}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
            <thead>
              <tr>
                <th>targetId</th>
                <th>mmsi</th>
                <th>heading</th>
                <th>latitude</th>
                <th>longitude</th>
                <th>course</th>
                <th>type</th>
                <th>state</th>
                <th>length</th>
                <th>speed</th>
                <th>timestamp</th>
                <th>fixed</th>
              </tr>
            </thead>
          `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
              <td>${ship.targetId}</td>
              <td>${ship.mmsi}</td>
              <td>${ship.heading}</td>
              <td>${ship.latitude}</td>
              <td>${ship.longitude}</td>
              <td>${ship.course}</td>
              <td>${ship.type}</td>
              <td>${ship.state}</td>
              <td>${ship.length}</td>
              <td>${ship.speed}</td>
              <td>${ship.timestamp}</td>
              <td>${ship.fixed}</td>
            `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }
    function getShipsByLongitudeRange(LongitudeStart, LongitudeEnd) {
        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/longitude/${LongitudeStart}/${LongitudeEnd}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
            <thead>
              <tr>
                <th>targetId</th>
                <th>mmsi</th>
                <th>heading</th>
                <th>latitude</th>
                <th>longitude</th>
                <th>course</th>
                <th>type</th>
                <th>state</th>
                <th>length</th>
                <th>speed</th>
                <th>timestamp</th>
                <th>fixed</th>
              </tr>
            </thead>
          `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
              <td>${ship.targetId}</td>
              <td>${ship.mmsi}</td>
              <td>${ship.heading}</td>
              <td>${ship.latitude}</td>
              <td>${ship.longitude}</td>
              <td>${ship.course}</td>
              <td>${ship.type}</td>
              <td>${ship.state}</td>
              <td>${ship.length}</td>
              <td>${ship.speed}</td>
              <td>${ship.timestamp}</td>
              <td>${ship.fixed}</td>
            `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }
    function getShipsBySpeedRange(minSpeed, maxSpeed) {
        // 发起AJAX请求，获取船舶数据
        fetch(`/api/ship/speed/${minSpeed}/${maxSpeed}`)
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
        <thead>
          <tr>
            <th>targetId</th>
            <th>mmsi</th>
            <th>heading</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>course</th>
            <th>type</th>
            <th>state</th>
            <th>length</th>
            <th>speed</th>
            <th>timestamp</th>
            <th>fixed</th>
          </tr>
        </thead>
      `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td>${ship.targetId}</td>
          <td>${ship.mmsi}</td>
          <td>${ship.heading}</td>
          <td>${ship.latitude}</td>
          <td>${ship.longitude}</td>
          <td>${ship.course}</td>
          <td>${ship.type}</td>
          <td>${ship.state}</td>
          <td>${ship.length}</td>
          <td>${ship.speed}</td>
          <td>${ship.timestamp}</td>
          <td>${ship.fixed}</td>
        `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }


    function getShipsByMmsiList(mmsiList) {
        // 构造请求体对象
        const requestBody = {
            mmsiList: mmsiList
        };

        // 发起AJAX请求，获取船舶数据
        fetch('/api/ship/mmsiList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody) // 将请求体对象转换为JSON格式
        })
            .then(response => response.json()) // 将响应数据转换为JSON格式
            .then(data => {
                // 清空shipList div的内容
                shipList.innerHTML = '';

                // 检查船舶数据是否为空
                if (data.length === 0) {
                    shipList.innerHTML = '<p>No ships found.</p>';
                    return;
                }

                // 创建表格元素
                const table = document.createElement('table');
                table.innerHTML = `
        <thead>
          <tr>
            <th>targetId</th>
            <th>mmsi</th>
            <th>heading</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>course</th>
            <th>type</th>
            <th>state</th>
            <th>length</th>
            <th>speed</th>
            <th>timestamp</th>
            <th>fixed</th>
          </tr>
        </thead>
      `;

                // 遍历船舶数据，并添加到表格中
                data.forEach(ship => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td>${ship.targetId}</td>
          <td>${ship.mmsi}</td>
          <td>${ship.heading}</td>
          <td>${ship.latitude}</td>
          <td>${ship.longitude}</td>
          <td>${ship.course}</td>
          <td>${ship.type}</td>
          <td>${ship.state}</td>
          <td>${ship.length}</td>
          <td>${ship.speed}</td>
          <td>${ship.timestamp}</td>
          <td>${ship.fixed}</td>
        `;
                    table.appendChild(row);
                });

                // 将表格添加到shipList div中
                shipList.appendChild(table);
            })
            .catch(error => {
                console.error('Error:', error);
                shipList.innerHTML = '<p>An error occurred while retrieving ships.</p>';
            });
    }
    

});

const exportCSVButton = document.getElementById("exportCSVButton");
exportCSVButton.addEventListener("click", exportToCSV);
function exportToCSV() {
    const csvRows = [];// 创建一个空数组，用于存储 CSV 的每一行数据
    const headers = Array.from(document.querySelectorAll("#shipList thead tr th")).map(header => header.textContent.trim());
    // 获取表格头部的每一列标题，并使用 map 函数进行处理，去除标题中的多余空白字符
    csvRows.push(headers.join(","));
    // 将处理后的标题行转换为逗号分隔的字符串，并添加到 csvRows 数组中作为 CSV 的第一行
    // 获取表格中的所有行数据（包括表头和数据行）
    const rows = Array.from(document.querySelectorAll("#shipList tr")); //这有bug, 导出数据多了一空行，因为多读取了一个tr
    rows.forEach(row => {
        // 判断是否是表头行，如果是则跳过该行
        if (row.parentElement.tagName === 'THEAD') {
            return;
        }
        // 遍历每一行，获取行中的每个单元格数据，并使用 map 函数进行处理，去除单元格数据中的多余空白字符
        const rowData = Array.from(row.querySelectorAll("td")).map(cell => cell.textContent.trim());
        csvRows.push(rowData.join(","));
        // 将处理后的行数据转换为逗号分隔的字符串，并添加到 csvRows 数组中，形成 CSV 的数据行
    });

    const csvContent = csvRows.join("\n");
    // 将 csvRows 数组中的每一行数据使用换行符连接成一个完整的 CSV 内容字符串
    const blob = new Blob([csvContent], { type: "text/csv" });
    // 创建 Blob 对象，用于存储 CSV 内容
    const url = URL.createObjectURL(blob);
    // 通过 URL.createObjectURL() 方法创建一个包含 CSV 内容的 URL
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ship_data.csv");
    // 创建一个 <a> 元素，设置其 href 属性为包含 CSV 内容的 URL，设置 download 属性为文件名 "ship_data.csv"
    link.style.display = "none";
    document.body.appendChild(link);
    // 将 <a> 元素添加到文档中的 body 中
    link.click();
    // 模拟用户点击 <a> 元素，触发下载操作
    document.body.removeChild(link);
    // 下载完成后，从文档中移除 <a> 元素
}


const exportExcelButton = document.getElementById("exportExcelButton");
exportExcelButton.addEventListener("click", exportToExcel);
function exportToExcel() {
    // const table = document.getElementById("shipList table");
    const table = document.querySelector("#shipList table");
    // const rows = Array.from(table.querySelectorAll("tbody tr"));//没用
    // console.log(rows);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ship Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ship_data.xlsx");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


