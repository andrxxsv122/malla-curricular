function puedeCursar(ramo) {
    const idsPrerrequisitos = ramo.dataset.prerrequisitos ? ramo.dataset.prerrequisitos.split(",") : [];
    if (idsPrerrequisitos.length === 0) return true;

    return idsPrerrequisitos.every(id => {
        const prereq = document.querySelector(`.ramo[data-codigo='${id}']`) ||
            document.querySelector(`.ramo[data-id='${id}']`);
        return prereq && (prereq.classList.contains('aprobado') || prereq.classList.contains('cursando'));
    });
}

function puedeAprobar(ramo) {
    const idsPrerrequisitos = ramo.dataset.prerrequisitos ? ramo.dataset.prerrequisitos.split(",") : [];
    if (idsPrerrequisitos.length === 0) return true;

    return idsPrerrequisitos.every(id => {
        const prereq = document.querySelector(`.ramo[data-codigo='${id}']`) || document.querySelector(`.ramo[data-id='${id}']`);
        return prereq && prereq.classList.contains('aprobado');
    });
}

function inicializarMenuAcciones() {
    const menuAcciones = document.getElementById("menu-acciones");

    document.querySelector('#menu-acciones .aprobado-btn').addEventListener('click', () => {
        const id = menuAcciones.dataset.ramoId;
        const ramo = document.querySelector(`[data-id="${id}"]`);
        if (ramo && !puedeAprobar(ramo)) {
            alert("No puedes aprobar este ramo sin haber aprobado todos sus prerrequisitos.");
            return;
        }
        ramo.classList.add('aprobado');
        ramo.classList.remove('reprobado', 'cursando');
        guardarRamoLS();
        cerrarMenus();
    });

    document.querySelector('#menu-acciones .reprobado-btn').addEventListener('click', () => {
        const id = menuAcciones.dataset.ramoId;
        const ramo = document.querySelector(`[data-id="${id}"]`);
        if (ramo) {
            ramo.classList.add('reprobado');
            ramo.classList.remove('aprobado', 'cursando');
        }
        guardarRamoLS();
        cerrarMenus();
    });
    

    document.querySelector('#menu-acciones .btn-cursando').addEventListener('click', () => {
        const id = menuAcciones.dataset.ramoId;
        const ramo = document.querySelector(`[data-id="${id}"]`);
        if (ramo && !puedeCursar(ramo)) {
            alert("No puedes cursar este ramo porque no se han cumplido sus prerrequisitos.");
            return;
        }
        ramo.classList.add('cursando');
        ramo.classList.remove('aprobado', 'reprobado');
        guardarRamoLS();
        cerrarMenus();
    });

    document.querySelector('#menu-acciones .btn-reset').addEventListener('click', () => {
        const id = menuAcciones.dataset.ramoId;
        const ramo = document.querySelector(`[data-id="${id}"]`);
        if (ramo) {
            ramo.classList.remove('aprobado', 'reprobado', 'cursando');
        }
        guardarRamoLS();
        cerrarMenus();
    });

    document.querySelector('#menu-acciones .btn-delete').addEventListener('click', () => {
        const id = menuAcciones.dataset.ramoId;
        const ramo = document.querySelector(`[data-id="${id}"]`);
        if (ramo) ramo.remove();
        guardarRamoLS();
        cerrarMenus();
    });

    document.querySelector('#menu-acciones .btn-prerrequisito').addEventListener('click', () => {
        const id = menuAcciones.dataset.ramoId;
        const ramo = document.querySelector(`[data-id="${id}"]`);
        if (!ramo) return;

        const modal = document.getElementById("modal-prerrequisitos");
        const lista = document.getElementById("lista-prerrequisitos");
        lista.innerHTML = "";

        const todos = Array.from(document.querySelectorAll('.ramo')).filter(r => r.dataset.id !== id);
        const prerrequisitosGuardados = (ramo.dataset.prerrequisitos || "").split(",");

        todos.forEach(r => {
            const cod = r.dataset.codigo || r.dataset.id;
            const span = r.querySelector('span');
            let nombreCompleto = '';

            if (span) {
                const partes = span.innerHTML.split('<br>');
                nombreCompleto = partes.length > 1 ? partes[1].trim() : span.textContent.trim();
            }

            const mostrarNombre = (r.dataset.codigo && r.dataset.codigo !== r.dataset.id) ? `${r.dataset.codigo} - ${nombreCompleto}` : `SC - ${nombreCompleto}`;
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = cod;

            if (prerrequisitosGuardados.includes(cod)) checkbox.checked = true;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + mostrarNombre));
            lista.appendChild(label);
        });

        modal.classList.remove("hidden");

        document.getElementById("confirmarPrerrequisitos").onclick = () => {
            const seleccionados = Array.from(lista.querySelectorAll("input:checked")).map(c => c.value);

            const etiquetasPrerrequisitos = seleccionados.map(cod => {
                const prereqRamo = document.querySelector(`[data-codigo='${cod}'], [data-id='${cod}']`);
                if (!prereqRamo) return cod;

                const span = prereqRamo.querySelector("span");
                let nombre = "";

                if (span) {
                    const partes = span.innerHTML.split('<br>');
                    nombre = partes.length > 1 ? partes[1].trim() : span.textContent.trim();
                }

                const etiqueta = (prereqRamo.dataset.codigo && prereqRamo.dataset.codigo !== prereqRamo.dataset.id)
                    ? `${prereqRamo.dataset.codigo} - ${nombre}`
                    : `SC - ${nombre}`;

                return etiqueta.length > 25 ? etiqueta.slice(0, 25) + "…" : etiqueta;
            });

            ramo.querySelector('.lista-prerrequisitos').textContent = etiquetasPrerrequisitos.length > 0 ? etiquetasPrerrequisitos.join(", ") : "Ninguno";
            ramo.dataset.prerrequisitos = seleccionados.join(",");

            modal.classList.add("hidden");
            guardarRamoLS();
            cerrarMenus();
        };

        document.getElementById("cancelarPrerrequisitos").onclick = () => {
            modal.classList.add("hidden");
        };
    });
}