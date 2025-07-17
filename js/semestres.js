//Agregar semestre
document.addEventListener("DOMContentLoaded", function () {
    const boton = document.getElementById("fabAgregarSemestre");

    if (boton) {
        let numeroSemestre = document.querySelectorAll('.semestre').length;

        boton.addEventListener("click", function () {
            const numeros = Array.from(document.querySelectorAll('.semestre'))
                .map(s => parseInt(s.id.split('-')[1]))
                .filter(n => !isNaN(n));

            const maxNumero = numeros.length > 0 ? Math.max(...numeros) : 0;
            const nuevoNumero = maxNumero + 1;

            const nuevoSemestre = document.createElement("div");
            nuevoSemestre.className = "semestre";
            nuevoSemestre.id = `semestre-${nuevoNumero}`;
            nuevoSemestre.setAttribute("ondrop", "drop(event)");
            nuevoSemestre.setAttribute("ondragover", "allowDrop(event)");

            nuevoSemestre.addEventListener("dragleave", (ev) => {
                ev.currentTarget.classList.remove("drag-over");
            });

            const titulo = document.createElement("h2");
            titulo.textContent = `${nuevoNumero}° Semestre`;

            nuevoSemestre.appendChild(titulo);
            document.querySelector(".semestres").appendChild(nuevoSemestre);

            const nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = nuevoNumero;
            nuevaOpcion.textContent = `${nuevoNumero}° Semestre`;
            document.getElementById("semestre").appendChild(nuevaOpcion);
        });
    }
});