// Drag & Drop de los ramos
let ramoEnMovimiento = null;

function drag(ev) {
    ramoEnMovimiento = ev.target;
    ev.dataTransfer.setData("text/plain", ev.target.dataset.id);
}

function allowDrop(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add("drag-over");
}

function drop(ev) {
    ev.preventDefault();
    const contenedor = ev.currentTarget;

    if (!contenedor || !ramoEnMovimiento) return;

    if (contenedor.classList && contenedor.classList.contains("semestre")) {
        contenedor.appendChild(ramoEnMovimiento);

        ramoEnMovimiento.classList.add("animado");

        setTimeout(() => {
            ramoEnMovimiento.classList.remove("animado");
        }, 300);
    }

    if (contenedor.classList) {
        contenedor.classList.remove("drag-over");
    }

    ramoEnMovimiento = null;
}


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.semestre').forEach(sem => {
        sem.addEventListener("dragleave", (ev) => {
            ev.currentTarget.classList.remove("drag-over");
        });
    });
});

let autoScrollInterval = null;

document.addEventListener("dragover", (e) => {
    const scrollZone = 150;
    const scrollSpeed = 30;
    const semestres = document.querySelector(".semestres");

    const { clientX } = e;
    const { left, right } = semestres.getBoundingClientRect();

    clearInterval(autoScrollInterval);

    if (clientX > right - scrollZone) { autoScrollInterval = setInterval(() => { semestres.scrollLeft += scrollSpeed; }, 8); }
    else if (clientX < left + scrollZone) { autoScrollInterval = setInterval(() => { semestres.scrollLeft -= scrollSpeed; }, 8); }
});