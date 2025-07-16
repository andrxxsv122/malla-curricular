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

            if (ramo.classList.contains('aprobado') || ramo.classList.contains('reprobado') || ramo.classList.contains('cursando')) {
                btnReset.style.display = "block";
            } else {
                btnReset.style.display = "none";
            }

            const otrosRamos = Array.from(document.querySelectorAll('.ramo')).filter(r => r !== ramo);
            const btnPrerrequisito = menuAcciones.querySelector('.btn-prerrequisito');

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
    });
}