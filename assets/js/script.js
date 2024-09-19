// Arreglo para almacenar los gastos
let listaGastos = [];
let editandoGasto = -1;  // Variable para controlar si estamos editando un gasto

// Al inicio, ocultar el botón de imprimir
document.getElementById("imprimirReporte").style.display = "none";

// Función que se ejecuta al hacer clic en el botón "Agregar Gasto"
function clickBoton() {
    const nombreGasto = document.getElementById("nombreGasto").value;
    const valorGasto = parseFloat(document.getElementById("valorGasto").value);
    const descripcionGasto = document.getElementById("descripcionGasto").value;

    // Validación para evitar entradas vacías o valores negativos
    if (nombreGasto === "" || isNaN(valorGasto) || valorGasto <= 0) {
        alert("Por favor, ingrese un nombre y un valor de gasto válido.");
        return;
    }

    // Alerta si el gasto es mayor a 150 dólares (o equivalente en la moneda seleccionada)
    const valorUmbral = convertirMoneda(150);
    if (valorGasto > valorUmbral) {
        alert(`¡Alerta! El gasto ingresado es mayor a ${formatoMoneda(valorUmbral)}.`);
    }

    // Si estamos editando un gasto, actualizamos el gasto existente
    if (editandoGasto >= 0) {
        listaGastos[editandoGasto] = {
            nombre: nombreGasto,
            valor: valorGasto,
            descripcion: descripcionGasto
        };
        editandoGasto = -1;  // Reseteamos la variable de edición
        document.getElementById("botonFormulario").textContent = traducciones[idioma].agregarGasto;  // Cambiamos el texto del botón
    } else {
        // Agregar el gasto al arreglo
        listaGastos.push({
            nombre: nombreGasto,
            valor: valorGasto,
            descripcion: descripcionGasto
        });
        
        // Mostrar el botón de imprimir si es el primer gasto
        if (listaGastos.length === 1) {
            document.getElementById("imprimirReporte").style.display = "block";
        }
    }

    // Limpiar los campos del formulario
    document.getElementById("nombreGasto").value = "";
    document.getElementById("valorGasto").value = "";
    document.getElementById("descripcionGasto").value = "";

    // Actualizar la interfaz
    actualizarListaDeGastos();
    actualizarTotalGastos();
}

// Función para actualizar la lista de gastos en el DOM
function actualizarListaDeGastos() {
    const listaDeGastos = document.getElementById("listaDeGastos");
    listaDeGastos.innerHTML = "";

    // Mostrar cada gasto en la lista
    listaGastos.forEach((gasto, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${gasto.nombre} - ${formatoMoneda(gasto.valor)} 
            <br><small>${gasto.descripcion}</small> 
            <i class="fas fa-edit" onclick="editarGasto(${index})" style="cursor: pointer; margin-right: 10px;"></i>
            <i class="fa-regular fa-trash-can fa-shake" onclick="eliminarGasto(${index})" style="cursor: pointer; color: red;"></i>
        `;
        listaDeGastos.appendChild(li);
    });
}

// Función para actualizar el total de los gastos
function actualizarTotalGastos() {
    const totalGastos = listaGastos.reduce((total, gasto) => total + gasto.valor, 0);
    document.getElementById("totalGastos").textContent = formatoMoneda(totalGastos);
}

// Función para eliminar un gasto
function eliminarGasto(index) {
    listaGastos.splice(index, 1);
    actualizarListaDeGastos();
    actualizarTotalGastos();

    // Ocultar el botón de imprimir si no hay gastos
    if (listaGastos.length === 0) {
        document.getElementById("imprimirReporte").style.display = "none";
    }
}

// Función para editar un gasto
function editarGasto(index) {
    const gasto = listaGastos[index];
    document.getElementById("nombreGasto").value = gasto.nombre;
    document.getElementById("valorGasto").value = gasto.valor;
    document.getElementById("descripcionGasto").value = gasto.descripcion;
    editandoGasto = index;

    // Cambiamos el texto del botón para indicar que estamos editando
    document.getElementById("botonFormulario").textContent = traducciones[idioma].editar;
}

// Función para imprimir el reporte
function imprimirReporte() {
    if (listaGastos.length === 0) {
        alert("No hay gastos para imprimir.");
        return;
    }

    let reporte = `
        <html>
            <head>
                <title>Reporte de Gastos</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { width: 100%; border-collapse: collapse; font-size: 1.2rem; }
                    th, td { padding: 15px; text-align: left; border: 1px solid #ddd; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    td { font-weight: normal; }
                    h1 { font-size: 2rem; text-align: center; }
                    footer { text-align: center; margin-top: 20px; font-size: 0.9rem; }
                </style>
            </head>
            <body>
                <h1>Reporte de Gastos Mensuales</h1>
                <table>
                    <tr>
                        <th>N°</th>
                        <th>Nombre</th>
                        <th>Valor</th>
                        <th>Descripción</th>
                    </tr>`;

    listaGastos.forEach((gasto, index) => {
        reporte += `
            <tr>
                <td>${index + 1}</td>
                <td>${gasto.nombre}</td>
                <td>${formatoMoneda(gasto.valor)}</td>
                <td>${gasto.descripcion}</td>
            </tr>`;
    });

    reporte += `
                </table>
                <footer>
                    &copy; ${new Date().getFullYear()} Jose Ortega. Todos los derechos reservados.
                </footer>
            </body>
        </html>`;

    // Crear una nueva ventana para imprimir
    const nuevaVentana = window.open('', '_blank');
    nuevaVentana.document.write(reporte);
    nuevaVentana.document.close();
    nuevaVentana.print();
}

// Función para actualizar la moneda
function actualizarMoneda() {
    const selectMoneda = document.getElementById('moneda');
    moneda = selectMoneda.value;
    simboloMoneda = selectMoneda.options[selectMoneda.selectedIndex].getAttribute('data-symbol');
    actualizarListaDeGastos();
    actualizarTotalGastos();
}

// Función para convertir el valor de acuerdo a la moneda seleccionada
function convertirMoneda(valor) {
    // Agrega aquí la lógica de conversión basada en la moneda seleccionada
    // Por simplicidad, aquí asumimos que la tasa de cambio es 1:1
    return valor;
}

// Función para formatear el valor según la moneda seleccionada
function formatoMoneda(valor) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: moneda
    }).format(valor);
}

// Función para actualizar el idioma
function actualizarIdioma() {
    idioma = document.getElementById('idioma').value;
    document.getElementById('botonFormulario').textContent = traducciones[idioma].agregarGasto;
    document.getElementById('totalLabel').textContent = traducciones[idioma].totalMensual;
    actualizarListaDeGastos();
}

// Traducciones para los botones y textos
const traducciones = {
    es: {
        agregarGasto: 'Agregar Gasto',
        editar: 'Editar',
        eliminar: 'Eliminar',
        totalMensual: 'Total Mensual'
    },
    en: {
        agregarGasto: 'Add Expense',
        editar: 'Edit',
        eliminar: 'Delete',
        totalMensual: 'Monthly Total'
    },
    fr: {
        agregarGasto: 'Ajouter Dépense',
        editar: 'Éditer',
        eliminar: 'Supprimer',
        totalMensual: 'Total Mensuel'
    },
    // Puedes añadir más idiomas aquí
};

let idioma = 'es';
let moneda = 'USD';  // Moneda por defecto
let simboloMoneda = '$';
