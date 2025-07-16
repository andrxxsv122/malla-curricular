//Función global para cerrar todos los menús
function cerrarMenus() {
    document.querySelectorAll('.acciones').forEach(menu => {
        menu.classList.add('oculto');
        menu.style.left = null;
        menu.style.top = null;
    });

    document.querySelectorAll('.ramo.z-top').forEach(r => {
        r.classList.remove('z-top');
    });
}

function generarIniciales(texto) {
    return texto.trim().split(/\s+/).map(p => p[0]?.toUpperCase() || '').join('').slice(0, 5) || 'SC';
}