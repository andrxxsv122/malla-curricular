document.addEventListener("DOMContentLoaded", () => {
    const btnExportar = document.getElementById("btn-exportar");
    const btnImportar = document.getElementById("btn-importar");
    const inputImportar = document.getElementById("input-importar");

    btnExportar.addEventListener("click", () => {
        const data = localStorage.getItem("estadoRamos");
        const titulo = localStorage.getItem("tituloMalla") || "malla-exportada";
        if (!data) return alert("No hay malla para exportar.");

        const blob = new Blob([data], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${titulo}.json`;
        a.click();

        URL.revokeObjectURL(url);
    });

    btnImportar.addEventListener("click", () => inputImportar.click());

    inputImportar.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        document.activeElement.blur();

        const nombre = document.getElementById("nombre");
        const semestre = document.getElementById("semestre");
        const nombreRequired = nombre.required;
        const semestreRequired = semestre.required;
        nombre.required = false;
        semestre.required = false;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                if (!Array.isArray(data)) throw new Error("Formato no válido");

                localStorage.setItem("estadoRamos", JSON.stringify(data));

                nombre.required = nombreRequired;
                semestre.required = semestreRequired;

                location.reload();
            } catch (err) {
                alert("Error al importar el archivo. Asegúrate de que sea un JSON válido.");

                nombre.required = nombreRequired;
                semestre.required = semestreRequired;
            }
        };
        reader.readAsText(file);
    });
});
