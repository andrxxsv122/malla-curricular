function guardarRamoLS() {
    const ramos = Array.from(document.querySelectorAll('.ramo')).map(ramo => ({
        id: ramo.dataset.id,
        codigo: ramo.dataset.codigo,
        nombre: (() => {
            const span = ramo.querySelector('span');
            if (!span) return '';
            const html = span.innerHTML;
            const partes = html.split('<br>');
            return partes.length > 1 ? partes[1].trim() : span.textContent.trim();
        })(),
        
        semestreId: ramo.closest('.semestre')?.id || '',
        estado: ramo.classList.contains('aprobado') ? 'aprobado'
            : ramo.classList.contains('reprobado') ? 'reprobado'
                : ramo.classList.contains('cursando') ? 'cursando'
                    : '',
        prerrequisitos: ramo.dataset.prerrequisitos || ''
    }));
    localStorage.setItem('estadoRamos', JSON.stringify(ramos));
}

function restaurarRamosLS() {
    const data = JSON.parse(localStorage.getItem('estadoRamos') || '[]');

    const idsSemestres = [...new Set(data.map(r => r.semestreId))]; 
    
    idsSemestres.forEach(id => {
        if (!document.getElementById(id)) {
            const numero = parseInt(id.split('-')[1]);
            const nuevoSemestre = document.createElement("div");
            nuevoSemestre.className = "semestre";
            nuevoSemestre.id = id;
            nuevoSemestre.setAttribute("ondrop", "drop(event)");
            nuevoSemestre.setAttribute("ondragover", "allowDrop(event)");
            nuevoSemestre.addEventListener("dragleave", (ev) => {
                ev.currentTarget.classList.remove("drag-over");
            });

            const titulo = document.createElement("h2");
            titulo.textContent = `${numero}° Semestre`;
            nuevoSemestre.appendChild(titulo);
            document.querySelector(".semestres").appendChild(nuevoSemestre);

            const nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = numero;
            nuevaOpcion.textContent = `${numero}° Semestre`;
            document.getElementById("semestre").appendChild(nuevaOpcion);
        }
    });

    data.forEach(r => {
        const contenedor = document.getElementById(r.semestreId);
        if (!contenedor) return;

        const ramo = document.createElement("div");
        ramo.className = "ramo";
        ramo.draggable = true;
        ramo.dataset.id = r.id;
        ramo.dataset.codigo = r.codigo;
        ramo.dataset.prerrequisitos = r.prerrequisitos || '';
        ramo.ondragstart = drag;

        if (r.estado === 'aprobado') ramo.classList.add('aprobado');
        else if (r.estado === 'reprobado') ramo.classList.add('reprobado');
        else if (r.estado === 'cursando') ramo.classList.add('cursando');

        ramo.innerHTML = `
          <div class="contenido-ramo">
            <div class="ramo-info">
              <span>${r.codigo && !r.codigo.startsWith('ramo-') ? `${r.codigo} -` : `<em style="color:#888;">Sin código -</em>`}<br>${r.nombre}</span>
            </div>
            <div class="prerrequisitos">
              <strong>Prerrequisitos:</strong> <span class="lista-prerrequisitos">${r.prerrequisitos || "Ninguno"}</span>
            </div>
          </div>`;

        contenedor.appendChild(ramo);

        ramo.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            cerrarMenus();

            const menuAcciones = document.getElementById("menu-acciones");
            menuAcciones.dataset.ramoId = ramo.dataset.id;

            const btnReset = menuAcciones.querySelector('.btn-reset');
            btnReset.style.display = (ramo.classList.contains('aprobado') || ramo.classList.contains('reprobado') || ramo.classList.contains('cursando')) ? "block" : "none";

            const otrosRamos = Array.from(document.querySelectorAll('.ramo')).filter(r => r !== ramo);
            const btnPrerrequisito = menuAcciones.querySelector('.btn-prerrequisito');
            btnPrerrequisito.style.display = (otrosRamos.length === 0) ? "none" : "block";

            menuAcciones.style.position = "fixed";
            menuAcciones.style.left = `${e.clientX}px`;
            menuAcciones.style.top = `${e.clientY}px`;
            menuAcciones.classList.remove("oculto");
        });
    });
}