document.addEventListener("DOMContentLoaded", () => {
    const titulo = document.getElementById('titulo-malla');
    
    const guardado = localStorage.getItem('tituloMalla');
    if (guardado) {
        titulo.textContent = guardado;
        document.title = guardado; 
    }

    titulo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            titulo.blur();
        }
    });

    titulo.addEventListener('blur', () => {
        const texto = titulo.textContent.trim();
        if (texto.length > 0) {
            localStorage.setItem('tituloMalla', texto);
            document.title = texto; 
        }
    });

    restaurarRamosLS();
    inicializarMenuAcciones();
});

document.addEventListener('click', cerrarMenus);
