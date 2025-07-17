//Formulario (inputs, card ramo)
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("formulario").addEventListener("submit", function (e) {
        e.preventDefault();

        const codigo = document.getElementById("codigo").value.trim();
        const nombre = document.getElementById("nombre").value.trim();
        const semestre = document.getElementById("semestre").value;
        const contenedor = document.getElementById(`semestre-${semestre}`);
        const ramo = document.createElement("div");

        if (!nombre) {
            alert("Por favor ingresa el nombre del ramo.");
            return;
        }

        if (!semestre) {
            alert("Por favor selecciona un semestre.");
            return;
        }

        ramo.className = "ramo";
        ramo.draggable = true;
        ramo.dataset.id = "ramo-" + Date.now();
        ramo.dataset.codigo = codigo || ramo.dataset.id;
        ramo.ondragstart = drag;

        ramo.innerHTML = `
      <div class="contenido-ramo">
        <div class="ramo-info">
          <span>${codigo ? `${codigo} -` : `<em style="color:#888;">Sin código -</em>`}<br>${nombre}</span>
        </div>
        <div class="prerrequisitos">
          <strong>Prerrequisitos:</strong> <span class="lista-prerrequisitos">Ninguno</span>
        </div>
      </div>`;

        contenedor.appendChild(ramo);
        guardarRamoLS();

        // Menú contextual con clic derecho
        ramo.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            cerrarMenus();

            const menuAcciones = document.getElementById("menu-acciones");
            const otrosRamos = Array.from(document.querySelectorAll('.ramo')).filter(r => r !== ramo);
            const btnReset = menuAcciones.querySelector('.btn-reset');
            const btnPrerrequisito = menuAcciones.querySelector('.btn-prerrequisito');
            menuAcciones.dataset.ramoId = ramo.dataset.id;

            if (ramo.classList.contains('aprobado') || ramo.classList.contains('reprobado') || ramo.classList.contains('cursando')) {
                btnReset.style.display = "block";
            } else {
                btnReset.style.display = "none";
            }

            if (otrosRamos.length === 0) {
                btnPrerrequisito.style.display = "none";
            } else {
                btnPrerrequisito.style.display = "block";
            }

            menuAcciones.style.position = "fixed";
            menuAcciones.style.left = `${e.clientX}px`;
            menuAcciones.style.top = `${e.clientY}px`;
            menuAcciones.classList.remove("oculto");
        });

        // Limpiar formulario
        document.getElementById("codigo").value = "";
        document.getElementById("nombre").value = "";
        document.getElementById("semestre").selectedIndex = 0;
        document.getElementById("codigo").focus();
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const btnBorrar = document.getElementById('btn-borrar');
    if (btnBorrar) {
        btnBorrar.addEventListener('click', () => {
            if (confirm("¿Estás seguro que quieres borrar todo?")) {
                localStorage.clear();
                location.reload();
            }
        });
    }
});
