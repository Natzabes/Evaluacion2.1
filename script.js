const students = [];

const spanAverage = document.getElementById("average-grade");
const totalTabla = document.getElementById("total");
const toApru = document.getElementById("aprueba");
const toRepru = document.getElementById("reprueba");
const tableBody = document.querySelector("#studentsTable tbody")
const form = document.getElementById("studentForm");
const editBtn = document.getElementById("form-edit");
let estaEnModoEditar = false;

function calcularPromedio() {
    totalTabla.textContent = students.length;
    toApru.textContent = 0
    toRepru.textContent = 0
    
    if (students.length === 0) return spanAverage.textContent = `No Disponible`;
    if (students.length === 1){
        if (parseInt(students[0].grade) < 4.0) {
            toRepru.textContent = 1 
        }
        else toApru.textContent = 1
        return spanAverage.textContent = `${students[0].grade}`;
    } 
    let average = 0
    
    for (let i = 0; i < students.length; i++) {
        if (parseInt(students[i].grade) < 4.0) {
            toRepru.textContent = parseInt(toRepru.textContent) + 1
        }
        else toApru.textContent = parseInt(toApru.textContent) + 1
        average += Math.floor(students[i].grade * 100) * 0.01;
    }
    average = average / students.length;
    spanAverage.textContent =  average.toFixed(1);
}

function encontrarFilaSelec() {
    const listaFilas = document.querySelectorAll("tbody tr");
    let filaEncontrada = null;
    listaFilas.forEach((fila) => {
        if(fila.querySelector(".edit").checked) filaEncontrada = fila;
    })
    return filaEncontrada;
}

function formSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const grade = document.getElementById("grade").value.trim();
    form.reset();
    //guardar datos en el Array nuevo
    const student = {name, lastName, grade};
    students.push(student);
    calcularPromedio();
    addStudentToTable(student);
}
form.onsubmit = formSubmit;

function cambiarEstiloForm() {
    const formBtn = document.getElementById("form-btn");
    const divForm = document.getElementById("form-container");
    const radioList = document.querySelectorAll("input.edit");
    form.reset()
    if(!estaEnModoEditar) {
        divForm.classList.remove("border-warning");
        divForm.classList.add("border-primary");

        formBtn.textContent = "Guardar Estudiante"
        formBtn.classList.remove("btn-warning");
        formBtn.classList.add("btn-primary");
        form.onsubmit = formSubmit;

        radioList.forEach((radio) => radio.setAttribute("disabled", ""))
        editBtn.textContent = "Modo Edición";
        let fila = encontrarFilaSelec()
        if(fila) encontrarFilaSelec().querySelector(".edit").checked = false;
        return
    }
    divForm.classList.remove("border-primary");
    divForm.classList.add("border-warning");
    
    formBtn.textContent = "Editar Estudiante"
    formBtn.classList.remove("btn-primary");
    formBtn.classList.add("btn-warning");

    radioList.forEach((radio) => radio.removeAttribute("disabled"))
    editBtn.textContent = "Salir Edición";
}

editBtn.addEventListener("click", (e) => {
    estaEnModoEditar = !estaEnModoEditar;
    cambiarEstiloForm()
})

function eliminarEstudiante(student, row) {
    //Buscar el estudiante por el array
    const index = students.indexOf(student, row);
    if(index > -1) {
        students.splice(index, 1);
        row.remove();
        calcularPromedio();
    }
}

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.innerHTML = 
    `
        <td class="colDato">${student.name}</td>
        <td class="colDato">${student.lastName}</td>
        <td class="colDato">${student.grade}</td>
        <td class="colAcciones">
            <button class="btn btn-danger mb-1 delete">Eliminar</button>
            <div class="container column text-center div_edit">
                <p class="mb-0">Editar:</p>
                <input type="radio" class="form-check-input edit" name="edit" disabled>
            </div>
        </td>
    `;
    const btnDelete = row.getElementsByClassName("delete")[0];
    const radioEdit = row.getElementsByClassName("edit")[0];

    btnDelete.addEventListener("click", function(e) {
        if(radioEdit.checked) {
            estaEnModoEditar = false;
            cambiarEstiloForm()
        };
        eliminarEstudiante(student, row);
    });

    radioEdit.addEventListener("click", function(e) {
        const inputs = document.querySelectorAll("input.form-control");
        inputs[0].value = student.name
        inputs[1].value = student.lastName
        inputs[2].value = student.grade
        
        form.onsubmit = function(e) {
            e.preventDefault();
            
            student.name = inputs[0].value.trim();
            student.lastName = inputs[1].value.trim();
            student.grade = inputs[2].value.trim();

            const cols = encontrarFilaSelec().querySelectorAll(".colDato");
            cols[0].textContent = `${student.name}`;
            cols[1].textContent = `${student.lastName}`;
            cols[2].textContent = `${student.grade}`;

            calcularPromedio();
            estaEnModoEditar = false;
            cambiarEstiloForm();
        }
    });
    tableBody.appendChild(row);
}
