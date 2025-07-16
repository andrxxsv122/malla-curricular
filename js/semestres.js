//Agregar semestre
document.addEventListener("DOMContentLoaded", function () {
    const boton = document.getElementById("fabAgregarSemestre");

    if (boton) {
        let numeroSemestre = document.querySelectorAll('.semestre').length;

        boton.addEventListener("click", function () {
            numeroSemestre++;

            const nuevoSemestre = document.createElement("div");
            nuevoSemestre.className = "semestre";
            nuevoSemestre.id = `semestre-${numeroSemestre}`;
            nuevoSemestre.setAttribute("ondrop", "drop(event)");
            nuevoSemestre.setAttribute("ondragover", "allowDrop(event)");

            nuevoSemestre.addEventListener("dragleave", (ev) => {
                ev.currentTarget.classList.remove("drag-over");
            });

            const titulo = document.createElement("h2");
            titulo.textContent = `${numeroSemestre}° Semestre`;

            nuevoSemestre.appendChild(titulo);
            document.querySelector(".semestres").appendChild(nuevoSemestre);

            const nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = numeroSemestre;
            nuevaOpcion.textContent = `${numeroSemestre}° Semestre`;
            document.getElementById("semestre").appendChild(nuevaOpcion);
        });
    }
});