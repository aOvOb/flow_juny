let loadedData

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:9298/getAll')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
    loadHTMLTable([])
});

document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
    // if (event.target.className === "goCheck") {
    //     handleEditRow(event.target.dataset.id);
    // }
});

const updateBtn = document.querySelector('#update-row-btn');
const searchBtn = document.querySelector('#search-btn');

// searchBtn.onclick = function() {
//     const searchValue = document.querySelector('#search-input').value;

//     fetch('http://localhost:9298/search/' + searchValue)
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
// }

function deleteRowById(id) {
    fetch('http://localhost:9298/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-name-input').dataset.id = id;
}

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');


    console.log(updateNameInput);

    fetch('http://localhost:9298/update', {
        method: 'PATCH',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
}


const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function () {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    // 이름 중복체크 로직
    let arrExtName = []
    try{
        if(name=='' || name == null|| name==undefined){
            alert('확장자명을 입력해주세요')
            throw '확장자명을 입력해주세요'
        }
        for( let i = 0; i<loadedData.length; i++){
            arrExtName.push(loadedData[i].FW_EXT_NAME)
        }
        console.log('$$$이름중복체크', arrExtName)
        console.log('$$$$$name value : ', name)
        if(arrExtName.includes(name)){
            alert('This Extension is Already Banned !')
            throw 'This Extension is Already Banned !'
        } 
    } catch{
        console.log()
    }

    fetch('http://localhost:9298/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ 
            name : name
        })
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));

    location.reload()
}

// const checkBox = document.querySelector('#checkBox')
// checkBox.onclick = function () {
//     const nameInput = document.querySelector('#checkBox');
//     const name = nameInput.value;
//     nameInput.value = "";

//     fetch('http://localhost:9298/insert', {
//         headers: {
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({ 
//             name : name
//         })
//     })
//     .then(response => response.json())
//     .then(data => insertRowIntoTable(data['data']));
// }

function insertRowIntoTable(data) {
    console.log(data);
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        // console.log('여기는 데이터', data)
        // console.log('여기는 키', key)
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            data.forEach(function ({SYS_ID, FW_EXT_NAME, SYS_MODIFY_DATE}) {
                tableHtml += "<tr>";
                // tableHtml += `<td>${SYS_ID}</td>`;
                tableHtml += `<td>${FW_EXT_NAME}</td>`;
                // tableHtml += `<td>${SYS_MODIFY_DATE}</td>`;
                tableHtml += `<td><button class="delete-row-btn" data-id=${SYS_ID}>Delete</td>`;
                // tableHtml += `<td><button class="edit-row-btn" data-id=${SYS_ID}>Edit</td>`;
                tableHtml += "</tr>";
            });
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length == 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";
    loadedData = data
    console.log(loadedData)

    data.forEach(function ({SYS_ID, FW_EXT_NAME, SYS_MODIFY_DATE}) {
        tableHtml += "<tr>";
        // tableHtml += `<td>${SYS_ID}</td>`;
        tableHtml += `<td>${FW_EXT_NAME}</td>`;
        // tableHtml += `<td>${SYS_MODIFY_DATE}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${SYS_ID}>Delete</td>`;
        // tableHtml += `<td><button class="edit-row-btn" data-id=${SYS_ID}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}