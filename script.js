const formulario = document.getElementById("formulario-auto");
const contenedorAutos = document.getElementById("contenedor-autos");
const mensajeVacio = document.getElementById("mensaje-vacio");
const botonAgregar = document.querySelector(".boton-agregar");
const buscarAuto = document.getElementById("buscar-auto");
const filtrarTipo = document.getElementById("filtrar-tipo");
const ordenarAutos = document.getElementById("ordenar-autos");

const totalAutos = document.getElementById("total-autos");
const totalFavoritos = document.getElementById("total-favoritos");
const totalDeportivos = document.getElementById("total-deportivos");

const botonTema = document.getElementById("boton-tema");

let autos = JSON.parse(localStorage.getItem("autos")) || [];
let indiceEditando = null;

function guardarAutos() {
    localStorage.setItem("autos", JSON.stringify(autos));
}

function obtenerColorCSS(color) {
    const colores = {
        rojo: "red",
        azul: "blue",
        negro: "black",
        blanco: "white",
        verde: "green",
        amarillo: "yellow",
        naranja: "orange",
        gris: "gray",
        morado: "purple",
        violeta: "violet",
        rosa: "pink",
        cafe: "brown",
        café: "brown",
        plateado: "silver",
        dorado: "gold",
        beige: "beige",
        turquesa: "turquoise",
        celeste: "skyblue"
    };

    return colores[color.toLowerCase()] || color;
}

function actualizarEstadisticas() {
    totalAutos.textContent = autos.length;

    const favoritos = autos.filter(function(auto) {
        return auto.favorito;
    });

    totalFavoritos.textContent = favoritos.length;

    const deportivos = autos.filter(function(auto) {
        return auto.tipo === "Deportivo";
    });

    totalDeportivos.textContent = deportivos.length;
}

function mostrarAutos() {
    contenedorAutos.innerHTML = "";

    actualizarEstadisticas();

    const textoBusqueda = buscarAuto.value.trim().toLowerCase();
    const tipoSeleccionado = filtrarTipo.value;
    const ordenSeleccionado = ordenarAutos.value;

    let autosFiltrados = autos.filter(function(auto) {
        const coincideBusqueda =
            auto.marca.toLowerCase().includes(textoBusqueda) ||
            auto.modelo.toLowerCase().includes(textoBusqueda);

        const coincideTipo =
            tipoSeleccionado === "Todos" ||
            auto.tipo === tipoSeleccionado;

        return coincideBusqueda && coincideTipo;
    });

    autosFiltrados = [...autosFiltrados];

    if (ordenSeleccionado === "marca") {
        autosFiltrados.sort(function(a, b) {
            return a.marca.localeCompare(b.marca);
        });
    }

    if (ordenSeleccionado === "recientes") {
        autosFiltrados.sort(function(a, b) {
            return Number(b.anio) - Number(a.anio);
        });
    }

    if (ordenSeleccionado === "antiguos") {
        autosFiltrados.sort(function(a, b) {
            return Number(a.anio) - Number(b.anio);
        });
    }

    if (ordenSeleccionado === "potencia") {
        autosFiltrados.sort(function(a, b) {
            return Number(b.potencia) - Number(a.potencia);
        });
    }

    if (autos.length === 0) {
        mensajeVacio.textContent = "Todavía no tienes autos en tu garaje.";
        mensajeVacio.style.display = "block";
        return;
    }

    if (autosFiltrados.length === 0) {
        mensajeVacio.textContent = "No se encontraron autos.";
        mensajeVacio.style.display = "block";
        return;
    }

    mensajeVacio.style.display = "none";

    autosFiltrados.forEach(function(auto) {
        const indice = autos.indexOf(auto);

        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-auto");

        tarjeta.innerHTML = `
            <h3>${auto.marca} ${auto.modelo}</h3>

            <p>Año: ${auto.anio}</p>

            <p>Potencia: ${auto.potencia} HP</p>

            <p>Tipo: ${auto.tipo}</p>

            <p class="color-auto">
                Color: ${auto.color}
                <span
                    class="muestra-color"
                    style="background-color: ${obtenerColorCSS(auto.color)};"
                ></span>
            </p>

            <div class="botones-auto">

                <button
                    class="favorito ${auto.favorito ? "activo" : ""}"
                    data-indice="${indice}"
                >
                    ${auto.favorito ? "★ Favorito" : "☆ Favorito"}
                </button>

                <button
                    class="editar"
                    data-indice="${indice}"
                >
                    Editar
                </button>

                <button
                    class="eliminar"
                    data-indice="${indice}"
                >
                    Eliminar
                </button>

            </div>
        `;

        contenedorAutos.appendChild(tarjeta);
    });
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const anio = document.getElementById("anio").value;
    const potencia = document.getElementById("potencia").value;
    const tipo = document.getElementById("tipo").value;
    const color = document.getElementById("color").value.trim();

    if (indiceEditando !== null) {
        autos[indiceEditando].marca = marca;
        autos[indiceEditando].modelo = modelo;
        autos[indiceEditando].anio = anio;
        autos[indiceEditando].potencia = potencia;
        autos[indiceEditando].tipo = tipo;
        autos[indiceEditando].color = color;

        indiceEditando = null;

        botonAgregar.textContent = "Agregar auto";
    } else {
        const nuevoAuto = {
            marca: marca,
            modelo: modelo,
            anio: anio,
            potencia: potencia,
            tipo: tipo,
            color: color,
            favorito: false
        };

        autos.push(nuevoAuto);
    }

    guardarAutos();
    mostrarAutos();

    formulario.reset();
});

contenedorAutos.addEventListener("click", function(evento) {
    const indice = Number(evento.target.dataset.indice);

    if (evento.target.classList.contains("eliminar")) {
        autos.splice(indice, 1);

        if (indiceEditando !== null) {
            indiceEditando = null;
            botonAgregar.textContent = "Agregar auto";
            formulario.reset();
        }

        guardarAutos();
        mostrarAutos();
    }

    if (evento.target.classList.contains("favorito")) {
        autos[indice].favorito = !autos[indice].favorito;

        guardarAutos();
        mostrarAutos();
    }

    if (evento.target.classList.contains("editar")) {
        const auto = autos[indice];

        document.getElementById("marca").value = auto.marca;
        document.getElementById("modelo").value = auto.modelo;
        document.getElementById("anio").value = auto.anio;
        document.getElementById("potencia").value = auto.potencia;
        document.getElementById("tipo").value = auto.tipo;
        document.getElementById("color").value = auto.color;

        indiceEditando = indice;

        botonAgregar.textContent = "Guardar cambios";

        document.getElementById("agregar").scrollIntoView({
            behavior: "smooth"
        });
    }
});

buscarAuto.addEventListener("input", function() {
    mostrarAutos();
});

filtrarTipo.addEventListener("change", function() {
    mostrarAutos();
});

ordenarAutos.addEventListener("change", function() {
    mostrarAutos();
});

botonTema.addEventListener("click", function() {
    document.body.classList.toggle("modo-claro");

    if (document.body.classList.contains("modo-claro")) {
        botonTema.textContent = "🌙 Modo oscuro";
        localStorage.setItem("tema", "claro");
    } else {
        botonTema.textContent = "☀️ Modo claro";
        localStorage.setItem("tema", "oscuro");
    }
});

const temaGuardado = localStorage.getItem("tema");

if (temaGuardado === "claro") {
    document.body.classList.add("modo-claro");
    botonTema.textContent = "🌙 Modo oscuro";
} else {
    botonTema.textContent = "☀️ Modo claro";
}

mostrarAutos();