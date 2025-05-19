const students=[];

const tableBody=document.querySelector("#studentsTable tbody");
const averageDiv=document.getElementById("average");

document.getElementById("studentForm").addEventListener("submit",function(e){
    e.preventDefault();

    const name=document.getElementById("name").value.trim();
    const lastName=document.getElementById("lastName").value.trim();
    const grade=parseFloat(document.getElementById("grade").value.trim());

    if(grade <1 || grade >7 || !name || !lastName || isNaN(grade)){
    alert("Error Datos Incorrectos")
    return
    }

    //guardar datos en el Array nuevo

    const student={name,lastName,grade};
    students.push(student);
     addStudentToTable(student)
     calcularPromedio()
   // console.log(students)

    this.reset();

});

function addStudentToTable(student){
    const row=document.createElement("tr");
    row.innerHTML=
    `<td>${student.name}</td>
     <td>${student.lastName}</td>
    <td>${student.grade}</td>
    <td></td>
    <td><button class="delete">Eliminar</button> <button class="edit">Editar</button></td>
    `;
 row.querySelector(".delete").addEventListener("click",function(){
    deleteEstudiante(student,row);
 });
   tableBody.appendChild(row);
}

function deleteEstudiante(student,row){
    //Buscar el estudiante por el array
    const index=students.indexOf(student);
    if(index > -1){
        students.splice(index,1);
        row.remove();
        calcularPromedio();
    }
 };

function calcularPromedio(){
    if(students.length===0){
       averageDiv.textContent="Promedio General del Curso:N/A"
        return;
    }
    const total=students.reduce((sum,s)=>sum+s.grade,0);
    console.log(total)
    const average=total/students.length;
    console.log(average)
    averageDiv.textContent=`Promedio General del Curso: ${average.toFixed(2)}`;
}
