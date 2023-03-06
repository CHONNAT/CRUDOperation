// =====================< get API From Scrip App GG >====================
let api = "https://script.google.com/macros/s/AKfycbymiJGP4yPavmU4mCWT2_ko8dfMAX1rqti2iPn__da4zB1I0B28y8A6Wah_BKHAns6VNg/exec";
let form = document.querySelector("form");
let add = document.querySelector(".add");
let update = document.querySelector(".update");
let tbody = document.querySelector("tbody");

// =====================< Insert Data to GGSheet >====================
function addData() {
    add.textContent = "Adding..";
    let obj = {
        todo: form[0].value
    }
    fetch(api, {
        method: "POST",
        body: JSON.stringify(obj)
    })
        .then(res => res.text())
        .then(data => {
            readData();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Data has been saved',
                showConfirmButton: false,
                timer: 1500
            })
            add.textContent = "Add Todo"
            form.reset();
        });
}

// =====================< Record Data From GGSheet >====================
function readData() {
    fetch(api)
        .then(res => res.json())
        .then(data => {
            let todo = data.todo;
            let trtd = todo.map(each => {
                let id = each[0];
                let stingTodo = each[1];
                return `
            <tr>
                <td class="id">${id}</td>
                <td class="data">${stingTodo}</td>
                <td class="edit" onclick="updateCall(this, ${id})">Edit</td>
                <td class="delete" onclick="delData(${id})">Delete</td>
            </tr>
            `
            })
            tbody.innerHTML = trtd.join("");
            form.reset();
        })

}
readData()

// =====================< Delete Data From GGSheet >====================
function delData(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
        if (result.isConfirmed) {
            fetch(api + `?dl=true&id=${id}`)
                .then(res => res.text())
                .then(data => {
                    readData()
                })
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            )
        }
    })
}

// =====================< Update Data From GGSheet >====================
function updateCall(elm, id) {
    add.style.display = "none";
    update.style.display = "unset";
    let todo = elm.parentElement.querySelector(".data").textContent;
    form[0].value = todo;
    
    update.setAttribute("onclick", `updateData(${id})`);
}

function updateData(id) {
    fetch(api + `?update=true&id=${id}&data=${form[0].value}`)
        .then(res => res.text())
        .then(data => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Data has been Updated',
                showConfirmButton: false,
                timer: 1500
            })
            readData()
            add.style.display = "";
            update.style.display = "none";
        })
}
